"use client";
import React, { useRef } from "react";
import { getPath } from "sidekicker";
import type { z } from "zod";
import type { UseFormApi } from "../../../hooks/use-form";
import type { ZodFieldDescriptor } from "../../../lib/zod-fields";
import type { Any } from "../../../types";
import { Button } from "../../core/button/button";
import { Card } from "../../display/card/card";
import { Autocomplete, type AutocompleteProps } from "../autocomplete/autocomplete";
import { Checkbox, type CheckboxProps } from "../checkbox/checkbox";
import { DatePicker, type DatePickerProps } from "../date-picker/date-picker";
import { FileUpload } from "../file-upload/file-upload";
import { Input, type InputProps } from "../input/input";
import { Textarea, type TextareaProps } from "../input/textarea";
import { MorphSelect } from "../morph-select/morph-select";
import { MultiSelect, type MultiSelectProps } from "../multi-select/multi-select";
import { Radiobox } from "../radiobox/radiobox";
import { Select, type SelectProps } from "../select/select";
import { Slider } from "../slider/slider";
import { Switch, type SwitchProps } from "../switch/switch";

/** The form handed to a field: the object `useForm` returns, typed loosely so the form of any schema fits. */
// The accepted paths differ per schema, so a method typed for one form never fits another: only `any` accepts them all.
type AnyForm = { [K in keyof UseFormApi<z.ZodObject>]: any };

/** Props merged over the ones the schema derives, keyed by field path (`email`, `address.street`, `items[].name`). */
export type ZodFieldOverrides = Partial<Record<string, Any>>;

export type ZodFieldRenderContext = { field: ZodFieldDescriptor; form: AnyForm; props: Any };

/** Replaces the rendering of one field. Return `undefined` to fall back to the default component. */
export type ZodFieldRenderers = Partial<Record<string, (context: ZodFieldRenderContext) => React.ReactNode>>;

export type ZodFieldLabels = Partial<{ add: string; remove: string }>;

export type ZodFieldProps = {
    /** What `useForm` returns. */
    form: AnyForm;
    /** Path of the field in the schema: `email`, `address.street`, `items[0].name`. */
    name: string;
    fields?: ZodFieldOverrides;
    render?: ZodFieldRenderers;
    labels?: ZodFieldLabels;
};

const GRID: React.CSSProperties = {
    display: "grid",
    gap: "var(--var-spacing-base)",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))",
};

const FULL_WIDTH: React.CSSProperties = { gridColumn: "1 / -1" };

const GROUP: React.CSSProperties = {
    border: 0,
    margin: 0,
    padding: 0,
    minInlineSize: 0,
    display: "grid",
    gap: "calc(var(--var-spacing-base) * 0.5)",
};

const ERROR: React.CSSProperties = { margin: 0, color: "var(--var-color-danger)", fontSize: "0.875em" };

const ROW_ACTIONS: React.CSSProperties = { display: "flex", justifyContent: "flex-end" };

/** `items[3].name` and `items[].name` share the same override key. */
const normalize = (name: string) => name.replace(/\[\d+]/g, "[]");

const pick = <V,>(map: Partial<Record<string, V>> | undefined, name: string): V | undefined => map?.[name] ?? map?.[normalize(name)];

const toRows = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const Message = ({ id, children }: { id: string; children?: string }) =>
    children ? (
        <p id={id} role="alert" style={ERROR}>
            {children}
        </p>
    ) : null;

type InnerProps = ZodFieldProps;

const FieldList = ({ form, name, fields, render, labels }: InnerProps) => {
    const field: ZodFieldDescriptor = form.field(name);
    const rows = toRows(getPath(form.state, name));
    const keys = useRef<number[]>([]);
    const counter = useRef(0);
    // Rows keep a stable key, so removing one does not hand its DOM state (checkboxes, files) to the next row.
    while (keys.current.length < rows.length) keys.current.push(counter.current++);
    keys.current.length = rows.length;
    const message = getPath(form.errors, name, undefined);
    const maxItems = field.constraints.maxItems;
    return (
        <Card title={field.title} role="group" aria-label={field.title} style={FULL_WIDTH}>
            <div style={{ display: "grid", gap: "var(--var-spacing-base)" }}>
                {rows.map((_, index) => {
                    const row: ZodFieldDescriptor = form.field(`${name}[${index}]`);
                    return (
                        <div
                            key={keys.current[index]}
                            data-component="zod-form-row"
                            style={{ display: "grid", gap: "calc(var(--var-spacing-base) * 0.5)" }}
                        >
                            <div style={GRID}>
                                {row.children.map((child) => (
                                    <FieldControl key={child.name} form={form} name={child.name} fields={fields} render={render} labels={labels} />
                                ))}
                            </div>
                            <div style={ROW_ACTIONS}>
                                <Button
                                    size="small"
                                    theme="muted"
                                    type="button"
                                    aria-label={`${labels?.remove ?? "Remove"} ${field.title} ${index + 1}`}
                                    onClick={() => {
                                        keys.current.splice(index, 1);
                                        form.remove(name, index);
                                    }}
                                >
                                    {labels?.remove ?? "Remove"}
                                </Button>
                            </div>
                        </div>
                    );
                })}
                <div>
                    <Button size="small" type="button" disabled={maxItems !== undefined && rows.length >= maxItems} onClick={() => form.append(name)}>
                        {labels?.add ?? "Add"} {field.title}
                    </Button>
                </div>
                <Message id={`${name}-error`}>{typeof message === "string" ? message : undefined}</Message>
            </div>
        </Card>
    );
};

