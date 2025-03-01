import { parse } from "qs";
import React, { type ComponentProps, useCallback, useEffect, useRef, useState } from "react";
import { type AllPaths, getPath, Is } from "sidekicker";
import { LocalStorage } from "storage-manager-js";
import { z, ZodNumber } from "zod";
import { AutocompleteProps, CheckboxProps, DatePickerProps, formReset, InputProps, SelectProps, SwitchProps, TextareaProps } from "../components";
import { path } from "../lib/fns";

const isValidJSON = (value: any): boolean => {
    if (typeof value !== "string") {
        try {
            value = JSON.stringify(value);
        } catch (error) {
            return false;
        }
    }
    try {
        JSON.parse(value);
        return true;
    } catch (error) {
        return false;
    }
};

const setHelper = (obj: any, path: string[], value: any): void => {
    const lastIndex = path.length - 1;
    for (let i = 0; i < path.length; i++) {
        const key: any = path[i];
        if (i === lastIndex) {
            obj[key] = value;
        } else {
            if (!(key in obj) || typeof obj[key] !== "object") {
                const nextKey = path[i + 1];
                obj[key] = isNaN(Number(nextKey)) ? {} : [];
            }
            obj = obj[key];
        }
    }
};

const convertPath = (path: string): string[] => path.replace(/\[(\d+)]/g, ".$1").split(".");

const setPath = <O extends object>(o: O, path: string | Array<string | number>, value: any): O => {
    const pathArr = Array.isArray(path) ? path.map(String) : convertPath(path);
    const obj = structuredClone(o);
    setHelper(obj, pathArr, value);
    return obj;
};

const sort = (a: string, b: string) => a.localeCompare(b);

const noop: any = {};

const getDefaultValue = (inner: z.ZodTypeAny): unknown => {
    const instanceName = inner._def.typeName;
    if (instanceName === "ZodDefault") return inner._def.defaultValue();
    if (instanceName === "ZodObject") return getDefaults(inner as any);
    if (instanceName === "ZodArray") return [];
    if ("innerType" in inner._def) {
        const defaults = getDefaultValue(inner._def.innerType);
        if (instanceName === "ZodArray") return defaults ?? [];
        return defaults;
    }
    return undefined;
};

const getDefaults = <TSchema extends z.AnyZodObject>(schema: TSchema) =>
    Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => {
            return [key, getDefaultValue(value as any)];
        })
    );

const deepMerge = <T extends object, U extends object>(a: T, b: U): T & U => {
    const result: any = structuredClone(a);
    for (const key in b) {
        const bValue = b[key];
        const aValue = (a as any)[key];
        if (bValue !== undefined) {
            if (
                typeof bValue === "object" &&
                bValue !== null &&
                !Array.isArray(bValue) &&
                typeof aValue === "object" &&
                aValue !== null &&
                !Array.isArray(aValue)
            ) {
                result[key] = deepMerge(aValue as object, bValue as object);
            } else {
                result[key] = bValue ? bValue : aValue;
            }
        }
    }
    return result as T & U;
};

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

export const getSchemaShape = <T extends z.ZodObject<any>>(name: string, schema: T) => {
    return convertPath(name).reduce((acc, el) => {
        if (el === "") return acc;
        const shape = acc.shape?.[el] || acc;
        return shape._def.typeName === "ZodArray" ? shape.element : shape;
    }, schema);
};

type HTMLEntryElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const getValueByType = (e: HTMLEntryElements) => {
    if (e.dataset.value) return e.dataset.value;
    if (e.type === "checkbox") return (e as HTMLInputElement).checked;
    if (e.type === "number") return (e as HTMLInputElement).valueAsNumber;
    return e.value || e.getAttribute("value");
};

const getDataTarget = (e: HTMLEntryElements) => {
    const target = e.dataset.target;
    if (!target) return getValueByType(e);
    const element = document.querySelector(`[data-origin="${target}"]`);
    if (!element) return getValueByType(e);
    return getValueByType(element as HTMLInputElement);
};

type CustomOnInvalid = (args: { form: HTMLFormElement; errors: Record<string, string> }) => any;

export type UseOnSubmitArgs<T> = {
    data: T;
    json: any;
    success: boolean;
    reset: () => void;
    form: HTMLFormElement;
    event: React.FormEvent<HTMLFormElement>;
    errors: Array<{ message: string; path: string[] }>;
};

export type UseFormSubmit<T> = (event: React.FormEvent<HTMLFormElement>, args: UseOnSubmitArgs<T>) => any;

type Interceptor<T> = {
    get: () => T;
    clear: () => void;
    set: (state: T) => void;
};

export type UseFormOptions<T> = Partial<{
    loading: boolean;
    useOnChange: boolean;
    interceptor: Interceptor<T>;
    state: T | Partial<T> | (() => T | Partial<T>);
}>;

const defaultOptions: UseFormOptions<any> = {
    state: {},
    loading: false,
    useOnChange: false,
};

const getName = (e: HTMLEntryElements) => e.dataset.target || e.name;

