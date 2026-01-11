import { timeToStrAbs, timeToStrRel } from "../utils/time.ts";

export const TimeRel = (props: { time: number, now?: number, class?: string }) =>
    <span class={props.class} title={timeToStrAbs(props.time)}>
        {timeToStrRel(props.time, props.now)}
    </span>;

export const TimeAbs = (props: { time: number, now?: number, class?: string }) =>
    <span class={props.class} title={timeToStrRel(props.time, props.now)}>
        {timeToStrAbs(props.time)}
    </span>;

