"use client";
import React, { forwardRef } from "react";
import type { z } from "zod";
import { type UseFormApi, type UseFormInvalid, type UseFormOptions, type UseFormSubmit, useForm } from "../../../hooks/use-form";
import { Button } from "../../core/button/button";
import { ZodField, type ZodFieldLabels, type ZodFieldOverrides, type ZodFieldRenderers, zodFieldLayout } from "./zod-field";

export {
    ZodField,
    type ZodFieldLabels,
    type ZodFieldOverrides,
    type ZodFieldProps,
    type ZodFieldRenderContext,
    type ZodFieldRenderers,
} from "./zod-field";

export type ZodFormProps<T extends z.ZodObject> = Omit<React.ComponentProps<"form">, "onSubmit" | "onInvalid" | "name" | "children" | "ref"> & {
    /** The schema that drives the form. Every field is rendered with the component its type asks for. */
    schema: T;
    /** Unique form name. Used as the form `id` and `name`. */
    name: string;
    /** Called with the parsed (typed) data, or with `success: false` and the zod issues. */
    onSubmit?: UseFormSubmit<z.infer<T>>;
    /** Called when native validation blocks the submit. */
    onInvalid?: UseFormInvalid;
    /** Initial values. They are merged over the defaults declared with `.default()`. */
    state?: UseFormOptions<z.input<T>>["state"];
    /** Keeps the state in storage between renders. See `createFormStorage`. */
    interceptor?: UseFormOptions<z.input<T>>["interceptor"];
    loading?: boolean;
    /** Props merged over what the schema derives, keyed by field path: `{ email: { placeholder: "me@site.com" } }`. */
    fields?: ZodFieldOverrides;
    /** Replaces how one field renders, keyed by field path. */
    render?: ZodFieldRenderers;
    /** Texts of the buttons the form adds. */
    labels?: ZodFieldLabels & Partial<{ submit: string }>;
    /** Extra content after the fields, next to the submit button. Receives the form. Pass `false` to remove the submit button. */
    footer?: ((form: UseFormApi<T>) => React.ReactNode) | false;
};

/**
 * A form generated from a zod schema. Each field is rendered with the library component that fits its type:
 * strings with `<Input />` (masks come from `.meta({ mask })`), enums with `<Select />`, arrays of enums with
 * `<MultiSelect />`, booleans with `<Checkbox />`, dates with `<DatePicker />`, files with `<FileUpload />`,
 * nested objects as groups and arrays of objects as repeatable rows. `.meta({ component })` picks another one.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   name: z.string().min(1).meta({ title: "Name" }),
 *   document: z.string().meta({ title: "CPF", mask: "cpf" }),
 *   role: z.enum(["admin", "member"]).default("member"),
 * });
 *
 * <ZodForm schema={schema} name="profile" onSubmit={(event, { data, success }) => success && save(data)} />
 * ```
 */
export const ZodForm = forwardRef<HTMLFormElement, ZodFormProps<z.ZodObject>>(function ZodForm(
    { schema, name, onSubmit, onInvalid, state, interceptor, loading, fields, render, labels, footer, ...props },
    ref
) {
    const form = useForm(schema, name, { state, interceptor, loading });
    return (
        <form {...props} {...form.controller()} ref={ref} onSubmit={form.onSubmit(onSubmit)} onInvalid={form.onInvalid(onInvalid)}>
            <div style={zodFieldLayout.grid}>
                {form.fields.map((field) => (
                    <ZodField key={field.name} form={form} name={field.name} fields={fields} render={render} labels={labels} />
                ))}
            </div>
            {footer === false ? null : (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "calc(var(--var-spacing-base) * 0.5)",
                        marginBlockStart: "var(--var-spacing-base)",
                    }}
                >
                    <Button type="submit" theme="main" loading={loading}>
                        {labels?.submit ?? "Submit"}
                    </Button>
                    {footer?.(form)}
                </div>
            )}
        </form>
    );
}) as <T extends z.ZodObject>(props: ZodFormProps<T> & { ref?: React.Ref<HTMLFormElement> }) => React.ReactElement;

(ZodForm as unknown as React.FC).displayName = "ZodForm";
