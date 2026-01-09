import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../http.ts";
import { db, Button } from "../../db/db.ts";
import { button, idParam } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Button>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
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
        const { id } = urlParamsTo(idParam, req);
        const res = await db.deleteFrom("button").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
