---
title: Slider
description: Range control for selecting one value or a range along a scale, with a rubber-band stretch past the ends, detent marks and a value tag.
package: "@g4rcez/components"
export: "{ Slider }"
import: "import { Slider } from '@g4rcez/components'"
category: form
---

# Slider

Range control that selects one or more numeric values along a scale. Dragging past either end stretches the track like rubber and springs back with the release speed, the thumb swells while it is held, `marks` act as detents, and `tooltip` adds a value tag that sways with the thumb's speed. It is built on `@base-ui/react/slider`, so every Base UI prop keeps working.

## Import

```tsx
import { Slider } from "@g4rcez/components";
```

## Props

`Slider` accepts all `@base-ui/react/slider` Root props, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| number[]` | — | Controlled value. An array renders one thumb per entry. |
| `defaultValue` | `number \| number[]` | `min` | Initial value, uncontrolled. A number or a one-entry array renders one thumb; two entries render a range. |
| `min` / `max` | `number` | `0` / `100` | Bounds. |
| `step` / `largeStep` | `number` | `1` / `10` | Increments (Base UI). |
| `onValueChange` | `(value, eventDetails) => void` | — | Base UI callback. Receives the value after any detent. |
| `onValueCommitted` | `(value, eventDetails) => void` | — | Base UI callback on release, key or mark press. Receives the detent-adjusted value. |
| `format` | `Intl.NumberFormatOptions` | — | Base UI. Formats the default value text and the tag. |
| `label` | `string` | — | Accessible name of the thumb. A range numbers its thumbs ("Price 1", "Price 2"). |
| `tooltip` | `boolean` | `false` | Shows a value tag above the thumb while it is hovered, focused or dragged. |
| `formatValue` | `(value: number) => string` | `Intl.NumberFormat` | Formats the tag and each thumb's `aria-valuetext`, for example `` `${value}%` ``. |
| `marks` | `Array<number \| { value: number; label?: ReactNode }>` | — | Detents. Labelled marks print under the track and can be pressed. |
| `startIcon` / `endIcon` | `ReactNode` | — | Decoration before and after the track. Hidden from assistive technology. |
| `elastic` | `boolean` | `true` | Rubber-band stretch past the ends and a nudge at the limits. |
| `className` | `string` | — | Classes for the control track wrapper. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks of `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set; the table shows examples.

| Override | Library default |
| --- | --- |
| `--var-slider-control-block-size` | `calc(var(--var-spacing-base) * 1.25)` |
| `--var-slider-track-block-size` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-slider-thumb-size` | `calc(var(--var-spacing-base) * 1.25)` |
| `--var-slider-thumb-focus-outline-width` | `calc(var(--var-spacing-base) * 0.125)` |
| `--var-slider-gap` | `calc(var(--var-spacing-base) * 0.75)` (space between the track and its icons) |
| `--var-slider-thumb-drag-scale` | `1.28` (thumb scale while held) |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `bg-background` | `--var-color-background` | Unfilled track background; value tag text |
| `bg-primary` | `--var-color-primary` | Filled track background and the active mark |
| `border-input-border` | `--var-color-border` | Thumb border |
| CSS override | `--var-slider-thumb-background` | Thumb fill |
| `focus-within:ring-ring` | `--var-color-ring` | Thumb focus outline color |
| `bg-foreground` | `--var-color-foreground` | Value tag background |
| `text-muted-foreground` | `--var-color-muted-foreground` | Icons and mark labels |

## Variants

### Single thumb

A number, or one entry in `defaultValue` / `value`, renders one draggable thumb. With no value at all the thumb sits at `min`.

### Range (dual thumb)

Two entries render two thumbs that define a range.

## Examples

### Volume with icons, a tag and a unit

```tsx
import { SpeakerHighIcon, SpeakerNoneIcon } from "@phosphor-icons/react";
import { Slider } from "@g4rcez/components";

export default function Volume() {
    return (
        <Slider
            label="Volume"
            tooltip
            defaultValue={[40]}
            formatValue={(value) => `${value}%`}
            startIcon={<SpeakerNoneIcon aria-hidden size={20} />}
            endIcon={<SpeakerHighIcon aria-hidden size={20} />}
        />
    );
}
```

### Marks as detents

```tsx
const speeds = [
    { value: 0.5, label: "0.5×" },
    { value: 1, label: "1×" },
    { value: 1.5, label: "1.5×" },
    { value: 2, label: "2×" },
];

<Slider label="Playback speed" min={0.5} max={2} step={0.05} defaultValue={[1]} marks={speeds} onValueCommitted={(value) => save(value)} />;
```

### Range slider

```tsx
<Slider label="Price" min={0} max={1000} step={10} defaultValue={[200, 800]} marks={[0, 500, 1000]} tooltip />
```

### Controlled

```tsx
const [value, setValue] = useState<readonly number[]>([0.5]);

