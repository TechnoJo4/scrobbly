import * as v from "@valibot/valibot";

export const int = v.pipe(v.number(), v.integer());

export const intStr = v.pipe(v.string(), v.toNumber(), v.integer());

export const unit = v.object({
    name: v.string(),
    pre: v.optional(v.string(), ""),
    post: v.optional(v.string(), ""),
    decimals: int,
});

export const task = v.object({
    name: v.string(),
    unit: v.string(),
});

export const event = v.object({
    task: int,
    time: int,
    qty: int,
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
