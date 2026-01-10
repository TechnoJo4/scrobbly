import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../utils/http.ts";
import { db, Task } from "../../db/db.ts";
import { idParam, task } from "../../utils/schema.ts";

export default byMethod({
    GET: apiGet<Task>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        return await db.selectFrom("task")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof task, Task>(task, async (req) => {
        return await db.insertInto("task")
            .values(req)
            .returningAll()
            .executeTakeFirstOrThrow();
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        const res = await db.deleteFrom("task").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
