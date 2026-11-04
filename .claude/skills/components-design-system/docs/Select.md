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

| Prop                 | Type                                                           | Default    | Description                                                                                       |
| -------------------- | -------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `options`            | `OptionProps[]`                                                | —          | Array of option objects.                                                                          |
| `size`               | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared control size inherited from `InputField`.                                                  |
| `selectContainer`    | `string`                                                       | `""`       | Legacy compatibility prop; currently accepted but not applied.                                    |
| `required`           | `boolean`                                                      | `true`     | Whether the field is required.                                                                    |
| `error`              | `string`                                                       | —          | Error message to display.                                                                         |
| `loading`            | `boolean`                                                      | `false`    | Accepted, but currently adds no loading indicator or interaction lock; set `disabled` explicitly. |
| `disabled`           | `boolean`                                                      | `false`    | Disables the select.                                                                              |
| `placeholder`        | `string`                                                       | —          | Placeholder shown as a disabled hidden option.                                                    |
| `value`              | `string`                                                       | —          | Controlled selected value.                                                                        |
| `onChange`           | `(e: ChangeEvent<HTMLSelectElement>) => void`                  | —          | Change handler.                                                                                   |
| `...inputFieldProps` | `InputFieldProps`                                              | —          | All `InputField` props (title, left, right, feedback, etc.).                                      |

### OptionProps

| Prop           | Type      | Description                                              |
| -------------- | --------- | -------------------------------------------------------- |
| `value`        | `string`  | Option value (required).                                 |
| `label`        | `string`  | Optional display text; falls back to `value` if omitted. |
| `disabled`     | `boolean` | Disables this individual option.                         |
| `data-dynamic` | `string`  | Marks a dynamically generated option.                    |
| `data-*`       | `string`  | Any custom data attributes forwarded to the `<option>`.  |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                      | Library default                           |
| --------------------------------------------- | ----------------------------------------- |
| `--var-free-text-surface-padding-block`       | `calc(var(--var-spacing-base) * 0.25)`    |
| `--var-free-text-small-surface-padding-block` | `calc( var(--var-spacing-base) * 0.125 )` |
| `--var-input-field-icon-size`                 | `calc(var(--var-spacing-base) * 1)`       |
| `--var-input-field-small-icon-size`           | `calc(var(--var-spacing-base) * 0.875)` |

