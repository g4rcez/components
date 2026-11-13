"use client";
import { format, isValid, parseISO } from "date-fns";
import { parse } from "qs";
import React, { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPath, Is } from "sidekicker";
import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import type {
    AutocompleteProps,
    CheckboxProps,
    DatePickerProps,
    FileUploadProps,
    InputProps,
    MorphSelectProps,
    MultiSelectProps,
    RadioboxProps,
    SelectProps,
    SliderProps,
    SwitchProps,
    TextareaProps,
} from "../components";
import { formReset } from "../components/form/form/formReset";
import type { AllPaths } from "../lib/path-types";
import {
    coerceFieldValue,
    coerceFormValues,
    describeField,
    fieldConstraintProps,
    getSchemaAtPath,
    getSchemaDefaults,
    type ZodFieldDescriptor,
    zodToFields,
} from "../lib/zod-fields";
import type { Any, SetState } from "../types";

/**
 * Validates if a value is valid JSON
 * @param value - The value to validate
 * @returns True if the value is valid JSON
 * @internal
 */
const isValidJSON = (value: unknown): boolean => {
    let str: string;
    if (typeof value === "string") {
        str = value;
    } else {
        try {
            str = JSON.stringify(value);
        } catch {
            return false;
        }
    }
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
};

const convertPath = (path: string): string[] => path.replace(/\[(\d+)]/g, ".$1").split(".");

const shallowSetPath = <T extends Any>(obj: T, keys: string[], value: unknown): unknown => {
    if (keys.length === 0) return value;
    const [key, ...rest] = keys;
    const current = obj !== null ? obj[key!] : undefined;
    const nextKey = rest[0];
    const fallback = nextKey !== undefined && !Number.isNaN(Number(nextKey)) ? [] : {};
    const updated = shallowSetPath((current as T) ?? (fallback as unknown as T), rest, value);
    if (Array.isArray(obj)) {
        const clone = obj.slice();
        clone[Number(key)] = updated;
        return clone;
    }
    return { ...(obj ?? {}), [key!]: updated };
};

const setPath = <O extends Any>(o: O, path: string | Array<string | number>, value: unknown): O => {
    const pathArr = Array.isArray(path) ? path.map(String) : convertPath(path);
    return shallowSetPath(o, pathArr, value) as O;
};

const sort = (a: string, b: string) => a.localeCompare(b);

const deepMerge = <T extends object, U extends object>(a: T, b: U): T & U => {
    // as unknown as Record: structuredClone returns T, but we mutate it dynamically; static T & U proven at return
    const result: Record<string, unknown> = structuredClone(a) as unknown as Record<string, unknown>;
    for (const key in b) {
        const bValue: unknown = b[key];
        const aValue: unknown = result[key];
        if (bValue !== undefined) {
            if (
                typeof bValue === "object" &&
                bValue !== null &&
                !Array.isArray(bValue) &&
                typeof aValue === "object" &&
                aValue !== null &&
                !Array.isArray(aValue)
            ) {
                result[key] = deepMerge(aValue, bValue);
            } else {
                result[key] = bValue ?? aValue;
            }
        }
    }
    return result as unknown as T & U;
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

/**
 * Converts a form element to a JSON object
 * @param form - The HTML form element to convert
 * @returns A JSON object representing the form data
 */
export const formToJson = (form: HTMLFormElement): Record<string, unknown> => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(
        Array.from(formData.entries()).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    );
    return parse(urlSearchParams.toString(), options) as never;
};

type FieldEntry = { validator: z.ZodType; field: ZodFieldDescriptor };

const fieldCache = new WeakMap<z.ZodType, Map<string, FieldEntry>>();

/** The schema found at `name` plus its descriptor. A path that does not exist in the schema accepts anything. */
const getFieldEntry = (name: string, schema: z.ZodType): FieldEntry => {
    let byName = fieldCache.get(schema);
    if (!byName) {
        byName = new Map();
        fieldCache.set(schema, byName);
    }
    const cached = byName.get(name);
    if (cached !== undefined) return cached;
    const validator = getSchemaAtPath(schema, name) ?? z.any().optional();
    const entry = { validator, field: describeField(name, validator) };
    byName.set(name, entry);
    return entry;
};

/**
 * Finds the schema of a field by path (`address.street`, `items[0].name`).
 * @deprecated Use `getSchemaAtPath`, or `useForm().field(name)` for the full descriptor.
 */
