---
title: Alert
description: Collapsible, themed alert banner for displaying important messages and status updates.
package: "@g4rcez/components"
export: "{ Alert }"
import: "import { Alert } from '@g4rcez/components/alert'"
category: display
---

# Alert

Collapsible, themed alert banner for displaying important messages and status updates.

## Import

```tsx
import { Alert } from "@g4rcez/components/alert";
```

## Props

| Prop        | Type                                                                                            | Default     | Description                                                    |
| ----------- | ----------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `theme`     | `"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral"` | `"neutral"` | Visual theme; `warn`/`danger` also choose the alert role       |
| `title`     | `string`                                                                                        | —           | Alert heading text                                             |
| `Icon`      | `React.ReactElement`                                                                            | —           | Custom icon element (overrides default theme icon)             |
| `open`      | `boolean`                                                                                       | `true`      | Controls visibility with collapse animation                    |
| `onClose`   | `(nextState: boolean) => void`                                                                  | —           | Callback when close button is clicked; omit to hide the button |
| `container` | `string`                                                                                        | —           | Additional classes for the outer wrapper                       |
| `as`        | `React.ElementType`                                                                             | `"div"`     | Polymorphic root element                                       |
| `className` | `string`                                                                                        | —           | Additional classes for the alert element                       |
| `children`  | `React.ReactNode`                                                                               | —           | Alert body content                                             |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                             | Library default                        |
| ------------------------------------ | -------------------------------------- |
| `--var-alert-surface-radius`         | `calc(var(--var-radius-base) / 4)`     |
| `--var-alert-surface-padding`        | `calc(var(--var-spacing-base) * 1)`    |
| `--var-alert-content-gap`            | `calc(var(--var-spacing-base) / 2)`    |
| `--var-alert-close-inset-inline-end` | `calc(var(--var-spacing-base) * 0.75)` |

| Token | CSS Variable                                             | Purpose                            |
| -------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `bg-alert-{theme}-bg`                                    | `--var-alert-{theme}-background`   | Background for `primary`, `info`, `warn`, `danger`, `success` |
| `text-alert-{theme}-text`                                | `--var-alert-{theme}-foreground`   | Text for `primary`, `info`, `warn`, `danger`, `success`       |
| `border-alert-{theme}-border`                            | `--var-alert-{theme}-border`       | Border for `primary`, `info`, `warn`, `danger`, `success`     |
| `bg-alert-secondary-bg`, `border-alert-secondary-border` | `--var-color-secondary`            | Secondary background and border                               |
| `text-alert-secondary-text`                              | `--var-color-secondary-foreground` | Secondary text                                                |
| `bg-alert-neutral-bg`                                    | `--var-color-background`           | Neutral background                                            |
| `text-alert-neutral-text`, `text-foreground`             | `--var-color-foreground`           | Neutral text and close button color                           |
| `border-alert-neutral-border`                            | `--var-color-border`               | Neutral border                                                |
| `border-card-border`                                     | `--var-card-border`                | Card border utility; not the Alert neutral border             |
| `text-danger`                                            | `--var-color-danger`               | Close button hover color |

Themes:`primary`, `secondary`, `info`, `warn`, `danger`, `success`, `muted`, `neutral`.

## Themes

Each theme maps to a set of `bg-alert-{theme}-*` tokens and provides default icons for some variants:

| Theme                                         | Default Icon      |
| --------------------------------------------- | ----------------- |
| `success`                                     | `CheckCircleIcon` |
| `info`                                        | `InfoIcon`        |
| `danger`                                      | `WarningIcon`     |
| `warn`                                        | —                 |
| `primary` / `secondary` / `muted` / `neutral` | —                 |

## Examples

### Basic Variants

```tsx
<>
    <Alert theme="info" title="Information">
        {" "}
        This is an informational message.
    </Alert>{" "}
    <Alert theme="success" title="Success">
        {" "}
        Your changes have been saved successfully.
    </Alert>{" "}
    <Alert theme="warn" title="Warning">
        {" "}
        Please review your input before proceeding.
    </Alert>{" "}
    <Alert theme="danger" title="Error">
        {" "}
        Something went wrong. Please try again.
    </Alert>
</>
```

### With Custom Icon

```tsx
import { BellIcon } from "@phosphor-icons/react";
<Alert theme="info" title="Notification" Icon={<BellIcon size={20} />}>
    {" "}
    You have new messages.
</Alert>;
```

### Dismissible Alert

```tsx
const [showAlert, setShowAlert] = useState(true);
<Alert theme="success" title="Welcome!" open={showAlert} onClose={() => setShowAlert(false)}>
    {" "}
    Thanks for joining our platform.
</Alert>;
```

### Rich Content

