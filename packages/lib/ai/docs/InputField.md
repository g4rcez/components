---
title: InputField
description: Low-level field wrapper that provides a label, tooltip, error message, feedback text, and left/right slots for any form control.
package: "@g4rcez/components"
export: "{ InputField }"
import: "import { InputField } from '@g4rcez/components'"
category: form
---

# InputField

Low-level field wrapper that provides a label, tooltip, error message, feedback text, and left/right slots for any form control. Most higher-level components (`Input`, `Select`, `Autocomplete`, `DatePicker`, `Textarea`) use `InputField` internally and forward its props automatically.

## Import

```tsx
import { InputField } from "@g4rcez/components";
```

## Props

| Prop             | Type                                                           | Default    | Description                                                                |
| ---------------- | -------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `title`          | `Label`                                                        | -          | Main label text for the field                                              |
| `info`           | `Label`                                                        | -          | Informational text shown in a `Tooltip` icon next to the label             |
| `error`          | `string`                                                       | -          | Error message rendered below the field border                              |
| `feedback`       | `Label`                                                        | -          | Success or neutral feedback message (hidden when `error` is present)       |
| `left`           | `Label`                                                        | -          | Content rendered to the left inside the field border                       |
| `right`          | `Label`                                                        | -          | Content rendered to the right inside the field border                      |
| `rightLabel`     | `Label`                                                        | -          | Content rendered to the right of the label text                            |
| `required`       | `boolean`                                                      | `false`    | Hides optional label text; set the constraint separately on a native child |
| `size`           | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared control size applied to the fieldset and control surface            |
| `optionalText`   | `string`                                                       | `""`       | Explicit text shown for optional fields when provided                      |
| `disabled`       | `boolean`                                                      | `false`    | Applies disabled styling to the wrapper and label                          |
| `interactive`    | `boolean`                                                      | `false`    | Sets `data-interactive` on the fieldset                                    |
| `container`      | `string`                                                       | -          | Extra CSS classes for the outer `<fieldset>`                               |
| `labelClassName` | `string`                                                       | -          | Extra CSS classes for the inner label/border wrapper `<div>`               |
| `hiddenLabel`    | `boolean`                                                      | `false`    | Visually hides the label row while keeping it accessible                   |
| `reportStatus`   | `boolean`                                                      | -          | Show `CheckCircle`/`XCircle` icons alongside the label based on validity   |
| `componentName`  | `string`                                                       | -          | Sets `data-component` on the fieldset (e.g., `"input"`, `"select"`)        |
| `id`             | `string`                                                       | -          | `id` linked to the inner control via `htmlFor` on the label                |
| `name`           | `string`                                                       | -          | Fallback for `id` when `id` is not provided                                |
| `children`       | `React.ReactNode`                                              | -          | The actual form control (input, select, etc.)                              |

## Design Tokens

Shared geometry uses scoped spacing/radius fallbacks; explicit overrides win. Read [Geometry tokens](geometry-tokens.md) before changing density or looking up library defaults. Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable            | Purpose                                     |
| ----------------------- | ------------------------------------------- | -------------------------------------------- |
| `border-input-border`   | `--var-color-border`                        | Default field border color                   |
| `text-input-label-text` | `--var-input-field-label-font-size`         | Label font size, not color                   |
| `text-primary`          | `--var-color-primary`                       | Label and border color on focus/hover        |
| `text-danger`           | `--var-color-danger`                        | Label, border, and error text in error state |
| `text-disabled`         | `--var-color-disabled`                      | Label and border color when disabled         |
| `mt-input-gap`          | `--var-input-field-hint-margin-block-start` | Gap before error/feedback text               |

## Examples

### Wrapping a native input

```tsx
import { InputField } from "@g4rcez/components";
<InputField title="Username" name="username" required>
    {" "}
    <input id="username" name="username" required className="h-input-height w-full flex-1 bg-transparent px-input-padding-x text-foreground" />
</InputField>;
```

### With info tooltip and error

```tsx
import { MagnifyingGlassIcon, CheckIcon } from "@phosphor-icons/react";
<>
    <p id="api-key-hint">Use the secret API key from your developer portal.</p>
    <InputField
        title="API Key"
        name="api_key"
        info="Your secret API key from the developer portal."
        error={apiKeyError}
        left={<MagnifyingGlassIcon aria-hidden="true" size={16} className="text-muted-foreground" />}
        right={isValid ? <CheckIcon aria-hidden="true" size={16} className="text-success" /> : null}
        required
    >
        {" "}
        <input
            id="api_key"
            name="api_key"
            type="password"
            required
            aria-invalid={!!apiKeyError}
            aria-describedby="api-key-hint api_key-error"
            className="h-input-height w-full flex-1 bg-transparent px-input-padding-x text-foreground"
        />
    </InputField>
</>;
```

### Optional vs required

```tsx
{
    /* Required — explicitly supplied optional text is hidden */
}
<InputField title="Email" name="email" required>
    {" "}
    <input id="email" name="email" type="email" required className="h-input-height w-full flex-1 bg-transparent px-input-padding-x text-foreground" />
</InputField>;
{
    /* Optional — show the badge by supplying optionalText */
}
<InputField title="Website" name="website" optionalText="Optional">
    {" "}
    <input id="website" name="website" type="url" className="h-input-height w-full flex-1 bg-transparent px-input-padding-x text-foreground" />
</InputField>;
```

### Hidden label (accessible)

```tsx
<InputField title="Search" name="search" hiddenLabel>
    {" "}
    <input
        id="search"
        name="search"
        type="search"
        placeholder="Search..."
        className="h-input-height w-full flex-1 bg-transparent px-input-padding-x text-foreground"
    />
</InputField>
```

