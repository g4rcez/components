"use client";
import React, { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { useCallbackRef } from "../../hooks/use-callback-ref";
import { css, dispatchInput } from "../../lib/dom";

export type SwitchProps = React.ComponentProps<"input"> & {
    onCheck?: (nextValue: boolean) => void;
    error?: string;
    container?: string;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ children, container, error, ...props }: SwitchProps, ref) => {
    const id = useId();
    const [innerChecked, setInnerChecked] = useState(props.checked ?? false);
    const checked = innerChecked;
    const innerRef = useRef<HTMLInputElement>(null);
    const stableOnChange = useCallbackRef(props.onChange);
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

    const onCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.target as HTMLButtonElement;
        const checked = !(button.dataset.checked === "true");
        setInnerChecked(checked);
        props?.onCheck?.(checked);
        if (innerRef.current !== null) {
            dispatchInput(innerRef.current, checked.toString());
            innerRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    return (
        <fieldset className={css("flex flex-wrap items-center", container)}>
            <input {...props} ref={innerRef} hidden type="checkbox" checked={checked} onChange={(e) => setInnerChecked(e.target.checked)} />
            <button
                type="button"
                role="switch"
                onClick={onCheck}
                aria-checked={checked}
                data-checked={checked}
                aria-labelledby={`${id}-label`}
                className="duration-300 ease-in-out relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked=false]:bg-input-switch-bg data-[checked=true]:bg-primary"
            >
                <span
                    aria-hidden="true"
                    data-checked={checked}
                    className="duration-300 duration-300 ease-in-out inline-block aspect-square size-5 transform rounded-full shadow ring-0 transition data-[checked=false]:translate-x-0 data-[checked=true]:translate-x-5 data-[checked=false]:bg-disabled data-[checked=true]:bg-input-switch"
                />
            </button>
            <span className="ml-3 text-sm" id={`${id}-label`}>
                <span className="font-medium text-foreground">{children}</span>
            </span>
            <span className="mt-1 flex-1 whitespace-nowrap text-xs text-danger empty:mt-0 empty:hidden">{error}</span>
        </fieldset>
    );
});
