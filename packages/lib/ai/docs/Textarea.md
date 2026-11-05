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

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `Label` | — | Label for the textarea. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Control size inherited from `InputField`. |
| `error` | `string` | — | Error message shown below the field. |
| `loading` | `boolean` | `false` | Sets `aria-busy`; does not disable editing or submission. |
| `rows` | `number` | Native `2` | Initial row count; sets the auto-growth minimum at mount. |
| `next` | `string` | — | ID of the element to focus on Enter; requires `enterKeyHint="next"`. |
| `placeholder` | `string` | — | Placeholder text. |
| `required` | `boolean` | — | Marks the field as required. |
| `className` | `string` | — | Extra CSS classes for the `<textarea>` element. |

## Design Tokens

Shared geometry uses scoped spacing and radius fallbacks. Explicit overrides win. Read [Geometry tokens](geometry-tokens.md) before changing density or looking up library defaults. Override these CSS variables in your theme to customize the component.

| Token | CSS Variable | Purpose |
|---|---|---|
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground` | Placeholder text color |
| `placeholder-input-mask-error` | `--var-free-text-error-placeholder-foreground` | Error placeholder color |
| `text-foreground` | `--var-color-foreground` | Input text color |
| `text-danger` | `--var-color-danger` | Error text color |
| `bg-transparent` | — | Input background (inherits from field wrapper) |
| `group-focus-within:border-primary` | `--var-color-primary` | Border highlight on focus |
| `group-hover:border-primary` | `--var-color-primary` | Border highlight on hover |
| `h-input-height` | `--var-free-text-control-height` | Shared input height token; `rows` controls textarea height |
| `px-input-padding-x` | `--var-free-text-surface-padding-inline` | Horizontal padding |
| `py-input-padding-y` | `--var-free-text-surface-padding-block` | Vertical padding |

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

Pass a specific `error` only after validation finds a problem. Native constraints do not create explanatory message text. The hint stays available while an error shows.

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

Text-field principles adapt Input text and Form validation guidance. They do not claim a published textarea page. Multiline behavior comes from this library's source.

### Use and current limits

- Use `Textarea` for messages, descriptions, or other content that needs line breaks. Use `Input` for single-line names, email, search, and passwords.
- Set a persistent visible `title`, suitable initial `rows`, and required/length instructions before entry. A placeholder is only an example, not a label.
- Click or tap on the associated label focuses the textarea. Native selection, copy/paste, undo, cursor movement, and multiline editing remain available.
- `Tab`/`Shift+Tab` leave the control. `Enter` inserts a line break by default.
- `enterKeyHint="next"` plus a resolving `next` ID makes `Enter` focus that target and prevents the line break. Use it only in an explicitly explained flow.
- `InputField` supplies the label and message layout. `Textarea` generates a stable ID when needed.
- Keep essential hints outside `feedback`: feedback is hidden during errors.
- Error paragraphs use `role="alert"`. Coordinate other announcements to avoid duplication.
- Native `required`, `minLength`, `maxLength`, `disabled`, and `readOnly` are forwarded.
- A custom `error` appears immediately and sets `aria-invalid`. It does not call `setCustomValidity` or prevent saving.
- The consumer owns validation timing, explanatory messages, value preservation, and confirmed correction. There is no built-in character counter or error summary.
- Verify growth/shrink behavior, manual resizing, readable messages, and visibility with zoom or the virtual keyboard open.
- Focus uses a primary-colored field border, not a guaranteed contrast-tested ring.

## Do

- Set a descriptive `title` to label the field.
- Set `rows` from the expected content length.
- Use `Textarea` when users enter more than one line of text.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`, `border-border`).

## Don't

- Don't use `Textarea` for single-line input such as names or emails. Use `Input`.
- Don't fix the height with a `className` such as `h-32`. It breaks auto-resize.
- Don't pass raw color classes (`bg-gray-50`, `border-gray-300`). Use design tokens.
- Don't use arbitrary values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Accessibility

- `InputField` wraps the textarea in a `<fieldset>` with a `<label>` linked via `id`/`for`.
- Caller `aria-describedby` IDs are kept and combined with IDs of populated error and feedback messages.
- A custom `error` sets `aria-invalid`. Native constraint invalidity shows after interaction while the field is blurred. An explicit caller `aria-invalid` is kept when neither state applies.
- Keyboard navigation follows standard `<textarea>` behavior: Tab focuses, Shift+Tab leaves.

## Data Attributes

| Attribute | Element | Value | Description |
|---|---|---|---|
| `data-component` | `InputField` root | `"textarea"` | Identifies the component. |
| `data-error` | `InputField` root | `"true"` / `"false"` | Whether a non-empty custom error was supplied. |
| `data-next` | `<textarea>` | element id | Target element id for Enter-key focus forwarding. |

## Notes

- Auto-growth runs once at mount and on native `input` events. It sets `style.height = "0px"`, then uses the greater of `scrollHeight` and the initial minimum.
- An explicit `rows` value contributes to that minimum.
- Later value, row, width, or font changes are not observed independently.
- With browser `normal` line-height, the native row height applies, not a guessed pixel metric.
- CSS allows vertical resizing by default. A later input event recalculates height. Verify how manual resizing and continued editing interact in the consuming layout.
- The shared `createFreeText` factory builds the component and also powers `Input`. All `InputField` layout features are available: left/right slots, optional text, and feedback.

## Verification

Acceptance criteria for tests and reviews: [verify/Textarea.md](verify/Textarea.md).
