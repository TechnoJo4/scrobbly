export const QtyInput = (props: { pre: string, post: string, decimals: number }) => <span>
    {props.pre}<input type="number" name="qty" step={10**(-props.decimals)} min={10**(-props.decimals)} value="1" required />{props.post}
</span>;
