import { join } from "@std/path";

const css = await Deno.readTextFile(join(import.meta.dirname!, "style.css"));

export default () => new Response(css, { headers: { "content-type": "text/css" } });
