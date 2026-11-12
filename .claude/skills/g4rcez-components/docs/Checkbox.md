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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | - | Controlled checked state. |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `loading` | `boolean` | `false` | Disables the input while true. Adds no pending announcement. |
| `error` | `string` | - | Error message below the label. |
| `indeterminate` | `boolean` | `false` | Shows the mixed state (a dash), for example on "select all". |
| `asTask` | `boolean` | `false` | Task mode: strikethrough on the label when checked. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny" \| "medium" \| "large"` | `"normal"` | Control size; named values map to library control-size tokens. |
| `container` | `string` | - | Extra classes for the outer `<label>`. |
| `labelClassName` | `string` | - | Extra classes for the error text element. |
| `className` | `string` | - | Extra classes for the `<input>`. |
| `children` | `React.ReactNode` | - | Label content. |
| `...props` | `React.InputHTMLAttributes<HTMLInputElement>` | - | All standard input attributes. |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override | Library default |
| --- | --- |
| `--var-checkbox-label-gap` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-button-big-height` | `calc(var(--var-spacing-base) * 3)` |
| `--var-button-height` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-button-min-height` | `calc(var(--var-spacing-base) * 1.75)` |

Override these CSS variables in your theme:

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| CSS override | `--var-checkbox-control-foreground` | Checked control color |
| CSS override | `--var-checkbox-control-border` | Unchecked border color (3.69:1 light, 3.66:1 dark on the page background) |
| `text-danger` | `--var-color-danger` | Error message text color |
| CSS override | `--var-checkbox-disabled-opacity` | Disabled control opacity |
| CSS override | `--var-checkbox-focus-ring` | Focus ring color |

## Variants

### Size

- Default: `"normal"`. Use `"normal"` for new code unless the design needs another size.
- Shared control-size names: `"big"`, `"default"`, `"min"`, `"normal"`, `"small"`, `"tiny"`.
- Legacy aliases: `"medium"`, `"large"`.

### Task mode

When `asTask={true}` and the checkbox is checked, the label text gets a strikethrough. Use it for to-do lists and task UIs.

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

- Use descriptive, actionable labels so users know what they agree to or enable.
- Group related checkboxes with a `fieldset` and `legend`.
- Use `asTask` for items in a to-do list or task-tracking UI.
- Set `error` when the checkbox is part of required validation (for example, accepting terms).
- Check focus visibility and touch comfort in the actual layout, not on the small square alone.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use `Checkbox` to trigger an immediate action. Use a `Button` or `Switch`.
- Don't use checkboxes for mutually exclusive choices. Use `Radiobox`.

## Interaction design and acceptance criteria

These checks describe current behavior or consumer design targets. They are not executed accessibility tests.

- Use independent choices for a form decision applied on submission. A checkbox change does not save data.
- For a binary setting applied immediately, prefer [Switch](Switch.md). For one choice from a related set, use [Radiobox](Radiobox.md).
- Pointer and touch activate the label. Tab reaches enabled inputs, Shift+Tab moves back, Space toggles.
- The `indeterminate` prop sets the DOM property and the CSS `:indeterminate` state. A click clears the native state, so the component re-syncs it after every render.
- There is no built-in parent/child selection rule. Consumers define what activation does to a partially selected group.
- Error text is associated with the input but is not a live region. Provide any save or error status.
- Use distinct `id` values when repeated `name` values would create duplicate error ids.
- Verify name, checked/mixed state, descriptions and state changes with the supported assistive technologies.

## Accessibility

- Renders a native `<input type="checkbox">`. HTML semantics expose the checkbox role and checked state.
- The outer `<label>` wraps the input and label text, so the label is part of the activation target.
- The input receives native `disabled`. When `disabled` or `loading` is true, `aria-disabled` and `data-disabled` are on the label.
- `error` sets `aria-invalid` and appends the error text id to `aria-describedby`, preserving a consumer description.
- Error text is visible below the label.
- CSS provides a focus outline. Keyboard handlers toggle with Space and Enter unless a consumer handler prevents the default action.
- `indeterminate` sets the DOM property `input.indeterminate`, so screen readers announce "mixed". The forwarded ref still points to the input.
- The unchecked border is a soft outline (about 1.8:1 against the page), below the 3:1 of WCAG 1.4.11. The checked state, the label and the focus ring carry the state. Override `--var-checkbox-control-border` for a stronger outline.

## Data Attributes

- `data-component="checkbox"`: on the outer `<label>`.
- `data-task`: reflects the `asTask` prop value.
- `data-disabled`: reflects the effective disabled state (`disabled || loading`).
- `data-name="checkbox-label"`: on the error text `<span>`.

## Notes

- `loading` sets `disabled` on the underlying input. Both states look the same.
- The component forwards its ref to the `<input>` element.
- All standard `HTMLInputElement` attributes go to the native input, for example `name`, `value`, `required`, `defaultChecked`.

## Verification

Acceptance criteria for tests and reviews: [verify/Checkbox.md](verify/Checkbox.md).
