---
title: ZodForm
description: A form generated from a zod 4 schema. Each field renders the library component its type asks for, with the mask, options, defaults and constraints read from the schema.
package: "@g4rcez/components"
export: "{ ZodForm, ZodField, useForm, zodToFields }"
import: "import { ZodForm } from '@g4rcez/components/zod-form'"
category: form
---

# ZodForm

A form generated from a zod 4 schema. Each field renders the library component its type asks for, with the mask, options, defaults and constraints read from the schema.

`zod` is a peer dependency (`^4`). Install it next to the library: `pnpm add @g4rcez/components zod`.

## Import

```tsx
import { ZodForm, ZodField, useForm } from "@g4rcez/components";
import { z } from "zod";
```

`ZodForm` and `ZodField` are also available from `@g4rcez/components/zod-form`.

## Quick start

```tsx
const schema = z.object({
    name: z.string().min(2).meta({ title: "Name" }),
    document: z.string().meta({ title: "CPF", mask: "cpf" }),
    age: z.number().min(18).max(99),
    role: z.enum(["admin", "member"]).default("member").meta({ labels: { admin: "Administrator" } }),
    newsletter: z.boolean().default(true).meta({ component: "switch" }),
});

export default function Profile() {
    return <ZodForm schema={schema} name="profile" onSubmit={(event, { success, data }) => success && save(data)} />;
}
```

## ZodForm props

Accepts the native `<form>` attributes, except `onSubmit`, `onInvalid`, `name`, `children`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `schema` | `z.ZodObject` | required | The schema that drives the form. |
| `name` | `string` | required | Form `id` and `name`. |
| `onSubmit` | `(event, { success, data, errors, json, form, reset, setErrors }) => void` | - | Called with the parsed data (`success: true`) or with the zod issues (`success: false`). |
| `onInvalid` | `({ form, errors }) => void` | - | Called when native validation blocks the submit. |
| `state` | `Partial<z.input<T>> \| () => ...` | - | Initial values, merged over the `.default()` values. |
| `interceptor` | `{ get, set, clear }` | - | Persists the state. See `createFormStorage`. |
| `loading` | `boolean` | `false` | Marks the controls and the submit button as loading. |
| `fields` | `Record<path, props>` | - | Props merged over what the schema derives, by field path (`email`, `address.street`, `items[].name`). |
| `render` | `Record<path, ({ field, form, props }) => ReactNode>` | - | Replaces the rendering of one field. |
| `labels` | `{ submit, add, remove }` | `"Submit"`, `"Add"`, `"Remove"` | Texts of the buttons the form adds. |
| `footer` | `((form) => ReactNode) \| false` | - | Content next to the submit button. `false` removes the button. |

## Schema to component

`.meta({ component })` always wins over the inferred component.

| Schema | Component | Derived props |
|---|---|---|
| `z.string()` | `Input` | `required`, `minLength`, `maxLength`, `pattern` (a regex without flags), `title`, `placeholder` |
| `z.email()`, `z.url()` | `Input` | `type="email"` / `type="url"` |
| `z.uuid()` | `Input` | `mask="uuid"` |
| `z.string().meta({ mask })` | `Input` | `mask`. Length and `pattern` are not sent, the mask owns the format. |
| `z.string().meta({ component: "textarea" })` | `Textarea` | `maxLength` |
| `z.number()`, `z.int()` | `Input type="number"` | `min`, `max`, `step` (`multipleOf`, or `1` for integers) |
| `z.number().meta({ component: "slider" })` | `Slider` | `min`, `max`, `step`. Starts at `min`. |
| `z.number().meta({ mask: "money" })` | `Input` (text) | Parsed back to a number with the `locale` of the mask |
| `z.boolean()` | `Checkbox` (`"switch"` for `Switch`) | `defaultChecked`. Only `z.literal(true)` is `required`. |
| `z.enum()`, literal union, native enum | `Select` (`"autocomplete"`, `"radio"`, `"morph"`) | `options` from the values, texts from `meta.labels` |
| `z.array(z.enum())` | `MultiSelect` | `options`, `value` |
| `z.array(z.string())` | `MultiSelect` | `dynamicOption`, so the user creates the options. `meta.options` gives a list. |
| `z.iso.date()` | `DatePicker` | Stores `yyyy-MM-dd` |
| `z.iso.datetime()` | `DatePicker type="datetime"` | Stores an ISO string |
| `z.date()` | `DatePicker` | Stores a `Date`. `.min()` / `.max()` disable days outside the range. |
| `z.file()`, `z.array(z.file())` | `FileUpload` | `accept` from `.mime()`, `maxSize` from `.max()`, `multiple` |
| `z.object()` | Group (`Card`) | One field per key |
| `z.array(z.object())` | Repeatable rows | Add and remove buttons. `.min(n)` starts with `n` rows. |

Wrappers are read through: `.optional()`, `.nullable()`, `.default()`, `.prefault()`, `.catch()`, `.readonly()`, `.pipe()`, `z.preprocess()` and `z.lazy()`. `.optional()` and `.default()` make a field not `required`. A plain `z.string()` is not `required` either, because the schema accepts an empty string; add `.min(1)`, `.email()` or a regex to require it.

## Metadata (`.meta()`)

