import { ClassValue, clsx } from "clsx";
import React, { Ref, RefCallback, RefObject } from "react";
import { Is } from "sidekicker";
import { twMerge } from "tailwind-merge";

export const mergeRefs =
    <T>(...refs: Array<RefObject<T> | Ref<T> | undefined | null>): RefCallback<T> =>
    (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref !== null) {
                (ref as RefObject<T | null>).current = value;
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

export const dispatchInput = (input: HTMLInputElement | undefined | null) => {
    const event = new Event("input", { bubbles: true, composed: true });
    input?.dispatchEvent(event);
    return Object.assign({}, event, { target: input, currentTarget: input });
};

export const initializeInputDataset = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const focus = () => input.setAttribute("data-initialized", "true");
    input.addEventListener("focus", focus);
    return () => input.removeEventListener("focus", focus);
};

export const hasVerticalScroll = (htmlElement: HTMLElement) => htmlElement.scrollHeight > htmlElement.clientHeight;
