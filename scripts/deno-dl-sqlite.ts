// Force deno to download libsqlite by opening an in-memory database
// Used during docker build so that it's not re-downloaded every container startup
import { Database } from "@db/sqlite";
new Database(":memory:");
