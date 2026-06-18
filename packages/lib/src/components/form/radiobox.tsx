import React from "react";
import { css } from "../../lib/dom";
import { Override } from "../../types";

export type RadioboxProps = Override<
    React.PropsWithChildren<React.ComponentProps<"input">>,
    {
        size?: "medium" | "large";
    }
>;

export const Radiobox = ({ children, className = "", size: _size, ...props }: RadioboxProps) => (
    <label
        data-component="radiobox"
        data-disabled={props.disabled}
        aria-disabled={props.disabled}
        className={css("__form-radiobox__tw-1 __form-radiobox__tw-extra-1")}
    >
        <input {...props} type="radio" className={css("app __form-radiobox__tw-2 __form-radiobox__tw-state-1", className)} />
        {children}
    </label>
);
