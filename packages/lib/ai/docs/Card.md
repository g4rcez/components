---
title: Card
description: Polymorphic container for grouping related content with optional title header, loading state, and composable sub-components.
package: "@g4rcez/components"
export: "{ Card, StatsCard }"
import: "import { Card, StatsCard } from '@g4rcez/components/card'"
category: display
---

# Card

Polymorphic container that groups related content. It has an optional title header, a loading state, and composable sub-components.

## Import

```tsx
import { Card } from "@g4rcez/components/card";
```

## Props

### Card props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `React.ReactNode` | — | Renders an automatic header with border separator |
| `loading` | `boolean` | — | Replaces content with animated skeleton lines |
| `titleClassName` | `string` | `""` | Extra classes for the title header element |
| `header` | `React.ReactElement \| null` | `null` | Custom header element; overrides `title` |
| `container` | `string` | `""` | Extra classes for the outer card element |
| `as` | `React.ElementType` | `"div"` | Polymorphic root element |
| `className` | `string` | `""` | Extra classes for the card body element |
| `children` | `React.ReactNode` | — | Card body content |

### Card.Title

Composable header with a title and an optional navigation or action area.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `React.ReactElement \| string` | — | Title content |
| `titleTag` | `React.ElementType` | `"h2"` | Element type for the title |
| `navTag` | `React.ElementType` | `"nav"` | Element type for the actions wrapper |
| `as` | `React.ElementType` | `"div"` | Element type for the container |
| `children` | `React.ReactNode` | — | Action elements in the navigation area |

### StatsCard

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Metric label |
| `value` | `Label` | — | Metric value |
| `Icon` | `Icon` | `InfoIcon` | Decorative metric icon |
| `mark` | `string` | — | Extra class for the icon mark |
| `interactive` | `boolean` | `true` | Applies the interactive stats-panel styling |
| `loading` | `boolean` | — | Shows a skeleton in place of the value |

`StatsCard` is exported from the same entry point. It uses the card surface contract.

## Design Tokens

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-card-content-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-card-surface-radius` | `calc(var(--var-radius-base) / 4)` |
| `--var-card-surface-padding-block` | `calc(var(--var-spacing-base) * 0.75)` |
| `--var-card-title-margin-block-end` | `calc(var(--var-spacing-base) / 2)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-card-background` | `--var-card-background` | Card surface color |
| `border-card-border` | `--var-card-border` | Card border and title separator |
| `rounded-card-radius` | `--var-card-surface-radius` | Corner radius |
| `shadow-shadow-card` | `--var-shadow-card` | Card drop shadow |
| `bg-muted` | `--var-color-muted` | Skeleton loading lines |

## Examples

### Basic Card

```tsx
<Card>
    {" "}
    <p>Card content goes here.</p>
</Card>
```

### With Title



```tsx
<Card title="User Profile">
    {" "}
    <div className="space-y-4">
        {" "}
        <p>Name: John Doe</p> <p>Email: john@example.com</p>{" "}
    </div>
</Card>
```

### With Loading State



```tsx
<Card title="Analytics" loading={isLoading}>
    {" "}
    <p>Loaded content rendered here when not loading.</p>
</Card>
```

### StatsCard

```tsx
<StatsCard title="Active users" value="1,234" loading={isLoading} />
```

### Card.Title

with Actions

```tsx
import { Button } from "@g4rcez/components/button";
<Card>
    {" "}
    <Card.Title title="Project Overview">
        {" "}
        <Button theme="primary" size="small">
            {" "}
            Edit{" "}
        </Button>{" "}
        <Button theme="neutral" size="small">
            {" "}
            Share{" "}
        </Button>{" "}
    </Card.Title>{" "}
    <p>Project description and details.</p>
</Card>;
```

### Custom Header

```tsx
<Card
    header={
        <header className="flex justify-between items-center p-4 border-b border-card-border">
            {" "}
            <h2 className="text-foreground font-semibold">Custom Header</h2>{" "}
        </header>
    }
>
    {" "}
    <p>Content with a completely custom header.</p>
</Card>
```

### Nested Cards

```tsx
<Card title="Dashboard">
    {" "}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {" "}
        <Card title="Statistics">
            {" "}
            <p>Chart content here</p>{" "}
        </Card>{" "}
        <Card title="Recent Activity">
            {" "}
            <ul>
                {" "}
                <li>User logged in</li> <li>New order received</li>{" "}
            </ul>{" "}
        </Card>{" "}
    </div>
</Card>
```

### Semantic Element

```tsx
<Card as="article" title="Blog Post">
    {" "}
    <p>Blog post content.</p>
</Card>
```

## Do

- Give each card a clear heading with `title` or `Card.Title`.
- Use `as="article"` or `as="section"` when semantics matter.
- Use `loading={true}` while data loads, to prevent layout shift.
- Space cards in a grid consistently with gap utilities.
- Use design-token classes for wrapper elements (`bg-background`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't over-nest cards. Multiple borders and shadows create visual clutter.
- Don't put more than one primary action in a single `Card.Title`.

## Accessibility

- `Card` uses semantic HTML. `Card.Title` renders an `h2` by default. Set `titleTag` to change it.
- Set `as` to use the correct element type for the document structure.
- Interactive elements inside cards stay keyboard accessible.

## Data Attributes

- `data-component="card"`: outer card element.
- `data-component="card-title"`: automatic title header.
- `data-component="card-body"`: card body wrapper.

## Notes

- When `title` and `header` are both set, `title` wins and `header` is ignored.
- `loading` replaces children with four `Skeleton` lines of varying widths.
- `Card.Title` stacks title and actions on mobile and lays them inline on `sm+`.
