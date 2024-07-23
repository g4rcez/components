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

export const dispatchInput = (input: HTMLInputElement, value: string) => {
    console.log(input, value);
    const native = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    native.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
};
