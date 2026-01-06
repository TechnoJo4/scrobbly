import { ColumnType } from "kysely";

export interface Test {
	id: ColumnType<number, number | bigint | boolean | undefined, number | bigint | boolean>;
}

export interface DB {
	test: Test;
}
