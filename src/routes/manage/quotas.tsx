import * as v from "@valibot/valibot";

import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect } from "../../utils/http.ts";
import { intStr } from "../../utils/schema.ts";
import { Page } from "../../components/Page.tsx";
import { timespanToStr, timeUnits } from "../../utils/time.ts";
import { Field } from "../../components/Field.tsx";
import { QtyInput } from "../../components/QtyInput.tsx";
import { qtyToStr } from "../../utils/unit.ts";

export default byMethod({
    GET: async () => {
        const tasks = await db.selectFrom("task")
            .innerJoin("unit", "task.unit", "unit.name")
            .select(["task.id", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
            .execute();
        const quotas = await db.selectFrom("quota").selectAll().execute();

        return render(
            <Page>
                <h2>add new quota</h2>
                {tasks.map(t => <form class="row" method="post">
                    <Field label="period">
                        <input type="number" name="period" required min="1" value="1" />
                        <select name="periodUnit">
                            {timeUnits.map(u => <option value={u.ms}>{u.name}</option>)}
                        </select>
                    </Field>
                    <Field label="max"><QtyInput {...t} /></Field>
                    <Field>
                        <input type="hidden" name="task" value={t.id} />
                        <button type="submit" class="task-button">{t.name}</button>
                    </Field>
                </form>)}

                <h2>quotas</h2>
                <ul>
                    {quotas.map(q => {
                        const t = tasks.find(t => t.id == q.task)!;
                        return <li class="quota">
                            {tasks.find(t => t.id == q.task)?.name}: max {qtyToStr(q.max, t)} within {timespanToStr(q.period)}
                        </li>;
                    })}
                </ul>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const data = await bodyParamsTo(v.object({
            task: intStr,
            qty: intStr,
            period: intStr,
            periodUnit: intStr,
        }), req);

        await db.insertInto("quota").values({
            task: data.task,
            period: data.period * data.periodUnit,
            max: data.qty
        }).execute();

        return redirect("/manage/quotas");
    }
}) satisfies Deno.ServeHandler;
