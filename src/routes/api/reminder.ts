import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../utils/http.ts";
import { db, Reminder } from "../../db/db.ts";
import { idParam, reminder } from "../../utils/schema.ts";

export default byMethod({
    GET: apiGet<Reminder>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        return await db.selectFrom("reminder")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof reminder, Reminder>(reminder, async (req) => {
        return await db.insertInto("reminder")
            .values(req)
            .returningAll()
            .executeTakeFirstOrThrow();
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        const res = await db.deleteFrom("reminder").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
