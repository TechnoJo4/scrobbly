let Ctx: Context<any> | undefined = undefined;
export class Context<T> {
    cleanup: Set<() => void> = new Set();
    data: T;
    #f: (v: Context<T>) => void;
    constructor(f: (c: Context<T>) => void, v: T) { this.#f = f; this.data = v; }
    fn() {
        const prev = Ctx; Ctx = this;
        this.#f(this);
        Ctx = prev;
    }
};

export const getCurrentContextData = () => Ctx?.data;

export const ctx = <T>(f: (c: Context<T>) => void, init: T = undefined as T): Context<T> => {
    const c = new Context(f, init);
    if (Ctx) Ctx.cleanup.add(() => dispose(c));
    c.fn = c.fn.bind(c);
    c.fn();
    return c;
};

export class Signal<T> {
    constructor(v: T) { this.#v = v; }
    #subs: Set<(v: T) => unknown | Promise<unknown>> = new Set();
    #v: T;

    subscribe(ctx: Context<any>) {
        this.#subs.add(ctx.fn);
        ctx.cleanup.add(() => this.#subs.delete(ctx.fn));
    }
    emit() {
        for (const sub of this.#subs)
            try { sub(this.#v); } catch (e) { console.warn(`error in subscriber`, e); }
    }
    get(): T {
        if (Ctx) this.subscribe(Ctx);
        return this.#v;
    }
    do(f: (v: T) => T) { this.set(f(this.#v)); }
    do_(f: (v: T) => void) { f(this.#v); this.emit(); }
    set(v: T) {
        if (v !== this.#v) { this.#v = v; this.emit(); }
    }
}

export type Signals<T extends object> = { [k in keyof T]: T[k] extends object ? Signals<T[k]> : Signal<T[k]> };
export const signals = <T extends object>(v: T): Signals<T> => {
    return Object.fromEntries(Object.entries(v).map(
        ([k,v]) => [k, typeof v === "object" ? signals(v) : new Signal(v)])
    ) as any;
};

export const update = <T extends object>(o: T, s: Signals<T>) => {
    for (const k in o)
        if (typeof o[k] === "object")
            update(o[k] as any, s[k] as any);
        else
            (s[k] as Signal<any>).set(o[k]);
};

export const dispose = (c: Context<any>) => {
    for (const f of c.cleanup) f();
    c.cleanup.clear();
    c.data = undefined as any;
};
