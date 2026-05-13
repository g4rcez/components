"use client";
import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { useStableRef } from "../../hooks/use-stable-ref";
import { css } from "../../lib/dom";

export type SwitchProps = React.ComponentProps<"input"> & {
    error?: string;
    loading?: boolean;
    container?: string;
    onCheck?: (nextValue: boolean) => void;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ children, loading, container, error, ...props }: SwitchProps, ref) => {
    const id = useId();
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
    }, []);

    const onCheck = () => {
        const checked = !innerRef.current?.checked;
        setInnerChecked(checked);
        props?.onCheck?.(checked);
        if (innerRef.current !== null) {
            innerRef.current.checked = checked;
            innerRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    return (
        <fieldset className={css("flex flex-col flex-wrap justify-center", container)} data-component="switch" disabled={props.disabled || loading}>
            <span className="flex flex-row flex-wrap items-center">
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
                    aria-checked={checked}
                    data-checked={checked}
                    aria-labelledby={`${id}-label`}
                    disabled={props.disabled || loading}
                    className="relative inline-flex h-switch-track-h w-switch-track-w flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked=false]:bg-input-switch-bg data-[checked=true]:bg-primary"
                >
                    <span
                        aria-hidden="true"
                        data-checked={checked}
                        className="inline-block aspect-square size-switch-thumb-size transform rounded-full shadow ring-0 transition duration-300 ease-in-out data-[checked=false]:translate-x-0 data-[checked=true]:translate-x-5 data-[checked=false]:bg-disabled data-[checked=true]:bg-input-switch"
                    />
                </button>
                <label htmlFor={props.id || id} className="ml-switch-gap inline-block text-switch-label-text" id={`${id}-label`}>
                    <span className="font-medium text-foreground">{children}</span>
                </label>
            </span>
            <span className="mt-switch-hint-mt flex-1 whitespace-nowrap text-switch-hint-text text-danger empty:mt-0 empty:hidden">{error}</span>
        </fieldset>
    );
});
