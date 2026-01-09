import { JSXNode } from "@oomfware/jsx";

export const Field = (props: { children: JSXNode, label?: string }) => props.label
        ? <label class="field">{props.label} {props.children}</label>
        : <div class="field">{props.children}</div>;
