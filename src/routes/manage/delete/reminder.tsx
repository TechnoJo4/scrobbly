import { db } from "../../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, redirect, urlParamsTo } from "../../../utils/http.ts";
import { idParam } from "../../../utils/schema.ts";
import { Page } from "../../../components/Page.tsx";
import { Field } from "../../../components/Field.tsx";
import { timespanToStr } from "../../../utils/time.ts";

export default byMethod({
    GET: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        const reminder = await db.selectFrom("reminder")
            .where("reminder.id", "=", id)
            .innerJoin("task", "task.id", "reminder.task")
            .innerJoin("unit", "unit.name", "task.unit")
            .select([ "reminder.since", "reminder.every", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
            .executeTakeFirst();

        if (reminder === undefined) return render(<Page>not found</Page>, { status: 404 });

        return render(
            <Page>
                <h2>delete reminder</h2>
                <form method="post">
                    are you sure you want to delete this reminder?
                    <Field label="task">{reminder.name}</Field>
                    <Field label="since">{new Date(reminder.since).toISOString()}</Field>
                    <Field label="every">{timespanToStr(reminder.every)}</Field>
                    <Field><button type="submit">yes</button></Field>
                </form>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        await db.deleteFrom("reminder").where("id", "=", id).execute();
        return redirect("/manage/reminders");
    }
}) satisfies Deno.ServeHandler;
