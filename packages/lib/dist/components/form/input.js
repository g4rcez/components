"use client";
import { __rest } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef } from "react";
import MaskInput from "the-mask-input";
import { css, mergeRefs } from "../../lib/dom";
import { InputField } from "./input-field";
export const Input = forwardRef((_a, ref) => {
    var _b;
    var { type = "text", feedback = null, info, labelClassName, next, interactive, rightLabel, optionalText, container, hideLeft = false, right, left, error } = _a, props = __rest(_a, ["type", "feedback", "info", "labelClassName", "next", "interactive", "rightLabel", "optionalText", "container", "hideLeft", "right", "left", "error"]);
    const id = (_b = props.id) !== null && _b !== void 0 ? _b : props.name;
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current === null)
            return;
        const input = inputRef.current;
        const focus = () => input.setAttribute("data-initialized", "true");
        const goNextInputImpl = (e) => {
            const event = e;
            if (event.key === "Enter" && input.enterKeyHint === "next") {
                const focusNext = input.getAttribute("data-next");
                if (focusNext) {
                    const el = document.getElementById(focusNext);
                    if (el) {
                        el.focus();
                        return void event.preventDefault();
                    }
                }
            }
        };
        input.addEventListener("keydown", goNextInputImpl);
        input.addEventListener("focus", focus);
        return () => {
            input.removeEventListener("keydown", goNextInputImpl);
            input.removeEventListener("focus", focus);
        };
    }, []);
    return (_jsx(InputField, { info: info, container: css("group inline-block w-full", container), error: error, feedback: feedback, hideLeft: hideLeft, left: left, optionalText: optionalText, right: right, rightLabel: rightLabel, interactive: interactive, form: props.form, id: props.name || props.id, name: props.name, labelClassName: labelClassName, title: props.title, placeholder: props.placeholder, required: props.required, children: _jsx(MaskInput, Object.assign({}, props, { type: type, "data-next": next, ref: mergeRefs(ref, inputRef), id: id, name: id, className: css("input text-foreground group h-11 w-full flex-1 rounded-md bg-transparent p-2 placeholder-input-mask outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error", !!right ? "pe-4" : "", !!left ? "ps-4" : "", props.className) })) }));
});
