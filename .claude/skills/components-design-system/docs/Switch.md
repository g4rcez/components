---
title: Switch
description: Toggle switch for switching between two mutually exclusive states such as On/Off.
package: "@g4rcez/components"
export: "{ Switch }"
import: "import { Switch } from '@g4rcez/components/switch'"
category: form
---

# Switch

Toggle switch for switching between two mutually exclusive states such as On/Off.

## Import

```tsx
import { Switch } from "@g4rcez/components/switch";
```

## Props

Inherits all standard HTML `input[type="checkbox"]` attributes, plus:

| Prop              | Type                                                           | Default     | Description                                                                                 |
| ----------------- | -------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `children`        | `React.ReactNode`                                              | —           | Label text or element displayed next to the switch.                                         |
| `onCheck`         | `(nextValue: boolean) => void`                                 | —           | Called with the new boolean value after toggling.                                           |
| `error`           | `string`                                                       | —           | Error message displayed below the switch; it wraps within the available width.              |
| `loading`         | `boolean`                                                      | `false`     | Disables the switch while an operation is pending; does not add a busy/status announcement. |
| `container`       | `string`                                                       | —           | Additional CSS classes for the outer `<fieldset>`.                                          |
| `size`            | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"default"` | Shared control size.                                                                        |
| `aria-label`      | `string`                                                       | —           | Accessible name for the visual switch when no nonempty child label is present.              |
| `aria-labelledby` | `string`                                                       | —           | ID reference for the visual switch name when no nonempty child label is present.            |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                    | Library default                        |
| --------------------------- | -------------------------------------- |
| `--var-button-big-height`   | `calc(var(--var-spacing-base) * 3)`    |
| `--var-button-height`       | `calc(var(--var-spacing-base) * 2.5)`  |
| `--var-button-min-height`   | `calc(var(--var-spacing-base) * 1.75)` |
| `--var-button-small-height` | `calc(var(--var-spacing-base) * 2)` |

| Token | CSS Variable                      | Purpose                                 |
| --------------------------------- | --------------------------------------- | ------------------------------- |
| `switch-track-background`         | `--var-switch-track-background`         | Track background when unchecked |
| `switch-track-checked-background` | `--var-switch-track-checked-background` | Track background when checked   |
| `switch-thumb-background`         | `--var-switch-thumb-background`         | Thumb fill when unchecked       |
| `switch-thumb-checked-background` | `--var-switch-thumb-checked-background` | Thumb fill when checked         |
| `color-ring`                      | `--var-color-ring`                      | Focus ring on the toggle button |
| `color-danger`                    | `--var-color-danger`                    | Error message color             |
| `color-foreground`                | `--var-color-foreground`                | Label text color                |

## Themes

The switch appearance is driven entirely by design tokens. Override them in your `@theme` block to change the checked/unchecked colors across the application.

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

Without Visible Label

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

- Use `Switch` for actions that take effect immediately without a "Save" button.
- Provide a clear, descriptive label via `children`.
- Use `onCheck` when you only need the new boolean value — it avoids parsing `e.target.checked`.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Switch` for selecting multiple items from a list — use `Checkbox` or `MultiSelect`.
- Don't use `Switch` when the action involves a long or complex process without additional loading feedback.
- Don't pass raw utility color classes (`bg-green-500`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block instead.

## Interaction design and acceptance criteria

These criteria describe current behavior and consumer design targets, not executed accessibility tests.

- Use a switch for a binary setting whose effect starts immediately, such as enabling notifications. Use [Checkbox](Checkbox.md) for a choice awaiting submission or confirmation, and a `Button` for a command. The component reports a change; the consumer applies and persists the setting.

- Keep a stable label describing the setting, not a changing action such as “Turn on”/“Turn off.” The visible button exposes `role="switch"` and `aria-checked`; it has no mixed state. A nonempty child label names it, otherwise provide `aria-label` or `aria-labelledby`.
- Clicking/tapping the switch button or pressing Space/Enter toggles it. Tab/Shift+Tab follows the button's normal focus order and CSS supplies a focus-visible outline. The forwarded ref points to the hidden checkbox, not the visual focus target. Review touch comfort and focused-state contrast in the chosen theme.
- **Current label limitation:** the visible label's `htmlFor` targets the hidden checkbox, not the switch button. There is no explicit forwarding from label activation to the button's `onCheck` handler. Do not assume identical callback/persistence behavior for label and button activation, particularly with controlled `checked`; verify this path before relying on the whole label as an immediate-setting target.
- `disabled`/`loading` disables both controls but adds no pending live status. `error` is associated with the button via `aria-describedby` and sets `aria-invalid`; it is not a live region. Consumers own pending/failure feedback and rollback to the actual setting value. Verify names, on/off state changes, and descriptions with supported assistive technologies rather than promising a specific announcement.

## Acceptance criteria

1. **Current behavior:** Given an enabled switch button, when it is clicked or tapped, then `onCheck` receives the opposite boolean and a checkbox change event is dispatched; an uncontrolled switch updates, while a controlled switch displays the parent's accepted `checked`.
2. **Current behavior:** Given keyboard focus on the switch button, when Space or Enter is pressed, then it toggles once without submitting its form; Tab/Shift+Tab can continue through the page.
3. **Current behavior:** Given `disabled` or `loading`, when button activation is attempted, then neither control permits an interactive toggle.
4. **Consumer target:** Given a stable setting label and an error or external help, when the switch is inspected and used with supported assistive technology, then its name, switch role, on/off state, and description remain understandable after a change.
5. **Integration target — current label gap:** Given an immediately persisted controlled setting, when either the button or associated label is activated, then the same intended setting is applied and failure restores the real state with feedback. Verify label/callback parity explicitly; current label wiring does not establish it.

## Accessibility

- A hidden `<input type="checkbox">` ensures correct native form submission and value reading.
- The visual toggle is a `<button role="switch">` with `aria-checked` reflecting the current state.
- A nonempty child label names the switch button. When there is no visible child label, `aria-label` or `aria-labelledby` names the button; these props are not assigned to the hidden checkbox.
- An explicit button keyboard handler toggles with Space and Enter unless the consumer prevents the event's default action; the toggle button uses `type="button"`.
- When `loading` or `disabled` is true, both the hidden input and the button receive `disabled`, preventing interaction.

## Data Attributes

| Attribute | Element

| Value            | Description                     |
| ---------------- | ------------------------------- |
| `data-component` | `fieldset` |
| `data-checked` | `input`, `button`, thumb `span` |
| `data-trigger` | `input` |

`"switch"`
Identifies the component.
`"true" \| "false"`
Reflects the checked state for CSS targeting.
`"change"`
Used internally to track the synthetic change event.

## Notes

- In uncontrolled mode, state starts from `defaultChecked`. When `checked` is supplied, it remains parent-owned; `onCheck` proposes the new boolean and the consumer must update `checked`.
- A bubbling synthetic `change` event is dispatched on the hidden checkbox after button activation, and a supplied `onChange` is called through a native listener.
- Track and thumb transitions use the library motion tokens.
