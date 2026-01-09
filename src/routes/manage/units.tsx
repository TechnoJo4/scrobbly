import * as v from "@valibot/valibot";

import { db } from "../../db/db.ts";
import { render } from '@oomfware/jsx';
import { byMethod, bodyParamsTo, redirect } from "../../http.ts";
import { intStr } from "../../schema.ts";
import { Page } from "../../components/Page.tsx";
import { Field } from "../../components/Field.tsx";
import { qtyToStr } from "../../unit.ts";

export default byMethod({
    GET: async () => {
        const units = await db.selectFrom("unit").selectAll().execute();

        return render(
            <Page>
                <h2>add new unit</h2>
                <form method="post">
                    <Field label="name">
                        <input type="text" name="name" required></input>
                    </Field>
                    <Field label="pre">
                        <input type="text" name="pre"></input>
                    </Field>
                    <Field label="post">
                        <input type="text" name="post"></input>
                    </Field>
                    <Field label="decimals">
                        <input type="number" name="decimals" required min="0" max="18" value="0"></input>
                    </Field>
                    <Field>
                        <button type="submit">new unit</button>
                    </Field>
                </form>

                <h2>units</h2>
                <ul>
                    {units.map(u => <li class="unit">
                        {u.name} ({qtyToStr(1, u)})
                    </li>)}
                </ul>
            </Page>
        );
    },
    POST: async (req: Request) => {
        const data = await bodyParamsTo(v.object({
            name: v.string(),
            pre: v.string(),
            post: v.string(),
            decimals: intStr,
        }), req);

        await db.insertInto("unit").values(data).execute();

        return redirect("/manage/units");
    }
}) satisfies Deno.ServeHandler;
