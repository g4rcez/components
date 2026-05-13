import React from "react";
import { css } from "../../lib/dom";
import { Override } from "../../types";

export type RadioboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        size?: "medium" | "large";
    }
>;

export const Radiobox = ({ children, className = "", size, ...props }: RadioboxProps) => (
    <label
        data-component="radiobox"
        data-disabled={props.disabled}
        aria-disabled={props.disabled}
        className={css("group flex items-center gap-radiobox-gap font-normal data-[disabled=true]:cursor-not-allowed")}
    >
        <input
            {...props}
            type="radio"
            className={css(
                "app form-radio inline-block size-radiobox-size appearance-none rounded-full border-card-border bg-origin-border text-primary focus:ring-primary disabled:opacity-70 group-aria-disabled:cursor-not-allowed",
                className
            )}
            {...props}
        />
        {children}
    </label>
);
