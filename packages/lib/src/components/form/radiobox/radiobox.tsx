import type React from "react";
import { forwardRef } from "react";
import { css } from "../../../lib/dom";
import type { Override } from "../../../types";
import { radioboxStyles } from "./radiobox.styles";

export type RadioboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        size?: "medium" | "large";
    }
>;

export const Radiobox = forwardRef<HTMLInputElement, RadioboxProps>(function Radiobox(
    { children, className = "", size = "medium", ...props }: RadioboxProps,
    ref
) {
    return (
        <label
            data-component="radiobox"
            data-disabled={props.disabled}
            aria-disabled={props.disabled}
            className={css(radioboxStyles.className({ size }), radioboxStyles.slots.label)}
        >
            <input
                {...props}
                ref={ref}
                type="radio"
                className={css(radioboxStyles.slots.control, radioboxStyles.slots["control-state"], className)}
            />
            {children}
        </label>
    );
});
