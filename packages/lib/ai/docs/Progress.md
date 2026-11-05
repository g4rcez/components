---
title: Progress
description: Accessible determinate progress bar with an optional label overlay.
package: "@g4rcez/components"
export: "{ Progress }"
import: "import { Progress } from '@g4rcez/components'"
category: display
---

# Progress

`Progress` wraps the Base UI progress primitive. It renders a themed track, an indicator, and an optional percentage label. It accepts any numeric range and maps it to the `min`/`max` interval.

## Import

```tsx
import { Progress } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Current progress value; preferred API |
| `percent` | `number` | — | Deprecated alias for `value`; `value` wins when both are set |
| `min` | `number` | `0` | Minimum of the progress range |
| `max` | `number` | `100` | Maximum of the progress range |
| `label` | `Label` | — | Replaces the rounded percentage label |
| `container` | `string` | — | Class for the progress track |
| `className` | `string` | — | Class for the indicator |
| `textClassName` | `string` | — | Class for the label |
| `aria-label` | `string` | — | Accessible name when no nonempty visible `label` renders |
| `aria-labelledby` | `string` | — | ID reference used when no nonempty visible `label` renders |

- When `value` and `percent` are both absent, or `max <= min`, the track renders without an indicator or label.
- The visual percentage clamps values outside the range.

## Design Tokens and CSS

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-progress-track-block-size` | `calc(var(--var-spacing-base) * 1.5)` |
| `--var-progress-track-radius` | `calc(var(--var-radius-base) * 0.4)` |

- The component ships `@g4rcez/components/progress.css`.
- Its stable selectors are `.__progress`, `.__progress__indicator`, and `.__progress__label`.
- The stylesheet reads `--var-progress-track-block-size`, `--var-progress-track-radius`, `--var-progress-indicator-transition-duration`, `--var-progress-indicator-transition-timing`, `--var-color-background`, `--var-color-primary`, and `--var-color-primary-foreground`.

## Examples

### Basic progress

```tsx
<Progress value={75} />
```

### Custom range

```tsx
<Progress min={0} max={4} value={3} label="Step 3 of 4" />
```

### Accessible Names

<> <Progress value={75} label="Upload progress" /> <Progress value={75} aria-label="Download progress" /> <span id="sync-progress-label">Sync progress</span> <Progress value={75} aria-labelledby="sync-progress-label" />
</>

### Animated progress

```tsx
const [value, setValue] = useState(0);
<Progress value={value} />;
```

### Unknown duration

Use a `Spinner` or another pending-state indicator when no numeric progress is available.

```tsx
{
    isUploading ? <Spinner /> : <Progress value={uploadProgress} />;
}
```

## Do

- Use `value` in new code. Keep the value in the same domain as `min` and `max`.
- Set a descriptive `label` when a rounded percentage gives too little context.
- Keep progress updates meaningful to avoid unnecessary visual work.

## Don't

- Don't use `Progress` for an operation whose progress cannot be measured.
- Don't use the deprecated `percent` prop in new code.
- Don't style the indicator with raw colors. Override semantic `--var-*` tokens or use the component CSS contract.

## Accessibility

- When a value renders, a nonempty `label` is the accessible name of the progressbar. The default percentage text does not name the progressbar.
- When no visible `label` renders, set `aria-label` or `aria-labelledby` on `Progress`.
- Pair long-running progress with a visible status message when users need more detail.

## Data Attributes

- `data-component="progress"`: progress root.
- `data-slot="indicator"`: filled indicator.
- `data-slot="label"`: rendered only when a value is available.

## Notes

- The displayed label is `Math.round(percent) %` unless `label` is set.
- Base UI controls the indicator width from the normalized value. The component renders no indeterminate animation.


```

```
