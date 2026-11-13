import { z } from "zod";
import type { CurrencyCode, InputProps, Locales } from "../components/form/input/input";
import type { Any } from "../types";

/** Components a schema field can be rendered with. Set `component` in `.meta()` to override the inferred one. */
export type ZodFieldComponent =
    | "input"
    | "textarea"
    | "select"
    | "autocomplete"
    | "radio"
    | "multiselect"
    | "checkbox"
    | "switch"
    | "slider"
    | "morph"
    | "datepicker"
    | "file";

/** What the schema describes, independent from the component that renders it. */
export type ZodFieldKind = "string" | "number" | "boolean" | "enum" | "multi" | "date" | "datetime" | "file" | "object" | "array" | "unknown";

/** How a date field is stored in the form state and in the parsed output. */
export type ZodFieldDateStorage = "date" | "iso-date" | "iso-datetime";

export type ZodFieldOption = { value: string; label: string };

/** UI metadata read from `.meta()`. Declared on zod's `GlobalMeta`, so `.meta({ mask: "cpf" })` is typed. */
export type ZodFieldMeta = {
    /** Mask sent to the `<Input />`: a preset (`"cpf"`, `"money"`), a pattern, a token array or a function. */
    mask?: InputProps["mask"];
    /** Overrides the component inferred from the schema. */
    component?: ZodFieldComponent;
    placeholder?: string;
    /** Display text per option value, for enums and arrays of enums. */
    labels?: Record<string, string>;
    /** Explicit options. Wins over the values found in the schema. Required to give `z.array(z.string())` something to pick. */
    options?: Array<string | ZodFieldOption>;
    currency?: CurrencyCode;
    locale?: Locales;
};

declare module "zod" {
    // Merging into zod's own registry type is what makes `.meta({ mask })` type-check for consumers.
    interface GlobalMeta extends ZodFieldMeta {}
}

/** Native constraints derived from the schema checks. */
export type ZodFieldConstraints = Partial<{
    min: number;
    max: number;
    step: number;
    minLength: number;
    maxLength: number;
    pattern: string;
    type: "text" | "email" | "url" | "number" | "time";
    accept: string;
    multiple: boolean;
    maxSize: number;
    minSize: number;
    minItems: number;
    maxItems: number;
    minDate: Date;
    maxDate: Date;
}>;

export type ZodFieldDescriptor = {
    /** Full path, e.g. `address.street` or `items[0].name`. Array elements use `[]`: `items[].name`. */
    name: string;
    kind: ZodFieldKind;
    component: ZodFieldComponent | "group" | "list" | "none";
    required: boolean;
    nullable: boolean;
    hasDefault: boolean;
    defaultValue: unknown;
    title: string;
    info?: string;
    placeholder?: string;
    mask?: InputProps["mask"];
    currency?: CurrencyCode;
    locale?: Locales;
    storage?: ZodFieldDateStorage;
    options: ZodFieldOption[];
    constraints: ZodFieldConstraints;
    meta: ZodFieldMeta & { title?: string; description?: string };
    /** The schema with every wrapper (optional, default, pipe...) removed. */
    schema: z.ZodType;
    /** Fields of an `object` kind. */
    children: ZodFieldDescriptor[];
    /** Item descriptor of an `array` kind of objects. */
    element?: ZodFieldDescriptor;
};

export type UnwrappedSchema = {
    base: z.ZodType;
    required: boolean;
    nullable: boolean;
    hasDefault: boolean;
    defaultValue: unknown;
    meta: Record<string, unknown>;
};

const defOf = (schema: z.ZodType): Any => (schema as unknown as { _zod: { def: Any } })._zod.def;

const internalsOf = (schema: z.ZodType): Any => (schema as unknown as { _zod: Any })._zod;

const MAX_DEPTH = 32;

/**
 * Removes every wrapper around a schema and collects what the wrappers know.
 * Metadata is merged from the outermost schema inwards, so the outer `.meta()` wins.
 */
