---
title: Select
description: Styled native select component with validation, loading state, and form integration.
package: "@g4rcez/components"
export: "{ Select }"
import: "import { Select } from '@g4rcez/components/select'"
category: form
---

# Select

Styled native select component with validation, loading state, and form integration.

## Import

```tsx
import { Select } from "@g4rcez/components/select";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `OptionProps[]` | — | Option objects. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared size from `InputField`. |
| `selectContainer` | `string` | `""` | Legacy, not applied. Use `container` or `labelClassName`. |
| `required` | `boolean` | `true` | Required field. Pass `required={false}` when optional. |
| `error` | `string` | — | Error message. |
| `loading` | `boolean` | `false` | No indicator, no interaction lock. Set `disabled` explicitly. |
| `disabled` | `boolean` | `false` | Disables the select. |
| `placeholder` | `string` | — | Shown as a disabled hidden option. |
| `value` | `string` | — | Controlled selected value. |
| `onChange` | `(e: ChangeEvent<HTMLSelectElement>) => void` | — | Change handler. |
| `...inputFieldProps` | `InputFieldProps` | — | All `InputField` props (title, left, right, feedback, etc.). |

`Select` accepts all HTML `<select>` attributes. `InputField` handles layout, label, error, and loading.

### OptionProps

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Option value (required). |
| `label` | `string` | Display text. Falls back to `value`. |
| `disabled` | `boolean` | Disables this option. |
| `data-dynamic` | `string` | Marks a dynamically generated option. |
| `data-*` | `string` | Custom data attributes, forwarded to the `<option>`. |

Custom `OptionProps` data attributes (for example `data-price`) are available through `e.target.selectedOptions[0].dataset`.

## Design Tokens

Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides win. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The first table lists examples. `defaultGeometryTokens` holds the full set.

| Override | Library default |
|---|---|
| `--var-free-text-surface-padding-block` | `calc(var(--var-spacing-base) * 0.25)` |
| `--var-free-text-small-surface-padding-block` | `calc( var(--var-spacing-base) * 0.125 )` |
| `--var-input-field-icon-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-input-field-small-icon-size` | `calc(var(--var-spacing-base) * 0.875)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `text-foreground` | `--var-color-foreground` | Selected option text |
| `text-input-placeholder` | `--var-free-text-placeholder-foreground` | Text when no option is selected |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground` | Placeholder text |
| `placeholder-input-mask-error` | `--var-free-text-error-placeholder-foreground` | Error placeholder text |
| `text-danger` | `--var-color-danger` | Error text |
| `hover:text-primary` | `--var-color-primary` | Caret hover color |
| `h-input-height` | `--var-free-text-control-height` | Control height |
| `px-input-padding-x` | `--var-free-text-surface-padding-inline` | Horizontal padding |
| `py-input-padding-y` | `--var-free-text-surface-padding-block` | Vertical padding |

## Examples

### Basic usage

```tsx
import { useState } from "react";
import { Select } from "@g4rcez/components/select";
export default function FruitPicker() {
    const [value, setValue] = useState("");
    return (
        <Select
            title="Fruit"
            options={[
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana" },
                { value: "orange", label: "Orange" },
            ]}
            placeholder="Select a fruit"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
```

### With validation error

```tsx
import { useState } from "react";
import { Select } from "@g4rcez/components/select";
export default function CountrySelect() {
    const [country, setCountry] = useState("");
    const [error, setError] = useState("");
    return (
        <Select
            title="Country"
            options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "uk", label: "United Kingdom" },
            ]}
            placeholder="Select country"
            value={country}
            error={error}
            required
            onChange={(e) => {
                setCountry(e.target.value);
                setError(e.target.value ? "" : "Please select a country");
            }}
        />
    );
}
```

### With disabled options

```tsx
import { Select } from "@g4rcez/components/select";
export default function StatusSelect() {
    return (
        <Select
            title="Status"
            options={[
                { value: "active", label: "Active" },
                { value: "pending", label: "Pending" },
                { value: "legacy", label: "Legacy (deprecated)", disabled: true },
                { value: "inactive", label: "Inactive" },
            ]}
            placeholder="Select status"
        />
    );
}
```

### Async options with loading state

```tsx
import { useEffect, useState } from "react";
import { Select } from "@g4rcez/components/select";
export default function AsyncSelect() {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    useEffect(() => {
        setLoading(true);
        fetchOptions.then((data) => {
            setOptions(data);
            setLoading(false);
        });
    }, []);
    return (
        <Select
            title="Region"
            options={options}
            placeholder={loading ? "Loading..." : "Select a region"}
            value={value}
            loading={loading}
            disabled={loading}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
```

### Form integration with `useForm`

The options of an enum come from the schema. Use `.meta({ labels })` for the texts.

```tsx
import { Select } from "@g4rcez/components/select";
import { useForm } from "@g4rcez/components";
import { z } from "zod";
const schema = z.object({
    role: z
        .enum(["admin", "editor", "viewer"])
        .default("viewer")
        .meta({ title: "Role", labels: { admin: "Administrator", editor: "Editor", viewer: "Viewer" } }),
});
export default function UserForm() {
    const form = useForm(schema, "userForm");
    return (
        <form {...form.controller()} onSubmit={form.onSubmit((event, { success, data }) => success && save(data))}>
            <Select {...form.select("role", { placeholder: "Select role" })} />
        </form>
    );
}
```

### Cascading selects

```tsx
import { useState } from "react";
import { Select } from "@g4rcez/components/select";
const subcategories: Record<string, { value: string; label: string }[]> = {
    electronics: [
        { value: "phones", label: "Phones" },
        { value: "laptops", label: "Laptops" },
    ],
    clothing: [
        { value: "shirts", label: "Shirts" },
        { value: "pants", label: "Pants" },
    ],
};
export default function CascadingSelect() {
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    return (
        <div className="flex flex-col gap-base">
            {" "}
            <Select
                title="Category"
                options={[
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                ]}
                placeholder="Select category"
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory("");
                }}
            />{" "}
            {category && (
                <Select
                    title="Subcategory"
                    options={subcategories[category] ?? []}
                    placeholder="Select subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                />
            )}{" "}
        </div>
    );
}
```

## Do

- Use descriptive `label` values for each option.
- Order options logically (alphabetically or by usage frequency).
- Set a `placeholder` that prompts the user.
- Use `loading` and `disabled` together while fetching options.
- Use design-token classes on wrappers (`bg-background`, `text-foreground`, `border-border`).

## Don't

- For a few alternatives that stay visible, use `Radiobox`. Use `Switch` only for an immediate binary setting, not as a compact option picker.
- Don't use `Select` for large searchable lists. Use `Autocomplete`.
- Don't use long option labels. They truncate on small viewports.
- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.

## Interaction design and acceptance criteria

`Select` uses native selection behavior. [MultiSelect](MultiSelect.md) and [Autocomplete](Autocomplete.md) adapt this guidance, but have separate custom interaction contracts.

- Use `Select` for a compact choice from known options. Give it a persistent `title` and meaningful option labels.
- A placeholder is a prompt. It is not the field name or a selectable answer.
- The browser or platform owns pointer and touch selection and the opening and confirmation keys.
- `Tab` reaches the select. Arrows navigate or change values. Enter, Space, and system shortcuts vary by platform.
- The caret button only focuses the select. Do not promise that tapping it opens a native picker.
- CSS changes the field border on hover and focus. Verify the focus cue and target comfort in the consumer theme.
- `disabled` disables the field and its native controls. Each option supports `disabled`.
- `loading` has no spinner, disable rule, or pending announcement. The consumer MUST set `disabled` and provide any loading or result status.
- The generated label, invalid state, descriptions, and native value semantics do not guarantee particular announcements.
- `InputField` renders errors with `role="alert"`. Verify reading and updates with supported assistive technologies.
- There is no built-in clear action. For an optional field that needs clearing, add an enabled empty-value option to `options` and matching validation.

## Accessibility

- Uses a native `<select>` for keyboard and screen-reader compatibility.
- The `placeholder` renders as a `disabled hidden` option and is never submitted.
- The caret is a translated, named `<button>`. Its action focuses the select. It does not call `showPicker` or open a popup.
- The native select references the generated title label through `aria-labelledby`.
- Error and feedback IDs are appended to `aria-describedby`. `error` sets `aria-invalid`.

## Data Attributes

| Attribute | Element | Value | Description |
|---|---|---|---|
| `data-component` | Root | `"select"` | Component ID. |
| `data-selected` | `<select>` | `true` / `false` | Whether a value is selected. |

`data-selected` starts from the truthiness of `value` and becomes `"true"` on the first change. It is a visual hint, not a validity check.

## Notes

- `selectContainer` stays in the public type for compatibility only.

## Verification

Acceptance criteria for tests and reviews: [verify/Select.md](verify/Select.md).