export const getSchemaShape = <T extends z.ZodObject>(name: string, schema: T): z.ZodType => getFieldEntry(name, schema).validator;

const compact = <T extends Record<string, unknown>>(value: T): Partial<T> =>
    Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>;

const asError = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);

/** `["items", 0, "name"]` becomes `items[0].name`. */
const pathToString = (path: ReadonlyArray<PropertyKey>) =>
    path.reduce<string>((acc, part) => (typeof part === "number" ? `${acc}[${part}]` : acc === "" ? String(part) : `${acc}.${String(part)}`), "");

/** Turns zod issues into the nested error object `useForm` exposes. The first message of each field wins. */
const issuesToErrors = (issues: ReadonlyArray<{ message: string; path: ReadonlyArray<PropertyKey> }>) =>
    issues
        .slice()
        .sort((a, b) => b.path.length - a.path.length)
        .reduce<Record<string, unknown>>((acc, issue) => {
            const path = pathToString(issue.path);
            // Skips a path that already holds a message, or nested messages (an array level issue next to its items).
            if (path === "" || getPath(acc, path, undefined) !== undefined) return acc;
            return setPath(acc, path, issue.message);
        }, {});

type HTMLEntryElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const getValueByType = (e: HTMLEntryElements) => {
    if (e.dataset.value) return e.dataset.value;
    if (e.type === "checkbox") return (e as HTMLInputElement).checked;
    if (e.type === "number") return (e as HTMLInputElement).valueAsNumber;
    return e.value ?? e.getAttribute("value");
};

const getDataTarget = (e: HTMLEntryElements) => {
    const target = e.dataset.target;
    if (!target) return getValueByType(e);
    const element = document.querySelector(`[data-origin="${target}"]`);
    if (!element) return getValueByType(e);
    return getValueByType(element as HTMLInputElement);
};

export type UseOnSubmitArgs<T> = {
    data: T;
    json: Record<string, unknown>;
    success: boolean;
    reset: () => void;
    form: HTMLFormElement;
    setErrors: SetState<Record<string, unknown> | null>;
    event: React.FormEvent<HTMLFormElement>;
    errors: Array<{ message: string; path: string[] }>;
};

export type UseFormInvalid = (args: { form: HTMLFormElement; errors: Record<string, string> }) => void;

export type UseFormSubmit<T> = (event: React.FormEvent<HTMLFormElement>, args: UseOnSubmitArgs<T>) => unknown;

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

const getName = (e: HTMLEntryElements) => e.dataset.target || e.name;

/**
 * Creates a form storage interceptor for persisting form state
 * @param name - The unique name for the form storage
 * @returns An interceptor object with get, set, and clear methods
 */
export const createFormStorage = (name: string): Interceptor<Any> => {
    const key = `@use-form/${name}`;
    return {
        get: <T extends Any>(): T => {
            const state = LocalStorage.get(key);
            return isValidJSON(state) ? (state as T) : ({} as T);
        },
        clear: () => void LocalStorage.delete(key),
        set: <T extends object>(s: T) => LocalStorage.set(key, s),
    };
};

const dateOf = (value: unknown): Date | undefined => {
    if (value instanceof Date) return isValid(value) ? value : undefined;
    if (!Is.string(value) || value === "") return undefined;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
};

const serializeDate = (date: Date, storage: ZodFieldDescriptor["storage"]) => {
    if (storage === "date") return date;
    if (storage === "iso-date") return format(date, "yyyy-MM-dd");
    return date.toISOString();
};

const toDisabledDate = (field: ZodFieldDescriptor) => {
    const { minDate, maxDate } = field.constraints;
    if (!minDate && !maxDate) return undefined;
    return (date: Date) => (minDate !== undefined && date < minDate) || (maxDate !== undefined && date > maxDate);
};

const toDropzoneAccept = (accept?: string) =>
    accept === undefined ? undefined : Object.fromEntries(accept.split(",").map((mime) => [mime.trim(), [] as string[]]));

const toArray = <V>(value: V | V[] | undefined): V[] => (value === undefined ? [] : Array.isArray(value) ? value : [value]);

type SliderChangeDetails = Parameters<NonNullable<SliderProps["onValueChange"]>>[1];

type Registered = { element: HTMLInputElement | HTMLSelectElement; schema: z.ZodType };