export const unwrapSchema = (schema: z.ZodType): UnwrappedSchema => {
    const meta: Record<string, unknown> = {};
    let current = schema;
    let nullable = false;
    let hasDefault = false;
    let defaultValue: unknown;
    let forceRequired = false;
    for (let depth = 0; depth < MAX_DEPTH; depth++) {
        const own = z.globalRegistry.get(current) as Record<string, unknown> | undefined;
        if (own) for (const key of Object.keys(own)) if (!(key in meta)) meta[key] = own[key];
        const def = defOf(current);
        const type: string = def.type;
        if (type === "nullable") {
            nullable = true;
            current = def.innerType;
        } else if (type === "default" || type === "prefault") {
            if (!hasDefault) {
                hasDefault = true;
                defaultValue = typeof def.defaultValue === "function" ? def.defaultValue() : def.defaultValue;
            }
            current = def.innerType;
        } else if (type === "nonoptional") {
            forceRequired = true;
            current = def.innerType;
        } else if (type === "optional" || type === "catch" || type === "readonly" || type === "exactOptional") {
            current = def.innerType;
        } else if (type === "lazy") {
            current = def.getter();
        } else if (type === "pipe") {
            // `z.preprocess(fn, schema)` has a transform on the input side, so the real schema is the output.
            current = defOf(def.in).type === "transform" ? def.out : def.in;
        } else break;
    }
    const optin = internalsOf(schema).optin;
    return { base: current, nullable, hasDefault, defaultValue, meta, required: forceRequired || optin === undefined };
};

/** `items[0].name` and `items[].name` both become `["items", "0" | "*", "name"]`. */
const splitPath = (path: string): string[] =>
    path
        .replace(/\[(\d*)]/g, (_, index: string) => `.${index === "" ? "*" : index}`)
        .split(".")
        .filter((x) => x !== "");

/**
 * Finds the schema of a field by path (`address.street`, `items[0].name` or `items[].name`).
 * The returned schema keeps its wrappers, so optional/default are still visible.
 */
export const getSchemaAtPath = (schema: z.ZodType, path: string): z.ZodType | undefined => {
    let current: z.ZodType | undefined = schema;
    for (const segment of splitPath(path)) {
        if (!current) return undefined;
        const { base } = unwrapSchema(current);
        const def = defOf(base);
        if (def.type === "object") current = def.shape?.[segment];
        else if (def.type === "array") current = def.element;
        else return undefined;
    }
    return current;
};

