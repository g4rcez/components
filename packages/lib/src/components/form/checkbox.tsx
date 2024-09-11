import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { Override } from "../../types";

export type CheckboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        size?: "medium" | "large";
        error?: string;
        container?: string;
    }
>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ children, error, className = "", size, container, ...props }: CheckboxProps, ref) => (
        <label
            data-disabled={props.disabled}
            aria-disabled={props.disabled}
            className={css("group flex flex-wrap items-center font-normal data-[disabled=true]:cursor-not-allowed", container)}
        >
            <input
                {...props}
                ref={ref}
                type="checkbox"
                className={css(
                    "form-checkbox mr-2 inline-block size-4 appearance-none rounded border-card-border bg-origin-border text-primary focus:ring-primary disabled:opacity-70 group-aria-disabled:cursor-not-allowed",
                    className
                )}
            />
            {children}
            <span className="flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden">{error}</span>
        </label>
    )
);
