---
title: Input
description: Text input with optional masking for currencies, percentages, phone numbers, dates, and custom regex patterns.
package: "@g4rcez/components"
export: "{ Input }"
import: "import { Input } from '@g4rcez/components/input'"
category: form
---

# Input

Text input with optional masking for currencies, percentages, phone numbers, dates, and custom regex patterns.

## Import

```tsx
import { Input } from "@g4rcez/components/input";
```

## Props

`Input` extends HTML `<input>` attributes and the `InputField` layout props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mask` | `AllMasks \| Array<string \| RegExp> \| ((value: string) => AllMasks)` | - | Input mask pattern. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Field size. Matches `Button` heights. |
| `locale` | `Locales` | - | Locale for currency and number formatting. |
| `currency` | `CurrencyCode` | - | Currency code for `mask="currency"`. |
| `error` | `string` | - | Error message below the field. |
| `title` | `string` | - | Field label. |
| `feedback` | `Label` | - | Success or neutral text below field. |
| `left` | `Label` | - | Content left of the input, inside the border. |
| `right` | `Label` | - | Content right of the input, inside the border. |
| `required` | `boolean` | `false` | Native required constraint. Hides supplied optional label text. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `loading` | `boolean` | `false` | Sets `aria-busy`. Does not disable editing or submission. |
| `container` | `string` | - | Extra CSS classes for the outer `fieldset`. |
| `labelClassName` | `string` | - | Extra CSS classes for the label wrapper. |
| `next` | `string` | - | `id` to focus on Enter with `enterKeyHint="next"`. |
| `hiddenLabel` | `boolean` | `false` | Hides the label visually, not from screen readers. |
| `...props` | `React.InputHTMLAttributes<HTMLInputElement>` | - | All standard input attributes. |

### Mask from a zod schema

With `useForm` or `ZodForm` the mask can live in the schema: `z.string().meta({ mask: "cpf" })`. `form.input("document")` then sends `mask` (and `currency` / `locale` for money masks) to the `Input`. A `z.number()` with a money or percentage mask is typed as text and parsed back to a number on submit. See [ZodForm](ZodForm.md).

### Mask patterns

| Pattern char | Matches |
|---|---|
| `9` | Digit (0–9) |
| `A` | Letter (a–z, A–Z) |
| `S` | Alphanumeric |
| `*` | Any character |

### Special mask strings

| Value | Description |
|---|---|
| `"currency"` | Currency format. Requires `locale` and `currency`. |
| `"percentage"` | Percentage input with `%` symbol. |
| `"decimal"` | Decimal number format. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides win. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The first table lists examples. `defaultGeometryTokens` holds the full set.

| Override | Library default |
|---|---|
| `--var-input-field-icon-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-input-field-small-icon-size` | `calc(var(--var-spacing-base) * 0.875)` |
| `--var-input-field-small-tooltip-icon-size` | `calc(var(--var-spacing-base) * 0.6875)` |
| `--var-input-field-small-status-min-inline-size` | `calc( var(--var-spacing-base) * 1.25 )` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `h-input-height` | `--var-free-text-control-height` | Input height |
| `px-input-padding-x` | `--var-free-text-surface-padding-inline` | Horizontal padding |
| `py-input-padding-y` | `--var-free-text-surface-padding-block` | Vertical padding |
| `mt-input-gap` | `--var-input-field-hint-margin-block-start` | Gap before error and feedback |
| `border-input-border` | `--var-color-input` | Border color |
| `text-input-label-text` | `--var-input-field-label-font-size` | Label font size, not color |
| `text-foreground` | `--var-color-foreground` | Input text color |
| `text-primary` | `--var-color-primary` | Hover and focus accent |
| `text-danger` | `--var-color-danger` | Error color |
| `text-disabled` | `--var-color-disabled` | Disabled color |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground` | Placeholder |
| `placeholder-input-mask-error` | `--var-free-text-error-placeholder-foreground` | Error placeholder |

