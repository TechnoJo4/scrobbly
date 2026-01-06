import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { Database } from "@db/sqlite";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import process from "node:process";

import SqliteDialect from "./dialect.ts";
import { DB } from "./types.ts";
export * from "./types.ts";

export const db = new Kysely<DB>({
    dialect: SqliteDialect(new Database(process.env.DB || "./data/db"))
});

// auto-migrate
const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs, path,
        migrationFolder: path.join(import.meta.dirname, "migrations"),
    })
});

const { error, results } = await migrator.migrateToLatest();
results?.forEach(res => console.log(`migration ${res.migrationName}: ${res.status}`));
if (error) process.exit(1);
