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

`Input` extends all standard HTML `<input>` attributes plus `InputField` layout props:

| Prop             | Type                                                                   | Default    | Description                                                                      |
| ---------------- | ---------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| `mask`           | `AllMasks \| Array<string \| RegExp> \| ((value: string) => AllMasks)` | -          | Input mask pattern                                                               |
| `size`           | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"`         | `"normal"` | Field size; button-compatible names use the same control heights                 |
| `locale`         | `Locales`                                                              | -          | Locale for currency/number formatting                                            |
| `currency`       | `CurrencyCode`                                                         | -          | Currency code when using `mask="currency"`                                       |
| `error`          | `string`                                                               | -          | Error message shown below the field                                              |
| `title`          | `string`                                                               | -          | Field label                                                                      |
| `feedback`       | `Label`                                                                | -          | Success or neutral feedback text below the field                                 |
| `left`           | `Label`                                                                | -          | Content rendered on the left inside the field border                             |
| `right`          | `Label`                                                                | -          | Content rendered on the right inside the field border                            |
| `required`       | `boolean`                                                              | `false`    | Native required constraint; hides explicitly supplied optional label text        |
| `disabled`       | `boolean`                                                              | `false`    | Disabled state                                                                   |
| `loading`        | `boolean`                                                              | `false`    | Sets `aria-busy`; does not disable editing or submission                         |
| `container`      | `string`                                                               | -          | Extra CSS classes for the outer `fieldset`                                       |
| `labelClassName` | `string`                                                               | -          | Extra CSS classes for the label/border wrapper                                   |
| `next`           | `string`                                                               | -          | `id` of the next field to focus when Enter is pressed with `enterKeyHint="next"` |
| `hiddenLabel`    | `boolean`                                                              | `false`    | Visually hides the label but keeps it for screen readers                         |
| `...props`       | `React.InputHTMLAttributes<HTMLInputElement>`                          | -          | All standard input attributes                                                    |

### Mask patterns

| Pattern char | Matches           |
| ------------ | ----------------- |
| `9`          | Digit (0–9)       |
| `A`          | Letter (a–z, A–Z) |
| `S`          | Alphanumeric      |
| `*`          | Any character     |

### Special mask strings

| Value          | Description                                            |
| -------------- | ------------------------------------------------------ |
| `"currency"`   | Currency formatting (requires `locale` and `currency`) |
| `"percentage"` | Percentage input with `%` symbol                       |
| `"decimal"`    | Decimal number formatting                              |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                         | Library default                          |
| ------------------------------------------------ | ---------------------------------------- |
| `--var-input-field-icon-size`                    | `calc(var(--var-spacing-base) * 1)`      |
| `--var-input-field-small-icon-size`              | `calc(var(--var-spacing-base) * 0.875)`  |
| `--var-input-field-small-tooltip-icon-size`      | `calc(var(--var-spacing-base) * 0.6875)` |
| `--var-input-field-small-status-min-inline-size` | `calc( var(--var-spacing-base) * 1.25 )` |