## Examples

### Basic text input

```tsx
import { Input } from "@g4rcez/components/input";
<Input name="name" title="Full name" placeholder="Jane Smith" required />;
```

### Phone number mask

```tsx
<Input name="phone" title="Phone" mask="(99) 99999-9999" placeholder="(00) 00000-0000" />
```

### Currency input

```tsx
<Input name="price" title="Price" mask="currency" currency="USD" locale="en-US" placeholder="0.00" />
```

### Dynamic mask (CPF / CNPJ)

```tsx
const docMask = (value: string) => (value.replace(/\D/g, "").length <= 11 ? "999.999.999-99" : "99.999.999/9999-99");
<Input name="document" title="CPF or CNPJ" mask={docMask} placeholder="000.000.000-00" />;
```

### Button-compatible sizes

```tsx
<div className="flex items-end gap-2">
    {" "}
    <Input size="small" title="Search" placeholder="Search records" /> <Button size="small">Search</Button>
</div>
```

`big`, `default`, `min`, `small`, and `tiny` match the control heights of the `Button` sizes with the same name. `normal` is the default and matches `default`.

### Input with inline left/right slots

```tsx
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
<Input name="search" title="Search" left={<MagnifyingGlassIcon size={16} className="text-muted-foreground" />} placeholder="Type to search..." />;
```

### Input with error and feedback

```tsx
import { useState } from "react";
import { Input } from "@g4rcez/components/input";
function EmailField() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | undefined>();
    return (
        <>
            {" "}
            <p id="email-hint">Use the address where you want to receive receipts.</p>{" "}
            <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                title="Email"
                required
                aria-describedby="email-hint"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) =>
                    setError(
                        e.currentTarget.validity.valid
                            ? undefined
                            : e.currentTarget.validity.valueMissing
                              ? "Enter your email address."
                              : "Enter an email address such as name@example.com."
                    )
                }
                error={error}
                feedback={!error && email ? "Format is checked when you leave this field." : undefined}
            />{" "}
        </>
    );
}
```

An error hides `feedback`. The hint stays visible. Browser format validation does not confirm that the address exists.

### Password visibility composed with Button

```tsx
import { useState } from "react";
import { Input } from "@g4rcez/components/input";
import { Button } from "@g4rcez/components/button";
function PasswordField() {
    const [visible, setVisible] = useState(false);
    return (
        <Input
            name="password"
            title="Password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            right={
                <Button type="button" theme="ghost-neutral" onClick={() => setVisible((value) => !value)}>
                    {" "}
                    {visible ? "Hide password" : "Show password"}{" "}
                </Button>
            }
        />
    );
}
```

This is a consumer composition, not a built-in toggle. The changing action name does not use `aria-pressed`. Verify value, button focus, touch targeting, and password-manager behavior in the consuming form.

### Enter-to-advance between fields

```tsx
function NameFields() {
    return (
        <>
            <Input name="first" title="First name" enterKeyHint="next" next="last" />
            <Input name="last" id="last" title="Last name" enterKeyHint="done" />
        </>
    );
}
```

### Inside a form

```tsx
import type { FormEvent } from "react";
import { Button } from "@g4rcez/components/button";
import { Form } from "@g4rcez/components/form";
import { Input } from "@g4rcez/components/input";

function SignUpForm() {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(Object.fromEntries(data));
    };

    return (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-base max-w-md">
            <Input name="name" title="Full name" required />
            <Input name="email" type="email" title="Email" required />
            <Input name="phone" title="Phone" mask="(99) 99999-9999" />
            <Button type="submit">Sign up</Button>
        </Form>
    );
}
```

## Interaction design and acceptance criteria

`Input` uses native input types. It has no separate exported components for text, email, search, or password.

