export const qtyToStr = (qty: number, unit: { pre: string, post: string, decimals: number }) =>
    `${unit.pre}${qty * 10**(-unit.decimals)}${unit.post}`;
