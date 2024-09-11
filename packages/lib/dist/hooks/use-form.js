import { __rest } from "tslib";
import { parse } from "qs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Is, setPath } from "sidekicker";
import { ZodArray, ZodNumber } from "zod";
import { formReset } from "../components/form/form";
const sort = (a, b) => a.localeCompare(b);
const options = {
    sort,
    allowDots: true,
    charset: "utf-8",
    parseArrays: true,
    plainObjects: true,
    charsetSentinel: true,
    allowPrototypes: false,
    depth: Number.MAX_SAFE_INTEGER,
    arrayLimit: Number.MAX_SAFE_INTEGER,
    parameterLimit: Number.MAX_SAFE_INTEGER,
};
export const formToJson = (form) => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(formData);
    return parse(urlSearchParams.toString(), options);
};
export const convertPath = (path) => path.replace("[", ".").replace("]", "").split(".");
export const getSchemaShape = (name, schema) => convertPath(name).reduce((acc, el) => {
    var _a;
    if (el === "")
        return acc;
    const shape = ((_a = acc.shape) === null || _a === void 0 ? void 0 : _a[el]) || acc;
    return shape instanceof ZodArray ? shape.element : shape;
}, schema);
const getValueByType = (e) => {
    if (e.type === "checkbox")
        return e.checked;
    if (e.type === "number")
        return e.valueAsNumber;
    return e.value;
};
export const useForm = (schema) => {
    const [errors, setErrors] = useState(null);
    const ref = useRef({});
    const select = (name, props) => {
        const validator = getSchemaShape(name, schema);
        return Object.assign(Object.assign({}, props), { name, id: name, required: !validator.isOptional(), error: errors === null || errors === void 0 ? void 0 : errors[name], ref: (e) => {
                if (e === null)
                    return;
                ref.current[name] = { element: e, schema: validator };
            } });
    };
    const checkbox = (name, props) => {
        const validator = getSchemaShape(name, schema);
        return Object.assign(Object.assign({}, props), { name, id: name, required: !validator.isOptional(), error: errors === null || errors === void 0 ? void 0 : errors[name], ref: (e) => {
                if (e === null)
                    return;
                ref.current[name] = { element: e, schema: validator };
            } });
    };
    const input = (name, props) => {
        var _a;
        const validator = getSchemaShape(name, schema);
        return Object.assign(Object.assign({}, props), { name, id: name, required: !validator.isOptional(), type: Is.instance(validator, ZodNumber) ? "number" : ((_a = props === null || props === void 0 ? void 0 : props.type) !== null && _a !== void 0 ? _a : "text"), error: errors === null || errors === void 0 ? void 0 : errors[name], ref: (e) => {
                if (e === null)
                    return;
                ref.current[name] = { element: e, schema: validator };
            } });
    };
    useEffect(() => {
        const events = Object.values(ref.current).map((input) => {
            if (input.element.dataset.ignore === "ignore")
                return {
                    input: null,
                    hasInitialError: false,
                    unsubscribe: () => { },
                };
            const validation = input.schema.safeParse(getValueByType(input.element));
            const onBlurField = (e) => {
                const html = input.element;
                const name = html.name;
                if (!name)
                    return;
                const value = getValueByType(e.target);
                const validation = input.schema.safeParse(value);
                if (validation.success) {
                    html.setCustomValidity("");
                    return setErrors((prev) => {
                        const _a = prev || {}, _b = name, removed = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                        return rest === null || Is.empty(rest) ? null : rest;
                    });
                }
                if (html.required) {
                    const errorMessage = validation.error.issues[0].message;
                    html.setCustomValidity(errorMessage);
                    setErrors((prev) => (Object.assign(Object.assign({}, prev), { [name]: errorMessage })));
                }
            };
            const event = input.element.tagName === "INPUT" ? "blur" : "change";
            input.element.addEventListener(event, onBlurField);
            return {
                input,
                hasInitialError: input.element.required ? !validation.success : false,
                unsubscribe: () => input.element.removeEventListener(event, onBlurField),
            };
        });
        const hasErrors = events.some((x) => x.hasInitialError);
        if (hasErrors)
            setErrors((prev) => (prev === null ? {} : prev));
        return () => events.forEach((item) => item.unsubscribe());
    });
    const onInvalid = useCallback((exec) => (event) => {
        const form = event.currentTarget;
        const validationErrors = Object.values(ref.current).reduce((acc, input) => {
            const field = input.element;
            const validation = input.schema.safeParse(getValueByType(field));
            if (field.dataset.ignore === "ignore")
                return acc;
            if (validation.success)
                return acc;
            const errorMessage = validation.error.issues[0].message;
            field.setAttribute("data-initialized", "true");
            const name = field.dataset.name || field.name || "";
            return Object.assign(Object.assign({}, acc), { [name]: errorMessage });
        }, {});
        const e = Is.empty(validationErrors) ? null : validationErrors;
        setErrors(e);
        exec === null || exec === void 0 ? void 0 : exec({ form, errors: e || {} });
    }, []);
    const onSubmit = useCallback((exec) => (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let json = formToJson(form);
        Array.from(form.elements).forEach((field) => {
            if (field.tagName === "SELECT") {
                const input = field;
                json = setPath(json, input.name, input.value);
            }
            if (field.tagName === "INPUT") {
                const input = field;
                json = setPath(json, input.name, getValueByType(input));
            }
        });
        const result = schema.safeParse(json);
        if (result.success) {
            return exec({ form, json, data: result.data, event, reset: () => formReset(form), success: true, errors: [] });
        }
        return exec({
            form,
            json,
            event,
            data: json,
            success: false,
            reset: () => formReset(form),
            errors: result.error.issues.map((x) => ({ message: x.message, path: x.path.map((x) => String(x)) })),
        });
    }, []);
    return { input, checkbox, select, onSubmit, errors, onInvalid, disabled: errors !== null };
};
