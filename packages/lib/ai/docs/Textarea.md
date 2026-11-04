---
title: Textarea
description: Auto-growing multi-line text input built on the InputField foundation.
package: "@g4rcez/components"
export: "{ Textarea }"
import: "import { Textarea } from '@g4rcez/components'"
category: form
---

# Textarea

Auto-growing multi-line text input built on the InputField foundation.

## Import

```tsx
import { Textarea } from "@g4rcez/components";
```

## Props

Inherits all `InputField` props and standard HTML `<textarea>` attributes, plus:

| Prop          | Type                                                           | Default    | Description                                                                             |
| ------------- | -------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `title`       | `Label`                                                        | —          | Label for the textarea.                                                                 |
| `size`        | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared control size inherited from `InputField`.                                        |
| `error`       | `string`                                                       | —          | Error message displayed below the field.                                                |
| `loading`     | `boolean`                                                      | `false`    | Sets `aria-busy`; does not disable editing or submission.                               |
| `rows`        | `number`                                                       | Native `2` | Initial row count; establishes the auto-growth minimum at mount. Browser `normal` line-height uses the native row height rather than a guessed pixel metric. |
| `next`        | `string`                                                       | —          | ID of the next element to focus when Enter is pressed (requires `enterKeyHint="next"`). |
| `placeholder` | `string`                                                       | —          | Placeholder text.                                                                       |
| `required`    | `boolean`                                                      | —          | Marks the field as required.                                                            |
| `className`   | `string`                                                       | —          | Additional CSS classes for the `<textarea>` element.                                    |

## Design Tokens

Shared geometry uses scoped spacing/radius fallbacks; explicit overrides win. Read [Geometry tokens](geometry-tokens.md) before changing density or looking up library defaults. Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable                        | Purpose                                        |
| ----------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `placeholder-input-placeholder`     | `--var-free-text-placeholder-foreground`       | Placeholder text color                                             |
| `placeholder-input-mask-error`      | `--var-free-text-error-placeholder-foreground` | Error placeholder color                                            |
| `text-foreground`                   | `--var-color-foreground`                       | Input text color                                                   |
| `text-danger`                       | `--var-color-danger`                           | Error text color                                                   |
| `bg-transparent`                    | —                                              | Input background (inherits from field wrapper)                     |
| `group-focus-within:border-primary` | `--var-color-primary`                          | Border highlight on focus                                          |
| `group-hover:border-primary`        | `--var-color-primary`                          | Border highlight on hover                                          |
| `h-input-height`                    | `--var-free-text-control-height`               | Shared input height token; textarea height is controlled by `rows` |
| `px-input-padding-x`                | `--var-free-text-surface-padding-inline`       | Horizontal padding                                                 |
| `py-input-padding-y`                | `--var-free-text-surface-padding-block`        | Vertical padding                                                   |

## Examples

### Basic usage

```tsx
import { Textarea } from "@g4rcez/components";
export default function BioField() {
    return <Textarea title="Bio" name="bio" placeholder="Tell us about yourself…" rows={4} onChange={(e) => console.log(e.target.value)} />;
}
```

### With validation error

```tsx
import { Textarea } from "@g4rcez/components";
export default function MessageField({ error }: { error?: string }) {
    return (
        <>
            {" "}
            <p id="message-hint">Describe the issue in at least 10 characters, up to 500 characters.</p>{" "}
            <Textarea
                id="message"
                title="Message"
                name="message"
                required
                minLength={10}
                maxLength={500}
                aria-describedby="message-hint"
                error={error}
                placeholder="Enter your message…"
            />{" "}
        </>
    );
}
```

Pass a specific `error` only after validation detects a problem. Native constraints do not automatically create explanatory message text; the hint remains available while an error is shown.

### Monospace styling for code

```tsx
import { Textarea } from "@g4rcez/components";
export default function CssSnippetField() {
    return <Textarea title="CSS Snippet" name="css" className="font-mono text-sm" rows={6} placeholder="body { margin: 0; }" />;
}
```

### Focus-next navigation

```tsx
import type { FormEvent } from "react";
import { Textarea } from "@g4rcez/components";
import { Form } from "@g4rcez/components/form";
import { Button } from "@g4rcez/components/button";
export default function MultiFieldForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
    return (
        <Form onSubmit={onSubmit} className="flex flex-col gap-base">
            {" "}
            <p id="description-hint">Press Enter to move to Submit; this flow replaces ordinary line-break entry.</p>{" "}
            <Textarea
                title="Description"
                name="description"
                aria-describedby="description-hint"
                enterKeyHint="next"
                next="submit-btn"
                rows={3}
                placeholder="Describe the issue…"
            />{" "}
            <Button id="submit-btn" type="submit" theme="primary">
                {" "}
                Submit{" "}
            </Button>{" "}
        </Form>
    );
}
```

## Interaction design and acceptance criteria

This is an adaptation of Input text and Form validation. These are transferable text-field principles, not a claim that publishes a textarea page. Multiline behavior below comes from this library's source.