```tsx
import { Button } from "@g4rcez/components/button";
<Alert theme="info" title="Update Available">
    {" "}
    <p>A new version of the application is available.</p>{" "}
    <div className="mt-3 flex gap-2">
        {" "}
        <Button theme="primary" size="small">
            {" "}
            Update Now{" "}
        </Button>{" "}
        <Button theme="neutral" size="small">
            {" "}
            Later{" "}
        </Button>{" "}
    </div>
</Alert>;
```

### Form Validation

```tsx
const [errors, setErrors] = useState<string[]>([]);
<Alert theme="danger" title="Validation Errors" open={errors.length > 0}>
    {" "}
    <ul className="list-disc list-inside space-y-1">
        {" "}
        {errors.map((error, index) => (
            <li key={index}>{error}</li>
        ))}{" "}
    </ul>
</Alert>;
```

## Do

- Use `theme` to match message severity (`danger` for errors, `success` for completions, `warn` for cautions).
- Provide a concise, descriptive `title` so users immediately understand the alert.
- Supply `onClose` when the alert should be user-dismissible.
- Use design-token classes for any wrapper elements (`bg-background`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use `theme` or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use `danger` or `warn` for routine information — both use the assertive alert role. Use `info`, `success`, or another status theme instead.
- Don't omit `onClose` if the alert must be dismissible — the close button only renders when the prop is provided.

## Interaction design and acceptance criteria

- Use `Alert` for relevant feedback that should stay near the affected task. State what happened, its consequence, and any useful next action in text; color and icons are supplementary. It has no auto-dismiss timer or outside-click dismissal. Keep critical information present until resolved or deliberately dismissed, and retain unresolved errors beside their fields.

- Urgency is part of the current theme contract: `danger` and `warn` render `role="alert"`; every other theme renders `role="status"`. Routine information should not use an urgent theme merely for its color. The component sets `role` after spreading consumer props, so passing a different role cannot change this policy. Do not use it for decorative copy that should have no live-region semantics.
- An appearing message should not steal focus. Native Tab order reaches the close button, when present, and consumer actions; reading the banner does not require making it a Tab stop. Use existing `Button` controls with meaningful names for actions, and verify visible focus and comfortable touch targets. There is no built-in focus transfer when the banner closes.
- `onClose` requests `false`; the consumer must update `open` and send focus to a predictable surviving control if dismissal removes the focused button. Hidden content is removed after exit, but `aria-hidden` is not a keyboard-inert mechanism. Verify the transition does not leave reachable hidden controls. Form summaries do not automatically associate their errors with fields; the application owns those descriptions and correction links.
- A provided title is always an `h4`, not a configurable heading level or an automatic accessible-name association. Check it against the page outline. Default icons are decorative; a custom `Icon` is not automatically hidden from assistive technologies. At 200% text size and a 320 CSS-pixel viewport, check long titles/messages, action wrapping, and the absolutely positioned close control for overlap. Actual live-region delivery requires assistive-technology verification.

## Acceptance criteria

These are application design targets to verify, not tested announcement guarantees. 1. **Given** routine information or an urgent dynamic warning, **when** the appropriate theme is rendered, **then** the DOM uses `status` or `alert` respectively and the wording communicates severity without relying on color. 2. **Given** a message appears during a task, **when** users continue with keyboard or touch, **then** focus stays on the task and any banner actions are named, visible, and independently operable. 3. **Given** a dismissible alert with focus on close, **when** Enter/Space or a pointer activates it, **then** the consumer sets `open` to false and focus moves to a predictable surviving control; hidden descendants are no longer reachable after exit. 4. **Given** a validation summary, **when** a user follows an error to its field, **then** the field retains a programmatic error description and the unresolved error remains available after the summary is dismissed. 5. **Given** long text, zoom, or a narrow viewport, **when** the message is read and its controls used, **then** all content and controls remain visible/reachable without close-button overlap.

## Accessibility

- Uses `role="alert"` for `danger`/`warn` and `role="status"` for other themes. The markup expresses urgency; it does not guarantee when a screen reader speaks the message.
- A supplied title renders as `h4`; the consumer must check the surrounding heading hierarchy.
- The close button is a native button with a localized accessible name and decorative icon.
- The visibility wrapper exposes `aria-hidden`; this alone does not suppress keyboard focus. Collapse removes content after the exit lifecycle.

## Data Attributes

- `data-component="alert"` — outer wrapper element.
- `data-theme` — current theme variant (e.g. `"danger"`).
- `data-open` — current visibility state (`"true"` / `"false"`).

## Notes

- Animation uses `Collapse` and its nested `Resizable`; the collapse wrapper fades out with a 0.35 s tween before removal.
- When `open` becomes `false`, the alert collapses and is removed from the DOM via `AnimatePresence`.
- The component is polymorphic — pass `as="section"` or any other element type via the `as` prop.