### Feedback after validation

```tsx
<InputField
    title="Slug"
    name="slug"
    feedback={isAvailable ? "This slug is available." : undefined}
    error={!isAvailable ? "Slug is already taken." : undefined}
    required
>
    {" "}
    <input
        id="slug"
        name="slug"
        required
        aria-invalid={!isAvailable}
        aria-describedby={isAvailable ? "slug-feedback" : "slug-error"}
        className="h-input-height w-full flex-1 bg-transparent px-input-padding-x text-foreground"
    />
</InputField>
```

This example represents a completed availability check. Do not treat a pending or unperformed check as a rejected value.

## Interaction design and acceptance criteria

Use the following integration criteria to verify the component in context.
### Use and current limits

- Prefer `Input`, `Textarea`, or another existing field component when it already provides the control you need. Use `InputField` for the shared label/message layout of a control that those components cannot supply; it does not implement a control or validation engine.
- Supply a persistent `title` and an explicit unique `id` or `name`, matching the native child's `id`. Unlike `Input`/`Textarea`, this wrapper does not generate a control ID, clone children, or forward `required`, `readOnly`, ARIA descriptions, or invalid state to them. Native `required` belongs on the child; `disabled` on the fieldset disables its descendant controls through HTML behavior. `optionalText` is empty by default, not automatically translated "Optional".
- Click/tap on the associated label should focus its control. Preserve native text selection/editing/paste and normal `Tab`/`Shift+Tab` order in the child. Interactive `info`, `left`, and `right` content needs its own name, visible focus, adequate touch area, and non-submitting behavior; verify it does not unexpectedly activate the surrounding label.
- Give essential instructions a persistent visible node and include its ID in the child's `aria-describedby`. `info` is supplemental tooltip content, not an automatically associated field hint. `feedback` is hidden during errors, so it cannot be the only location for instructions needed to correct them.
- With a stable ID, error and feedback paragraphs receive `<id>-error` and `<id>-feedback`. The error paragraph has `role="alert"`; explicit `error` text is displayed immediately, not delayed until interaction. The consumer must set the child's `aria-invalid` and description references, choose when to validate, and clear/update the error after confirmed correction. Native-invalid CSS does not create correction text.
- `reportStatus` icons are decorative CSS indicators of native validity, not proof of server acceptance. The wrapper has no reusable error summary, summary-link focus handling, asynchronous validation ordering, or configurable error announcement role. Avoid duplicate live announcements and verify announcement timing, contrast, zoom, and virtual-keyboard layouts in the consuming application.

## Acceptance criteria

These are integration targets to verify, not recorded test results or accessibility certification. 1. **Given** a visible title and matching wrapper/child ID, **when** the label is clicked or tapped and the child is reached with `Tab`, **then** the intended control receives visible focus, retains native editing, and allows `Tab`/`Shift+Tab` to leave it. 2. **Given** instructions and a detected error, **when** the native child is inspected and reached with assistive technology, **then** it has the label, required/invalid state, and both hint/error description references; correction text is visible and does not depend on a border or status icon alone. 3. **Given** existing values and several errors, **when** one correction is confirmed, **then** only its message and invalid state are removed/updated, values and other errors remain, and focus is not moved during ordinary editing. 4. **Given** an optional/required or disabled wrapper, **when** it is rendered, **then** optional text appears only when explicitly supplied and not required, the child enforces its own required constraint, and disabled descendants cannot be edited or activated. 5. **Given** supplemental tooltip or slot actions, **when** they are operated by pointer, touch, or keyboard, **then** their names and focus are available without submitting the form or redirecting input unexpectedly; desktop/mobile alert behavior is checked without duplicate application announcements.

## Do

- Use `InputField` when building new form controls to ensure consistent label, error, and feedback layout across the application.
- Always provide a `title` for every field so screen readers can identify the control.
- Use the `info` prop for fields that need supplemental explanation without cluttering the label.
- Match the `id` on the inner control to the `name` (or `id`) on `InputField` so the `<label htmlFor>` association works correctly.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) to `InputField` wrappers — use theme props or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use `InputField` for non-form content; it is specifically designed for labeled input controls.
- Don't skip the `title` prop — the label association alone does not give the control descriptive label text.

## Accessibility

- Renders a `<fieldset>` element as the outer wrapper, with `aria-disabled` when disabled.
- The inner `<label>` uses `htmlFor` linked to `id` (or `name`) to associate with the control.
- Error messages render as a `<p role="alert">` with `<id>-error` when `id` or `name` is supplied. Explicit errors are visible immediately; native-invalid CSS applies after interaction to compatible child controls.
- Feedback messages render as a separate `<p>` with `<id>-feedback` and are hidden when an error is present.
- The `info` tooltip is a `type="button"` trigger: a string supplies its accessible name; non-string content uses a description ID. It does not automatically describe the child control.
- `reportStatus` icons use `aria-hidden="true"` since they are supplemental visual indicators.

## Data Attributes

- `data-component` — reflects the `componentName` prop (e.g., `"input"`, `"select"`, `"autocomplete"`).
- `data-error` — `"true"` when an `error` string is present; drives CSS group variants.
- `data-interactive` — `"true"` when `interactive` is set; used for custom interactive state styling.

## Notes

- Stable input-field CSS selectors coordinate hover/focus appearance. `Input` and `Textarea` add the shared free-text border-focus class; a standalone native child needs its own appropriate focus treatment.
- `optionalText` defaults to `""`. Supply localized text explicitly when an optional marker is needed.
- `reportStatus` defaults to the value configured in `useTweaks.input.iconFeedback`, allowing a global default.

```

```