/**
 * A comprehensive form management hook with Zod schema validation.
 *
 * Provides form state management, validation, and component binding for React forms.
 * Supports automatic validation, error handling, and form persistence.
 *
 * Every helper (`input`, `select`, `checkbox`...) reads the schema and spreads what it knows onto the component:
 * `required`, `min`/`max`/`step`, `minLength`/`maxLength`, `pattern`, `type`, the `mask` set in `.meta()`, the
 * `options` of an enum, and the value declared with `.default()`. Props you pass always win over the schema.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   name: z.string().min(1, "Name is required"),
 *   email: z.email("Invalid email"),
 *   age: z.number().min(18, "Must be 18 or older"),
 *   document: z.string().meta({ mask: "cpf", title: "CPF" }),
 *   role: z.enum(["admin", "member"]).default("member"),
 * });
 *
 * const MyForm = () => {
 *   const form = useForm(schema, "user-form");
 *
 *   return (
 *     <form {...form.controller()} onSubmit={form.onSubmit((e, { data }) => {
 *       console.log("Form data:", data);
 *     })}>
 *       <Input {...form.input("name", { title: "Name" })} />
 *       <Input {...form.input("email", { title: "Email" })} />
 *       <Input {...form.input("age", { title: "Age" })} />
 *       <Input {...form.input("document")} />
 *       <Select {...form.select("role", { title: "Role" })} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   );
 * };
 * ```
 *
 * @template T - The Zod schema type
 * @param schema - Zod schema for form validation
 * @param formName - Unique identifier for the form
 * @param opts - Optional configuration including initial state and interceptors
 * @returns Form management object with input helpers and handlers
 */
