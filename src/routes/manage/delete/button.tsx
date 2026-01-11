import { db } from "../../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, redirect, urlParamsTo } from "../../../utils/http.ts";
import { idParam } from "../../../utils/schema.ts";
import { Page } from "../../../components/Page.tsx";
import { Field } from "../../../components/Field.tsx";
import { qtyToStr } from "../../../utils/unit.ts";

export default byMethod({
    GET: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        const button = await db.selectFrom("button")
            .where("button.id", "=", id)
            .innerJoin("task", "task.id", "button.task")
            .innerJoin("unit", "unit.name", "task.unit")
            .select([ "button.qty", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
            .executeTakeFirst();

        if (button === undefined) return render(<Page>not found</Page>, { status: 404 });

        return render(
            <Page>
                <h2>delete button</h2>
                <form method="post">
                    are you sure you want to delete this button?
                    <Field label="task">{button.name}</Field>
                    <Field label="qty">{qtyToStr(button.qty, button)}</Field>
                    <Field><button type="submit">yes</button></Field>
                </form>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        await db.deleteFrom("button").where("id", "=", id).execute();
        return redirect("/manage/buttons");
    }
}) satisfies Deno.ServeHandler;
