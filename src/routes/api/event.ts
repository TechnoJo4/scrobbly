import { byMethod, apiGet, apiRoute, urlParamsTo, apiNotFound, apiSuccess, APISuccess } from "../../utils/http.ts";
import { db, Event } from "../../db/db.ts";
import { event, idParam } from "../../utils/schema.ts";
import { time } from "../../utils/time.ts";

export default byMethod({
    GET: apiGet<Event>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        return await db.selectFrom("event")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst() ?? apiNotFound;
    }),
    POST: apiRoute<typeof event, Event>(event, async (req) => {
        return await db.insertInto("event")
            .values({
                ...req,
                time: req.time ?? time()
            })
            .returningAll()
            .executeTakeFirstOrThrow();
    }),
    DELETE: apiGet<APISuccess>(async (req) => {
        const { id } = urlParamsTo(idParam, req);
        const res = await db.deleteFrom("event").where("id", "=", id).executeTakeFirst();
        return res.numDeletedRows !== 0n ? apiSuccess : apiNotFound;
    })
}) satisfies Deno.ServeHandler;
