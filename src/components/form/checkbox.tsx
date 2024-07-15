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
    <label className="font-normal flex items-center gap-2">
        <input
            {...props}
            type="checkbox"
            className={css(
                "form-checkbox h-4 w-4 app rounded border-card-border text-primary focus:ring-primary appearance-none inline-block bg-origin-border select-none",
                className
            )}
            {...props}
        />
        {children}
    </label>
);
