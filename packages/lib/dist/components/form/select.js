"use client";
import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useTranslations } from "../../hooks/use-translate-context";
import { css, mergeRefs } from "../../lib/dom";
import { InputField } from "./input-field";
export const Select = forwardRef((_a, ref) => {
    var _b;
    var { required = true, options, info, selectContainer = "", feedback = null, labelClassName, interactive, rightLabel, optionalText, container, hideLeft = false, right, left, error } = _a, props = __rest(_a, ["required", "options", "info", "selectContainer", "feedback", "labelClassName", "interactive", "rightLabel", "optionalText", "container", "hideLeft", "right", "left", "error"]);
    const translation = useTranslations();
    const inputRef = useRef(null);
    const id = (_b = props.id) !== null && _b !== void 0 ? _b : props.name;
    useImperativeHandle(ref, () => inputRef.current);
    useEffect(() => {
        if (inputRef.current === null)
            return;
        const input = inputRef.current;
        const focus = () => input.setAttribute("data-initialized", "true");
        const change = () => input.setAttribute("data-selected", "true");
        input.addEventListener("focus", focus);
        input.addEventListener("change", change);
        return () => {
            input.removeEventListener("focus", focus);
            input.removeEventListener("change", change);
        };
    }, []);
    const onClickLabel = () => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); };
    return (_jsx(InputField, { container: css("group inline-block w-full", container), error: error, feedback: feedback, hideLeft: hideLeft, left: left, info: info, optionalText: optionalText, rightLabel: rightLabel, interactive: interactive, form: props.form, id: props.name || props.id, name: props.name, labelClassName: labelClassName, title: props.title, placeholder: props.placeholder, required: required, right: _jsx("label", { htmlFor: id, children: _jsxs("button", { onClick: onClickLabel, type: "button", className: "mt-2 transition-colors hover:text-primary", children: [_jsx(ChevronDown, { size: 20 }), _jsx("span", { className: "sr-only", children: translation.inputCaretDown })] }) }), children: _jsxs("select", Object.assign({}, props, { ref: mergeRefs(ref, inputRef), id: id, name: id, value: props.value, required: required, "data-selected": !!props.value || false, defaultValue: props.value ? undefined : "", className: css("input select group h-11 w-full flex-1 rounded-md bg-transparent p-2 text-foreground placeholder-input-placeholder outline-none transition-colors group-error:text-danger group-error:placeholder-input-mask-error", "data-[selected=false]:text-input-placeholder", props.className), children: [_jsx("option", { value: "", disabled: true, hidden: true, children: props.placeholder }), options.map((option) => {
                    var _a;
                    return (_jsx("option", Object.assign({}, option, { children: (_a = option.label) !== null && _a !== void 0 ? _a : option.value }), `${id}-select-option-${option.value}`));
                })] })) }));
});
