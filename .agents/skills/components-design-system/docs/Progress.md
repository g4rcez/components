---
title: Progress
description: Accessible determinate progress bar with an optional label overlay.
package: "@g4rcez/components"
export: "{ Progress }"
import: "import { Progress } from '@g4rcez/components'"
category: display
---

# Progress

`Progress` wraps Base UI's progress primitive and renders a themed track, indicator, and optional percentage label. It accepts values in any numeric range and maps them to the configured `min`/`max` interval.

## Import

```tsx
import { Progress } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
| --------------- | ---- | ------- | ----------- |
| `value` | `number` | — | Current progress value. Preferred API. |
| `percent` | `number` | — | Deprecated alias for `value`. `value` takes precedence when both are provided. |
| `min` | `number` | `0` | Minimum value of the progress range. |
| `max` | `number` | `100` | Maximum value of the progress range. |
| `label` | `Label` | — | Replaces the rounded percentage label. |
| `container` | `string` | — | Class for the progress track. |
| `className` | `string` | — | Class for the indicator. |
| `textClassName` | `string` | — | Class for the label. |

If `value` and `percent` are both absent, or `max <= min`, the track is rendered without an indicator or label. Values outside the range are clamped for the visual percentage.

## Design Tokens and CSS

The component ships `@g4rcez/components/progress.css`. Its stable selectors are `.__progress`, `.__progress__indicator`, and `.__progress__label`. The stylesheet reads `--var-progress-track-block-size`, `--var-progress-track-radius`, `--var-progress-indicator-transition-duration`, `--var-progress-indicator-transition-timing`, `--var-color-background`, `--var-color-primary`, and `--var-color-primary-foreground`.

## Examples

### Basic progress

```tsx
<Progress value={75} />
```

### Custom range

```tsx
<Progress min={0} max={4} value={3} label="Step 3 of 4" />
```

### Animated progress

```tsx
const [value, setValue] = useState(0);

<Progress value={value} />
```

### Unknown duration

Use a `Spinner` or another pending-state indicator when no numeric progress is available.

```tsx
{isUploading ? <Spinner /> : <Progress value={uploadProgress} />}
```

## Do

- Use `value` for new code and keep the value in the same domain as `min` and `max`.
- Provide a descriptive `label` when a rounded percentage is not enough context.
- Keep progress updates meaningful to avoid unnecessary visual work.

## Don't

- Don't use `Progress` for an operation whose progress cannot be measured.
- Don't use the deprecated `percent` prop in new code.
- Don't style the indicator with raw colors; override semantic `--var-*` tokens or use the component CSS contract.

## Accessibility

- Base UI provides the progressbar semantics and value attributes.
- The label is supplementary text inside the progress root; do not use it as the only status announcement for rapidly changing progress.
- Pair long-running progress with a visible status message when users need more detail.

## Data Attributes

- `data-component="progress"` — progress root.
- `data-slot="indicator"` — filled indicator.
- `data-slot="label"` — rendered only when a value is available.

## Notes

- The displayed label is `Math.round(percent) %` unless `label` is supplied.
- The indicator width is controlled by Base UI from the normalized value; the component does not render an indeterminate animation.
