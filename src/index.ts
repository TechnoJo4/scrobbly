import { join, toFileUrl, relative, SEPARATOR } from "@std/path";
import { promises as fs } from "node:fs";

const reRouteName = /^(.+).tsx?$/;

const basePath = join(import.meta.dirname, "routes");
const routes = {};
for (const file of await fs.readdir(basePath, { withFileTypes: true, recursive: true })) {
    const match = reRouteName.exec(file.name);
    if (match !== null && file.isFile()) {
        const path = join(file.parentPath, file.name);
        const res: { default: Deno.ServeHandler } = await import(toFileUrl(path).toString())

        const routeName = match[1] === "index" ? "" : match[1];
        const route = relative(basePath, file.parentPath).replace(SEPARATOR, "/") + "/" + routeName;
        routes[route] = res.default;
    }
}

export default {
    fetch: function (req: Request, info: Deno.ServeHandlerInfo<Deno.Addr>): Response | Promise<Response> {
        const pathname = new URL(req.url).pathname;
        const handler = routes[pathname];
        if (handler !== undefined) {
            try {
                return handler(req, info);
            } catch (e) {
                console.error(e);
                return new Response(e.toString(), { status: 500 });
            }
        }
        return new Response("Not found", { status: 404 });
    }
} satisfies Deno.ServeDefaultExport;

