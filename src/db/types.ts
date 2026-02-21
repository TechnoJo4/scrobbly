import { ColumnType, Selectable } from "kysely";

type Integer = number | bigint | boolean;

export interface ButtonTable {
	id: ColumnType<number, Integer | undefined, Integer>;
	label: string;
	task: ColumnType<number, Integer, Integer>;
	qty: ColumnType<number, Integer, Integer>;
}

export type Button = Selectable<ButtonTable>;

export interface EventTable {
	id: ColumnType<number, Integer | undefined, Integer>;
	task: ColumnType<number, Integer, Integer>;
	time: ColumnType<number, Integer, Integer>;
	qty: ColumnType<number, Integer, Integer>;
}

export type Event = Selectable<EventTable>;

export interface QuotaTable {
	id: ColumnType<number, Integer | undefined, Integer>;
	task: ColumnType<number, Integer, Integer>;
	period: ColumnType<number, Integer, Integer>;
	max: ColumnType<number, Integer, Integer>;
}

export type Quota = Selectable<QuotaTable>;

export interface ReminderTable {
	id: ColumnType<number, Integer | undefined, Integer>;
	task: ColumnType<number, Integer, Integer>;
	since: ColumnType<number, Integer, Integer>;
	every: ColumnType<number, Integer, Integer>;
}

export type Reminder = Selectable<ReminderTable>;

export interface TaskTable {
	id: ColumnType<number, Integer | undefined, Integer>;
	name: string;
	unit: string;
	hidden: ColumnType<number, Integer | undefined, Integer>;
}

export type Task = Selectable<TaskTable>;

export interface UnitTable {
	name: string;
	pre: string;
	post: string;
	decimals: ColumnType<number, Integer, Integer>;
}

export type Unit = Selectable<UnitTable>;

export interface DB {
	button: ButtonTable;
	event: EventTable;
	quota: QuotaTable;
	reminder: ReminderTable;
	task: TaskTable;
	unit: UnitTable;
}
