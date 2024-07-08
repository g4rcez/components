import { useId } from "@floating-ui/react";
import React, { useState } from "react";

export const Switch = (props: React.ComponentProps<"input">) => {
    const id = useId();
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex items-center">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                data-checked={checked}
                aria-labelledby={`${id}-label`}
                onClick={() => setChecked((prev) => !prev)}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent data-[checked=false]:bg-input-switch data-[checked=true]:bg-primary transition-colors ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                <span
                    aria-hidden="true"
                    data-checked={checked}
                    className="data-[checked=false]:bg-disabled data-[checked=true]:bg-primary-subtle pointer-events-none inline-block size-5 aspect-square data-[checked=false]translate-x-0 data-[checked=true]:translate-x-5 transform rounded-full shadow ring-0 transition ease-in-out"
                />
            </button>
            <span className="ml-3 text-sm" id={`${id}-label`}>
                <span className="font-medium text-foreground">{props.children}</span>
            </span>
        </div>
    );
};
