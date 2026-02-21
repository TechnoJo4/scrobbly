import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect, urlParamsTo } from "../../utils/http.ts";
import { idParam, task } from "../../utils/schema.ts";
import { Page } from "../../components/Page.tsx";
import { Field } from "../../components/Field.tsx";

export default byMethod({
    GET: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        const task = await db.selectFrom("task")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst();

        if (task === undefined) return render(<Page>not found</Page>, { status: 404 });

        const units = await db.selectFrom("unit").selectAll().execute();

        return render(
            <Page>
                <h2>edit task</h2>
                <form method="post">
                    <Field label="name">
                        <input type="text" name="name" value={task.name} required></input>
                    </Field>
                    <Field label="unit">
                        <select name="unit">
                            {units.map(u => <option value={u.name} selected={task.unit == u.name}>{u.name}</option>)}
                        </select>
                    </Field>
                    <Field label="hide">
                        <input type="checkbox" name="hidden" checked={task.hidden !== 0}></input>
                    </Field>
                    <Field>
                        <button type="submit">save</button>
                    </Field>
                </form>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        const data = await bodyParamsTo(task, req);

        await db.updateTable("task").set(data).where("id", "=", id).execute();

        return redirect("/manage/tasks");
    }
}) satisfies Deno.ServeHandler;