| Token | CSS Variable                    | Purpose                                        |
| ------------------------------- | ---------------------------------------------- | ------------------------------- |
| `text-foreground`               | `--var-color-foreground`                       | Selected option text            |
| `text-input-placeholder`        | `--var-free-text-placeholder-foreground`       | Text when no option is selected |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground`       | Placeholder text                |
| `placeholder-input-mask-error`  | `--var-free-text-error-placeholder-foreground` | Error placeholder text          |
| `text-danger`                   | `--var-color-danger`                           | Error text                      |
| `hover:text-primary`            | `--var-color-primary`                          | Caret hover color               |
| `h-input-height`                | `--var-free-text-control-height`               | Default control height          |
| `px-input-padding-x`            | `--var-free-text-surface-padding-inline`       | Horizontal padding              |
| `py-input-padding-y`            | `--var-free-text-surface-padding-block`        | Vertical padding                |

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

```tsx
import { Select } from "@g4rcez/components/select";
import { useForm } from "@g4rcez/components";
import { z } from "zod";
const schema = z.object({ role: z.string });
export default function UserForm() {
    const form = useForm(schema, "userForm");
    return (
        <form {...form.props}>
            {" "}
            <Select
                {...form.select("role")}
                options={[
                    { value: "admin", label: "Administrator" },
                    { value: "editor", label: "Editor" },
                    { value: "viewer", label: "Viewer" },
                ]}
                placeholder="Select role"
            />{" "}
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
- Provide a `placeholder` so users know what to select.
- Use `loading` and `disabled` together while fetching options asynchronously.
- Use design-token classes for wrapper elements (`bg-background`, `text-foreground`, `border-border`).

## Don't

- For a small set of alternatives that should stay visible, prefer `Radiobox`. Use `Switch` only for an immediate binary setting, not as a compact option picker.
- Don't use `Select` for large searchable lists; use `Autocomplete` instead.
- Don't use long option labels that may truncate on small viewports.
- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`); use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`); override CSS variables in your `@theme` block instead.

## Interaction design and acceptance criteria

This component uses native selection behavior. [MultiSelect](MultiSelect.md) and [Autocomplete](Autocomplete.md) adapt the same selection guidance but have separate custom interaction contracts.

- Use `Select` for a compact choice from known options. Give it a persistent `title`, meaningful option labels, and explicit `required={false}` when optional. A placeholder is a prompt, not the field name or a selectable answer.

- Pointer/touch selection and opening/confirmation keys are browser/platform-owned. Tab reaches the select, arrows navigate or change values, and Enter/Space/system shortcuts vary by platform. The caret button only focuses the select; do not promise that tapping it opens a native picker. CSS changes the field border on hover and focus; verify the focus cue and target comfort in the consumer theme.
- `disabled` disables the field and its native controls; individual options support `disabled`. `loading` is currently accepted without a spinner, disable rule, or pending announcement. Consumers must set `disabled` and provide any necessary loading/result status.
- The generated label, invalid state, help/error descriptions, and native value semantics support inspection, not a guarantee of particular announcements. `InputField` renders errors with `role="alert"`; verify actual reading and updates with supported assistive technologies. There is no built-in clear action: an optional field that needs clearing requires an enabled empty-value option in `options` and matching validation.

## Acceptance criteria

These checks and consumer targets have not been exercised as part of this documentation review. 1. **Current behavior:** Given labeled options and a controlled value, when an enabled option is chosen with a pointer, touch, or native keyboard interaction, then `onChange` contains that option's value and the accepted parent value is displayed. 2. **Browser check:** Given focus on the select, when the platform's opening/navigation/confirmation keys and Tab/Shift+Tab are used, then options are usable and focus can continue through the form; the field's focus treatment remains visible. 3. **Current behavior:** Given an enabled select, when its caret button is activated, then focus moves to the select; native picker opening is not an implemented caret action. 4. **Current behavior:** Given `disabled` or a disabled option, when selection is attempted, then that unavailable choice cannot be changed through native interaction; `loading` alone is not an interaction lock. 5. **Consumer target:** Given an optional or invalid selection, when the field is inspected and used with supported assistive technology, then its persistent name, current value, required/disabled/invalid state, and applicable description are available; clearing works only if the consumer supplies a selectable empty option.

## Accessibility

- Uses a native `<select>` for keyboard and screen-reader compatibility.
- The `placeholder` renders as a `disabled hidden` option and is never submitted.
- The caret is a translated, named `<button>` whose action focuses the select; it does not call `showPicker` or implement popup opening.
- The native select references the generated title label through `aria-labelledby`; error/feedback ids are appended to `aria-describedby`, and `error` sets `aria-invalid`.
- `data-selected` starts from the truthiness of `value` and is set to `"true"` on the first change; it is a visual hint, not a validity check.

## Data Attributes

| Attribute | Element

| Value            | Description |
| ---------------- | ----------- |
| `data-component` | Root |
| `data-selected` | `<select>` |

`"select"`
Component ID.
`true` / `false`
Whether selected.

## Notes

- `selectContainer` remains in the public type for compatibility but is not applied. Use `container` or `labelClassName` for styling. - Built on `InputField` for layout, label, error, and loading handling.
- Supports all standard HTML `<select>` attributes via prop spread.
- `required` defaults to `true`; pass `required={false}` when optional.
- Custom `OptionProps` data attributes (for example, `data-price`) are forwarded to each `<option>` and available through `e.target.selectedOptions[0].dataset`.
