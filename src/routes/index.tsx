import { render } from '@oomfware/jsx';
import { db } from "../db/db.ts";
import { latestReminderTime, time, timespanToStr } from "../utils/time.ts";
import { Page } from "../components/Page.tsx";
import { Buttons } from "../components/Buttons.tsx";
import { QtyInput } from "../components/QtyInput.tsx";
import { Field } from "../components/Field.tsx";
import { qtyToStr } from "../utils/unit.ts";
import { by, by1, map } from "../utils/fn.ts";

export default (async () => {
	const now = time();

	const latestEvents = await db.selectFrom("event")
		.select(({ fn }) => ["task", fn.max("time").as("time")])
		.groupBy("task")
		.orderBy("time", "desc")
		.execute();

	const reminders = await db.selectFrom("reminder")
		.select(["id", "since", "every", "task"])
		.execute();

	const quotas = await db.selectFrom("quota")
		.select(eb => [
			"id", "task", "max",
			eb.selectFrom("event")
				.whereRef("event.task", "=", "quota.task")
				.where("event.time", ">", eb => eb(eb.unary("-", "quota.period"), "+", now))
				.select(eb => eb.fn.sum<number>("event.qty").as("qty"))
				.as("qty")
		])
		.execute();

	const quotasByTask = by(quotas, q => q.task);

	const tasks = (await db.selectFrom("task")
		.innerJoin("unit", "task.unit", "unit.name")
		.select(["task.id", "task.name", "task.unit", "unit.decimals", "unit.pre", "unit.post"])
		.execute())
		.map(t => {
			const q = quotasByTask.get(t.id);
			const max = q ? Math.min(...q.map(q => q.max-q.qty!)) : Infinity;
			return { ...t, max, overQuota: max <= 0 };
		});

	const tasksById = by1(tasks, t => t.id);

	const timeByTask = map(latestEvents, e => [e.task, e.time]);
	const activeReminders = reminders
		.map(r => ({ ...r, trigger: latestReminderTime(r.since, r.every) }))
		.filter(r => !timeByTask.has(r.task) || timeByTask.get(r.task)! < r.trigger);

	const buttons = await db.selectFrom("button").selectAll().execute();

	return render(
		<Page>
			<section class="section-buttons">
				<Buttons buttons={buttons} tasks={tasksById}></Buttons>
			</section>

			<h2>active reminders</h2>
			<section class="section-reminders">
				{activeReminders.length !== 0 ? <ul class="reminder-list">
					{activeReminders.map(r => <li class={`reminder${tasksById.get(r.task)?.overQuota && " reminder-over-quota"}`}>
						you should <span class="reminder-task">
							{tasksById.get(r.task)!.name}
						</span> (<span class="reminder-trigger">{timespanToStr(now - r.trigger)} ago</span>)
					</li>)}
				</ul> : <p class="reminders-none">none!</p>}
			</section>

			<h2>tasks</h2>
			<section class="section-manual">
				{tasks.map(t => <form class="scrobble-form" action="/scrobble" method="post">
					<input type="hidden" name="task" value={t.id} />
					<Field><QtyInput {...t} /></Field>
					<Field>
						<button type="submit" class={`scrobble-button${t.overQuota && " scrobble-button-over-quota"}`}>
							{t.name}
						</button>
					</Field>
				</form>)}
			</section>

			<h2>recent</h2>
			<section class="section-history">
				<table>
					{(await db.selectFrom("event").selectAll().orderBy("time", "desc").limit(10).execute()).map(e => {
						const t = tasksById.get(e.task)!;
						return <tr>
							<td>{new Date(e.time).toISOString()}</td>
							<td>{t.name}</td>
							<td>{qtyToStr(e.qty, t)}</td>
							<td><a href={`/manage/delete/event?id=${e.id}`}>X</a></td>
						</tr>;
					})}
				</table>
			</section>

			<h2>manage</h2>
			<section class="section-manage">
				<a href="/manage/buttons">buttons</a>
				<a href="/manage/reminders">reminders</a>
				<a href="/manage/quotas">quotas</a>
				<a href="/manage/tasks">tasks</a>
				<a href="/manage/units">units</a>
			</section>
		</Page>
	);
}) satisfies Deno.ServeHandler;
