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

export const dispatchInput = (node: HTMLInputElement | undefined | null, value: string) => {
    if (!node) return;
    const inputTypes = [window.HTMLInputElement, window.HTMLSelectElement, window.HTMLTextAreaElement];
    // only process the change on elements we know have a value setter in their constructor
    if (inputTypes.indexOf((node as any).__proto__.constructor) > -1) {
        const setValue = Object.getOwnPropertyDescriptor((node as any).__proto__, "value")?.set;
        const event = new Event("input", { bubbles: true });
        setValue?.call(node, value);
        node.dispatchEvent(event);
        return event;
    }
};

export const initializeInputDataset = (input: HTMLInputElement | HTMLSelectElement) => {
    const focus = () => input.setAttribute("data-initialized", "true");
    input.addEventListener("focus", focus);
    return () => input.removeEventListener("focus", focus);
}
