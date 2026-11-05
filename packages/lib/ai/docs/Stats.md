---
title: Stats
description: Metric display card with a prominent icon, value, and optional footer for trend or contextual data.
package: "@g4rcez/components"
export: "{ Stats }"
import: "import { Stats } from '@g4rcez/components/stats'"
category: display
---

# Stats

Metric display card with a prominent icon, value, and optional footer for trend or contextual data.

## Import

```tsx
import { Stats } from "@g4rcez/components/stats";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `Label` | — | Metric label above the value. |
| `Icon` | `React.FC<{ className: string }>` | — | Icon component (Phosphor recommended). |
| `iconContainer` | `string` | — | Extra classes for the icon background container. |
| `footer` | `React.ReactElement` | — | Optional footer for trend data or context. Without it, no divider renders. |
| `children` | `React.ReactNode` | — | The metric value (for example, a number or formatted string). |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override | Library default |
| --- | --- |
| `--var-stats-rounded` | `calc(var(--var-radius-base) * 1)` |
| `--var-stats-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-stats-icon-p` | `calc(var(--var-spacing-base) * 2)` |
| `--var-stats-icon-size` | `calc(var(--var-spacing-base) * 2.5)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| CSS override | `--var-stats-background` | Card surface |
| CSS override | `--var-stats-border-color` | Card border and footer divider |
| `rounded-stats-rounded` | `--var-stats-rounded` | Corner radius |
| `shadow-shadow-card` | `--var-shadow-card` | Card shadow |
| CSS override | `--var-stats-icon-background` | Icon container background |
| CSS override | `--var-stats-icon-foreground` | Icon color |
| CSS override | `--var-stats-title-font-size` | Title font size |
| CSS override | `--var-stats-value-font-size` | Value font size |

## Examples

### Basic Metric

```tsx
import { UsersIcon } from "@phosphor-icons/react";
<Stats title="Active Users" Icon={UsersIcon}>
    {" "}
    1,234
</Stats>;
```

### With Footer Trend

```tsx
import { TrendUpIcon, CurrencyDollarIcon } from "@phosphor-icons/react";
<Stats
    title="Revenue"
    Icon={CurrencyDollarIcon}
    iconContainer="bg-success"
    footer={
        <div className="flex items-center gap-1 text-success text-sm font-medium">
            {" "}
            <TrendUpIcon size={14} /> <span>+12% from last month</span>{" "}
        </div>
    }
>
    {" "}
    $45,200.00
</Stats>;
```

### Custom Icon Container Theme

```tsx
import { WarningCircleIcon } from "@phosphor-icons/react";
<Stats title="Error Rate" Icon={WarningCircleIcon} iconContainer="bg-danger">
    {" "}
    0.3%
</Stats>;
```

### Dashboard Grid

```tsx
import { UsersIcon, ClockIcon, TargetIcon } from "@phosphor-icons/react";
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {" "}
    <Stats title="Users" Icon={UsersIcon}>
        {" "}
        1.2k{" "}
    </Stats>{" "}
    <Stats title="Sessions" Icon={ClockIcon}>
        {" "}
        450{" "}
    </Stats>{" "}
    <Stats title="Conversion" Icon={TargetIcon}>
        {" "}
        3.2%{" "}
    </Stats>
</div>;
```

### With Skeleton Loading

```tsx
import { ChartBarIcon } from "@phosphor-icons/react";
import { Skeleton } from "@g4rcez/components";
<Stats title="Page Views" Icon={ChartBarIcon}>
    {" "}
    {isLoading ? <Skeleton className="h-9 w-24" /> : "48,301"}
</Stats>;
```

## Do

- Use clear icons that relate to the metric.
- Keep the value concise: one or two tokens, not a sentence.
- Use `iconContainer` with design-token color classes (`bg-success`, `bg-danger`) to tell metric types apart.
- Use `footer` for trend context (period-over-period comparison).

## Don't

- Don't pass raw utility color classes (`bg-green-500`, `text-red-600`) to `iconContainer` or `footer`. Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't place many `Stats` cards without logical grouping. Overuse reduces impact.
- Don't put long sentences in `title` or `children`. Both must be scannable at a glance.

## Accessibility

- The metric label is an `<h3>` element, for heading hierarchy in a dashboard.
- `props.Icon` renders the icon with a `className` prop. Phosphor icons include accessible SVG structure.
- Add `aria-label` to the icon container when the icon carries essential meaning that the title does not convey.

## Notes

- The icon container uses `size-10` with `p-8` padding (square aspect ratio). Adjust it with `iconContainer`.
- `children` renders in a `<p>` with `text-4xl font-semibold`. Pass a pre-formatted string for custom number formatting.
