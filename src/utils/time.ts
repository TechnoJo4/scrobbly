export const time = () => Math.floor(Date.now());

export const latestReminderTime = (since: number, every: number) => Math.floor((time() - since) / every) * every + since;

export const nextReminderTime = (since: number, every: number) => latestReminderTime(since, every) + every;

const timeUnitMultiples = [1, 1000, 60, 60, 24, 7];
const timeUnitNames = ["ms", "s", "m", "h", "day", "week"];
const timeUnitPost = ["ms", "s", "m", "h", " days", " weeks"];

export const timeUnits = timeUnitMultiples.map((_,i) => ({
    name: timeUnitNames[i],
    post: timeUnitPost[i],
    ms: timeUnitMultiples.slice(0,i+1).reduce((a,b) => a*b),
}));

export const timespanToStr = (span: number) => {
    let use = timeUnits[0];
    for (const unit of timeUnits) {
        if (span < 2*unit.ms) break;
        use = unit;
    }
    return (span/use.ms).toFixed(0)+use.post;
};

export const timeToStrRel = (t: number, now: number = time()) => {
    return timespanToStr(now - t)+" ago";
};

export const timeToStrAbs = (t: number) => {
    return new Date(t).toISOString().replace("T", " ").replace("Z", "");
};
