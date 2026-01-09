import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { Database } from "@db/sqlite";
import { promises as fs } from "node:fs";
import { join, toFileUrl } from "@std/path";

import SqliteDialect from "./dialect.ts";
import { DB } from "./types.ts";
export * from "./types.ts";

const conn = new Database(Deno.env.get("DB") || "./data/db", { int64: true });
conn.exec("pragma foreign_keys = ON");

export const db = new Kysely<DB>({ dialect: SqliteDialect(conn) });

if (!import.meta.dirname) throw new Error("can't get import.meta.dirname");

// auto-migrate
const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path: {
            join: (a: string, ...b: string[]): string => toFileUrl(join(a, ...b)).toString()
        },
        migrationFolder: join(import.meta.dirname, "migrations"),
    })
});

const { error, results } = await migrator.migrateToLatest();
results?.forEach(res => console.log(`migration ${res.migrationName}: ${res.status}`));
if (error) {
    console.error(error);
    Deno.exit(1);
};
