import React from "react";
import { css } from "../../lib/dom";
import { Override } from "../../types";

export type CheckboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        size?: "medium" | "large";
    }
>;

export const Checkbox = ({ children, className = "", size, ...props }: CheckboxProps) => (
    <label
        data-disabled={props.disabled}
        aria-disabled={props.disabled}
        className="group font-normal flex items-center gap-2 data-[disabled=true]:cursor-not-allowed"
    >
        <input
            {...props}
            type="checkbox"
            className={css(
                "form-checkbox size-4 rounded border-card-border text-primary focus:ring-primary appearance-none inline-block bg-origin-border group-aria-disabled:cursor-not-allowed disabled:opacity-70",
                className
            )}
            {...props}
        />
        {children}
    </label>
);