| Native type | Consumer responsibilities |
|---|---|
| `text` (default) | Keep a visible label. State length limits. Use `Textarea` for line breaks. |
| `email` | Set `autoComplete="email"` for contact addresses. Use the account identifier value for sign-in. Native checks do not prove delivery or ownership. Use `multiple` only for more than one address, and explain the format. |
| `search` | Label what is searched. Choose submission or live filtering. Show result, empty, and pending feedback. Do not move focus unexpectedly. |
| `password` | Set `autoComplete` to `current-password` or `new-password`. Own the reveal action: use a non-submit `Button` with an updated action name, keep value and focus, allow paste and autofill. Never log or announce the secret. |

### Current behavior and integration limits

- `title` labels the control. The label target is `id`, then `name`, then a generated ID.
- Set an explicit unique `id` for external hints and focus destinations.
- Native `required`, `disabled`, and `readOnly` are forwarded.
- Only explicitly supplied `optionalText` is displayed.
- Placeholder text is supplementary, not a label.
- Label activation by pointer or touch focuses the field. Native editing, `Tab`, and `Shift+Tab` stay available.
- `Enter` follows the form submission behavior. Exception: when `enterKeyHint="next"` and `next` resolve to a focusable target, `Enter` focuses that target. Explain this override. Do not intercept ordinary editing keys.
- On focus, CSS changes the containing border to the primary color and eases in a ring (`--var-color-ring`, `--var-free-text-focus-ring-width`) over `--var-motion-duration-fast`. `prefers-reduced-motion` turns the transition off.
- On touch devices (`pointer: coarse`) typed text is at least 16px, so iOS Safari does not zoom the page on focus.
- Verify contrast, read-only and disabled states, target sizes, zoom, and visibility above the virtual keyboard in the actual theme and layout.
- A populated `error` sets `aria-invalid` and adds its message ID to `aria-describedby`. Caller IDs stay in `aria-describedby`.
- An explicit caller `aria-invalid` stays when neither state applies.
- Native invalidity is exposed after interaction, while blurred. It generates no error text.
- A custom `error` does not call `setCustomValidity` and does not block submission. The form handler MUST enforce its rules.
- `InputField` renders error text with `role="alert"` and hides feedback during errors.
- Keep essential hints outside `feedback`. Link them with `aria-describedby`. Do not add duplicate live announcements.
- `Input` has no built-in search-result region, clear or reveal control, error-summary component, or application-level focus recovery.

## Do

- Use `mask` patterns that match the data type.
- Set a `placeholder` with the expected format (for example `"(00) 00000-0000"`).
- Use `error` for validation messages.
- Use `next` with `enterKeyHint="next"` for mobile keyboard flows.
- Use design-token classes on wrappers (`bg-background`, `text-foreground`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use a mask that blocks valid input variations. Use dynamic masks for variable-length formats.
- Don't send masked display values to a backend that expects raw data. Strip the formatting first.
- Don't use `Input` for long-form text. Use `Textarea`.

## Accessibility

- Renders a semantic `<input>` in a `<fieldset>` with an associated `<label>` (via `InputField`).
- Props set `aria-disabled`, `aria-readonly`, and `aria-busy`.
- A custom error shows in a visible `<p>` below the field.
- Native validation styling starts after first focus (`data-initialized="true"`).

## Data Attributes

- `data-initialized`: `initializeInputDataset` sets `"true"` on focus. This enables native validation styling after blur. Mount does not set `"false"`.
- `data-next`: set from `next`.
- `data-component="input"`: set on the outer `fieldset` by `InputField`.
- `data-error`: on the `fieldset`. `"true"` when an `error` string is present.

## Notes

- Built on `the-mask-input`. All its mask features work.
- The component manages cursor position during masked input.
- Works controlled (`value` + `onChange`) and uncontrolled (`defaultValue`).
- `Input` comes from the `createFreeText` factory, which also builds `Textarea`. Both share the same styling tokens.

## Verification

Acceptance criteria for tests and reviews: [verify/Input.md](verify/Input.md).
