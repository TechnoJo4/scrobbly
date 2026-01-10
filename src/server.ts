import { join, toFileUrl, relative, SEPARATOR } from "@std/path";
import { promises as fs } from "node:fs";
import { HTTPError } from "./utils/http.ts";

const reRouteName = /^(.+).tsx?$/;

const srcPath = import.meta.dirname;
if (!srcPath) throw new Error("couldn't get import.meta.dirname");

const basePath = join(srcPath, "routes");
const routes: Record<string, Deno.ServeHandler> = {};
for (const file of await fs.readdir(basePath, { withFileTypes: true, recursive: true })) {
    const match = reRouteName.exec(file.name);
    if (match !== null && file.isFile()) {
        const path = join(file.parentPath, file.name);
        const res: { default: Deno.ServeHandler } = await import(toFileUrl(path).toString())

        const routeName = match[1] === "index" ? "" : match[1];
        const route = relative(basePath, file.parentPath).replace(SEPARATOR, "/") + "/" + routeName;
        routes[route.startsWith("/") ? route : "/" + route] = res.default;
    }
}

export default {
    fetch: async function (req: Request, info: Deno.ServeHandlerInfo<Deno.Addr>): Promise<Response> {
        const pathname = new URL(req.url).pathname;
        const handler = routes[pathname];
        if (handler !== undefined) {
            try {
                return await handler(req, info);
            } catch (e) {
                if (e instanceof HTTPError) {
                    return e.res;
                }

                console.error(e);
                return new Response("internal server error", { status: 500 });
            }
        }
        return new Response("not found", { status: 404 });
    }
} satisfies Deno.ServeDefaultExport;
