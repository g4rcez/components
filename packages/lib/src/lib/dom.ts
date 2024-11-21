import { ClassValue, clsx } from "clsx";
import React, { LegacyRef, MutableRefObject, RefCallback } from "react";
import { Is } from "sidekicker";
import { twMerge } from "tailwind-merge";

export const mergeRefs =
    <T extends any = any>(...refs: Array<MutableRefObject<T> | LegacyRef<T> | undefined | null>): RefCallback<T> =>
    (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref !== null) {
                (ref as MutableRefObject<T | null>).current = value;
            }
        });
    };

export const isReactComponent = (a: any): a is React.ReactElement => {
    if (a.$$typeof === Symbol.for("react.forward_ref")) {
        return true;
    }
    if (a.$$typeof === Symbol.for("react.fragment")) {
        return true;
    }
    return a.$$typeof === Symbol.for("react.element");
};

export const isReactFC = (a: any) => Is.function(a);

export const css = (...styles: ClassValue[]) => twMerge(clsx(styles));

export const dispatchInput = (input: HTMLInputElement | undefined | null, newValue: string) => {
    const event = new Event("input", { bubbles: true, composed: true });
    input?.dispatchEvent(event);
    return Object.assign({}, event, { target: input, currentTarget: input });
};

export const initializeInputDataset = (input: HTMLInputElement | HTMLSelectElement) => {
    const focus = () => input.setAttribute("data-initialized", "true");
    input.addEventListener("focus", focus);
    return () => input.removeEventListener("focus", focus);
};
