import type React from "react";
import { forwardRef, useId } from "react";
import { css } from "../../lib/dom";
import type { Override } from "../../types";
import { checkboxStyles } from "./checkbox.styles";

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
                        checkboxStyles.className({ task: asTask ? "true" : "false" }),
                        "__checkbox__label",
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
                        className={css("__checkbox__control __checkbox__control-state", className)}
                    />
                    {children}
                </label>
                <span id={errorId} data-name="checkbox-label" className={css("__checkbox__error", labelClassName)}>
                    {error}
                </span>
            </>
        );
    }
);
