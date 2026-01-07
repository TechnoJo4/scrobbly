import { ColumnType } from "kysely";

export interface Quota {
	id: ColumnType<number, number | bigint | boolean | undefined, number | bigint | boolean>;
	task: ColumnType<number, number | bigint | boolean, number | bigint | boolean>;
	period: ColumnType<number, number | bigint | boolean, number | bigint | boolean>;
	max: ColumnType<number, number | bigint | boolean, number | bigint | boolean>;
}

export interface Reminder {
	id: ColumnType<number, number | bigint | boolean | undefined, number | bigint | boolean>;
	task: ColumnType<number, number | bigint | boolean, number | bigint | boolean>;
	since: ColumnType<number, number | bigint | boolean, number | bigint | boolean>;
	every: ColumnType<number, number | bigint | boolean, number | bigint | boolean>;
}

export interface Task {
	id: ColumnType<number, number | bigint | boolean | undefined, number | bigint | boolean>;
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