export const useForm = <T extends z.ZodObject>(schema: T, formName: string, opts: UseFormOptions<z.input<T>> = {}) => {
    type Fields = AllPaths<z.input<T>>;

    const loading = opts.loading ?? false;
    const [errors, setErrors] = useState<Record<string, unknown> | null>(null);
    const ref = useRef<Record<string, Registered>>({});
    const bound = useRef(new WeakSet<Element>());
    const abort = useRef<AbortController | null>(null);
    const fields = useMemo(() => zodToFields(schema), [schema]);
    const [state, setState] = useState<z.input<T>>(() => {
        const initial = Is.function(opts?.state) ? opts.state() : opts?.state;
        return deepMerge(getSchemaDefaults(schema), (initial ?? {}) as object) as z.input<T>;
    });

    /**
     * Writes a value into the state. A field that shows an error is validated again, so the message goes away as soon as
     * the value is valid (controls without a blur, like sliders and radios, would otherwise keep it forever).
     */
    const update = (name: string, value: unknown) => {
        setState((prev) => setPath((prev ?? {}) as Any, name, value) as z.input<T>);
        setErrors((prev) => {
            if (prev === null || typeof getPath(prev, name, undefined) !== "string") return prev;
            const { validator } = getFieldEntry(name, schema);
            if (!validator.safeParse(coerceFieldValue(validator, value)).success) return prev;
            ref.current[name]?.element.setCustomValidity?.("");
            const next = setPath(prev, name, undefined);
            return Is.empty(next) ? null : next;
        });
    };

    const clearError = (name: string) => setErrors((prev) => (prev === null ? null : setPath(prev, name, undefined)));

    const register = (name: string, entry: FieldEntry) => (element: HTMLInputElement | HTMLSelectElement | null) => {
        if (element === null) delete ref.current[name];
        else ref.current[name] = { element, schema: entry.validator };
    };

    const managed = (name: Fields, entry: FieldEntry, required?: boolean) => ({
        name,
        id: name,
        // Some controls forward unknown props to the DOM, so `loading: false` is left out.
        loading: loading || undefined,
        form: formName,
        required: required ?? entry.field.required,
        error: asError(getPath(errors, name, undefined)),
    });

    const onInvalidField = useCallback(
        (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const target = e.target as HTMLInputElement;
            const related = e.currentTarget;
            const isOptional = target.dataset.optional === "true";
            if (isOptional) {
                return;
            }
            const path = getName(target);
            const value = getDataTarget(target) ?? (related ? getValueByType(related) : "");
            const { validator } = getFieldEntry(path, schema);
            target.setAttribute("data-initialized", "true");
            const validation = validator.safeParse(coerceFieldValue(validator, value));
            const message = validation.success ? undefined : (validation.error.issues[0]?.message ?? "");
            setErrors((prev) => setPath(prev ?? {}, path, message));
        },
        [schema]
    );

    const onInvalid = useCallback(
        (exec?: UseFormInvalid) => (event: React.FormEvent<HTMLFormElement>) => {
            const form = event.currentTarget;
            const validationErrors = Object.values(ref.current).reduce((acc, input) => {
                const field = input.element as HTMLInputElement;
                const validation = input.schema.safeParse(coerceFieldValue(input.schema, getValueByType(field)));
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

    const datepicker = (name: Fields, props?: DatePickerProps): DatePickerProps => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        const onChange = (date: Date | undefined) => {
            if (date === undefined) {
                update(name, undefined);
                return (props?.onChange as ((date?: Date) => void) | undefined)?.(date);
            }
            if (!isValid(date)) return;
            update(name, serializeDate(date, field.storage));
            clearError(name);
            const input = ref.current[name]?.element as HTMLInputElement | undefined;
            if (input) {
                const origin = input.getAttribute("data-origin");
                const inputShadow = document.querySelector(`input[data-target="${origin}"]`) as HTMLInputElement;
                if (inputShadow) inputShadow.setCustomValidity("");
            }
            (props?.onChange as ((date: Date) => void) | undefined)?.(date);
        };
        return {
            ...compact({
                title: field.meta.title,
                info: field.info,
                placeholder: field.placeholder,
                disabledDate: toDisabledDate(field),
                type: field.kind === "datetime" ? "datetime" : undefined,
            }),
            ...props,
            ...managed(name, entry, props?.required),
            onChange,
            date: dateOf(getPath(state, name, undefined)),
            ref: register(name, entry),
        } as unknown as DatePickerProps;
    };

    const select = <Props extends SelectProps | AutocompleteProps>(name: Fields, props?: Props): Props => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            update(name, e.target.value);
            // SelectProps/AutocompleteProps have divergent onChange signatures at this generic union boundary
            (props?.onChange as React.ChangeEventHandler<HTMLSelectElement> | undefined)?.(e);
        };
        return {
            ...compact({
                title: field.meta.title,
                info: field.info,
                placeholder: field.placeholder,
                options: field.options.length > 0 ? field.options : undefined,
            }),
            ...props,
            ...managed(name, entry, props?.required),
            onChange,
            onInvalid: onInvalidField,
            value: getPath(state, name, undefined) ?? "",
            ref: register(name, entry),
        } as unknown as Props;
    };

    const checkbox = <Props extends CheckboxProps | SwitchProps>(name: Fields, props?: Props): Props => {
        const entry = getFieldEntry(name, schema);
        const onChange: Props["onChange"] = (e) => {
            update(name, e.target.checked);
            props?.onChange?.(e);
        };
        return {
            defaultChecked: Boolean(getPath(state, name, undefined)),
            ...props,
            ...managed(name, entry, props?.required),
            onChange,
            onInvalid: onInvalidField,
            ref: register(name, entry),
        } as unknown as Props;
    };

    const textarea = <Props extends TextareaProps>(name: Fields, props?: Props): Props => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            e.persist?.();
            props?.onChange?.(e);
            update(name, e.target.value);
        };
        return {
            ...compact({
                title: field.meta.title,
                info: field.info,
                placeholder: field.placeholder,
                ...fieldConstraintProps(field, ["minLength", "maxLength"]),
            }),
            ...props,
            ...managed(name, entry, props?.required),
            onChange,
            onInvalid: onInvalidField,
            value: getPath(state, name, undefined) ?? props?.value ?? "",
            ref: register(name, entry),
        } as unknown as Props;
    };

    const multiselect = <Props extends MultiSelectProps>(name: Fields, props?: Props): Props => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        const onChangeOptions = (options: string[]) => {
            update(name, options);
            props?.onChangeOptions?.(options);
        };
        return {
            ...compact({
                title: field.meta.title,
                info: field.info,
                placeholder: field.placeholder,
                options: field.options.length > 0 ? field.options : undefined,
                // An array of free strings has no list to pick from, so the user creates the options.
                dynamicOption: field.options.length === 0 ? true : undefined,
            }),
            ...props,
            ...managed(name, entry, props?.required),
            onChangeOptions,
            onInvalid: onInvalidField,
            value: getPath(state, name, undefined) ?? props?.value ?? [],
            ref: register(name, entry),
        } as unknown as Props;
    };

    const input = <Props extends InputProps>(name: Fields, props?: Props): Props => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        // A masked number is typed as text ("R$ 1.234,56") and converted back when the form is parsed.
        const isNumber = field.kind === "number" && field.mask === undefined;
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist?.();
            const raw = isNumber ? e.target.valueAsNumber : e.target.value;
            props?.onChange?.(e);
            update(name, typeof raw === "number" && Number.isNaN(raw) ? undefined : raw);
        };
        return {
            ...compact({
                type: field.constraints.type,
                mask: field.mask,
                title: field.meta.title,
                info: field.info,
                locale: field.locale,
                currency: field.currency,
                placeholder: field.placeholder,
                ...fieldConstraintProps(field),
            }),
            ...props,
            ...managed(name, entry, props?.required),
            onChange,
            onInvalid: onInvalidField,
            value: getPath(state, name, undefined) ?? props?.value ?? "",
            ref: register(name, entry),
        } as unknown as Props;
    };

    /** Props for one `<Radiobox />` of the group. Call it once per option value. */
    const radio = (name: Fields, value: string, props?: RadioboxProps): RadioboxProps => {
        const entry = getFieldEntry(name, schema);
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) update(name, value);
            props?.onChange?.(e);
        };
        return {
            ...props,
            name,
            value,
            onChange,
            form: formName,
            id: `${name}-${value}`,
            required: props?.required ?? entry.field.required,
            checked: String(getPath(state, name, undefined) ?? "") === value,
        };
    };

    const slider = (name: Fields, props?: Partial<SliderProps>): SliderProps => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        const { min, max, step } = field.constraints;
        return {
            ...compact({ min, max, step, label: field.meta.title }),
            ...props,
            name,
            value: getPath(state, name, undefined) ?? field.defaultValue ?? min ?? 0,
            onValueChange: (value: number | readonly number[], details: SliderChangeDetails) => {
                update(name, value);
                (props?.onValueChange as ((value: number | readonly number[], details: SliderChangeDetails) => void) | undefined)?.(value, details);
            },
        } as SliderProps;
    };

    const file = (name: Fields, props?: Partial<FileUploadProps>): FileUploadProps => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        const multiple = field.constraints.multiple === true;
        const current = toArray(getPath(state, name, undefined) as File | File[] | undefined);
        return {
            ...compact({
                multiple,
                maxSize: field.constraints.maxSize,
                minSize: field.constraints.minSize,
                accept: toDropzoneAccept(field.constraints.accept),
            }),
            ...props,
            name,
            files: current,
            onDrop: (files: File[]) => {
                update(name, multiple ? files : files[0]);
                props?.onDrop?.(files);
            },
            onDeleteFile: (target: File) => {
                update(name, multiple ? current.filter((item) => item !== target) : undefined);
                props?.onDeleteFile?.(target);
            },
        } as FileUploadProps;
    };

    /** Adds a row to an array of objects. The row starts from the defaults the schema declares. */
    const append = (name: Fields, value?: unknown) => {
        const { field } = getFieldEntry(name, schema);
        const current = toArray(getPath(state, name, undefined) as unknown[] | undefined);
        update(name, current.concat([value ?? structuredClone(field.element?.defaultValue ?? {})]));
    };

    /** Removes a row from an array of objects and forgets the messages of the array. */
    const remove = (name: Fields, index: number) => {
        const current = toArray(getPath(state, name, undefined) as unknown[] | undefined);
        update(
            name,
            current.filter((_, position) => position !== index)
        );
        clearError(name);
    };

    const morph = (name: Fields, props?: Partial<MorphSelectProps>): MorphSelectProps => {
        const entry = getFieldEntry(name, schema);
        const { field } = entry;
        return {
            label: field.title,
            placeholder: field.placeholder,
            items: field.options.map(({ value, label }) => ({ value, label })),
            ...props,
            name,
            value: (getPath(state, name, undefined) as string | undefined) ?? null,
            onValueChange: (value, option) => {
                update(name, value);
                props?.onValueChange?.(value, option);
            },
        };
    };

    /** Registers the blur validation of a field once. Rows added after the first render are bound on the next one. */
    const bind = (input: Registered, signal: AbortSignal) => {
        const element = input.element.dataset.origin
            ? (document.querySelector(`[data-target="${input.element.name}"]`) as HTMLEntryElements | null)
            : (input.element as HTMLEntryElements);
        if (!element || bound.current.has(element)) return;
        bound.current.add(element);
        const onBlurField = (e: Event) => {
            if (e.target === null) return false;
            const name = getName(e.target as unknown as HTMLEntryElements);
            if (!name) return false;
            const current = e.target as HTMLEntryElements;
            const relatedTarget = (e as FocusEvent).relatedTarget as HTMLEntryElements | null;
            const value = getDataTarget(current) ?? (relatedTarget ? getValueByType(relatedTarget) : "");
            const validation = input.schema.safeParse(coerceFieldValue(input.schema, value));
            current.setAttribute("value", value as string);
            if (validation.success) {
                if (element.setCustomValidity) element.setCustomValidity("");
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
                if (element.setCustomValidity) element.setCustomValidity(errorMessage);
                setErrors((prev) => {
                    if (Is.null(prev)) return null;
                    const newErrors = setPath(prev, name, errorMessage || undefined);
                    return Is.empty(newErrors) ? null : newErrors;
                });
            }
            return false;
        };
        element.addEventListener(element.getAttribute("data-trigger") || "blur", onBlurField, { signal });
    };

    useEffect(() => {
        const controller = (abort.current ??= new AbortController());
        for (const registered of Object.values(ref.current)) bind(registered, controller.signal);
    });

    useEffect(
        () => () => {
            abort.current?.abort();
            abort.current = null;
            bound.current = new WeakSet();
        },
        []
    );

    useEffect(() => {
        const hasErrors = Object.values(ref.current).some((registered) => {
            const element = registered.element.dataset.origin
                ? (document.querySelector(`[data-target="${registered.element.name}"]`) as HTMLEntryElements | null)
                : (registered.element as HTMLEntryElements);
            if (!element || element.dataset.shadow || !(element as HTMLInputElement).required) return false;
            return !registered.schema.safeParse(coerceFieldValue(registered.schema, getValueByType(element))).success;
        });
        if (hasErrors) setErrors((prev) => (prev === null ? {} : prev));
    }, []);

    const onSubmit = (exec?: UseFormSubmit<z.infer<T>>) => (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        let json = formToJson(form);
        const elements = formName ? Array.from(document.querySelectorAll(`[form="${formName}"]`)) : Array.from(form.elements);
        elements.forEach((field) => {
            if (field.tagName === "SELECT") {
                const input = field as HTMLSelectElement;
                json = setPath(json, input.name, input.value);
            }
            if (field.tagName === "INPUT") {
                const input = field as HTMLInputElement;
                const value = getDataTarget(input) ?? (input ? getValueByType(input) : "");
                json = setPath(json, input.dataset.target || input.name, value);
            }
        });
        // Native controls post strings only: convert them to what the schema declares after the typed state is merged in.
        const input = coerceFormValues(schema, deepMerge(json, state as object));
        const result = schema.safeParse(input);
        const reset = () => {
            formReset(form);
            opts.interceptor?.clear();
        };
        if (result.success) {
            const jsonString = JSON.stringify(result.data);
            form.setAttribute("data-json", jsonString);
            opts.interceptor?.clear();
            setErrors(null);
            return exec?.(event, {
                form,
                event,
                reset,
                setErrors,
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
        setErrors(issuesToErrors(result.error.issues));
        form.reportValidity();
        return exec?.(event, {
            form,
            event,
            reset,
            setErrors,
            json: input,
            success: false,
            data: input as z.infer<T>,
            errors: result.error.issues.map((x) => ({
                message: x.message,
                path: x.path.map((x) => String(x)),
            })),
        });
    };

    const get = (p: Fields) => getPath(state, p) ?? "";

    const field = (name: Fields): ZodFieldDescriptor => getFieldEntry(name, schema).field;

    const controller = (props?: ComponentProps<"form">) => ({
        ...props,
        id: formName,
        name: formName,
    });

    useEffect(() => {
        if (opts.interceptor) opts.interceptor?.set(state);
    }, [state, opts.interceptor]);

    return {
        get,
        file,
        input,
        append,
        remove,
        radio,
        state,
        field,
        fields,
        morph,
        errors,
        select,
        slider,
        checkbox,
        onSubmit,
        setState,
        textarea,
        onInvalid,
        controller,
        datepicker,
        name: formName,
        multiselect,
        disabled: errors !== null,
    };
};

/** What `useForm` returns, for components that receive the form as a prop. */
export type UseFormApi<T extends z.ZodObject> = ReturnType<typeof useForm<T>>;

export const getJsonForm = <T extends z.ZodObject>(form?: HTMLFormElement | null): z.infer<T> => {
    if (!form) return {} as z.infer<T>;
    const value = form.getAttribute("data-json");
    if (!value) return {} as z.infer<T>;
    try {
        return JSON.parse(value) as z.infer<T>;
    } catch {
        return {} as z.infer<T>;
    }
};
