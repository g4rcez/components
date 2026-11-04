---
title: Checkbox
description: Styled checkbox with label support, task mode, error display, loading state, and size variants.
package: "@g4rcez/components"
export: "{ Checkbox }"
import: "import { Checkbox } from '@g4rcez/components/checkbox'"
category: form
---

# Checkbox

Styled checkbox with label support, task mode, error display, loading state, and size variants.

## Import

```tsx
import { Checkbox } from "@g4rcez/components/checkbox";
```

## Props

| Prop             | Type                                                                                  | Default    | Description                                                            |
| ---------------- | ------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `checked`        | `boolean`                                                                             | -          | Controlled checked state                                               |
| `onChange`       | `(e: React.ChangeEvent<HTMLInputElement>) => void`                                    | -          | Change handler                                                         |
| `disabled`       | `boolean`                                                                             | `false`    | Disabled state                                                         |
| `loading`        | `boolean`                                                                             | `false`    | Loading state — disables the checkbox while loading                    |
| `error`          | `string`                                                                              | -          | Error message rendered below the label                                 |
| `indeterminate`  | `boolean`                                                                             | `false`    | Shows the mixed state (a dash), for example on a "select all" checkbox |
| `asTask`         | `boolean`                                                                             | `false`    | Task mode: applies strikethrough to the label when checked             |
| `size`           | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny" \| "medium" \| "large"` | `"normal"` | Checkbox size; the named values map to the library control-size tokens |
| `container`      | `string`                                                                              | -          | Extra CSS classes for the outer `<label>` wrapper                      |
| `labelClassName` | `string`                                                                              | -          | Extra CSS classes for the error text element                           |
| `className`      | `string`                                                                              | -          | Extra CSS classes for the `<input>` element                            |
| `children`       | `React.ReactNode`                                                                     | -          | Label content                                                          |
| `...props`       | `React.InputHTMLAttributes<HTMLInputElement>`                                         | -          | All standard input attributes                                          |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                   | Library default                        |
| -------------------------- | -------------------------------------- |
| `--var-checkbox-label-gap` | `calc(var(--var-spacing-base) * 0.5)`  |
| `--var-button-big-height`  | `calc(var(--var-spacing-base) * 3)`    |
| `--var-button-height`      | `calc(var(--var-spacing-base) * 2.5)`  |
| `--var-button-min-height`  | `calc(var(--var-spacing-base) * 1.75)` |

<<<<<<< Updated upstream
| Override | Library default |
| --- | --- |
| `--var-checkbox-label-gap` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-button-big-height` | `calc(var(--var-spacing-base) * 3)` |
| `--var-button-height` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-button-min-height` | `calc(var(--var-spacing-base) * 1.75)` |

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token                | CSS Variable    | Purpose                              |
| -------------------- | --------------- | ------------------------------------ |
| CSS override | `--var-checkbox-control-foreground` | Checked control color |
| CSS override | `--var-checkbox-control-border` | Unchecked border color (3.69:1 light, 3.66:1 dark on the page background) |
| `text-danger` | `--var-color-danger` | Error message text color |
| CSS override | `--var-checkbox-disabled-opacity` | Disabled control opacity |
| CSS override | `--var-checkbox-focus-ring` | Focus ring color |
||||||| Stash base
| Override | Library default |
| --- | --- |
| `--var-checkbox-label-gap` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-button-big-height` | `calc(var(--var-spacing-base) * 3)` |
| `--var-button-height` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-button-min-height` | `calc(var(--var-spacing-base) * 1.75)` |

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token                | CSS Variable    | Purpose                              |
| -------------------- | --------------- | ------------------------------------ |
| CSS override | `--var-checkbox-control-foreground` | Checked control color |
| CSS override | `--var-checkbox-control-border` | Unchecked border color |
| `text-danger` | `--var-color-danger` | Error message text color |
| CSS override | `--var-checkbox-disabled-opacity` | Disabled control opacity |
| CSS override | `--var-checkbox-focus-ring` | Focus ring color |
=======
| Token | CSS Variable  | Purpose                             |
| ------------- | ----------------------------------- | ------------------------ |
| CSS override  | `--var-checkbox-control-foreground` | Checked control color    |
| CSS override  | `--var-checkbox-control-border`     | Unchecked border color   |
| `text-danger` | `--var-color-danger`                | Error message text color |
| CSS override  | `--var-checkbox-disabled-opacity`   | Disabled control opacity |
| CSS override  | `--var-checkbox-focus-ring`         | Focus ring color         |
>>>>>>> Stashed changes

