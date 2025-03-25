"use client";
import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { useStableRef } from "../../hooks/use-stable-ref";
import { css } from "../../lib/dom";

export type SwitchProps = React.ComponentProps<"input"> & {
    error?: string;
    container?: string;
    onCheck?: (nextValue: boolean) => void;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ children, container, error, ...props }: SwitchProps, ref) => {
    const id = useId();
    const [innerChecked, setInnerChecked] = useState(props.checked ?? false);
    const checked = innerChecked;
    const innerRef = useRef<HTMLInputElement>(null);
    const stableOnChange = useStableRef(props.onChange);
    useImperativeHandle(ref, () => innerRef.current!);

    useEffect(() => {
        if (innerRef.current !== null) {
            if (stableOnChange.current) {
                const onChange = (e: any) => {
                    e.target.checked = !e.target.checked;
                    stableOnChange.current && stableOnChange.current(e);
                };
                innerRef.current.addEventListener("change", onChange);
                return () => innerRef.current?.removeEventListener("change", onChange);
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
        <fieldset className={css("flex flex-col flex-wrap justify-center", container)} data-component="switch">
            <span className="flex flex-row flex-wrap items-center">
                <input
                    {...props}
                    checked={checked}
                    data-checked={checked}
                    data-trigger="change"
                    hidden
                    id={props.id || id}
                    onChange={(e) => setInnerChecked(e.target.checked)}
                    ref={innerRef}
                    type="checkbox"
                />
                <button
                    type="button"
                    role="switch"
                    onClick={onCheck}
                    aria-checked={checked}
                    data-checked={checked}
                    aria-labelledby={`${id}-label`}
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked=false]:bg-input-switch-bg data-[checked=true]:bg-primary"
                >
                    <span
                        aria-hidden="true"
                        data-checked={checked}
                        className="inline-block aspect-square size-5 transform rounded-full shadow ring-0 transition duration-300 ease-in-out data-[checked=false]:translate-x-0 data-[checked=true]:translate-x-5 data-[checked=false]:bg-disabled data-[checked=true]:bg-input-switch"
                    />
                </button>
                <label htmlFor={props.id || id} className="ml-3 inline-block text-sm" id={`${id}-label`}>
                    <span className="font-medium text-foreground">{children}</span>
                </label>
            </span>
            <span className="mt-1 flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden">{error}</span>
        </fieldset>
    );
});
