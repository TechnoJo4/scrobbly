import * as v from "@valibot/valibot";

import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect } from "../../http.ts";
import { intStr } from "../../schema.ts";
import { Page } from "../../components/Page.tsx";
import { QtyInput } from "../../components/QtyInput.tsx";
import { Field } from "../../components/Field.tsx";
import { qtyToStr } from "../../unit.ts";

export default byMethod({
    GET: async () => {
        const tasks = await db.selectFrom("task")
            .innerJoin("unit", "task.unit", "unit.name")
            .select(["task.id", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
            .execute();

        const buttons = await db.selectFrom("button").selectAll().execute();

        return render(
            <Page>
                <h2>add new button</h2>
                {tasks.map(t => <form class="row" method="post">
                    <Field label="label">
                        <input type="text" name="label" placeholder="optional" />
                    </Field>
                    <Field><QtyInput {...t} /></Field>
                    <Field>
                        <input type="hidden" name="task" value={t.id} />
                        <button type="submit" class="task-button">{t.name}</button>
                    </Field>
				</form>)}

                <h2>buttons</h2>
                <ul>
                    {buttons.map(b => {
                        const t = tasks.find(t => t.id == b.task)!;
                        return <li class="button">
                            {b.label && b.label+": "}{t.name} ({qtyToStr(b.qty, t)})
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
            label: v.string(),
        }), req);

        await db.insertInto("button").values(data).execute();
        return redirect("/manage/buttons");
    }
}) satisfies Deno.ServeHandler;
