"use client";
import { jsx as _jsx } from "react/jsx-runtime";
const inputFields = ["INPUT", "SELECT"];
export const formReset = (form) => {
    if (!form)
        return;
    const elements = Array.from(form.elements);
    elements.forEach((field) => {
        if (!inputFields.includes(field.tagName))
            return;
        if (field.tagName === "INPUT") {
            field.value = field.defaultValue;
        }
        if (field.tagName === "SELECT") {
            field.value = "";
        }
        field.setAttribute("data-initialized", "false");
    });
};
export const Form = (props) => {
    const onSubmit = (e) => {
        var _a;
        e.persist();
        e.preventDefault();
        (_a = props.onSubmit) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    return _jsx("form", Object.assign({}, props, { onSubmit: onSubmit }));
};
