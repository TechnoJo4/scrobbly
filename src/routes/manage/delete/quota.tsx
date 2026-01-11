import { db } from "../../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, redirect, urlParamsTo } from "../../../utils/http.ts";
import { idParam } from "../../../utils/schema.ts";
import { Page } from "../../../components/Page.tsx";
import { Field } from "../../../components/Field.tsx";
import { qtyToStr } from "../../../utils/unit.ts";
import { timespanToStr } from "../../../utils/time.ts";

export default byMethod({
    GET: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        const quota = await db.selectFrom("quota")
            .where("quota.id", "=", id)
            .innerJoin("task", "task.id", "quota.task")
            .innerJoin("unit", "unit.name", "task.unit")
            .select([ "quota.max", "quota.period", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
            .executeTakeFirst();

        if (quota === undefined) return render(<Page>not found</Page>, { status: 404 });

        return render(
            <Page>
                <h2>delete quota</h2>
                <form method="post">
                    are you sure you want to delete this quota?
                    <Field label="task">{quota.name}</Field>
                    <Field label="qty">{qtyToStr(quota.max, quota)}</Field>
                    <Field label="period">{timespanToStr(quota.period)}</Field>
                    <Field><button type="submit">yes</button></Field>
                </form>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const { id } = urlParamsTo(idParam, req);
        await db.deleteFrom("quota").where("id", "=", id).execute();
        return redirect("/manage/quotas");
    }
}) satisfies Deno.ServeHandler;
