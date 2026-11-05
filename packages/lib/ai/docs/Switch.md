---
title: Switch
description: Toggle switch for switching between two mutually exclusive states such as On/Off.
package: "@g4rcez/components"
export: "{ Switch }"
import: "import { Switch } from '@g4rcez/components/switch'"
category: form
---

# Switch

Toggle switch for two mutually exclusive states such as On/Off.

## Import

```tsx
import { Switch } from "@g4rcez/components/switch";
```

## Props

Inherits all standard HTML `input[type="checkbox"]` attributes, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Label next to the switch. |
| `onCheck` | `(nextValue: boolean) => void` | — | Called with the new boolean value after toggling. |
| `error` | `string` | — | Error message below the switch. It wraps within the available width. |
| `loading` | `boolean` | `false` | Disables the switch. Adds no busy or status announcement. |
| `container` | `string` | — | Extra CSS classes for the outer `<fieldset>`. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"default"` | Shared control size. |
| `aria-label` | `string` | — | Accessible name when no nonempty child label exists. |
| `aria-labelledby` | `string` | — | ID reference for the name when no nonempty child label exists. |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map has the full set. Current plain-CSS geometry examples:

| Override | Library default |
| --- | --- |
| `--var-button-big-height` | `calc(var(--var-spacing-base) * 3)` |
| `--var-button-height` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-button-min-height` | `calc(var(--var-spacing-base) * 1.75)` |
| `--var-button-small-height` | `calc(var(--var-spacing-base) * 2)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `switch-track-background` | `--var-switch-track-background` | Track background when unchecked |
| `switch-track-checked-background` | `--var-switch-track-checked-background` | Track background when checked |
| `switch-thumb-background` | `--var-switch-thumb-background` | Thumb fill when unchecked |
| `switch-thumb-checked-background` | `--var-switch-thumb-checked-background` | Thumb fill when checked |
| `color-ring` | `--var-color-ring` | Focus ring on the toggle button |
| `color-danger` | `--var-color-danger` | Error message color |
| `color-foreground` | `--var-color-foreground` | Label text color |

## Themes

Design tokens drive the switch appearance. Override them in your `@theme` block to change the checked and unchecked colors.

## Examples

### Basic toggle

```tsx
import { Switch } from "@g4rcez/components/switch";
export default function NotificationsToggle() {
    return (
        <Switch defaultChecked onChange={(e) => console.log(e.target.checked)}>
            {" "}
            Enable notifications{" "}
        </Switch>
    );
}
```

### Switch

Without visible label.

```tsx
<Switch aria-label="Enable location sharing" />
```

### Controlled switch

```tsx
import { useState } from "react";
import { Switch } from "@g4rcez/components/switch";
export default function DarkModeToggle() {
    const [enabled, setEnabled] = useState(false);
    return (
        <Switch checked={enabled} onCheck={setEnabled}>
            {" "}
            Dark mode{" "}
        </Switch>
    );
}
```

### With loading state

```tsx
import { Switch } from "@g4rcez/components/switch";
export default function SyncSwitch() {
    return <Switch loading>Syncing data…</Switch>;
}
```

### With error message

```tsx
import { Switch } from "@g4rcez/components/switch";
export default function TermsSwitch() {
    return <Switch error="You must accept the terms to continue">Accept terms and conditions</Switch>;
}
```

### In a settings form

```tsx
import { Switch } from "@g4rcez/components/switch";
export default function PrivacySettings() {
    return (
        <div className="flex flex-col gap-base">
            {" "}
            <Switch defaultChecked onCheck={(v) => updateSetting("emails", v)}>
                {" "}
                Receive marketing emails{" "}
            </Switch>{" "}
            <Switch onCheck={(v) => updateSetting("analytics", v)}>Share analytics data</Switch>{" "}
            <Switch defaultChecked onCheck={(v) => updateSetting("notifications", v)}>
                {" "}
                Push notifications{" "}
            </Switch>{" "}
        </div>
    );
}
```

## Do

- Use `Switch` for actions that take effect immediately, without a "Save" button.
- Give a clear label through `children`.
- Use `onCheck` when you need only the new boolean. It avoids `e.target.checked`.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Switch` to select multiple items. Use `Checkbox` or `MultiSelect`.
- Don't use `Switch` for a long or complex process without extra loading feedback.
- Don't pass raw utility color classes (`bg-green-500`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Interaction design and acceptance criteria

These criteria describe current behavior and consumer design targets. They are not executed accessibility tests.

- Use a switch for a binary setting whose effect starts immediately, such as enabling notifications.
- Use [Checkbox](Checkbox.md) for a choice that awaits submission or confirmation. Use a `Button` for a command.
- The component reports a change. The consumer applies and persists the setting.
- Use a stable label that describes the setting. Do not use a changing action label such as "Turn on"/"Turn off."
- The visible button exposes `role="switch"` and `aria-checked`. It has no mixed state.
- Click, tap, Space, or Enter on the switch button toggles it.
- Tab and Shift+Tab follow the normal focus order of the button. CSS supplies a focus-visible outline.
- The forwarded ref points to the hidden checkbox, not the visual focus target.
- Review touch comfort and focused-state contrast in the chosen theme.
- **Current label limitation:** the `htmlFor` of the visible label targets the hidden checkbox, not the switch button.
- Label activation does not forward explicitly to the `onCheck` handler of the button.
- Do not assume identical callback or persistence behavior for label and button activation, particularly with controlled `checked`.
- Verify the label path before you use the whole label as an immediate-setting target.
- `disabled` and `loading` disable both controls. Neither adds a pending live status.
- `error` is not a live region.
- The consumer owns pending and failure feedback, and rollback to the actual setting value.
- Verify names, on/off state changes, and descriptions with supported assistive technologies. Do not promise a specific announcement.

## Accessibility

- A hidden `<input type="checkbox">` provides native form submission and value reading.
- The visual toggle is `<button role="switch">`. `aria-checked` reflects the current state.
- A nonempty child label names the switch button.
- Without a visible child label, `aria-label` or `aria-labelledby` names the button. These props are not assigned to the hidden checkbox.
- The button uses `type="button"`. A keyboard handler toggles with Space and Enter unless the consumer prevents the default action of the event.
- `error` is associated with the button through `aria-describedby` and sets `aria-invalid`.
- When `loading` or `disabled` is true, the hidden input and the button both receive `disabled`.

## Data Attributes

| Attribute | Element | Value | Description |
| --- | --- | --- | --- |
| `data-component` | `fieldset` | `"switch"` | Identifies the component. |
| `data-checked` | `input`, `button`, thumb `span` | `"true" \| "false"` | Reflects the checked state for CSS targeting. |
| `data-trigger` | `input` | `"change"` | Used internally to track the synthetic change event. |

## Notes

- Uncontrolled mode starts from `defaultChecked`.
- When `checked` is supplied, the parent owns it. `onCheck` proposes the new boolean. The consumer MUST update `checked`.
- After button activation, a bubbling synthetic `change` event is dispatched on the hidden checkbox. A native listener calls a supplied `onChange`.
- Track and thumb transitions use the library motion tokens.

## Verification

Acceptance criteria for tests and reviews: [verify/Switch.md](verify/Switch.md).
