import * as v from "@valibot/valibot";

import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect } from "../../utils/http.ts";
import { intStr } from "../../utils/schema.ts";
import { Page } from "../../components/Page.tsx";
import { timespanToStr, timeUnits } from "../../utils/time.ts";
import { Field } from "../../components/Field.tsx";

export default byMethod({
    GET: async () => {
        const tasks = await db.selectFrom("task").select(["id", "name"]).execute();
        const reminders = await db.selectFrom("reminder").selectAll().execute();

        return render(
            <Page>
                <h2>add new reminder</h2>
                <form method="post">
                    <Field label="task">
                        <select id="task" name="task">
                            {tasks.map(t => <option value={t.id}>{t.name}</option>)}
                        </select>
                    </Field>
                    <Field label="since">
                        <input type="datetime-local" id="since" name="since" />
                    </Field>
                    <Field label="every">
                        <input type="number" id="every" name="every" required min="1" value="1" />
                        <select id="everyUnit" name="everyUnit">
                            {timeUnits.map(u => <option value={u.ms}>{u.name}</option>)}
                        </select>
                    </Field>
                    <Field>
                        <button type="submit">new reminder</button>
                    </Field>
                </form>

                <h2>reminders</h2>
                <ul>
                    {reminders.map(r => <li class="reminder">
                        {tasks.find(t => t.id == r.task)?.name} every {timespanToStr(r.every)} since {new Date(r.since).toISOString()}
                    </li>)}
                </ul>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const data = await bodyParamsTo(v.object({
            task: intStr,
            since: v.pipe(v.string(), v.isoDateTime()),
            every: intStr,
            everyUnit: intStr,
        }), req);

        await db.insertInto("reminder").values({
            task: data.task,
            since: new Date(data.since).getTime(),
            every: data.every * data.everyUnit
        }).execute();

        return redirect("/manage/reminders");
    }
}) satisfies Deno.ServeHandler;
