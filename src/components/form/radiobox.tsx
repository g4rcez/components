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
    <label data-disabled={props.disabled} aria-disabled={props.disabled} className="group font-normal flex items-center gap-2 data-[disabled=true]:cursor-not-allowed">
        <input
            {...props}
            type="radio"
            className={css(
                "form-radio rounded-full h-4 w-4 app border-card-border text-primary focus:ring-primary appearance-none inline-block bg-origin-border group-aria-disabled:cursor-not-allowed disabled:opacity-70",
                className
            )}
            {...props}
        />
        {children}
    </label>
);
