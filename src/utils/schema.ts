import * as v from "@valibot/valibot";

export const int = v.pipe(v.number(), v.integer());

export const intStr = v.pipe(v.string(), v.toNumber(), v.integer());

export const idParam = v.object({ id: intStr });

export const checkbox = v.pipe(v.optional(v.string(), ""), v.transform(v => v === "on"));

export const unit = v.object({
    name: v.string(),
    pre: v.optional(v.string(), ""),
    post: v.optional(v.string(), ""),
    decimals: int,
});

export const task = v.object({
    name: v.string(),
    unit: v.string(),
    hidden: checkbox
});

export const event = v.object({
    task: int,
    time: v.optional(int),
    qty: int,
});

export const button = v.object({
    task: int,
    qty: int,
    label: v.string(),
});

export const quota = v.object({
    task: int,
    period: int,
    max: int,
});

export const reminder = v.object({
    task: int,
    since: int,
    every: int,
});
