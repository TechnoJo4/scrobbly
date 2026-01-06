// deno-lint-ignore-file require-await
import { CompiledQuery, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler, type Dialect, type DatabaseConnection, type Driver, type QueryResult } from "kysely";
import { type Database, type BindValue } from "@db/sqlite";

class SqliteDriver implements Driver {
    #c: undefined | Promise<void>; #r: undefined | (() => void); // lock bullshit
    #db: Database;

    constructor(db: Database) { this.#db = db; }
    async init(): Promise<void> {}
    async destroy(): Promise<void> { this.#db.close(); }

    async beginTransaction(c: DatabaseConnection): Promise<void> { await c.executeQuery(CompiledQuery.raw('begin')); }
    async commitTransaction(c: DatabaseConnection): Promise<void> { await c.executeQuery(CompiledQuery.raw('commit')); }
    async rollbackTransaction(c: DatabaseConnection): Promise<void> { await c.executeQuery(CompiledQuery.raw('rollback')); }

    async releaseConnection(): Promise<void> { this.#r?.(); }
    async acquireConnection(): Promise<DatabaseConnection> {
        while (this.#c) await this.#c;
        this.#c = new Promise(r => this.#r = () => {
            this.#c = undefined; this.#r = undefined; r();
        });

        const db = this.#db;
        return {
            async executeQuery<R>({ sql, parameters }: CompiledQuery): Promise<QueryResult<R>> {
                const rows = db.prepare(sql).all(...(parameters as BindValue[]));
                return Promise.resolve({
                    rows: rows as R[],
                    numAffectedRows: BigInt(db.changes),
                    insertId: BigInt(db.lastInsertRowId),
                });
            },
            async *streamQuery<R>({ sql, parameters }: CompiledQuery): AsyncIterableIterator<QueryResult<R>> {
                const stmt = db.prepare(sql).bind(...(parameters as BindValue[]));
                for (const row of stmt) yield { rows: [row] };
            }
        };
    }
};

export default (db: Database): Dialect => ({
    createDriver: () => new SqliteDriver(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
    createAdapter: () => new SqliteAdapter(),
    createIntrospector: db => new SqliteIntrospector(db)
});