## Variants

### Size

The default is `"normal"`. The component accepts the shared control-size names `"big"`, `"default"`, `"min"`, `"normal"`, `"small"`, and `"tiny"`, plus the legacy aliases `"medium"` and `"large"`. Use `"normal"` for new code unless the design calls for another control size.

### Task mode

When `asTask={true}`, the label text receives a strikethrough style when the checkbox is checked. This is intended for to-do lists and task management UIs.

## Examples

### Basic checkbox

```tsx
const [accepted, setAccepted] = useState(false);
<Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
    {" "}
    I accept the terms and conditions
</Checkbox>;
```

### With error



```tsx
const [agreed, setAgreed] = useState(false);
const [error, setError] = useState("");
<Checkbox
    checked={agreed}
    onChange={(e) => {
        setAgreed(e.target.checked);
        if (e.target.checked) setError("");
    }}
    error={error}
>
    {" "}
    I agree to the privacy policy
</Checkbox>;
```

### Task list

```tsx
const [tasks, setTasks] = useState([
    { id: 1, text: "Write release notes", done: false },
    { id: 2, text: "Merge pull request", done: true },
]);
<div className="flex flex-col gap-sm">
    {" "}
    {tasks.map((task) => (
        <Checkbox
            key={task.id}
            checked={task.done}
            onChange={() => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)))}
            asTask
        >
            {" "}
            {task.text}{" "}
        </Checkbox>
    ))}
</div>;
```

### Loading state

```tsx
const [loading, setLoading] = useState(false);
const [subscribed, setSubscribed] = useState(false);
const handleChange = async (checked: boolean) => {
    setLoading(true);
    await updateSubscription(checked);
    setSubscribed(checked);
    setLoading(false);
};
<Checkbox checked={subscribed} onChange={(e) => handleChange(e.target.checked)} loading={loading}>
    {" "}
    Subscribe to newsletter
</Checkbox>;
```

### Notification preferences form

```tsx
function PreferencesForm() {
    const [prefs, setPrefs] = useState({ email: false, push: true, sms: false });
    const toggle = (key: keyof typeof prefs) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setPrefs((prev) => ({ ...prev, [key]: e.target.checked }));
    return (
        <form className="flex flex-col gap-sm">
            {" "}
            <Checkbox checked={prefs.email} onChange={toggle("email")}>
                {" "}
                Email notifications{" "}
            </Checkbox>{" "}
            <Checkbox checked={prefs.push} onChange={toggle("push")}>
                {" "}
                Push notifications{" "}
            </Checkbox>{" "}
            <Checkbox checked={prefs.sms} onChange={toggle("sms")}>
                {" "}
                SMS notifications{" "}
            </Checkbox>{" "}
        </form>
    );
}
```

## Do

- Use descriptive, actionable labels so users know exactly what they are agreeing to or enabling.
- Group related checkboxes visually to signal they form a set.
- Use `asTask` for items in a to-do list or task-tracking UI.
- Provide an `error` message when the checkbox is part of required validation (e.g., accepting terms).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use theme props or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use `Checkbox` to trigger an immediate action — use a `Button` or `Switch` instead.
- Don't use checkboxes for mutually exclusive choices — use `Radiobox` instead.

## Interaction design and acceptance criteria

The checks below describe current behavior or consumer design targets; they are not executed accessibility tests.

