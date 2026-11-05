---
title: Slider
description: Range control for selecting one or more numeric values along a scale.
package: "@g4rcez/components"
export: "{ Slider }"
import: "import { Slider } from '@g4rcez/components'"
category: form
---

# Slider

Range control that selects one or more numeric values along a scale.

## Import

```tsx
import { Slider } from "@g4rcez/components";
```

## Props

`Slider` accepts all `@base-ui/react/slider` Root props, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tooltip` | `boolean` | `false` | Enables the thumb Tooltip. Its value sync is unverified (see current limits). |
| `value` | `number[]` | — | Controlled values. |
| `defaultValue` | `number[]` | — | Initial values, uncontrolled. Pass an array to render thumbs. |
| `min` | `number` | `0` | Minimum value. |
| `max` | `number` | `100` | Maximum value. |
| `step` | `number` | `1` | Increment between selectable values. |
| `onValueChange` | `(value, eventDetails) => void` | — | Base UI callback. Use it, not a DOM `onChange`, to update controlled values. |
| `className` | `string` | — | Classes for the control track wrapper. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks of `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set; the table shows examples.

| Override | Library default |
| --- | --- |
| `--var-slider-control-block-size` | `calc(var(--var-spacing-base) * 1.25)` |
| `--var-slider-track-block-size` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-slider-thumb-size` | `calc(var(--var-spacing-base) * 1.25)` |
| `--var-slider-thumb-focus-outline-width` | `calc(var(--var-spacing-base) * 0.125)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `bg-background` | `--var-color-background` | Unfilled track background |
| `bg-primary` | `--var-color-primary` | Filled track background |
| `border-input-border` | `--var-color-border` | Thumb border |
| CSS override | `--var-slider-thumb-background` | Thumb fill |
| `focus-within:ring-ring` | `--var-color-ring` | Thumb focus outline color |

## Variants

### Single thumb

One value in `defaultValue` renders one draggable thumb.

### Range (dual thumb)

Two values in `defaultValue` render two thumbs that define a range.

## Examples

### Single value

```tsx
import { Slider } from "@g4rcez/components";
export default function VolumeControl() {
    return <Slider min={0} max={100} defaultValue={[50]} onValueChange={(value) => console.log(value)} />;
}
```

### Range slider

```tsx
import { Slider } from "@g4rcez/components";
export default function PriceRangeFilter() {
    return <Slider min={0} max={1000} defaultValue={[200, 800]} tooltip />;
}
```

### Controlled with tooltip and custom step

```tsx
import { useState } from "react";
import { Slider } from "@g4rcez/components";
export default function SteppedSlider() {
    const [value, setValue] = useState([0.5]);
    return (
        <div className="flex flex-col gap-base">
            {" "}
            <Slider min={0} max={1} step={0.1} value={value} tooltip onValueChange={setValue} />{" "}
            <span className="text-sm text-muted-foreground">Current: {value[0].toFixed(1)}</span>{" "}
        </div>
    );
}
```

## Do

- Add a visible label or description of what the slider controls.
- Treat `tooltip` as supplemental feedback. Show the current value and unit persistently. Offer an `Input` when precision matters.
- Use `step` to restrict selection to valid increments (for example, `step={10}` for percentages in tens).
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Slider` for very large or effectively infinite ranges. Use a text `Input`.
- Don't use `Slider` for a small discrete set (for example, 3 named options). Use `Radiobox` or `Select`.
- Don't pass raw utility color classes (`bg-blue-500`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Interaction design and acceptance criteria

Keyboard details come from the installed Base UI primitive. These are source-informed checks and design targets, not executed accessibility tests.

- Use a slider for a bounded numeric adjustment where relative position helps. Show the current value, unit, and meaningful endpoints before interaction.
- For exact entry, compose [Input](Input.md) with the same controlled value. Do not rely on dragging or a tooltip.
- Pass `value` or `defaultValue` as an array. The wrapper renders one thumb per array entry. It renders no thumbs when neither array is passed or when a scalar is passed.
- Update controlled values with `onValueChange`.
- Base UI handles pointer and touch dragging and track presses. Review target size, precision, and page scrolling, because the control CSS uses `touch-action: none`.
- Tab and Shift+Tab move focus to and from the native range input in each thumb.
- In horizontal left-to-right layout, Arrow Up/Right increases the value and Arrow Down/Left decreases it. Horizontal arrows reverse in RTL.
- Home/End reach the allowed endpoints. In a range, neighboring thumbs constrain them.
- Page Up/Page Down and Shift+Arrow use Base UI's `largeStep`. They are not library-specific shortcuts.
- Associate a persistent visible label with the forwarded `aria-labelledby`.
- The wrapper has no per-thumb name or value-text props. Range endpoints cannot get distinct consumer-authored thumb labels.
- Verify range start and end value text and units with supported assistive technologies. If the shared label is not enough, use separately labeled existing inputs.
- Consumers own numeric bounds, step choice, persistence, and focus, contrast, and touch verification.

**Current limits:**

- No built-in endpoint or value display. No completion announcement.
- The tooltip observer targets the wrapper, not the nested range input, so its number may not track the value. Do not use the tooltip as the only precise or accessible feedback.

## Accessibility

- Each Base UI thumb contains a visually hidden native `<input type="range">` with the current value, `min`, `max`, `step`, and disabled state. Keyboard focus reaches that input.
- The primitive implements Arrow keys, Home/End, and Page Up/Page Down on the range input. Range endpoints respect neighboring values and minimum separation.
- Base UI propagates an explicit root `aria-labelledby` to the range inputs. A root `aria-label` alone names the group, not each nested input.
- CSS supplies a thumb focus outline. The default thumb size is spacing-derived, not a verified minimum touch target.

## Notes

- The slider is built on `@base-ui/react/slider`. That primitive provides most structural ARIA and keyboard behavior.
- The tooltip observer watches `aria-valuenow` on the thumb wrapper. Base UI sets that attribute on the nested range input. Do not assume tooltip value sync.
- The `useLocale` result goes to Base UI for number and value-text formatting. Tooltip content is the observer's raw number, not locale-formatted.

## Verification

Acceptance criteria for tests and reviews: [verify/Slider.md](verify/Slider.md).
