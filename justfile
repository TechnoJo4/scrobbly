codegen $DB=":memory:":
    deno run -A scripts/db-codegen.ts

run:
    deno serve -A --port 8000 src/server.ts
