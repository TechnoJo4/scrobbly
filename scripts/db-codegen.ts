import { db } from "../src/db/db.ts";

const upper0 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const types: Record<string, [string, string]> = {
    INTEGER: ["number", "Integer"],
    TEXT: ["string", "string"],
    FLOAT: ["number", "number"],
    BLOB: ["Uint8Array", "Uint8Array"]
};

let out = "import { ColumnType, Selectable } from \"kysely\";\n\ntype Integer = number | bigint | boolean;\n";
let dbTbl = "\nexport interface DB {";

for (const tbl of await db.introspection.getTables()) {
    const casedName = upper0(tbl.name)
    const typeName = casedName + "Table";
    dbTbl += `\n\t${tbl.name}: ${typeName};`;

    out += `\nexport interface ${typeName} {`;
    for (const col of tbl.columns) {
        const t = types[col.dataType];
        if (!t) throw new Error(`unknown datatype ${col.dataType}`);

        let [s,i] = t;
        let u = i;
        if (col.isNullable) {
            i += " | null | undefined";
            u += " | null";
        } else if (col.hasDefaultValue || col.isAutoIncrementing) {
            i += " | undefined";
        }

        out += "\n\t";
        out += u == s
            ? i == s
                ? `${col.name}: ${s};`
                : `${col.name}: ColumnType<${s}, ${i}>;`
            : `${col.name}: ColumnType<${s}, ${i}, ${u}>;`;
    }
    out += "\n}\n";
    out += `\nexport type ${casedName} = Selectable<${typeName}>;\n`;
}
out += dbTbl + "\n}\n";
await Deno.writeTextFile("src/db/types.ts", out);
