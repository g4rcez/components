---
title: InputField
description: Low-level field wrapper that provides a label, tooltip, error message, feedback text, and left/right slots for any form control.
package: "@g4rcez/components"
export: "{ InputField }"
import: "import { InputField } from '@g4rcez/components'"
category: form
---

# InputField

Low-level field wrapper that provides a label, tooltip, error message, feedback text, and left/right slots for any form control. `Input`, `Select`, `Autocomplete`, `DatePicker`, and `Textarea` use `InputField` internally and forward its props.

## Import

```tsx
import { InputField } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `Label` | - | Main label text. |
| `info` | `Label` | - | Text in a `Tooltip` icon next to the label. |
| `error` | `string` | - | Error message below the field border. |
| `feedback` | `Label` | - | Success or neutral message. Hidden when `error` is present. |
| `left` | `Label` | - | Content left of the control, inside the border. |
| `right` | `Label` | - | Content right of the control, inside the border. |
| `rightLabel` | `Label` | - | Content right of the label text. |
| `required` | `boolean` | `false` | Hides optional label text. Set the constraint on the native child. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared size for the fieldset and control surface. |
| `optionalText` | `string` | `""` | Text shown for optional fields. Not translated automatically. |
| `disabled` | `boolean` | `false` | Disabled styling for the wrapper and label. |
| `interactive` | `boolean` | `false` | Sets `data-interactive` on the fieldset. |
| `container` | `string` | - | Extra CSS classes for the outer `<fieldset>`. |
| `labelClassName` | `string` | - | Extra CSS classes for the inner label and border `<div>`. |
| `hiddenLabel` | `boolean` | `false` | Hides the label row visually, not from assistive technology. |
| `reportStatus` | `boolean` | - | Shows `CheckCircle`/`XCircle` icons by validity. Default: `useTweaks.input.iconFeedback`. |
| `componentName` | `string` | - | Sets `data-component` on the fieldset (for example `"input"`, `"select"`). |
| `id` | `string` | - | Linked to the control through `htmlFor` on the label. |
| `name` | `string` | - | Fallback for `id`. |
| `children` | `React.ReactNode` | - | The form control (input, select, etc.). |

## Design Tokens

Shared geometry uses scoped spacing and radius fallbacks. Explicit overrides win. Read [Geometry tokens](geometry-tokens.md) before changing density or looking up library defaults. Override these CSS variables in your theme.

| Token | CSS Variable | Purpose |
|---|---|---|
| `border-input-border` | `--var-color-border` | Border color |
| `text-input-label-text` | `--var-input-field-label-font-size` | Label font size, not color |
| `text-primary` | `--var-color-primary` | Label and border color on focus and hover |
| `text-danger` | `--var-color-danger` | Label, border, and error text in error state |
| `text-disabled` | `--var-color-disabled` | Label and border color when disabled |
| `mt-input-gap` | `--var-input-field-hint-margin-block-start` | Gap before error and feedback |

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

This example shows a completed availability check. Do not treat a pending or unperformed check as a rejected value.

## Interaction design and acceptance criteria

Use these integration criteria to verify the component in context.

### Use and current limits

- Prefer `Input`, `Textarea`, or another field component when it provides the control. Use `InputField` for the shared label and message layout of a control those components cannot supply.
- `InputField` implements no control and no validation engine.
- Supply a persistent `title` and a unique `id` or `name` that matches the native child `id`.
- Unlike `Input` and `Textarea`, the wrapper does not generate a control ID. It does not clone children. It does not forward `required`, `readOnly`, ARIA descriptions, or invalid state.
- Put native `required` on the child.
- `disabled` on the fieldset disables descendant controls through HTML behavior.
- Label click or tap focuses the control. Preserve native text selection, editing, paste, and `Tab`/`Shift+Tab` order in the child.
- Interactive `info`, `left`, and `right` content needs its own name, visible focus, adequate touch area, and non-submitting behavior. Verify it does not activate the surrounding label.
- Give essential instructions a persistent visible node. Add its ID to the child `aria-describedby`.
- `info` is supplemental tooltip content. It is not an associated field hint.
- `feedback` is hidden during errors. Do not use it as the only location for correction instructions.
- With a stable ID, the error and feedback paragraphs get `<id>-error` and `<id>-feedback`.
- The error paragraph has `role="alert"`. Explicit `error` text shows immediately, not after interaction.
- The consumer MUST set the child `aria-invalid` and description references, choose when to validate, and clear the error after a confirmed correction.
- Native-invalid CSS does not create correction text.
- `reportStatus` icons are decorative CSS indicators of native validity, not proof of server acceptance.
- The wrapper has no reusable error summary, summary-link focus handling, asynchronous validation ordering, or configurable error announcement role.
- Avoid duplicate live announcements. Verify announcement timing, contrast, zoom, and virtual-keyboard layouts in the consuming application.

## Do

- Use `InputField` for new form controls, for consistent label, error, and feedback layout.
- Provide a `title` for every field so screen readers identify the control.
- Use `info` for supplemental explanation without cluttering the label.
- Match the inner control `id` to the `InputField` `name` (or `id`) so the `<label htmlFor>` association works.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) to `InputField` wrappers. Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use `InputField` for non-form content. It is for labeled input controls.
- Don't skip `title`. The label association alone gives the control no descriptive label text.

## Accessibility

- The outer wrapper is a `<fieldset>` with `aria-disabled` when disabled.
- The inner `<label>` uses `htmlFor` linked to `id` (or `name`).
- Error messages render as `<p role="alert">` with `<id>-error` when `id` or `name` is supplied.
- Native-invalid CSS applies after interaction to compatible child controls.
- Feedback messages render as a separate `<p>` with `<id>-feedback`. They are hidden when an error is present.
- The `info` tooltip is a `type="button"` trigger. A string supplies its accessible name. Non-string content uses a description ID. It does not describe the child control.
- `reportStatus` icons use `aria-hidden="true"`.

## Data Attributes

- `data-component`: reflects `componentName` (for example `"input"`, `"select"`, `"autocomplete"`).
- `data-error`: `"true"` when an `error` string is present. Drives CSS group variants.
- `data-interactive`: `"true"` when `interactive` is set. For custom interactive state styling.

## Notes

- Stable input-field CSS selectors coordinate hover and focus appearance.
- `Input` and `Textarea` add the shared free-text border-focus class. A standalone native child needs its own focus treatment.
- Supply localized `optionalText` when an optional marker is needed.

## Verification

Acceptance criteria for tests and reviews: [verify/InputField.md](verify/InputField.md).
