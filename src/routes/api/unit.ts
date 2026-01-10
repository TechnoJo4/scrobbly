import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, APISuccess, apiSuccess } from "../../utils/http.ts";
import { db, Unit } from "../../db/db.ts";
import { unit } from "../../utils/schema.ts";

const nameParam = v.object({ name: v.string() });

export default byMethod({
    GET: apiGet<Unit>(async (req) => {
        const { name } = urlParamsTo(nameParam, req);
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
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { name } = urlParamsTo(nameParam, req);
        const res = await db.deleteFrom("unit").where("name", "=", name).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
