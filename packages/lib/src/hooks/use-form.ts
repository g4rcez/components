import { parse } from "qs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { type AllPaths, Is, setPath } from "sidekicker";
import { z } from "zod";
import type { AutocompleteProps, CheckboxProps, DatePickerProps, InputProps, SelectProps, SwitchProps } from "../components";
import { formReset } from "../components/form/form";
import { path } from "../lib/fns";

const sort = (a: string, b: string) => a.localeCompare(b);

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
} as const;

export const formToJson = (form: HTMLFormElement): any => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), options) as never;
};

export const convertPath = (path: string) => path.replace("[", ".").replace("]", "").split(".");

export const getSchemaShape = <T extends z.ZodObject<any>>(name: string, schema: T) =>
    convertPath(name).reduce((acc, el) => {
        if (el === "") return acc;
        const shape = acc.shape?.[el] || acc;
        return shape._def.typeName === "ZodArray" ? shape.element : shape;
    }, schema);

type HTMLEntryElements = HTMLInputElement | HTMLSelectElement;

const getValueByType = (e: HTMLEntryElements) => {
    if (e.dataset.value) return e.dataset.value;
    if (e.type === "checkbox") return e.checked;
    if (e.type === "number") return e.valueAsNumber;
    return e.value || e.getAttribute("value");
};

type CustomOnInvalid = (args: { form: HTMLFormElement; errors: Record<string, string> }) => any;

export type UseFormSubmitParams<T> = {
    success: boolean;
    errors: Array<{ message: string; path: string[] }>;
    json: any;
    data: T;
    form: HTMLFormElement;
    reset: () => void;
    event: React.FormEvent<HTMLFormElement>;
};

type UseFormSubmit<T> = (args: UseFormSubmitParams<T>) => any;

export const useForm = <T extends z.ZodObject<any>>(schema: T, formName?: string) => {
    const [errors, setErrors] = useState<Record<string, string | undefined> | null>(null);
    const ref = useRef<Record<string, { element: HTMLInputElement | HTMLSelectElement; schema: z.ZodType }>>({});
    const [state, setState] = useState<T>({} as T);

    type Fields = AllPaths<z.infer<T>>;

    const datepicker = <Props extends DatePickerProps>(name: Fields, props?: Props): Props => {
        const validator = getSchemaShape(name, schema);
        return {
            ...props,
            name,
            id: name,
            form: formName,
            required: !validator.isOptional(),
            error: errors?.[name],
            ref: (e: HTMLSelectElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    const select = <Props extends SelectProps | AutocompleteProps>(name: Fields, props?: Props): Props => {
        const validator = getSchemaShape(name, schema);
        return {
            ...props,
            name,
            id: name,
            form: formName,
            required: !validator.isOptional(),
            error: errors?.[name],
            ref: (e: HTMLSelectElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    const checkbox = <Props extends CheckboxProps | SwitchProps>(name: Fields, props?: Props): Props => {
        const validator = getSchemaShape(name, schema);
        return {
            ...props,
            name,
            id: name,
            form: formName,
            required: !validator.isOptional(),
            error: errors?.[name],
            ref: (e: HTMLInputElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    const input = <Props extends InputProps>(name: Fields, props?: Props): Props => {
        const validator = getSchemaShape(name, schema);
        return {
            ...props,
            name,
            id: name,
            required: !validator.isOptional(),
            form: formName,
            type: (validator._def.typeName as string) === "ZodNumber" ? "number" : (props?.type ?? "text"),
            error: errors?.[name],
            ref: (e: HTMLInputElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    useEffect(() => {
        const events = Object.values(ref.current).map((input) => {
            const element = input.element.dataset.origin
                ? (document.querySelector(`[data-target="${input.element.name}"]`) as HTMLEntryElements)
                : (input.element as HTMLEntryElements);
            const validation = input.schema.safeParse(getValueByType(element));
            const onBlurField = (e: any) => {
                const name = element.dataset.target || element.name;
                if (!name) return;
                const value = getValueByType(e.target) || (e.relatedTarget ? getValueByType(e.relatedTarget) : "");
                const validation = input.schema.safeParse(value);
                if (validation.success) {
                    element.setCustomValidity("");
                    setState((prev) => setPath(prev, name, validation.data));
                    return setErrors((prev) => {
                        const { [name]: removed, ...rest } = prev || {};
                        return rest === null || Is.empty(rest) ? null : rest;
                    });
                }
                if (element.required) {
                    const errorMessage = validation.error.issues[0]?.message || "";
                    element.setCustomValidity(errorMessage);
                    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
                }
            };
            const trigger = element.getAttribute("data-trigger") || "blur";
            element.addEventListener(trigger, onBlurField);
            if (element.tagName === "SELECT") element.addEventListener("change", onBlurField);
            return {
                input,
                hasInitialError: (element as HTMLInputElement).required ? !validation.success : false,
                unsubscribe: () => {
                    element.removeEventListener(trigger, onBlurField);
                    if (element.tagName === "SELECT") element.addEventListener("change", onBlurField);
                },
            };
        });
        const hasErrors = events.some((x) => x.hasInitialError);
        if (hasErrors) setErrors((prev) => (prev === null ? {} : prev));
        return () => events.forEach((item) => item.unsubscribe());
    });

    const onInvalid = useCallback(
        (exec?: CustomOnInvalid) => (event: React.FormEvent<HTMLFormElement>) => {
            const form = event.currentTarget;
            const validationErrors = Object.values(ref.current).reduce((acc, input) => {
                const field = input.element as HTMLInputElement;
                const validation = input.schema.safeParse(getValueByType(field));
                if (field.dataset.ignore === "ignore") return acc;
                if (validation.success) return acc;
                const errorMessage = validation.error.issues[0]?.message;
                field.setAttribute("data-initialized", "true");
                const name = field.dataset.name || field.name || "";
                return { ...acc, [name]: errorMessage };
            }, {});
            const e = Is.empty(validationErrors) ? null : validationErrors;
            setErrors(e);
            exec?.({ form, errors: e || {} });
        },
        []
    );

    const onSubmit = useCallback(
        (exec: UseFormSubmit<z.infer<T>>) => (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const form = event.currentTarget;
            let json = formToJson(form);
            const elements = formName ? Array.from(document.querySelectorAll(`[form="${formName}"]`)) : Array.from(form.elements);
            elements.forEach((field) => {
                if (field.tagName === "SELECT") {
                    const input = field as HTMLSelectElement;
                    json = setPath<any>(json as any, input.name, input.value);
                }
                if (field.tagName === "INPUT") {
                    const input = field as HTMLInputElement;
                    json = setPath<any>(json as any, input.name, getValueByType(input));
                }
            });
            const result = schema.safeParse(state);
            if (result.success) {
                return exec({
                    form,
                    json,
                    data: result.data,
                    event,
                    reset: () => formReset(form),
                    success: true,
                    errors: [],
                });
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
        },
        [formName]
    );

    const get = (p: Fields) => path(state, p as any) || "";

    return {
        state,
        input,
        datepicker,
        checkbox,
        select,
        onSubmit,
        errors,
        onInvalid,
        disabled: errors !== null,
        name: formName,
        get,
    };
};