const humanize = (name: string): string => {
    const last =
        splitPath(name)
            .filter((x) => !/^(\d+|\*)$/.test(x))
            .at(-1) ?? name;
    const spaced = last
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .trim()
        .toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const valuesOf = (base: z.ZodType): unknown[] | undefined => {
    const values = internalsOf(base).values as Set<unknown> | undefined;
    return values ? Array.from(values) : undefined;
};

const checksOf = (base: z.ZodType): Any[] => ((defOf(base).checks ?? []) as Array<{ _zod: { def: Any } }>).map((check) => check._zod.def);

const formatOf = (base: z.ZodType, checks: Any[]): string | undefined => {
    const def = defOf(base);
    if (typeof def.format === "string" && def.type === "string") return def.format;
    return checks.find((check) => check.check === "string_format" && check.format !== "regex")?.format;
};

const isIntFormat = (base: z.ZodType) => /int/i.test(String(defOf(base).format ?? ""));

const toOptions = (meta: ZodFieldMeta, values?: unknown[]): ZodFieldOption[] => {
    if (meta.options) {
        return meta.options.map((option) =>
            typeof option === "string" ? { value: option, label: meta.labels?.[option] ?? option } : { value: option.value, label: option.label }
        );
    }
    return (values ?? []).map((raw) => {
        const value = String(raw);
        return { value, label: meta.labels?.[value] ?? value };
    });
};

type Shape = { kind: ZodFieldKind; storage?: ZodFieldDateStorage; values?: unknown[]; multipleFile?: boolean };

const classify = (base: z.ZodType, checks: Any[], meta: ZodFieldMeta): Shape => {
    const def = defOf(base);
    switch (def.type) {
        case "string": {
            const format = formatOf(base, checks);
            if (format === "date") return { kind: "date", storage: "iso-date" };
            if (format === "datetime") return { kind: "datetime", storage: "iso-datetime" };
            return { kind: "string" };
        }
        case "number":
        case "bigint":
            return { kind: "number" };
        case "boolean":
            return { kind: "boolean" };
        case "date":
            return { kind: "date", storage: "date" };
        case "file":
            return { kind: "file" };
        case "enum":
            return { kind: "enum", values: valuesOf(base) };
        case "literal": {
            const values = valuesOf(base) ?? [];
            return values.length === 1 && values[0] === true ? { kind: "boolean" } : { kind: "enum", values };
        }
        case "union": {
            const values = valuesOf(base);
            return values ? { kind: "enum", values } : { kind: "unknown" };
        }
        case "array": {
            const element = unwrapSchema(def.element);
            const elementDef = defOf(element.base);
            if (elementDef.type === "object") return { kind: "array" };
            if (elementDef.type === "file") return { kind: "file", multipleFile: true };
            const values = classify(element.base, checksOf(element.base), meta).values;
            return { kind: "multi", values };
        }
        case "object":
            return { kind: "object" };
        default:
            return { kind: "unknown" };
    }
};

const defaultComponent = (kind: ZodFieldKind): ZodFieldDescriptor["component"] => {
    switch (kind) {
        case "string":
        case "number":
        case "unknown":
            return "input";
        case "boolean":
            return "checkbox";
        case "enum":
            return "select";
        case "multi":
            return "multiselect";
        case "date":
        case "datetime":
            return "datepicker";
        case "file":
            return "file";
        case "object":
            return "group";
        case "array":
            return "list";
    }
};

const numberConstraints = (base: z.ZodType, checks: Any[], constraints: ZodFieldConstraints) => {
    const integer = isIntFormat(base) || checks.some((check) => check.check === "number_format" && /int/i.test(String(check.format)));
    for (const check of checks) {
        if (check.check === "greater_than") constraints.min = !check.inclusive && integer ? Number(check.value) + 1 : Number(check.value);
        if (check.check === "less_than") constraints.max = !check.inclusive && integer ? Number(check.value) - 1 : Number(check.value);
        if (check.check === "multiple_of") constraints.step = Number(check.value);
    }
    if (constraints.step === undefined && integer) constraints.step = 1;
};

const lengthConstraints = (checks: Any[], constraints: ZodFieldConstraints, array: boolean) => {
    const [min, max] = array ? (["minItems", "maxItems"] as const) : (["minLength", "maxLength"] as const);
    for (const check of checks) {
        if (check.check === "min_length") constraints[min] = Number(check.minimum);
        if (check.check === "max_length") constraints[max] = Number(check.maximum);
        if (check.check === "length_equals") {
            constraints[min] = Number(check.length);
            constraints[max] = Number(check.length);
        }
    }
};

const stringConstraints = (base: z.ZodType, checks: Any[], constraints: ZodFieldConstraints, hasMask: boolean) => {
    const format = formatOf(base, checks);
    if (format === "email") constraints.type = "email";
    if (format === "url") constraints.type = "url";
    if (format === "time") constraints.type = "time";
    // A mask adds characters, so native length and pattern checks would reject valid masked values.
    if (hasMask) return;
    lengthConstraints(checks, constraints, false);
    // The native `pattern` attribute takes a source only: a regex with flags cannot be expressed there.
    const regex = checks.find(
        (check) => check.check === "string_format" && check.format === "regex" && check.pattern instanceof RegExp && check.pattern.flags === ""
    );
    if (regex) constraints.pattern = (regex.pattern as RegExp).source;
};

const fileConstraints = (checks: Any[], constraints: ZodFieldConstraints) => {
    for (const check of checks) {
        if (check.check === "mime_type") constraints.accept = (check.mime as string[]).join(",");
        if (check.check === "max_size") constraints.maxSize = Number(check.maximum);
        if (check.check === "min_size") constraints.minSize = Number(check.minimum);
    }
};

const dateConstraints = (checks: Any[], constraints: ZodFieldConstraints) => {
    for (const check of checks) {
        if (check.check === "greater_than" && check.value instanceof Date) constraints.minDate = check.value;
        if (check.check === "less_than" && check.value instanceof Date) constraints.maxDate = check.value;
    }
};

const objectDefaults = (children: ZodFieldDescriptor[]) => {
    const entries = children.map((child) => [child.name.split(".").at(-1)!, child.defaultValue] as const).filter(([, value]) => value !== undefined);
    return entries.length === 0 ? undefined : Object.fromEntries(entries);
};

/** Whether the schema lets an empty string through. A schema that cannot run synchronously is assumed to reject it. */
const acceptsEmpty = (schema: z.ZodType): boolean => {
    try {
        return schema.safeParse("").success;
    } catch {
        return false;
    }
};

/** Describes one field (and, recursively, its children) from the schema found at `name`. */
export const describeField = (name: string, schema: z.ZodType): ZodFieldDescriptor => {
    const unwrapped = unwrapSchema(schema);
    const base = unwrapped.base;
    const meta = unwrapped.meta as ZodFieldMeta & { title?: string; description?: string };
    const checks = checksOf(base);
    const shape = classify(base, checks, meta);
    const kind = shape.kind;
    const format = kind === "string" ? formatOf(base, checks) : undefined;
    const mask = meta.mask ?? (format === "uuid" ? "uuid" : undefined);
    const constraints: ZodFieldConstraints = {};
    if (kind === "string" || kind === "unknown") stringConstraints(base, checks, constraints, mask !== undefined);
    if (kind === "number") {
        numberConstraints(base, checks, constraints);
        constraints.type = mask === undefined ? "number" : "text";
    }
    if (kind === "multi" || kind === "array") lengthConstraints(checks, constraints, true);
    if (kind === "file") {
        fileConstraints(shape.multipleFile ? checksOf(unwrapSchema(defOf(base).element).base) : checks, constraints);
        constraints.multiple = shape.multipleFile ?? false;
    }
    if (kind === "date" && shape.storage === "date") dateConstraints(checks, constraints);
    const options = kind === "enum" || kind === "multi" ? toOptions(meta, shape.values) : [];
    // `z.boolean()` is satisfied by an unchecked box, so only `z.literal(true)` makes a checkbox required.
    const isLiteralTrue = defOf(base).type === "literal" && kind === "boolean";
    // `z.string()` accepts "", so marking it `required` would block a value the schema allows, with no message to show.
    const required = kind === "boolean" ? isLiteralTrue && unwrapped.required : unwrapped.required && !(kind === "string" && acceptsEmpty(base));
    const field: ZodFieldDescriptor = {
        name,
        kind,
        options,
        required,
        constraints,
        mask,
        children: [],
        schema: base,
        storage: shape.storage,
        nullable: unwrapped.nullable,
        hasDefault: unwrapped.hasDefault,
        defaultValue: unwrapped.defaultValue,
        meta,
        info: meta.description as string | undefined,
        title: (meta.title as string | undefined) ?? humanize(name),
        placeholder: meta.placeholder,
        currency: meta.currency,
        locale: meta.locale,
        component: meta.component ?? defaultComponent(kind),
    };
    if (kind === "object") {
        const shapeEntries = Object.entries((defOf(base).shape ?? {}) as Record<string, z.ZodType>);
        field.children = shapeEntries.map(([key, child]) => describeField(name === "" ? key : `${name}.${key}`, child));
        if (!field.hasDefault) field.defaultValue = objectDefaults(field.children);
    }
    if (kind === "array") {
        field.element = describeField(`${name}[]`, defOf(base).element);
        // `.min(n)` starts the list with n blank rows, so the user never faces an empty list that cannot be valid.
        if (!field.hasDefault)
            field.defaultValue = Array.from({ length: constraints.minItems ?? 0 }, () => structuredClone(field.element?.defaultValue ?? {}));
    }
    if (kind === "multi" && !field.hasDefault) field.defaultValue = [];
    // A slider always has a position, so an untouched one must submit its starting point.
    if (field.component === "slider" && field.defaultValue === undefined) field.defaultValue = constraints.min ?? 0;
    return field;
};

/** Describes every top level field of an object schema. */
export const zodToFields = (schema: z.ZodObject): ZodFieldDescriptor[] => describeField("", schema).children;

/** Default values declared by the schema (`.default()`), nested objects included. Arrays default to `[]`. */
export const getSchemaDefaults = (schema: z.ZodObject): Record<string, unknown> =>
    (objectDefaults(zodToFields(schema)) as Record<string, unknown> | undefined) ?? {};

/** Constraints that map to native attributes of a text or number `<input>`. */
export const TEXT_CONSTRAINTS = ["minLength", "maxLength", "pattern", "min", "max", "step"] as const;

/**
 * Native attributes for a field, ready to spread on the component that renders it.
 * Pass the constraint names the component understands, so unknown attributes never reach the DOM.
 */
export const fieldConstraintProps = (
    field: ZodFieldDescriptor,
    keys: ReadonlyArray<keyof ZodFieldConstraints> = TEXT_CONSTRAINTS
): Record<string, unknown> => {
    const props: Record<string, unknown> = {};
    if (field.required) props.required = true;
    for (const key of keys) if (field.constraints[key] !== undefined) props[key] = field.constraints[key];
    return props;
};

const numberFormatParts = (locale: string) => {
    const parts = new Intl.NumberFormat(locale).formatToParts(11111.1);
    return {
        group: parts.find((part) => part.type === "group")?.value ?? ",",
        decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    };
};

/** Reads a number out of a masked, locale formatted string: `R$ 1.234,56` becomes `1234.56`. */
export const parseLocaleNumber = (text: string, locale: string = "pt-BR"): number => {
    const { group, decimal } = numberFormatParts(locale);
    const negative = /^\s*[-−(]/.test(text);
    const cleaned = text
        .split(group)
        .join("")
        .replace(decimal, ".")
        .replace(/[^0-9.]/g, "");
    const parsed = Number(cleaned);
    return negative ? -parsed : parsed;
};

const MONEY_MASKS = new Set(["money", "currency", "percentage", "percent", "percentual"]);

const coerceNumber = (value: unknown, field: ZodFieldDescriptor): unknown => {
    if (typeof value === "number") return Number.isNaN(value) ? undefined : value;
    if (typeof value !== "string") return value;
    if (value.trim() === "") return undefined;
    if (typeof field.mask === "string" && MONEY_MASKS.has(field.mask)) return parseLocaleNumber(value, field.locale ?? "pt-BR");
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
};

const matchValue = (raw: unknown, values?: unknown[]): unknown => {
    if (values === undefined || typeof raw !== "string") return raw;
    return values.find((value) => String(value) === raw) ?? raw;
};

/** Coerces one value (what a native control reports) to what `schema` expects. */
export const coerceFieldValue = (schema: z.ZodType, value: unknown): unknown => coerceValue(schema, value);

const coerceValue = (schema: z.ZodType, value: unknown): unknown => {
    const unwrapped = unwrapSchema(schema);
    const field = describeField("", schema);
    const kind = field.kind;
    const empty = value === undefined || value === null || value === "";
    if (kind === "object") {
        const source = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
        const result: Record<string, unknown> = { ...source };
        for (const child of field.children) {
            const key = child.name;
            const childSchema = (defOf(unwrapped.base).shape as Record<string, z.ZodType>)[key];
            const next = coerceValue(childSchema, source[key]);
            if (next === undefined) delete result[key];
            else result[key] = next;
        }
        return Object.keys(result).length === 0 && !unwrapped.required ? undefined : result;
    }
    if (kind === "array") {
        if (!Array.isArray(value)) return empty ? (unwrapped.required ? [] : undefined) : value;
        const element = defOf(unwrapped.base).element as z.ZodType;
        return value.map((item) => coerceValue(element, item));
    }
    if (kind === "multi") {
        const elementValues = field.schema && valuesOf(unwrapSchema(defOf(field.schema).element).base);
        const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",").filter((item) => item !== "") : [];
        return list.map((item) => matchValue(item, elementValues));
    }
    if (kind === "boolean") {
        if (value === "on" || value === "true") return true;
        if (value === "false") return false;
        if (typeof value === "boolean") return value;
        return unwrapped.required ? false : undefined;
    }
    if (kind === "string" || kind === "unknown") {
        if (value === "") return unwrapped.required ? "" : unwrapped.nullable ? null : undefined;
        return value === null ? undefined : value;
    }
    if (empty) return unwrapped.nullable && value === "" ? null : undefined;
    if (kind === "number") return coerceNumber(value, field);
    if (kind === "enum") return matchValue(value, valuesOf(unwrapped.base));
    if (kind === "date" && field.storage === "date" && typeof value === "string") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date;
    }
    return value;
};

/**
 * Converts what a native form posts (strings only) into what the schema expects:
 * numbers, booleans, `Date`s, option arrays and nested objects. Empty optional fields become `undefined`.
 */
export const coerceFormValues = <T extends z.ZodObject>(schema: T, values: Record<string, unknown>): Record<string, unknown> =>
    (coerceValue(schema, values) as Record<string, unknown> | undefined) ?? {};