const FieldControl = ({ form, name, fields, render, labels }: InnerProps): React.ReactNode => {
    const field: ZodFieldDescriptor = form.field(name);
    const override: Any = pick(fields, name) ?? {};
    const custom = pick(render, name)?.({ field, form, props: override });
    if (custom !== undefined) return custom;
    const message = getPath(form.errors, name, undefined);
    const error = typeof message === "string" ? message : undefined;
    const labelled = { title: field.title, ...override };
    switch (field.component) {
        case "group":
            return (
                <Card title={field.title} role="group" aria-label={field.title} style={FULL_WIDTH}>
                    <div style={GRID}>
                        {field.children.map((child) => (
                            <FieldControl key={child.name} form={form} name={child.name} fields={fields} render={render} labels={labels} />
                        ))}
                    </div>
                </Card>
            );
        case "list":
            return <FieldList form={form} name={name} fields={fields} render={render} labels={labels} />;
        case "textarea":
            return <Textarea {...form.textarea(name, labelled as TextareaProps)} />;
        case "select":
            return <Select {...form.select(name, labelled as SelectProps)} />;
        case "autocomplete":
            return <Autocomplete {...form.select(name, labelled as AutocompleteProps)} />;
        case "multiselect":
            return <MultiSelect {...form.multiselect(name, labelled as MultiSelectProps)} />;
        case "datepicker":
            return <DatePicker {...form.datepicker(name, labelled as DatePickerProps)} />;
        case "checkbox":
            return (
                <div style={FULL_WIDTH}>
                    <Checkbox {...form.checkbox(name, override as CheckboxProps)}>{field.title}</Checkbox>
                </div>
            );
        case "switch":
            return (
                <div style={FULL_WIDTH}>
                    <Switch {...form.checkbox(name, override as SwitchProps)}>{field.title}</Switch>
                </div>
            );
        case "radio":
            return (
                <fieldset role="radiogroup" aria-describedby={error ? `${name}-error` : undefined} style={GROUP} aria-label={field.title}>
                    <legend>{field.title}</legend>
                    {field.options.map((option) => (
                        <Radiobox key={option.value} {...form.radio(name, option.value, override)}>
                            {option.label}
                        </Radiobox>
                    ))}
                    <Message id={`${name}-error`}>{error}</Message>
                </fieldset>
            );
        case "slider":
            return (
                <div style={GROUP}>
                    <span>{field.title}</span>
                    <Slider {...form.slider(name, { label: field.title, ...override })} />
                    <Message id={`${name}-error`}>{error}</Message>
                </div>
            );
        case "morph":
            return (
                <div style={GROUP}>
                    <MorphSelect {...form.morph(name, override)} />
                    <Message id={`${name}-error`}>{error}</Message>
                </div>
            );
        case "file":
            return (
                <div style={{ ...GROUP, ...FULL_WIDTH }}>
                    <span>{field.title}</span>
                    <FileUpload {...form.file(name, override)} />
                    <Message id={`${name}-error`}>{error}</Message>
                </div>
            );
        default:
            return <Input {...form.input(name, labelled as InputProps)} />;
    }
};

/**
 * Renders one field of a `useForm` form with the component its schema asks for.
 * Use it to lay out a schema driven form by hand, field by field.
 *
 * @example
 * ```tsx
 * const form = useForm(schema, "profile");
 * <form {...form.controller()} onSubmit={form.onSubmit(save)}>
 *   <ZodField form={form} name="email" />
 *   <ZodField form={form} name="address" />
 * </form>
 * ```
 */
export const ZodField = ({ form, name, fields, render, labels }: ZodFieldProps) => (
    <FieldControl form={form} name={name} fields={fields} render={render} labels={labels} />
);

export const zodFieldLayout = { grid: GRID, fullWidth: FULL_WIDTH } as const;
