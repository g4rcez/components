---
title: Slider
description: Range control for selecting one or more numeric values along a scale.
package: "@g4rcez/components"
export: "{ Slider }"
import: "import { Slider } from '@g4rcez/components'"
category: form
---

# Slider

Range control for selecting one or more numeric values along a scale.

## Import

```tsx
import { Slider } from "@g4rcez/components";
```

## Props

`Slider` accepts all props from `@base-ui/react/slider` Root, plus:

| Prop            | Type                            | Default | Description                                                                                                          |
| --------------- | ------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `tooltip`       | `boolean`                       | `false` | Enables the existing thumb Tooltip; value synchronization needs verification (see current limits).                   |
| `value`         | `number[]`                      | —       | Controlled value(s).                                                                                                 |
| `defaultValue`  | `number[]`                      | —       | Initial values for uncontrolled usage; supply an array to render thumbs.                                             |
| `min`           | `number`                        | `0`     | Minimum value.                                                                                                       |
| `max`           | `number`                        | `100`   | Maximum value.                                                                                                       |
| `step`          | `number`                        | `1`     | Increment between selectable values.                                                                                 |
| `onValueChange` | `(value, eventDetails) => void` | —       | Base UI callback for numeric value changes; use this rather than a DOM `onChange` event to update controlled values. |
| `className`     | `string`                        | —       | Additional classes applied to the control track wrapper.                                                             |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                 | Library default                         |
| ---------------------------------------- | --------------------------------------- |
| `--var-slider-control-block-size`        | `calc(var(--var-spacing-base) * 1.25)`  |
| `--var-slider-track-block-size`          | `calc(var(--var-spacing-base) * 0.5)`   |
| `--var-slider-thumb-size`                | `calc(var(--var-spacing-base) * 1.25)`  |
| `--var-slider-thumb-focus-outline-width` | `calc(var(--var-spacing-base) * 0.125)` |

| Token | CSS Variable             | Purpose                         |
| ------------------------ | ------------------------------- | ------------------------- |
| `bg-background`          | `--var-color-background`        | Unfilled track background |
| `bg-primary`             | `--var-color-primary`           | Filled track background   |
| `border-input-border`    | `--var-color-border`            | Thumb border              |
| CSS override             | `--var-slider-thumb-background` | Thumb fill                |
| `focus-within:ring-ring` | `--var-color-ring`              | Thumb focus outline color |

## Variants

### Single thumb

One value in `defaultValue` renders a single draggable thumb.

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

- Provide visible labels or descriptive context indicating what the slider controls.
- Treat `tooltip` as supplemental feedback; display the current value and unit persistently, and offer an `Input` alternative when precision matters.
- Use `step` to restrict selection to valid increments (e.g., `step={10}` for percentages in tens).
- Use design-token classes for any wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Slider` for very large or effectively infinite ranges where a text `Input` would be more efficient.
- Don't use `Slider` for selecting from a small discrete set (e.g., 3 named options) — use `Radiobox` or `Select`.
- Don't pass raw utility color classes (`bg-blue-500`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block instead.

## Interaction design and acceptance criteria

Keyboard details also come from the installed Base UI primitive. These are source-informed checks and consumer design targets, not executed accessibility tests.

- Use a slider for a bounded numeric adjustment where relative position is useful. Show the current value, unit, and meaningful endpoints before interaction. For exact entry, compose the existing [Input](Input.md) with the same controlled value rather than relying on dragging or a tooltip.

- Supply `value` or `defaultValue` as an array: the wrapper renders one thumb per array entry, and no thumbs when neither array is supplied or when a scalar is used. Update controlled values with `onValueChange`. Pointer/touch dragging and track presses are handled by Base UI; review target size, precision, and page scrolling because the control CSS uses `touch-action: none`.
- Tab/Shift+Tab reaches/leaves the native range input in each thumb. Arrow Up/Right increases and Down/Left decreases in the horizontal left-to-right case; horizontal arrows reverse in RTL. Home/End reaches allowed endpoints, constrained by neighboring thumbs in a range. Page Up/Page Down and Shift+Arrow use Base UI's `largeStep`, not a library-specific shortcut.
- Associate a persistent visible label using the forwarded `aria-labelledby`. The wrapper has no per-thumb naming/value-text props, so range endpoints cannot receive distinct consumer-authored thumb labels through this API. Verify range-start/end value text and units with supported assistive technologies; prefer separately labeled existing inputs if the shared-label contract is insufficient.
- **Current limits:** there is no built-in endpoint/value display or completion announcement. The tooltip observer targets the wrapper rather than the nested range input, so its displayed number may not track the value. Do not use it as the only precise or accessible feedback. Consumers own numeric bounds, step choice, persistence, and focus/contrast/touch verification.

## Acceptance criteria

1. **Current behavior:** Given a single-value array and valid bounds/step, when the thumb is dragged or the track pressed, then Base UI proposes a bounded numeric value through `onValueChange`; an accepting controlled consumer updates the thumb and persistent value display.
2. **Current behavior:** Given focus on a single native range input in horizontal LTR mode, when arrows, Home/End, and Page Up/Page Down are used, then the value changes by `step`, reaches `min`/`max`, or uses `largeStep` within the bounds.
3. **Current behavior:** Given a disabled slider with rendered thumbs, when pointer or keyboard adjustment is attempted, then the disabled native range inputs do not accept a value change.
4. **Integration target:** Given a labeled two-thumb range, when each thumb is reached and adjusted, then focus stays visible, permitted ordering/separation is maintained, and the shared name plus endpoint/value information is understandable; distinct consumer-authored thumb names are not currently exposed.
5. **Integration target — current gap:** Given exact values or units matter, when any input method changes the value, then a persistent consumer display or synchronized `Input` shows the accepted value. If a tooltip is enabled, verify its number separately; current observer wiring does not establish this target.

## Accessibility

- Each Base UI thumb contains a visually hidden native `<input type="range">` with current value, `min`, `max`, `step`, and disabled state; keyboard focus reaches that input.
- The installed primitive implements Arrow keys, Home/End, and Page Up/Page Down on the range input. Range-slider endpoints also respect neighboring values and minimum separation.
- An explicit root `aria-labelledby` is propagated by Base UI to the range inputs. A root `aria-label` alone names the group, not each nested input.
- CSS supplies a thumb focus outline. The default thumb size is spacing-derived, not a verified minimum touch target.

## Notes

- Built on `@base-ui/react/slider` — most structural ARIA and keyboard behavior comes from that primitive.
- The tooltip observer watches the thumb wrapper's `aria-valuenow`, while the installed Base UI primitive puts that attribute on the nested range input; do not assume tooltip value synchronization.
- The `useLocale` result is passed to Base UI for its number/value-text formatting. Tooltip content is the observer's raw number, not separately locale-formatted.
