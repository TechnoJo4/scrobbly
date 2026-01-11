export const classes = (c: Record<string, any>) => Object.entries(c).filter(([_,v]) => v).map(([k,_]) => k).join(" ");
