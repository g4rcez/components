"use client";
import React, { useId, useState } from "react";

type SwitchProps = Omit<React.ComponentProps<"input">, "onChange"> & { onCheck?: (nextValue: boolean) => void };

export const Switch = ({ children, ...props }: SwitchProps) => {
    const id = useId();
    const [innerChecked, setInnerChecked] = useState(false);
    const checked = props.checked ?? innerChecked;

    const onCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.target as HTMLButtonElement;
        const checked = !(button.dataset.checked === "true");
        setInnerChecked(checked);
        props?.onCheck?.(checked);
    };

    return (
        <div className="flex items-center">
            <input {...props} hidden type="checkbox" checked={checked} onChange={(e) => setInnerChecked(e.target.checked)} />
            <button
                type="button"
                role="switch"
                onClick={onCheck}
                aria-checked={checked}
                data-checked={checked}
                aria-labelledby={`${id}-label`}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent data-[checked=false]:bg-input-switch-bg data-[checked=true]:bg-primary transition-colors ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                <span
                    aria-hidden="true"
                    data-checked={checked}
                    className="data-[checked=false]:bg-disabled data-[checked=true]:bg-input-switch pointer-events-none inline-block size-5 aspect-square data-[checked=false]translate-x-0 data-[checked=true]:translate-x-5 transform rounded-full shadow ring-0 transition ease-in-out"
                />
            </button>
            <span className="ml-3 text-sm" id={`${id}-label`}>
                <span className="font-medium text-foreground">{children}</span>
            </span>
        </div>
    );
};