Declared on zod's `GlobalMeta`, so it is typed. It can sit on the inner schema or on the wrapper; the outer one wins.

| Key | Type | Used for |
|---|---|---|
| `title` | `string` | Label of the field. Falls back to the key, humanized. |
| `description` | `string` | Tooltip (`info`) of the field. |
| `placeholder` | `string` | Placeholder. |
| `mask` | `Input` `mask` | `"cpf"`, `"cnpj"`, `"cellphone"`, `"cep"`, `"money"`, a pattern like `"(99) 99999-9999"`, a token array or a function. |
| `currency`, `locale` | `CurrencyCode`, `Locales` | Money and percentage masks. |
| `component` | `"input" \| "textarea" \| "select" \| "autocomplete" \| "radio" \| "multiselect" \| "checkbox" \| "switch" \| "slider" \| "morph" \| "datepicker" \| "file"` | Overrides the inferred component. |
| `labels` | `Record<value, string>` | Texts of the options of an enum. |
| `options` | `Array<string \| { value, label }>` | Explicit options. Wins over the schema values. |

Mask presets of `the-mask-input`: `uuid`, `cellphone`, `cellTelephone`, `cep`, `cnpj`, `color`, `cpf`, `cpfCnpj`, `creditCard`, `date`, `isoDate`, `time`, `int`, `telephone`, plus `money`, `currency`, `percentage`.

## Compose your own layout

`useForm` reads the same schema. Each helper returns the props of one component, so you can place the fields by hand. Props you pass always win.

```tsx
const form = useForm(schema, "profile");

<form {...form.controller()} onSubmit={form.onSubmit((event, { success, data }) => success && save(data))}>
    <Input {...form.input("name")} />
    <Input {...form.input("document", { title: "CPF" })} />
    <Select {...form.select("role", { title: "Role" })} />
    <MultiSelect {...form.multiselect("tags", { title: "Tags" })} />
    <Checkbox {...form.checkbox("terms")}>Accept the terms</Checkbox>
    <DatePicker {...form.datepicker("birthday", { title: "Birthday" })} />
    <Slider {...form.slider("volume")} />
    <MorphSelect {...form.morph("status")} />
    <FileUpload {...form.file("avatar")} />
    {form.field("plan").options.map((option) => (
        <Radiobox key={option.value} {...form.radio("plan", option.value)}>{option.label}</Radiobox>
    ))}
    <ZodField form={form} name="address" />
</form>;
```

| Helper | Returns props for |
|---|---|
| `form.input(name, props?)` | `Input` |
| `form.textarea(name, props?)` | `Textarea` |
| `form.select(name, props?)` | `Select`, `Autocomplete` |
| `form.multiselect(name, props?)` | `MultiSelect` |
| `form.checkbox(name, props?)` | `Checkbox`, `Switch` |
| `form.radio(name, value, props?)` | one `Radiobox` of a group |
| `form.datepicker(name, props?)` | `DatePicker` |
| `form.slider(name, props?)` | `Slider` |
| `form.file(name, props?)` | `FileUpload` |
| `form.morph(name, props?)` | `MorphSelect` |
| `form.append(name)`, `form.remove(name, index)` | rows of an array of objects |
| `form.field(name)`, `form.fields` | the descriptor of one field, or of every top level field |

## Inspect the schema

`zodToFields(schema)` returns what the form is built from: `name`, `kind`, `component`, `required`, `defaultValue`, `title`, `info`, `mask`, `options`, `constraints` and `children`. `coerceFormValues(schema, values)` converts what a native form posts (strings) into what the schema expects.

## How a submit is parsed

1. Native values are read from the form, then the typed `useForm` state is merged over them.
2. `coerceFormValues` converts them: `"42"` to `42`, `"on"` to `true`, `"a,b"` to `["a", "b"]`, a date string to a `Date` for `z.date()`, a masked money string to a number, and `""` to `undefined` for optional fields. An unchecked required checkbox is `false`.
3. The schema parses the result. `onSubmit` gets `data` (typed output) on success, or `success: false` with the `errors` list.
4. On failure every issue is copied into the field errors, so schema-only failures (a `.refine()` on another field) show under the field named by the issue path.

Native validation runs first: the derived `required`, `min`, `max`, `minLength`, `pattern` and `type` attributes block the submit and fire `invalid`, which shows the zod message of that field.

## Accessibility

- Every control keeps the semantics of its component (`textbox`, `spinbutton`, `combobox`, `switch`, `slider`, `radio`).
- A radio group is a `fieldset` with `role="radiogroup"`, named by its legend. Objects and arrays render as `role="group"` named by their title.
- Errors render in a `role="alert"` element; fields with an `error` also set `aria-invalid`.
- Add and remove buttons name the row: "Remove Contacts 2".

## Do

- Put `title`, `mask`, `labels` and `component` in the schema, so every screen that reads it renders the same field.
- Use `.default()` for initial values. They also drive `defaultChecked`, the selected option and the slider position.
- Keep the schema as the single source of truth for `required` and the limits.

## Don't

- Don't pass `zod` v3 schemas. The introspection reads the zod 4 internals.
- Don't give `z.number()` a currency mask and expect a string back. It is parsed to a number.
- Don't rely on a `.transform()` to change the type a control edits. Controls edit the input side of the schema.
