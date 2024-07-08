import { parse } from "qs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AllPaths, Is, setPath } from "sidekicker";
import { z, ZodArray, ZodNumber } from "zod";
import { formReset } from "~/components/form/form";
import { InputProps } from "~/components/form/input";
import { SelectProps } from "~/components/form/select";

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

export const formToJson = <T extends any>(form: HTMLFormElement): T => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), options) as never;
};

export const convertPath = (path: string) => path.replace("[", ".").replace("]", "").split(".");

export const getSchemaShape = <T extends z.ZodObject<any>>(name: string, schema: T) =>
    convertPath(name).reduce((acc, el) => {
        if (el === "") return acc;
        const shape = acc.shape?.[el] || acc;
        return shape instanceof ZodArray ? shape.element : shape;
    }, schema);

const getValueByType = (e: HTMLInputElement) => {
    if (e.type === "checkbox") return e.checked;
    if (e.type === "number") return e.valueAsNumber;
    return e.value;
};

type CustomOnInvalid = (args: { form: HTMLFormElement; errors: Record<string, string> }) => any;

type CustomOnSubmit<T> = (args: { json: T; form: HTMLFormElement; reset: () => void; event: React.FormEvent<HTMLFormElement> }) => any;

export const useForm = <T extends z.ZodObject<any>>(schema: T) => {
    const [errors, setErrors] = useState<Record<string, string | undefined> | null>(null);
    const ref = useRef<Record<string, { element: HTMLElement; schema: z.ZodType }>>({});

    const select = <Props extends SelectProps>(name: AllPaths<z.infer<T>>, props?: Props): Props => {
        const validator = getSchemaShape(name, schema);
        return {
            ...props,
            name,
            id: name,
            error: errors?.[name],
            ref: (e: HTMLSelectElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    const input = <Props extends InputProps>(name: AllPaths<z.infer<T>>, props?: Props): Props => {
        const validator = getSchemaShape(name, schema);
        return {
            ...props,
            name,
            id: name,
            type: Is.instance(validator, ZodNumber) ? "number" : props?.type ?? "text",
            error: errors?.[name],
            ref: (e: HTMLInputElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    useEffect(() => {
        const events = Object.values(ref.current).map((input) => {
            const validation = input.schema.safeParse(getValueByType(input.element as any));
            const onBlurField = (e: any) => {
                const validation = input.schema.safeParse(getValueByType(e.target));
                const html = input.element as HTMLInputElement;
                const name = html.name;
                if (validation.success) {
                    html.setCustomValidity("");
                    return setErrors((prev) => {
                        const { [name]: removed, ...rest } = prev || {};
                        return rest === null || Is.empty(rest) ? null : rest;
                    });
                }
                if (html.required) {
                    const errorMessage = validation.error.issues[0].message;
                    html.setCustomValidity(errorMessage);
                    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
                }
            };
            const event = input.element.tagName === "INPUT" ? "blur" : "change";
            input.element.addEventListener(event, onBlurField);
            return {
                input,
                hasInitialError: (input.element as HTMLInputElement).required ? !validation.success : false,
                unsubscribe: () => input.element.removeEventListener(event, onBlurField),
            };
        });
        const hasErrors = events.some((x) => x.hasInitialError);
        if (hasErrors) setErrors((prev) => (prev === null ? {} : prev));
        return () => events.forEach((item) => item.unsubscribe());
    });

    const onInvalid = useCallback(
        (exec?: CustomOnInvalid) => (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const form = event.currentTarget;
            const validationErrors = Object.values(ref.current).reduce((acc, input) => {
                const field = input.element as HTMLInputElement;
                const validation = input.schema.safeParse(getValueByType(field));
                if (validation.success) return acc;
                const errorMessage = validation.error.issues[0].message;
                field.setAttribute("data-initialized", "true");
                return { ...acc, [field.name]: errorMessage };
            }, {});
            const e = Is.empty(validationErrors) ? null : {};
            console.log("ON INVALID", e);
            setErrors(e);
            exec?.({ form, errors: e || {} });
        },
        []
    );

    const onSubmit = useCallback(
        (exec: CustomOnSubmit<z.infer<T>>) => (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const form = event.currentTarget;
            let json = formToJson(form);
            Array.from(form.elements).forEach((field) => {
                if (field.tagName === "SELECT") {
                    const input = field as HTMLSelectElement;
                    json = setPath(json, input.name, input.value);
                }
                if (field.tagName === "INPUT") {
                    const input = field as HTMLInputElement;
                    json = setPath(json, input.name, getValueByType(input));
                }
            });
            exec({ form, json, event, reset: () => formReset(form) });
        },
        []
    );

    return { input, select, onSubmit, errors, onInvalid, disabled: errors !== null };
};
