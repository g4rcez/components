---
title: Radiobox
description: Styled radio button for selecting one option from a mutually exclusive set.
package: "@g4rcez/components"
export: "{ Radiobox }"
import: "import { Radiobox } from '@g4rcez/components/radiobox'"
category: form
---

# Radiobox

Styled radio button for selecting one option from a mutually exclusive set.

## Import

```tsx
import { Radiobox } from "@g4rcez/components/radiobox";
```

## Props

Accepts all standard HTML `input[type="radio"]` attributes, plus:

| Prop        | Type                  | Default    | Description                                               |
| ----------- | --------------------- | ---------- | --------------------------------------------------------- |
| `children`  | `React.ReactNode`     | —          | Label text or element displayed next to the radio button. |
| `size`      | `"medium" \| "large"` | `"medium"` | Visual size of the radio button.                          |
| `className` | `string`              | —          | Additional CSS classes for the `<input>` element.         |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                              | Library default                          |
| ------------------------------------- | ---------------------------------------- |
| `--var-radiobox-label-min-block-size` | `calc(var(--var-spacing-base) * 1.25)`   |
| `--var-radiobox-label-gap`            | `calc(var(--var-spacing-base) * 0.5)`    |
| `--var-radiobox-control-size`         | `calc(var(--var-spacing-base) * 1)`      |
| `--var-radiobox-control-border-width` | `calc(var(--var-spacing-base) * 0.0625)` |

| Token | CSS Variable | Purpose                             |
| ------------ | ----------------------------------- | --------------------------- |
| CSS override | `--var-radiobox-control-border`     | Default radio circle border |
| CSS override | `--var-radiobox-control-foreground` | Checked control color       |
| CSS override | `--var-radiobox-focus-ring`         | Focus ring color            |
| CSS override | `--var-radiobox-disabled-opacity`   | Disabled control opacity    |

## Examples

### Basic group

```tsx
import { Radiobox } from "@g4rcez/components/radiobox";
export default function PlanSelector() {
    return (
        <div className="flex flex-col gap-sm">
            {" "}
            <Radiobox name="plan" value="basic" defaultChecked>
                {" "}
                Basic Plan{" "}
            </Radiobox>{" "}
            <Radiobox name="plan" value="pro">
                {" "}
                Pro Plan{" "}
            </Radiobox>{" "}
            <Radiobox name="plan" value="enterprise">
                {" "}
                Enterprise Plan{" "}
            </Radiobox>{" "}
        </div>
    );
}
```

### Disabled state

```tsx
import { Radiobox } from "@g4rcez/components/radiobox";
export default function DisabledOption() {
    return (
        <Radiobox disabled name="option" value="legacy">
            {" "}
            Legacy (unavailable){" "}
        </Radiobox>
    );
}
```

### In a grid layout

```tsx
import { Radiobox } from "@g4rcez/components/radiobox";
export default function GenderSelector() {
    return (
        <div className="grid grid-cols-2 gap-base">
            {" "}
            <Radiobox name="gender" value="male">
                {" "}
                Male{" "}
            </Radiobox>{" "}
            <Radiobox name="gender" value="female">
                {" "}
                Female{" "}
            </Radiobox>{" "}
            <Radiobox name="gender" value="non-binary">
                {" "}
                Non-binary{" "}
            </Radiobox>{" "}
            <Radiobox name="gender" value="prefer-not">
                {" "}
                Prefer not to say{" "}
            </Radiobox>{" "}
        </div>
    );
}
```

## Do

- Group related `Radiobox` components by giving them the same `name` attribute.
- Provide a clear, concise label for each radio button via `children`.
- Use `Radiobox` when there are 2–7 mutually exclusive options; for more, prefer `Select`.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Radiobox` for independent toggles — use `Checkbox` instead.
- Don't replace a form's yes/no question with `Switch` unless it is an immediate binary setting; a submitted mutually exclusive answer can use `Radiobox`.
- Don't pass raw utility color classes (`text-blue-500`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`text-[--my-var]`) — override CSS variables in your `@theme` block instead.

## Interaction design and acceptance criteria

These are source-informed integration checks and design targets, not executed accessibility tests.

- Use a visible radio group when people must compare alternatives and choose at most one. Use [Checkbox](Checkbox.md) for independent choices and [Select](Select.md) when a compact list is more useful.

- `Radiobox` renders a native radio inside a label. A true group needs the same nonempty `name` and the same form owner for every related input, distinct option `value` values, and a consumer-supplied `fieldset`/`legend`. Visual proximity or identical labels alone does not create exclusivity.
- Clicking or tapping a label selects its option, clears another radio in the native group, and does not toggle a selected option off. Native Tab entry, arrow-key selection, and Space behavior remain browser-owned; with no selection, entry can differ by browser and navigation direction. CSS supplies focus and selected-state indicators; verify them and label target size on small screens.
- There is no group component, automatic group label, error renderer, or live announcement. Consumers own `required`, help/error text and `aria-describedby`, and controlled state consistency. Keep nested links/buttons outside radio labels and verify the group name, option name, selected state, and position information with the supported assistive technologies.

## Acceptance criteria

1. **Current behavior:** Given two enabled radios sharing a `name` and form owner, when the second control or label is clicked or tapped, then only the second is checked; activating it again leaves it checked.
2. **Browser check:** Given a named group with a selected option, when Tab enters it and arrow keys are used, then focus and selection follow the browser's radio-group behavior and exactly one option remains checked; Space selects the focused option.
3. **Current behavior:** Given a disabled radio, when its control or label is activated, then it remains unavailable and does not become selected.
4. **Consumer target:** Given a group question and help/error text, when an option is inspected or reached with supported assistive technology, then the group and option names, selected state, and associated description are available.
5. **Consumer target:** Given controlled radios, when a new choice is accepted, then the parent supplies a single selected value and preserves a visible focus indicator without moving focus elsewhere.

## Accessibility

- A semantic `<label>` wraps the `<input>`, associating label text with the radio button without extra `htmlFor` wiring.
- `aria-disabled` is set on the wrapper `<label>` when the input is disabled.
- Standard keyboard interaction: Arrow keys navigate between radios in the same group; Space selects.
- CSS provides disabled cursor/opacity styling and a keyboard focus outline; visual size and target comfort still need review in the consumer layout.

## Data Attributes

| Attribute | Element

| Value            | Description |
| ---------------- | ----------- |
| `data-component` | `label` |
| `data-disabled` | `label` |

`"radiobox"`
Identifies the component.
`true \| undefined`
Set when the radio is disabled.

## Notes

- Plain CSS draws the radio circle and selected mark; `size="large"` uses the large control and mark tokens, while `"medium"` uses the normal tokens.
- Render multiple `Radiobox` components inside a `<fieldset>` with a `<legend>` for full semantic grouping.
