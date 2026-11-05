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

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Label text or element next to the radio button. |
| `size` | `"medium" \| "large"` | `"medium"` | Visual size of the radio button. |
| `className` | `string` | — | Extra CSS classes for the `<input>` element. |

## Design Tokens

Defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides take precedence. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The table shows examples; the exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-radiobox-label-min-block-size` | `calc(var(--var-spacing-base) * 1.25)` |
| `--var-radiobox-label-gap` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-radiobox-control-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-radiobox-control-border-width` | `calc(var(--var-spacing-base) * 0.0625)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| CSS override | `--var-radiobox-control-border` | Default radio circle border |
| CSS override | `--var-radiobox-control-foreground` | Checked control color |
| CSS override | `--var-radiobox-focus-ring` | Focus ring color |
| CSS override | `--var-radiobox-disabled-opacity` | Disabled control opacity |

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

- Give related `Radiobox` components the same `name`.
- Label each radio button through `children`, with clear, concise text.
- Use `Radiobox` for 2–7 mutually exclusive options. For more, use `Select`.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Radiobox` for independent toggles. Use `Checkbox`.
- Don't replace a form's yes/no question with `Switch` unless it is an immediate binary setting. A submitted mutually exclusive answer can use `Radiobox`.
- Don't pass raw color classes (`text-blue-500`, `border-gray-300`). Use design tokens.
- Don't use arbitrary values (`text-[--my-var]`). Override CSS variables in your `@theme` block.

## Interaction design and acceptance criteria

These are source-informed integration checks and design targets, not executed accessibility tests.

- Use a visible radio group when people compare alternatives and choose at most one.
- Use [Checkbox](Checkbox.md) for independent choices. Use [Select](Select.md) when a compact list fits better.
- `Radiobox` renders a native radio inside a label.
- A true group needs the same nonempty `name` and the same form owner for every related input.
- A true group also needs distinct option `value` values and a consumer-supplied `fieldset`/`legend`.
- Visual proximity or identical labels do not create exclusivity.
- Clicking or tapping a label selects its option and clears another radio in the native group. It does not toggle a selected option off.
- Native Tab entry, arrow-key selection, and Space behavior stay browser-owned. With no selection, entry can differ by browser and navigation direction.
- CSS supplies focus and selected-state indicators. Verify them, and verify label target size on small screens.
- There is no group component, automatic group label, error renderer, or live announcement.
- Consumers own `required`, help/error text with `aria-describedby`, and controlled state consistency.
- Keep nested links and buttons outside radio labels.
- Verify the group name, option name, selected state, and position information with the supported assistive technologies.

## Accessibility

- A semantic `<label>` wraps the `<input>`. No extra `htmlFor` wiring is needed.
- `aria-disabled` is set on the wrapper `<label>` when the input is disabled.
- Standard keyboard interaction: Arrow keys move between radios in the same group; Space selects.
- CSS provides disabled cursor/opacity styling and a keyboard focus outline. Review visual size and target comfort in the consumer layout.

## Data Attributes

| Attribute | Element | Value | Description |
|---|---|---|---|
| `data-component` | `label` | `"radiobox"` | Identifies the component. |
| `data-disabled` | `label` | `true \| undefined` | Set when the radio is disabled. |

## Notes

- Plain CSS draws the radio circle and selected mark. `size="large"` uses the large control and mark tokens; `"medium"` uses the normal tokens.
- Render multiple `Radiobox` components inside a `<fieldset>` with a `<legend>` for full semantic grouping.

## Verification

Acceptance criteria for tests and reviews: [verify/Radiobox.md](verify/Radiobox.md).
