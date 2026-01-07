import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, reqParamsTo, apiNotFound } from "../../http.ts";
import { db, Task } from "../../db/db.ts";
import { intStr, task } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Task>(async (req) => {
        const { id } = reqParamsTo(v.object({ id: intStr }), req);
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
    })
}) satisfies Deno.ServeHandler;
