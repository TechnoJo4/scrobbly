import * as v from "@valibot/valibot";

export const byMethod = (methods: { [x in string]: Deno.ServeHandler }): Deno.ServeHandler => {
    const err = `method not allowed. use ${Object.keys(methods).join(", ")}`;
    return ((req: Request, info: Deno.ServeHandlerInfo<Deno.Addr>) => {
        return methods[req.method]
            ? methods[req.method](req, info)
            : new Response(err, { status: 405 })
    });
};

export const paramsTo = <TSchema extends v.GenericSchema>(schema: TSchema, params: URLSearchParams): v.InferOutput<TSchema> => {
    return v.parse(schema, Object.fromEntries(params.entries()));
};

export const reqParamsTo = <TSchema extends v.GenericSchema>(schema: TSchema, req: Request): v.InferOutput<TSchema> => {
    return paramsTo(schema, new URL(req.url).searchParams);
};

export type APIResponse<T extends object> = T | { error: string; status: number | undefined };

export const apiNotFound: APIResponse<any> = { error: "not found", status: 404 };

export const jsonHeaders = {
    "content-type": "application/json"
};

export const apiGet = <TResponse extends object>(f: (req: Request) => Promise<APIResponse<TResponse>>): Deno.ServeHandler => {
    return async (req: Request) => {
        const res = await f(req);
        if ("error" in res) {
            return new Response(JSON.stringify(res), {
                status: res.status !== undefined ? res.status : 400,
                headers: jsonHeaders,
            });
        }

        return new Response(JSON.stringify(res), { headers: jsonHeaders });
    }
};

export const apiRoute = <TSchema extends v.GenericSchema, TResponse extends object>(schema: TSchema, f: (req: v.InferOutput<TSchema>) => Promise<APIResponse<TResponse>>): Deno.ServeHandler => {
    return async (req: Request) => {
        const input = await req.json();
        try {
            const parsed = v.parse(schema, input);
            const res = await f(parsed);
            return new Response(JSON.stringify(res), { headers: jsonHeaders });
        } catch (e) {
            if (e instanceof v.ValiError)
                return new Response(JSON.stringify({
                    error: "request parsing failure",
                    issues: e.issues
                }), { status: 400, headers: jsonHeaders });
            throw e;
        }
    };
};

