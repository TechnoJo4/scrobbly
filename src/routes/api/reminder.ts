import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../http.ts";
import { db, Reminder } from "../../db/db.ts";
import { intStr, reminder } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Reminder>(async (req) => {
        const { id } = urlParamsTo(v.object({ id: intStr }), req);
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
        const { id } = urlParamsTo(v.object({ id: intStr }), req);
        const res = await db.deleteFrom("reminder").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
