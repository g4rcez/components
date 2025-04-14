import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { Override } from "../../types";

export type CheckboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        error?: string;
        asTask?: boolean;
        container?: string;
        labelClassName?: string;
        size?: "medium" | "large";
    }
>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ children, asTask = false, labelClassName, loading, error, className = "", size, container, ...props }: CheckboxProps, ref) => {
        const d = props.disabled || loading;
        return (
            <label
                aria-disabled={d}
                data-disabled={d}
                data-task={asTask}
                data-component="checkbox"
                className={css(
                    "group flex w-fit flex-wrap items-center font-normal data-[disabled=true]:cursor-not-allowed",
                    asTask ? "group-checkbox-checked:line-through" : "",
                    container
                )}
            >
                <input
                    {...props}
                    ref={ref}
                    disabled={d}
                    type="checkbox"
                    data-task={asTask}
                    className={css(
                        "form-checkbox mr-2 inline-block size-4 appearance-none rounded border-card-border bg-origin-border text-primary focus:ring-primary disabled:opacity-70 group-aria-disabled:cursor-not-allowed",
                        className
                    )}
                />
                {children}
                <span data-name="checkbox-label" className={css("min-w-full flex-1 text-xs text-danger empty:mt-0 empty:hidden", labelClassName)}>
                {error}
            </span>
            </label>
        )
    }
);