### Use and current limits

- Choose `Textarea` for messages, descriptions, or other content that needs line breaks; use `Input` for single-line names, email, search, and passwords. Provide a persistent visible `title`, suitable initial `rows`, and any required/length instructions before entry. Placeholder is only an example, not a label.

- Click/tap on the associated label should focus the textarea. Keep native selection, copy/paste, undo, cursor movement, and multiline editing. `Tab`/`Shift+Tab` leave the control; `Enter` inserts a line break by default. The optional `enterKeyHint="next"` plus a resolving `next` ID overrides `Enter` to focus that target and prevent the line break, so use it only in an explicitly explained flow.
- `InputField` supplies the label and message layout; `Textarea` generates a stable ID when needed, merges caller `aria-describedby` IDs with populated message IDs, and exposes custom/native invalid state. Essential hints should stay outside `feedback`, because feedback is hidden during errors. Error paragraphs use `role="alert"`; coordinate other announcements to avoid duplication.
- Native `required`, `minLength`, `maxLength`, `disabled`, and `readOnly` are forwarded. A custom `error` appears immediately and sets `aria-invalid`, but does not call `setCustomValidity` or prevent saving. The consumer owns validation timing, explanatory messages, preservation of values, and confirmed correction; there is no built-in character counter or error summary. `loading` marks busy state without disabling editing.
- Auto-growth runs at mount and on native `input` events, preserving the initial minimum height; CSS permits vertical resizing. Programmatic value/`rows` changes, width changes, and font/layout reflow are not independently observed. Verify growth/shrink behavior, manual resizing, readable messages, and continued visibility with zoom or the virtual keyboard open. Focus uses a primary-colored field border, not a guaranteed contrast-tested ring.

## Acceptance criteria

These are integration targets to verify, not recorded test results or accessibility certification. 1. **Given** a visible title and associated textarea, **when** its label is clicked/tapped or `Tab` reaches it, **then** the intended control receives visible focus and native typing, selection, paste, and `Tab`/`Shift+Tab` exit remain available. 2. **Given** the default multiline flow, **when** `Enter` is pressed, **then** a line break is inserted without submitting; **given** the explicitly explained `next` override and a focusable target, **when** `Enter` is pressed, **then** focus moves to that target without inserting a line break. 3. **Given** initial rows and changing user-entered content, **when** native input events add or remove lines, **then** height accommodates the content without shrinking below the initial minimum; manual resizing, zoom, width reflow, and programmatic updates are checked separately. 4. **Given** required/length guidance and a rejected value, **when** validation reports an error, **then** the text remains for correction, the hint and specific correction message are associated with the textarea, and confirmed revalidation clears only its error without moving editing focus. 5. **Given** an invalid or disabled/read-only textarea, **when** its DOM semantics and desktop/mobile assistive-technology behavior are checked, **then** the label, multiline nature, constraints, applicable state, and descriptions are available, with no redundant application alerts or color-only explanation.

## Do

- Provide a descriptive `title` to label the field.
- Set a sensible initial `rows` value based on the expected content length.
- Use `Textarea` whenever the user is expected to provide more than a single line of text.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`, `border-border`).

## Don't

- Don't use `Textarea` for single-line inputs like names or emails — use `Input` instead.
- Don't fix the height with a `className` like `h-32` if you want the auto-resize behavior to work.
- Don't pass raw utility color classes (`bg-gray-50`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block instead.

## Accessibility

- Rendered inside an `InputField` which wraps the element with `<fieldset>` and a `<label>` linked via `id`/`for`.
- Caller-provided `aria-describedby` IDs are preserved and combined with IDs for populated error and feedback messages.
- Custom errors set `aria-invalid`; native constraint invalidity is exposed after interaction while the field is blurred. An explicit caller `aria-invalid` is preserved when neither state applies.
- Keyboard navigation follows standard `<textarea>` behavior (Tab to focus, Shift+Tab to leave).
- When `enterKeyHint="next"` and a `next` id is provided, pressing Enter moves focus to the target element.

## Data Attributes

| Attribute | Element

| Value            | Description       |
| ---------------- | ----------------- |
| `data-component` | `InputField` root |
| `data-error` | `InputField` root |
| `data-next` | `<textarea>` |

`"textarea"`
Identifies the component.
`"true"` / `"false"`
Whether a non-empty custom error was supplied.
element id
Target element id for Enter-key focus forwarding.

## Notes

- Auto-growth runs once at mount and on native `input` events: it sets `style.height = "0px"` then uses the greater of `scrollHeight` and the initial minimum. An explicit `rows` value contributes to that minimum; later value, row, width, or font changes are not observed independently.
- CSS allows vertical resizing by default. A later input event recalculates height, so verify how manual resizing and continued editing interact in the consuming layout.
- Built via the shared `createFreeText` factory, which also powers the `Input` component — all `InputField` layout features (left/right slots, optional text, feedback, etc.) are available.
