import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await sql`pragma journal_mode = WAL;`.execute(db);

    await sql`CREATE TABLE button(
        id INTEGER PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        task INTEGER NOT NULL,
        qty INTEGER NOT NULL,
        FOREIGN KEY (task) REFERENCES task (id)
    ) STRICT;`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("button").execute();
}
