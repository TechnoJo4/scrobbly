import { ColumnType } from "kysely";

type Integer = number | bigint | boolean;

export interface Quota {
	id: ColumnType<number, Integer | undefined, Integer>;
	task: ColumnType<number, Integer, Integer>;
	period: ColumnType<number, Integer, Integer>;
	max: ColumnType<number, Integer, Integer>;
}

export interface Reminder {
	id: ColumnType<number, Integer | undefined, Integer>;
	task: ColumnType<number, Integer, Integer>;
	since: ColumnType<number, Integer, Integer>;
	every: ColumnType<number, Integer, Integer>;
}

export interface Task {
	id: ColumnType<number, Integer | undefined, Integer>;
	name: string;
	unit: string;
}

export interface Unit {
	name: string;
	pre: string;
	post: string;
}

export interface DB {
	quota: Quota;
	reminder: Reminder;
	task: Task;
	unit: Unit;
}
