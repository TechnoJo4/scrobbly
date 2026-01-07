import * as v from "@valibot/valibot";

export const intStr = v.pipe(v.string(), v.toNumber(), v.integer());

export const unit = v.object({
    name: v.string(),
    pre: v.optional(v.string(), ""),
    post: v.optional(v.string(), ""),
    decimals: v.pipe(v.number(), v.integer()),
});

export const task = v.object({
    name: v.string(),
    unit: v.string(),
});
