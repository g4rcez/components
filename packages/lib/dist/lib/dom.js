import { clsx } from "clsx";
import { Is } from "sidekicker";
import { twMerge } from "tailwind-merge";
export const mergeRefs = (...refs) => (value) => {
    refs.forEach((ref) => {
        if (typeof ref === "function") {
            ref(value);
        }
        else if (ref !== null) {
            ref.current = value;
        }
    });
};
export const isReactComponent = (a) => {
    if (a.$$typeof === Symbol.for("react.forward_ref")) {
        return true;
    }
    if (a.$$typeof === Symbol.for("react.fragment")) {
        return true;
    }
    return a.$$typeof === Symbol.for("react.element");
};
export const isReactFC = (a) => Is.function(a);
export const css = (...styles) => twMerge(clsx(styles));
export const dispatchInput = (node, value) => {
    var _a;
    if (!node)
        return;
    const inputTypes = [window.HTMLInputElement, window.HTMLSelectElement, window.HTMLTextAreaElement];
    // only process the change on elements we know have a value setter in their constructor
    if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
        const setValue = (_a = Object.getOwnPropertyDescriptor(node.__proto__, "value")) === null || _a === void 0 ? void 0 : _a.set;
        const event = new Event("input", { bubbles: true });
        setValue === null || setValue === void 0 ? void 0 : setValue.call(node, value);
        node.dispatchEvent(event);
        return event;
    }
};
