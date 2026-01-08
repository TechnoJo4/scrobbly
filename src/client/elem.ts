import { ctx, getCurrentContextData } from "./signals.ts";

export const key = Symbol("element key");

export type E = HTMLElement | Text | Comment;
export type FE = E | (() => E) | { [key]: string, f: () => E };

export const t = document.createTextNode.bind(document);

type ElemContextData = { [key]: Record<string, E>, elem: E };

export function e<T extends keyof HTMLElementTagNameMap>(tag: T, attrs: object = {}, children: FE[] = []): HTMLElementTagNameMap[T] {
    const c = getCurrentContextData();
    const cache: Record<string, E> | undefined = c && key in c ? c[key] : undefined;

    let e: HTMLElementTagNameMap[T];
    if (cache && key in attrs) {
        const k = attrs[key] as string;
        e = cache[k] as typeof e;
        if (!e) e = cache[k] = document.createElement(tag);
    } else e = document.createElement(tag);

    Object.assign(e, Object.fromEntries(Object.entries(attrs).filter(([k]) => typeof k === "string" && !k.startsWith("_"))));

    const nodes = children.map(v => {
        if (key in v)
            if (cache && v[key] in cache) return cache[v[key]];
            else v = (({ [key]: k, f }) => () => cache ? cache[k] = f() : f())(v);

        return typeof v !== "function" ? v : ctx<ElemContextData>(c => {
            const e = v();
            if (c.data.elem) c.data.elem.replaceWith(e);
            c.data.elem = e;
        }, { [key]: {}, elem: undefined as any }).data.elem as E;
    });
    e.append(...nodes);

    for (const [k,v] of Object.entries(attrs)) 
        if (k.startsWith("_on")) e.addEventListener(k.substring(3), v.bind(e));

    return e;
}
