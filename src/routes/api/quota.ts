import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../utils/http.ts";
import { db, Quota } from "../../db/db.ts";
import { idParam, quota } from "../../utils/schema.ts";

export default byMethod({
    GET: apiGet<Quota>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        return await db.selectFrom("quota")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof quota, Quota>(quota, async (req) => {
        return await db.insertInto("quota")
            .values(req)
            .returningAll()
            .executeTakeFirstOrThrow();
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        const res = await db.deleteFrom("quota").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
