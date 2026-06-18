"use client";
import type React from "react";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { useStableRef } from "../../hooks/use-stable-ref";
import { css } from "../../lib/dom";

export type SwitchProps = Omit<React.ComponentProps<"input">, "onKeyDown"> & {
    error?: string;
    loading?: boolean;
    container?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
    onCheck?: (nextValue: boolean) => void;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ children, loading, container, error, onKeyDown, onCheck: onCheckProp, ...props }: SwitchProps, ref) => {
        const id = useId();
        const errorId = error ? `${props.id || id}-error` : undefined;
        const describedBy = [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;
        const ariaInvalid = error ? true : props["aria-invalid"];
        const [innerChecked, setInnerChecked] = useState(props.checked ?? false);
        const checked = innerChecked;
        const innerRef = useRef<HTMLInputElement>(null);
        const stableOnChange = useStableRef(props.onChange);
        useImperativeHandle(ref, () => innerRef.current!);

        useEffect(() => {
            if (innerRef.current !== null) {
                if (stableOnChange.current) {
                    const onChange = (e: Event) => {
                        if (stableOnChange.current) stableOnChange.current(e as unknown as React.ChangeEvent<HTMLInputElement>);
                    };
                    const ref = innerRef.current;
                    ref.addEventListener("change", onChange);
                    return () => ref?.removeEventListener("change", onChange);
                }
            }
        }, [stableOnChange]);

        const onCheck = () => {
            const checked = !innerRef.current?.checked;
            setInnerChecked(checked);
            onCheckProp?.(checked);
            if (innerRef.current !== null) {
                innerRef.current.checked = checked;
                innerRef.current.dispatchEvent(new Event("change", { bubbles: true }));
            }
        };

        return (
            <fieldset
                className={css("__switch __switch__fieldset", container)}
                data-component="switch"
                disabled={props.disabled || loading}
            >
                <span className="__switch__row">
                    <input
                        {...props}
                        hidden
                        ref={innerRef}
                        type="checkbox"
                        checked={checked}
                        id={props.id || id}
                        data-trigger="change"
                        data-checked={checked}
                        disabled={props.disabled || loading}
                        onChange={(e) => setInnerChecked(e.target.checked)}
                    />
                    <button
                        role="switch"
                        type="button"
                        onClick={onCheck}
                        onKeyDown={(event) => {
                            onKeyDown?.(event);

                            if (event.defaultPrevented) return;
                            if (event.key === " " || event.key === "Space" || event.code === "Space" || event.key === "Enter") {
                                event.preventDefault();
                                onCheck();
                            }
                        }}
                        aria-checked={checked}
                        aria-invalid={ariaInvalid}
                        aria-describedby={describedBy}
                        data-checked={checked}
                        aria-labelledby={`${id}-label`}
                        disabled={props.disabled || loading}
                        className="__switch__track"
                    >
                        <span aria-hidden="true" data-checked={checked} className="__switch__thumb" />
                    </button>
                    <label htmlFor={props.id || id} className="__switch__label" id={`${id}-label`}>
                        <span className="__switch__label-text">{children}</span>
                    </label>
                </span>
                <span id={errorId} className="__switch__error">
                    {error}
                </span>
            </fieldset>
        );
    }
);
