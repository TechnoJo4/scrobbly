import { Button } from "../db/types.ts";
import { classes } from "../utils/jsx.ts";
import { qtyToStr } from "../utils/unit.ts";

export const Buttons = (props: {
        buttons: Button[],
        tasks: Map<number, { id: number, name: string, pre: string, post: string, decimals: number, max: number }>,
        activeReminders?: { task: number }[]
    }) => <>
        {props.buttons.map(b => {
			const t = props.tasks.get(b.task)!;
            return <form class="scrobble-button-form" action="/scrobble" method="post">
                <input type="hidden" name="task" value={b.task} />
                <input type="hidden" name="qty" value={b.qty} />
                <button type="submit" class={classes({
                    "scrobble-button": 1,
                    "scrobble-button-over-quota": t.max < b.qty,
                    "scrobble-button-reminder": props.activeReminders?.find(r => r.task === b.task)
                })}>
                    {b.label && b.label+": "}{t.name} ({qtyToStr(b.qty, t)})
                </button>
        </form>})}
    </>;