- Use independent choices for a form decision that is applied on submission. For a binary setting applied immediately, prefer [Switch](Switch.md); for one choice from a related set, use [Radiobox](Radiobox.md). A checkbox change does not itself save data.

- Keep a descriptive child label and group related choices with a `fieldset` and `legend`. The label supports pointer/touch activation; Tab reaches enabled inputs, Shift+Tab moves back, and Space toggles. Check focus visibility and touch comfort in the actual layout rather than judging the small square alone.
- The CSS supports `:indeterminate`, but there is no `indeterminate` prop or built-in parent/child selection rule. Consumers must set the native input's `indeterminate` property through its ref and define what activation does to a partially selected group.
- `loading` only disables interaction; it adds no pending announcement. Error text is associated with the input but is not a live region. Provide any needed save/error status, and use distinct `id` values when repeated `name` values would otherwise create duplicate error ids. Verify name, checked/mixed state, descriptions, and state changes with the supported assistive technologies.

## Acceptance criteria

1. **Current behavior:** Given an enabled checkbox with a text label, when the control or label is clicked or tapped, then its checked state changes and `onChange` receives the new state; a controlled consumer must update `checked`.
2. **Current behavior:** Given focus on an enabled checkbox, when Space is pressed, then it toggles once; when Tab or Shift+Tab is used, then focus continues through the form without a checkbox-specific trap.
3. **Current behavior:** Given `disabled` or `loading`, when activation is attempted, then the native input stays disabled and its checked state does not change.
4. **Consumer target:** Given several independent choices pending submission, when one is toggled, then the others retain their state and no setting is persisted until the consumer's submit action.
5. **Consumer target:** Given help, an error, or a mixed-state parent checkbox, when its accessibility properties and supported screen-reader interaction are inspected, then the label, description, and actual state are available; the consumer's mixed-state activation rule is consistent.

## Accessibility

<<<<<<< Updated upstream
- Renders a native `<input type="checkbox">` for full browser and screen reader support.
- The outer `<label>` wraps both the input and the label text, so clicking anywhere on the label toggles the checkbox.
- `aria-disabled` and `data-disabled` are applied when `disabled` or `loading` is true.
- Error messages are rendered as visible text below the label and are discoverable by screen readers.
- Focus ring is visible for keyboard navigation.
- `indeterminate` sets the DOM property `input.indeterminate`, so screen readers announce "mixed". The forwarded ref still points to the input.
- The unchecked border meets the 3:1 contrast minimum for UI parts (WCAG 1.4.11) in light and dark.
||||||| Stash base
- Renders a native `<input type="checkbox">` for full browser and screen reader support.
- The outer `<label>` wraps both the input and the label text, so clicking anywhere on the label toggles the checkbox.
- `aria-disabled` and `data-disabled` are applied when `disabled` or `loading` is true.
- Error messages are rendered as visible text below the label and are discoverable by screen readers.
- Focus ring is visible for keyboard navigation.
=======
- Renders a native `<input type="checkbox">`, exposing the checkbox role and checked state through HTML semantics.
- The outer `<label>` wraps both the input and label text, so the label is part of the activation target.
- The input receives native `disabled`; `aria-disabled` and `data-disabled` are on the label when `disabled` or `loading` is true.
- `error` sets `aria-invalid` and appends the error text's id to `aria-describedby`, preserving a consumer description.
- CSS provides a focus outline. Keyboard handlers toggle with Space and Enter unless a consumer handler prevents the event's default action.
>>>>>>> Stashed changes

## Data Attributes

- `data-component="checkbox"` — on the outer `<label>`.
- `data-task` — reflects the `asTask` prop value.
- `data-disabled` — reflects the effective disabled state (`disabled || loading`).
- `data-name="checkbox-label"` — on the error text `<span>`.

## Notes

- `loading` sets `disabled` on the underlying input. The two states share the same visual treatment.
- The component forwards its ref to the `<input>` element.
- All standard `HTMLInputElement` attributes are forwarded to the native input, so you can use `name`, `value`, `required`, `defaultChecked`, and so on.
