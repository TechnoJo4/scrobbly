import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, reqParamsTo, apiNotFound } from "../../http.ts";
import { db, Unit } from "../../db/db.ts";
import { unit } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Unit>(async (req) => {
        const { name } = reqParamsTo(v.object({ name: v.string() }), req);
        return await db.selectFrom("unit")
            .where("name", "=", name)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof unit, Unit>(unit, async (req) => {
        return await db.insertInto("unit")
            .values(req)
            .returningAll()
            .executeTakeFirstOrThrow();
    })
}) satisfies Deno.ServeHandler;
