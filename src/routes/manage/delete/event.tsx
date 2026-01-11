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
        const event = await db.selectFrom("event")
            .where("event.id", "=", id)
            .innerJoin("task", "task.id", "event.task")
            .innerJoin("unit", "unit.name", "task.unit")
            .select([ "event.qty", "event.time", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
            .executeTakeFirst();

        if (event === undefined) return render(<Page>not found</Page>, { status: 404 });

        return render(
            <Page>
                <h2>delete event</h2>
                <form method="post">
                    are you sure you want to delete this event?
                    <Field label="task">{event.name}</Field>
                    <Field label="qty">{qtyToStr(event.qty, event)}</Field>
                    <Field label="time">{new Date(event.time).toISOString()}</Field>
                    <Field><button type="submit">yes</button></Field>
                </form>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        await db.deleteFrom("event").where("id", "=", id).execute();
        return redirect("/");
    }
}) satisfies Deno.ServeHandler;
