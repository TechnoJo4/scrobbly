import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { Database } from "@db/sqlite";
import { promises as fs } from "node:fs";
import { join, toFileUrl } from "@std/path";

import SqliteDialect from "./dialect.ts";
import { DB } from "./types.ts";
export * from "./types.ts";

export const db = new Kysely<DB>({
    dialect: SqliteDialect(new Database(Deno.env.get("DB") || "./data/db"))
});

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
