"use client";
import { CodeBlock } from "@/components/code-block";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { Button, Card, Checkbox, Input, MultiSelect, Select, useForm, ZodField, ZodForm, zodToFields } from "@g4rcez/components";
import { useMemo, useState } from "react";
import { z } from "zod";
import { demoSchema } from "./demo-schema";

type Outcome = { success: boolean; data?: unknown; errors?: unknown } | null;

/** Files are not JSON, so they print as what a reader needs: name, size and type. */
const printable = (_key: string, value: unknown) =>
    typeof File !== "undefined" && value instanceof File ? { file: value.name, size: value.size, type: value.type } : value;

/** The descriptors hold the schema itself, regexes and functions. Neither prints as JSON. */
const describable = function (this: Record<string, unknown>, key: string, value: unknown) {
    if (key === "schema") return undefined;
    // `this[key]` is the value before toJSON turned a Date into a zone dependent string, so server and client print the same text.
    const original = this[key];
    if (original instanceof Date)
        return `${original.getFullYear()}-${String(original.getMonth() + 1).padStart(2, "0")}-${String(original.getDate()).padStart(2, "0")}`;
    if (value instanceof RegExp) return String(value);
    if (typeof value === "function") return "[function]";
    return value;
};

const zodFormUsage = `import { ZodForm } from "@g4rcez/components";
import { demoSchema } from "./demo-schema";

export default function Profile() {
    return (
        <ZodForm
            schema={demoSchema}
            name="profile"
            labels={{ submit: "Create profile" }}
            onSubmit={(event, { success, data, errors }) => {
                if (success) save(data); // typed as z.infer<typeof demoSchema>
            }}
        />
    );
}`;

const composeSchema = z.object({
    username: z.string().min(3, "Use at least 3 characters").meta({ title: "Username" }),
    workEmail: z.email("Enter a valid email").meta({ title: "Email" }),
    accountRole: z
        .enum(["admin", "member"])
        .default("member")
        .meta({ title: "Role", labels: { admin: "Administrator", member: "Member" } }),
    interests: z
        .array(z.enum(["design", "code", "ops"]))
        .default(["code"])
        .meta({ title: "Interests" }),
    home: z.object({ city: z.string().default("Recife").meta({ title: "City" }) }),
});

const composeUsage = `const composeSchema = z.object({
    username: z.string().min(3, "Use at least 3 characters").meta({ title: "Username" }),
    workEmail: z.email("Enter a valid email").meta({ title: "Email" }),
    accountRole: z.enum(["admin", "member"]).default("member").meta({ title: "Role", labels: { admin: "Administrator", member: "Member" } }),
    interests: z.array(z.enum(["design", "code", "ops"])).default(["code"]).meta({ title: "Interests" }),
    home: z.object({ city: z.string().default("Recife").meta({ title: "City" }) }),
});

function Account() {
    const form = useForm(composeSchema, "account");
    return (
        <form {...form.controller()} onSubmit={form.onSubmit((event, { success, data }) => success && save(data))}>
            <div className="grid gap-4 md:grid-cols-2">
                {/* Props come from the schema: required, minLength, type, options, default. Yours win. */}
                <Input {...form.input("username")} />
                <Input {...form.input("workEmail")} />
                <Select {...form.select("accountRole")} />
                <MultiSelect {...form.multiselect("interests")} />
                {/* Or let the schema pick the component for a field, or a whole group. */}
                <ZodField form={form} name="home" />
            </div>
            <Button type="submit">Save</Button>
        </form>
    );
}`;

const overrideSchema = z.object({
    nickname: z.string().min(2).meta({ title: "Nickname", component: "textarea" }),
    level: z.enum(["beginner", "advanced"]).default("beginner").meta({ title: "Level", component: "radio" }),
    consent: z.literal(true, { error: "You must accept the terms" }).meta({ title: "I accept the terms" }),
});

const overrideUsage = `const overrideSchema = z.object({
    // .meta({ component }) picks another control in the schema itself
    nickname: z.string().min(2).meta({ title: "Nickname", component: "textarea" }),
    level: z.enum(["beginner", "advanced"]).default("beginner").meta({ title: "Level", component: "radio" }),
    consent: z.literal(true, { error: "You must accept the terms" }).meta({ title: "I accept the terms" }),
});

<ZodForm
    schema={overrideSchema}
    name="overrides"
    // props merged over what the schema derives, by field path
    fields={{ nickname: { placeholder: "Set from the fields prop", rows: 2 } }}
    // replace one field with your own markup. form.checkbox("consent") still binds the control to the schema
    render={{
        consent: ({ field, form }) => (
            <div>
                <p>Custom render for "{field.name}": read the terms, then tick the box.</p>
                <Checkbox {...form.checkbox("consent")}>I have read the terms</Checkbox>
            </div>
        ),
    }}
    onSubmit={(event, { success, data }) => success && save(data)}
/>`;

