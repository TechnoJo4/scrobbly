import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await sql`pragma journal_mode = WAL;`.execute(db);

    await sql`CREATE TABLE unit(
        name TEXT PRIMARY KEY NOT NULL,
        pre TEXT NOT NULL,
        post TEXT NOT NULL
    ) STRICT;`.execute(db);

    await sql`CREATE TABLE task(
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        FOREIGN KEY (unit) REFERENCES unit (name)
    ) STRICT;`.execute(db);

    await sql`CREATE TABLE quota(
        id INTEGER PRIMARY KEY NOT NULL,
        task INTEGER NOT NULL,
        period INTEGER NOT NULL,
        max INTEGER NOT NULL,
        FOREIGN KEY (task) REFERENCES task (id)
    ) STRICT;`.execute(db);
    await sql`CREATE INDEX quota_task ON quota (task);`.execute(db);

    await sql`CREATE TABLE reminder(
        id INTEGER PRIMARY KEY NOT NULL,
        task INTEGER NOT NULL,
        since INTEGER NOT NULL,
        every INTEGER NOT NULL,
        FOREIGN KEY (task) REFERENCES task (id)
    ) STRICT;`.execute(db);
    await sql`CREATE INDEX reminder_task ON reminder (task);`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("unit").execute();
    await db.schema.dropTable("task").execute();
    await db.schema.dropTable("quota").execute();
    await db.schema.dropTable("reminder").execute();
}