export const createFormStorage = (name: string): Interceptor<any> => {
    const key = `@use-form/${name}`;
    return {
        get: <T extends object>(): T | {} => {
            const state = LocalStorage.get(key);
            return isValidJSON(state) ? (state as T) : {};
        },
        clear: () => void LocalStorage.delete(key),
        set: <T extends object>(s: T) => LocalStorage.set(key, s),
    };
};

export const useForm = <T extends z.ZodObject<any>>(schema: T, formName: string, opts: UseFormOptions<z.infer<T>> = defaultOptions) => {
    type Fields = AllPaths<z.infer<T>>;

    const [errors, setErrors] = useState<Record<string, any> | null>(null);
    const ref = useRef<Record<string, { element: HTMLInputElement | HTMLSelectElement; schema: z.ZodType }>>({});
    const [state, setState] = useState<z.infer<T>>(() => {
        if (Is.function(opts?.state)) return opts.state();
        return opts?.state ?? getDefaults(schema) ?? {};
    });

    const onInvalidField = useCallback((e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const related = e.currentTarget;
        const isOptional = target.dataset.optional === "true";
        if (isOptional) {
            return;
        }
        const path = getName(target);
        const value = getDataTarget(target) || (related ? getValueByType(related) : "");
        const partialSchema = getSchemaShape(path, schema);
        target.setAttribute("data-initialized", "true");
        if (partialSchema) {
            const validation = partialSchema.safeParse(value);
            const message = validation.success ? undefined : (validation.error.issues[0]?.message ?? "");
            setErrors((prev) => setPath(prev ?? {}, path, message));
        }
    }, []);

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
                return setPath(acc, name, errorMessage);
            }, {});
            const e = Is.empty(validationErrors) ? null : validationErrors;
            setErrors(e);
            console.error(e);
            exec?.({ form, errors: e || {} });
        },
        []
    );

    const datepicker = <Props extends DatePickerProps>(name: Fields, props: Props = noop): Props => {
        const validator = getSchemaShape(name, schema);
        const onChange = (e: React.ChangeEvent<HTMLSelectElement> | Date) => {
            if (!e) return;
            const value = e instanceof Date ? e.toISOString() : e.target.value;
            setState((prev) => setPath(prev!, name, value));
            props?.onChange?.(e as any);
        };
        return {
            ...props,
            loading: opts.loading,
            name,
            id: name,
            onChange,
            form: formName,
            date: Is.string(state[name]) ? new Date(state[name]) : state[name],
            required: props.required ?? !validator.isOptional(),
            error: errors?.[name],
            ref: (e: HTMLSelectElement) => {
                if (e === null) return;
                ref.current[name] = { element: e, schema: validator };
            },
        } as any;
    };

    const select = <Props extends SelectProps | AutocompleteProps>(name: Fields, props: Props = noop): Props => {
        const validator = getSchemaShape(name, schema);
        const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setState((prev) => setPath(prev!, name, value));
            props?.onChange?.(e as any);
        };
        return {
            ...props,
            name,
            id: name,
            onChange,
            form: formName,
            loading: opts.loading,
            onInvalid: onInvalidField,
            error: getPath(errors, name, undefined),
            value: getPath(state, name, undefined) || "",
            required: props.required ?? !validator.isOptional(),
            ref: (e: HTMLSelectElement) =>
                e !== null
                    ? (ref.current[name] = {
                          element: e,
                          schema: validator,
                      })
                    : undefined,
        } as any;
    };

    const checkbox = <Props extends CheckboxProps | SwitchProps>(name: Fields, props: Props = noop): Props => {
        const validator = getSchemaShape(name, schema);
        const onChange: Props["onChange"] = (e) => {
            const value = e.target.checked;
            setState((prev) => setPath(prev ?? {}, name, value));
            props?.onChange?.(e as any);
        };
        return {
            ...props,
            name,
            id: name,
            onChange,
            form: formName,
            loading: opts.loading,
            onInvalid: onInvalidField,
            error: getPath(errors, name, undefined),
            required: props.required ?? !validator.isOptional(),
            ref: (e: HTMLInputElement) =>
                e !== null
                    ? void (ref.current[name] = {
                          element: e,
                          schema: validator,
                      })
                    : undefined,
        } as any;
    };

    const textarea = <Props extends TextareaProps>(name: Fields, props: Props = noop): Props => {
        const validator = getSchemaShape(name, schema);
        const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            e.persist?.();
            const value = e.target.value;
            props?.onChange?.(e);
            setState((prev) => setPath(prev, name, value));
        };
        return {
            ...props,
            loading: opts.loading,
            name,
            id: name,
            onChange,
            form: formName,
            onInvalid: onInvalidField,
            error: getPath(errors, name, undefined),
            required: props.required ?? !validator.isOptional(),
            value: getPath(state, name, undefined) || props?.value || "",
            type: Is.instance(validator, ZodNumber) ? "number" : (props?.type ?? "text"),
            ref: (e: HTMLInputElement) =>
                e === null
                    ? undefined
                    : (ref.current[name] = {
                          element: e,
                          schema: validator,
                      }),
        } as any;
    };

    const input = <Props extends InputProps>(name: Fields, props: Props = noop): Props => {
        const validator = getSchemaShape(name, schema);
        const isNumber = (validator._def.typeName as string) === "ZodNumber";
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist?.();
            const value = isNumber ? e.target.valueAsNumber : e.target.value;
            props?.onChange?.(e);
            setState((prev) => setPath(prev, name, value));
        };
        return {
            ...props,
            name,
            id: name,
            onChange,
            form: formName,
            loading: opts.loading,
            onInvalid: onInvalidField,
            error: getPath(errors, name, undefined),
            required: props.required ?? !validator.isOptional(),
            type: isNumber ? "number" : (props?.type ?? "text"),
            value: getPath(state, name, undefined) || props?.value || "",
            ref: (e: HTMLInputElement) =>
                e === null
                    ? undefined
                    : void (ref.current[name] = {
                          element: e,
                          schema: validator,
                      }),
        } as any;
    };

    useEffect(() => {
        const events = Object.values(ref.current).map((input) => {
            const element = input.element.dataset.origin
                ? (document.querySelector(`[data-target="${input.element.name}"]`) as HTMLEntryElements)
                : (input.element as HTMLEntryElements);
            const validation = input.schema.safeParse(getValueByType(element));
            const onBlurField = (e: any) => {
                const name = getName(e.target);
                if (!name) return false;
                const current = e.target;
                const value = getDataTarget(e.target) || (e.relatedTarget ? getValueByType(e.relatedTarget) : "");
                const validation = input.schema.safeParse(value);
                current.setAttribute("value", value as string);
                if (validation.success) {
                    element.setCustomValidity("");
                    setErrors((prev) => {
                        if (Is.null(prev)) return null;
                        const newErrors = setPath(prev, name, undefined);
                        if (Is.empty(prev) || Is.nil(prev)) return null;
                        return Is.empty(newErrors) ? null : newErrors;
                    });
                    return false;
                }
                if (element.required) {
                    const errorMessage = validation.error.issues[0]?.message || "";
                    element.setCustomValidity(errorMessage);
                    setErrors((prev) => {
                        if (Is.null(prev)) return null;
                        const newErrors = setPath(prev, name, errorMessage || undefined);
                        return Is.empty(newErrors) ? null : newErrors;
                    });
                }
                return false;
            };
            const controller = new AbortController();
            const trigger = element.getAttribute("data-trigger") || "blur";
            element.addEventListener(trigger, onBlurField, { signal: controller.signal });
            const hasInitialError = element.dataset.shadow ? false : (element as HTMLInputElement).required ? !validation.success : false;
            return {
                input,
                hasInitialError,
                unsubscribe: () => controller.abort(),
            };
        });
        const hasErrors = events.some((x) => x.hasInitialError);
        if (hasErrors) setErrors((prev) => (prev === null ? {} : prev));
        return () => events.forEach((item) => item.unsubscribe());
    });

    const onSubmit = (exec?: UseFormSubmit<z.infer<T>>) => (event: React.FormEvent<HTMLFormElement>) => {
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
                const value = getDataTarget(input) || (input ? getValueByType(input) : "");
                json = setPath<any>(json as any, input.dataset.target || input.name, value);
            }
        });
        const input = deepMerge(json, state);
        const result = schema.safeParse(input);
        const reset = () => {
            formReset(form);
            opts.interceptor?.clear();
        };
        if (result.success) {
            const jsonString = JSON.stringify(result.data);
            form.setAttribute("data-json", jsonString);
            opts.interceptor?.clear();
            return exec?.(event, {
                form,
                event,
                reset,
                errors: [],
                success: true,
                data: result.data,
                json: result.data,
            });
        }
        console.group("useForm error");
        console.info(result);
        console.info(result.error.issues);
        console.error(result.error);
        console.groupEnd();
        form.reportValidity();
        return exec?.(event, {
            form,
            json,
            event,
            reset,
            data: json,
            success: false,
            errors: result.error.issues.map((x) => ({ message: x.message, path: x.path.map((x) => String(x)) })),
        });
    };

    const get = (p: Fields) => path(state, p as any) || "";

    const controller = (props?: ComponentProps<"form">) => ({
        ...props,
        id: formName,
        name: formName,
    });

    useEffect(() => {
        if (opts.interceptor) opts.interceptor?.set(state);
    }, [state]);

    return {
        get,
        input,
        state,
        errors,
        select,
        checkbox,
        onSubmit,
        setState,
        textarea,
        onInvalid,
        controller,
        datepicker,
        name: formName,
        disabled: errors !== null,
    };
};

export const getJsonForm = <T extends z.ZodObject<any>>(form?: HTMLFormElement | null): z.infer<T> =>
    !form ? {} : (JSON.parse(form.getAttribute("data-json")!) as any);