const fieldsUsage = `import { zodToFields } from "@g4rcez/components";

// The descriptors the form is built from: kind, component, required, defaultValue, mask, options, constraints...
const fields = zodToFields(demoSchema);`;

export const ZodFormDemo = ({ schemaSource }: { schemaSource: string }) => {
    const [outcome, setOutcome] = useState<Outcome>(null);
    const [overrideOutcome, setOverrideOutcome] = useState<Outcome>(null);
    const descriptors = useMemo(() => JSON.stringify(zodToFields(demoSchema), describable, 2), []);
    const composed = useForm(composeSchema, "account");
    const [saved, setSaved] = useState<unknown>(null);

    return (
        <DocsLayout
            title="Zod Form"
            section="form"
            description="Describe a form once, with a zod 4 schema, and render it with the library components. The type of each key picks the component. The mask, the options, the defaults and the limits come from the schema."
            useWhen="Use Zod Form when a zod schema already describes the data. It removes the second copy of every limit, option list and default that otherwise lives in the markup."
            avoidWhen="Avoid it for a form that is mostly bespoke markup. Use the useForm helpers on single fields instead."
        >
            <ComponentDemo
                title="Schema to form"
                description="The schema below the form is the file this form runs. Submit it empty to see the schema messages, then fill it in to see the typed result."
                code={zodFormUsage}
            >
                <div className="grid gap-8 2xl:grid-cols-2">
                    <section aria-label="Form" className="min-w-0 space-y-6">
                        <Card title="Create profile">
                            <ZodForm
                                schema={demoSchema}
                                name="zod-demo"
                                labels={{ submit: "Create profile" }}
                                onSubmit={(event, { success, data, errors }) => setOutcome(success ? { success, data } : { success, errors })}
                            />
                        </Card>
                        <Card title={outcome === null ? "Result" : outcome.success ? "Parsed data" : "Schema issues"}>
                            {outcome === null ? (
                                <p>Submit the form to see what the schema returns.</p>
                            ) : (
                                <pre className="overflow-x-auto text-sm" aria-live="polite">
                                    <code>{JSON.stringify(outcome.success ? outcome.data : outcome.errors, printable, 2)}</code>
                                </pre>
                            )}
                        </Card>
                    </section>
                    <section aria-label="Schema" className="min-w-0">
                        <h4 className="mb-2 text-sm font-semibold">The schema behind this form</h4>
                        <CodeBlock code={schemaSource} />
                    </section>
                </div>
            </ComponentDemo>

            <ComponentDemo
                title="What the schema became"
                description="zodToFields reads the schema and returns one descriptor per field. This is the data the form renders from."
                code={fieldsUsage}
            >
                <CodeBlock code={descriptors} lang="json" />
            </ComponentDemo>

            <ComponentDemo
                title="Compose the layout yourself"
                description="useForm reads the same schema. Each helper returns the props of one component, so you place the fields and ZodField renders a whole group."
                code={composeUsage}
            >
                <form
                    {...composed.controller()}
                    onSubmit={composed.onSubmit((event, { success, data }) => setSaved(success ? data : null))}
                    className="space-y-4"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input {...composed.input("username")} />
                        <Input {...composed.input("workEmail")} />
                        <Select {...composed.select("accountRole")} />
                        <MultiSelect {...composed.multiselect("interests")} />
                        <ZodField form={composed} name="home" />
                    </div>
                    <Button type="submit">Save</Button>
                    <pre className="overflow-x-auto text-sm" aria-live="polite">
                        <code>{JSON.stringify(saved ?? composed.state, null, 2)}</code>
                    </pre>
                </form>
            </ComponentDemo>

            <ComponentDemo
                title="Overrides and custom render"
                description="Change the control in the schema with .meta({ component }), merge props by field path with `fields`, or replace one field with `render`."
                code={overrideUsage}
            >
                <div className="space-y-4">
                    <ZodForm
                        schema={overrideSchema}
                        name="overrides"
                        fields={{ nickname: { placeholder: "Set from the fields prop", rows: 2 } }}
                        render={{
                            consent: ({ field, form }) => (
                                <div>
                                    <p>Custom render for &quot;{field.name}&quot;: read the terms, then tick the box.</p>
                                    <Checkbox {...form.checkbox("consent")}>I have read the terms</Checkbox>
                                </div>
                            ),
                        }}
                        footer={(form) => (
                            <Button type="button" theme="muted" onClick={() => setOverrideOutcome({ success: true, data: form.state })}>
                                Show state
                            </Button>
                        )}
                        onSubmit={(event, { success, data, errors }) => setOverrideOutcome(success ? { success, data } : { success, errors })}
                    />
                    {overrideOutcome === null ? null : (
                        <pre className="overflow-x-auto text-sm" aria-live="polite">
                            <code>{JSON.stringify(overrideOutcome.success ? overrideOutcome.data : overrideOutcome.errors, printable, 2)}</code>
                        </pre>
                    )}
                </div>
            </ComponentDemo>
        </DocsLayout>
    );
};