| Token | CSS Variable                    | Purpose                                        |
| ------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| `h-input-height`                | `--var-free-text-control-height`               | Default input height                      |
| `px-input-padding-x`            | `--var-free-text-surface-padding-inline`       | Horizontal padding                        |
| `py-input-padding-y`            | `--var-free-text-surface-padding-block`        | Vertical padding                          |
| `mt-input-gap`                  | `--var-input-field-hint-margin-block-start`    | Gap before error/feedback text            |
| `border-input-border`           | `--var-color-border`                           | Default border color                      |
| `text-input-label-text`         | `--var-input-field-label-font-size`            | Label font size, not color                |
| `text-foreground`               | `--var-color-foreground`                       | Input text color                          |
| `text-primary`                  | `--var-color-primary`                          | Hover/focus border and label accent       |
| `text-danger`                   | `--var-color-danger`                           | Error state border, text, and label color |
| `text-disabled`                 | `--var-color-disabled`                         | Disabled text and border color            |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground`       | Placeholder text color                    |
| `placeholder-input-mask-error`  | `--var-free-text-error-placeholder-foreground` | Error placeholder color                   |

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

`big`, `default`, `min`, `small`, and `tiny` use the same control heights as the matching `Button` sizes. `normal` remains the default input size and has the same height as `default`.

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

The hint remains visible when an error hides `feedback`. Browser format validation does not confirm that the address exists.

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

This is a consumer composition, not a built-in password toggle. The changing action name does not use `aria-pressed`. Verify value preservation, button focus, touch targeting, and password-manager behavior in the consuming form.

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

Choose the native input type that matches the data and browser behavior. `Input` uses native input types; it does not provide separate exported components for text, email, search, or password fields.

| Native type | Use and consumer responsibilities |
| --- | --- |
| `text` (default) | Use for single-line free text. Keep a visible label and explain length limits. Use `Textarea` when users need line breaks. |
| `email` | Set `autoComplete="email"` for contact addresses or the appropriate account identifier for sign-in. Native format checks do not prove delivery or ownership. Use `multiple` only when users need to enter more than one address, and explain the format. |
| `search` | Label what is searched. Choose submission or live filtering, and provide clear result, empty, and pending feedback without moving focus unexpectedly. |
| `password` | Set the appropriate autocomplete value (`current-password` or `new-password`). A reveal action is consumer-owned; use a non-submit `Button` with an updated action name, preserve the value and focus, and allow paste and autofill. Never log or announce the secret. |

### Current behavior and integration limits

- `title` labels the control using `id`, then `name`, then a generated ID. Use an explicit unique `id` for external hints and focus destinations. Native `required`, `disabled`, and `readOnly` are forwarded; only explicitly supplied `optionalText` is displayed. Placeholder text is supplementary, not a label.
- Pointer/touch activation of the associated label should focus the field. Native editing, `Tab`, and `Shift+Tab` remain available. `Enter` follows the form's submission behavior, except when `enterKeyHint="next"` and `next` resolve to a focusable target. Explain that override rather than intercepting ordinary editing keys.
- CSS highlights the containing border on focus; it does not supply the previously documented primary focus ring. Verify contrast, distinguishability of read-only/disabled states, target sizes, zoom, and visibility above the virtual keyboard in the actual theme and layout.
- A populated `error` sets `aria-invalid` and adds its message ID to `aria-describedby`; caller hint IDs are retained. Native invalidity is exposed after focus/blur, but does not generate explanatory error text. A custom `error` does not call `setCustomValidity` or prevent submission: the form handler must enforce its rules.
- `InputField` renders error text with `role="alert"` and hides feedback during errors. Keep essential hints outside `feedback` and link them with `aria-describedby`; do not add duplicate live announcements. There is no built-in search-result region, reusable clear/reveal control, error-summary component, or automatic application-level focus recovery. `loading` marks busy state without disabling the control.

## Acceptance criteria

These are integration targets to verify, not recorded test results or accessibility certification.

1. **Given** a visible title and unique control ID, **when** the label is activated or the field receives keyboard focus, **then** the correct field has visible focus and native editing, paste, and Tab navigation work without a focus trap.
2. **Given** an email field with stated requirements, **when** invalid input is validated, **then** a specific correction message appears without clearing the address; correcting and revalidating removes it without claiming the address exists.
3. **Given** a search field, **when** a query is submitted or filtering settles, **then** result, empty, and pending feedback are available without unexpected focus movement.
4. **Given** a masked password and a consumer-provided visibility button, **when** the button is activated by pointer or keyboard, **then** its name and input type change while the value and button focus remain, no form submission occurs, and the password is not announced.
5. **Given** a persistent hint and a detected error, **when** the field is inspected with assistive technology, **then** its name, type, required/invalid state, hint, and correction text are available; verify announcement timing in the consuming application.
## Do

- Use `mask` patterns that match user expectations for the data type.
- Provide a `placeholder` that shows the expected format (e.g., `"(00) 00000-0000"`).
- Use the `error` prop to surface validation messages from your form library or manual validation.
- Use the `next` prop with `enterKeyHint="next"` to create smooth keyboard flows on mobile.
- Use design-token classes for wrapper elements (`bg-background`, `text-foreground`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use theme props or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use a mask that blocks valid input variations — prefer dynamic masks for formats with variable length.
- Don't forget that the mask formats the display value; if your backend expects raw data, strip formatting before sending.
- Don't use `Input` for long-form text — use `Textarea` instead.

## Accessibility

- Renders a semantic `<input>` wrapped in a `<fieldset>` with an associated `<label>` (via `InputField`).
- `aria-disabled`, `aria-readonly`, and `aria-busy` are set automatically from props.
- Caller-provided `aria-describedby` IDs are preserved and combined with IDs for populated error and feedback messages.
- Custom errors set `aria-invalid`; native constraint invalidity is exposed after interaction while the field is blurred. An explicit caller `aria-invalid` is preserved when neither state applies.
- A supplied custom error appears in a visible `<p>` below the field; native validation styling is enabled after first focus (`data-initialized="true"`).
- Focus is indicated by the containing field border changing to the primary color; verify its visibility and contrast in the consuming theme.
- The `hiddenLabel` prop keeps the label in the accessibility tree while hiding it visually.

## Data Attributes

- `data-initialized` — `initializeInputDataset` sets this to `"true"` on focus, enabling native validation styling after the field is blurred; it does not initialize the attribute to `"false"` at mount.
- `data-next` — set from the `next` prop; used to focus the next field on Enter.
- `data-component="input"` — set on the outer `fieldset` by `InputField`.
- `data-error` — on the `fieldset`: `"true"` when an `error` string is present.

## Notes

- Built on top of `the-mask-input`. All mask features from that library are available.
- The component automatically manages cursor positioning during masked input.
- Works with both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) patterns.
- `Input` is created via the `createFreeText` factory, which also powers `Textarea`. Both share the same styling tokens.

