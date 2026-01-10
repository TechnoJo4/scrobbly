import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect } from "../../utils/http.ts";
import { task } from "../../utils/schema.ts";
import { Page } from "../../components/Page.tsx";
import { Field } from "../../components/Field.tsx";

export default byMethod({
    GET: async () => {
        const tasks = await db.selectFrom("task").selectAll().execute();
        const units = await db.selectFrom("unit").selectAll().execute();

        return render(
            <Page>
                <h2>add new task</h2>
                <form method="post">
                    <Field label="name">
                        <input type="text" id="name" name="name" required></input>
                    </Field>
                    <Field label="unit">
                        <select id="unit" name="unit">
                            {units.map(u => <option value={u.name}>{u.name}</option>)}
                        </select>
                    </Field>
                    <Field>
                        <button type="submit">new task</button>
                    </Field>
                </form>

                <h2>tasks</h2>
                <ul>
                    {tasks.map(t => <li class="task"><a href={`/manage/task?id=${t.id}`}>{t.name} ({t.unit})</a></li>)}
                </ul>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const data = await bodyParamsTo(task, req);

        await db.insertInto("task").values(data).execute();

        return redirect("/manage/tasks");
    }
}) satisfies Deno.ServeHandler;
