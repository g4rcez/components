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

When you load styles individually, import the visibility-wrapper styles with Alert and its foundation dependencies:

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/polymorph.css";
@import "@g4rcez/components/resizable.css";
@import "@g4rcez/components/collapse.css";
@import "@g4rcez/components/alert.css";
```

## Props

|Prop|Type|Default|Description|
|---|---|---|---|
|`theme`|`"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral"`|`"neutral"`|Visual theme. `warn` and `danger` also set the alert role.|
|`title`|`string`|—|Alert heading text.|
|`Icon`|`React.ReactElement`|—|Custom icon. Replaces the default theme icon.|
|`open`|`boolean`|`true`|Controls visibility with collapse animation.|
|`onClose`|`(nextState: boolean) => void`|—|Called on close-button click. Omit to hide the button.|
|`container`|`string`|—|Extra classes for the outer wrapper.|
|`as`|`React.ElementType`|`"div"`|Polymorphic root element.|
|`className`|`string`|—|Extra classes for the alert element.|
|`children`|`React.ReactNode`|—|Alert body content.|

## Design Tokens

- Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides remain unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

|Override|Library default|
|---|---|
|`--var-alert-surface-radius`|`calc(var(--var-radius-base) / 4)`|
|`--var-alert-surface-padding`|`calc(var(--var-spacing-base) * 1)`|
|`--var-alert-content-gap`|`calc(var(--var-spacing-base) / 2)`|
|`--var-alert-close-inset-inline-end`|`calc(var(--var-spacing-base) * 0.75)`|

|Token|CSS Variable|Purpose|
|---|---|---|
|`bg-alert-{theme}-bg`|`--var-alert-{theme}-background`|Background for `primary`, `info`, `warn`, `danger`, `success`|
|`text-alert-{theme}-text`|`--var-alert-{theme}-foreground`|Text for `primary`, `info`, `warn`, `danger`, `success`|
|`border-alert-{theme}-border`|`--var-alert-{theme}-border`|Border for `primary`, `info`, `warn`, `danger`, `success`|
|`bg-alert-secondary-bg`, `border-alert-secondary-border`|`--var-color-secondary`|Secondary background and border|
|`text-alert-secondary-text`|`--var-color-secondary-foreground`|Secondary text|
|`bg-alert-neutral-bg`|`--var-color-background`|Neutral background|
|`text-alert-neutral-text`, `text-foreground`|`--var-color-foreground`|Neutral text and close button color|
|`border-alert-neutral-border`|`--var-color-border`|Neutral border|
|`border-card-border`|`--var-card-border`|Card border utility; not the Alert neutral border|
|`text-danger`|`--var-color-danger`|Close button hover color|

## Themes

Each theme maps to a set of `bg-alert-{theme}-*` tokens. Some themes have a default icon:

|Theme|Default Icon|
|---|---|
|`success`|`CheckCircleIcon`|
|`info`|`InfoIcon`|
|`danger`|`WarningIcon`|
|`warn`|—|
|`primary` / `secondary` / `muted` / `neutral`|—|

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

- Use `theme` to match message severity: `danger` for errors, `success` for completions, `warn` for cautions.
- Provide a concise, descriptive `title`.
- Supply `onClose` when users must be able to dismiss the alert.
- Use design-token classes for wrapper elements (`bg-background`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use `theme` or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use `danger` or `warn` for routine information. Both use the assertive alert role. Use `info`, `success`, or another status theme.
- Don't omit `onClose` when the alert must be dismissible. The close button renders only when `onClose` is set.

## Interaction design and acceptance criteria

- Use `Alert` for feedback that stays near the affected task.
- State in text what happened, its consequence, and any next action. Color and icons are supplementary.
- `Alert` has no auto-dismiss timer and no outside-click dismissal.
- Keep critical information until the user resolves or dismisses it. Keep unresolved errors beside their fields.
- `danger` and `warn` render `role="alert"`. Every other theme renders `role="status"`.
- Do not use an urgent theme only for its color.
- The component sets `role` after it spreads consumer props. A consumer `role` cannot change this policy.
- Do not use `Alert` for decorative copy that needs no live-region semantics.
- A new message MUST NOT steal focus.
- Native Tab order reaches the close button (when present) and consumer actions. The banner itself is not a Tab stop.
- Use existing `Button` controls with meaningful names for actions. Verify visible focus and comfortable touch targets.
- There is no built-in focus transfer when the banner closes.
- `onClose` requests `false`. The consumer MUST update `open`.
- When dismissal removes the focused button, send focus to a predictable surviving control.
- Hidden content is removed after exit. `aria-hidden` does not make content keyboard-inert. Verify the transition leaves no reachable hidden controls.
- Form summaries do not associate errors with fields. The application owns those descriptions and correction links.
- A provided title is always an `h4`. The heading level is not configurable. The title is not an automatic accessible-name association. Check it against the page outline.
- Default icons are decorative. A custom `Icon` is not hidden from assistive technologies automatically.
- At 200% text size and a 320 CSS-pixel viewport, check long titles and messages, action wrapping, and overlap with the absolutely positioned close control.
- Verify live-region delivery with assistive technology.

## Accessibility

- `role="alert"` for `danger`/`warn`. `role="status"` for other themes.
- The role expresses urgency. It does not guarantee when a screen reader speaks the message.
- A supplied title renders as `h4`. The consumer checks the surrounding heading hierarchy.
- The close button is a native button with a localized accessible name and a decorative icon.
- The visibility wrapper exposes `aria-hidden`. This alone does not suppress keyboard focus.
- Collapse removes content after the exit lifecycle.

## Data Attributes

- `data-component="alert"`: outer wrapper element.
- `data-theme`: current theme variant (e.g. `"danger"`).
- `data-open`: current visibility state (`"true"` / `"false"`).

## Notes

- Animation uses `Collapse` and its nested `Resizable`. The collapse wrapper fades out with a 0.35 s tween before removal.
- When `open` becomes `false`, the alert collapses. `AnimatePresence` then removes it from the DOM.
- The component is polymorphic. Pass `as="section"` or any other element type in `as`.

## Verification

Acceptance criteria for tests and reviews: [verify/Alert.md](verify/Alert.md).
