import * as v from "@valibot/valibot";
import { byMethod, apiGet, apiRoute, reqParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../http.ts";
import { db, Event } from "../../db/db.ts";
import { intStr, event } from "../../schema.ts";

export default byMethod({
    GET: apiGet<Event>(async (req) => {
        const { id } = reqParamsTo(v.object({ id: intStr }), req);
        return await db.selectFrom("event")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof event, Event>(event, async (req) => {
        return await db.insertInto("event")
            .values(req)
            .returningAll()
            .executeTakeFirstOrThrow();
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { id } = reqParamsTo(v.object({ id: intStr }), req);
        const res = await db.deleteFrom("event").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
