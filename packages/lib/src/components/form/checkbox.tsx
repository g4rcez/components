import React, { forwardRef, useId } from "react";
import { css } from "../../lib/dom";
import { Override } from "../../types";

export type CheckboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        error?: string;
        asTask?: boolean;
        loading?: boolean;
        container?: string;
        labelClassName?: string;
        size?: "medium" | "large";
    }
>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ children, asTask = false, labelClassName, loading, error, className = "", size: _size, container, ...props }: CheckboxProps, ref) => {
        const d = props.disabled || loading;
        const generatedId = useId();
        const id = props.id ?? props.name ?? generatedId;
        const errorId = error ? `${id}-error` : undefined;
        const describedBy = [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;
        const ariaInvalid = error ? true : props["aria-invalid"];
        return (
            <>
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
                        aria-invalid={ariaInvalid}
                        aria-describedby={describedBy}
                        onKeyDown={(event) => {
                            props.onKeyDown?.(event);

                            if (event.defaultPrevented) return;
                            if (event.key === " " || event.key === "Space" || event.code === "Space" || event.key === "Enter") {
                                event.preventDefault();
                                event.currentTarget.click();
                            }
                        }}
                        className={css(
                            "form-checkbox mr-checkbox-gap inline-block size-checkbox-size appearance-none rounded-checkbox-radius border-card-border bg-origin-border text-primary focus:ring-primary disabled:opacity-70 group-aria-disabled:cursor-not-allowed",
                            className
                        )}
                    />
                    {children}
                </label>
                <span
                    id={errorId}
                    data-name="checkbox-label"
                    className={css("min-w-full flex-1 text-checkbox-hint-text text-danger empty:mt-0 empty:hidden", labelClassName)}
                >
                    {error}
                </span>
            </>
        );
    }
);
