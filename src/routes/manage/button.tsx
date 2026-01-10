import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect, urlParamsTo } from "../../utils/http.ts";
import { idParam, button } from "../../utils/schema.ts";
import { Page } from "../../components/Page.tsx";
import { Field } from "../../components/Field.tsx";
import { QtyInput } from "../../components/QtyInput.tsx";

export default byMethod({
    GET: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        const button = await db.selectFrom("button")
            .innerJoin("task", "button.task", "task.id")
            .innerJoin("unit", "task.unit", "unit.name")
            .where("button.id", "=", id)
            .select(["button.label", "button.task", "button.qty", "task.name", "unit.pre", "unit.post", "unit.decimals"])
            .executeTakeFirst();

        if (button === undefined) return render(<Page>not found</Page>, { status: 404 });

        return render(
            <Page>
                <h2>edit button</h2>
                <form method="post">
                    <Field label="task">
                        {button.name}
                        <input type="hidden" name="task" value={button.task} />
                    </Field>
                    <Field label="label">
                        <input type="text" name="name" value={button.label}></input>
                    </Field>
                    <Field>
                        <QtyInput {...button} />
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
        const data = await bodyParamsTo(button, req);

        await db.updateTable("button").set(data).where("id", "=", id).execute();

        return redirect("/manage/buttons");
    }
}) satisfies Deno.ServeHandler;
