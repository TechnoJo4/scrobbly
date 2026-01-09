import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../http.ts";
import { db, Task } from "../../db/db.ts";
import { intStr, task } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Task>(async (req) => {
        const { id } = urlParamsTo(v.object({ id: intStr }), req);
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
        const { id } = urlParamsTo(v.object({ id: intStr }), req);
        const res = await db.deleteFrom("task").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
