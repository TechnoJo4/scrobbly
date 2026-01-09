import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../http.ts";
import { db, Button } from "../../db/db.ts";
import { intStr, button } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Button>(async (req) => {
        const { id } = urlParamsTo(v.object({ id: intStr }), req);
        return await db.selectFrom("button")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof button, Button>(button, async (req) => {
        return await db.insertInto("button")
            .values(req)
            .returningAll()
            .executeTakeFirstOrThrow();
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { id } = urlParamsTo(v.object({ id: intStr }), req);
        const res = await db.deleteFrom("button").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
