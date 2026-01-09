import * as v from "@valibot/valibot";

import { db } from "../db/db.ts";
import { byMethod, bodyParamsTo, redirect } from "../http.ts";
import { intStr } from "../schema.ts";
import { time } from "../time.ts";

export default byMethod({
    POST: async (req: Request) => {
        const data = await bodyParamsTo(v.object({
            task: intStr,
            time: v.optional(intStr),
            qty: intStr,
        }), req);

        await db.insertInto("event")
            .values({
                ...data,
                time: data.time ?? time()
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return redirect("/");
    }
}) satisfies Deno.ServeHandler;
