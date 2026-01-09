export const QtyInput = (props: { qty?: number, pre: string, post: string, decimals: number }) => <span>
    {props.pre}<input type="number" name="qty" required
        step={10**(-props.decimals)}
        min={10**(-props.decimals)}
        value={(props.qty??1) *10**(-props.decimals)} />{props.post}
</span>;