<Slider label="Opacity" min={0} max={1} step={0.1} value={value} onValueChange={(next) => setValue(Array.isArray(next) ? next : [next])} />;
```

## Do

- Give it a `label`. Add `formatValue` so the value text carries its unit.
- Use `marks` for common targets such as 0, 50 and 100. They are soft snaps and never block the values in between.
- Treat the value tag as supplemental feedback. Show the value and unit persistently when precision matters, and offer an `Input` for exact entry.
- Use `step` to restrict selection to valid increments.
- Use design-token classes on wrapper elements (`bg-background`, `text-foreground`).

## Don't

- Don't use `Slider` for very large or effectively infinite ranges. Use a text `Input`.
- Don't use `Slider` for a small discrete set (for example, 3 named options). Use `Radiobox` or `Select`.
- Don't pass raw utility color classes (`bg-blue-500`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't put the only copy of the value or the unit in an icon, the tag or a mark label: they are hidden from assistive technology.

## Interaction design and acceptance criteria

Keyboard details come from the installed Base UI primitive. The stretch, detents and tag are this component's own.

- Use a slider for a bounded numeric adjustment where relative position helps. Show the current value, unit and meaningful endpoints.
- For exact entry, compose [Input](Input.md) with the same controlled value. Do not rely on dragging or the tag.
- Update controlled values with `onValueChange`. It receives the value after a detent has been applied, and so does `onValueCommitted`.
- **Stretch.** Dragging the pointer past either end stretches the track toward it with iOS-style resistance, up to 36px however far the pointer goes, and releasing springs it back with the release velocity. The thumb at that end follows the stretch and an icon on that side is pushed outward. Home, End or an arrow key pressed at a limit plays a short stretch and snap. It is off for `elastic={false}`, vertical sliders, disabled sliders and reduced motion.
- **Detents.** While dragging or pressing the track, a value within about 7px of a mark snaps to it, the tick pops and a short vibration plays where the device supports it. Keyboard steps never snap. Pressing a labelled mark moves the nearest thumb to it (a range stays ordered) and commits.
- **Thumb.** It grows to `--var-slider-thumb-drag-scale` while held.
- Base UI handles pointer and touch dragging and track presses. The control CSS uses `touch-action: none`, so review target size, precision and page scrolling.
- Tab and Shift+Tab move focus to and from the native range input in each thumb.
- In horizontal left-to-right layout, Arrow Up/Right increases the value and Arrow Down/Left decreases it. Horizontal arrows reverse in RTL. Home/End reach the endpoints. In a range, neighboring thumbs constrain them. Page Up/Page Down and Shift+Arrow use `largeStep`.
- Consumers own numeric bounds, step choice, persistence, and focus, contrast and touch verification.

**Current limits:**

- The stretch is horizontal only, and the icons assume left-to-right layout.
- No completion announcement. If the value changes matter, announce them from the consumer.

## Accessibility

- Each Base UI thumb contains a visually hidden native `<input type="range">` with the current value, `min`, `max`, `step` and disabled state. Keyboard focus reaches that input.
- `label` names each thumb through the thumb's `aria-label`, numbered for a range. `formatValue` sets `aria-valuetext`. Without `formatValue` Base UI's own formatting applies.
- The primitive implements Arrow keys, Home/End and Page Up/Page Down on the range input. Range endpoints respect neighboring values and minimum separation.
- The icons, the value tag and the mark labels are `aria-hidden`. The labelled marks are `tabIndex={-1}` pointer shortcuts: keyboard users reach every value through the slider itself.
- CSS supplies a thumb focus outline. The default thumb size is spacing-derived, not a verified minimum touch target.

## Notes

- The slider is built on `@base-ui/react/slider`. That primitive provides most structural ARIA and keyboard behavior.
- `format` is Base UI's `Intl.NumberFormatOptions`. The function-valued option is `formatValue`.
- The stretch runs on a motion value that publishes CSS variables on the root (`--slider-scale-x`, `--slider-origin`, `--slider-shift-min`, `--slider-shift-max`), so dragging does not re-render React per frame. These are private implementation variables, not theme tokens.
- Base UI centers the thumb with the individual `translate` property, so the stretch shifts thumbs with `transform` and the press scale uses `scale`.
- The value tag follows the value; its tilt and lag come from the value's velocity and are skipped under reduced motion.
- The `useLocale` result goes to Base UI for number and value-text formatting, and to the tag's default formatting.
- Earlier versions rendered no thumbs for a number or for no value, and the tooltip number could fail to track the value. Both are fixed.

## Verification

Acceptance criteria for tests and reviews: [verify/Slider.md](verify/Slider.md).
