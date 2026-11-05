---
title: Masonry
description: Measured masonry layout that preserves source order while placing items in columns of uneven height.
package: "@g4rcez/components"
export: "{ Masonry, MasonryItem }"
import: "import { Masonry, MasonryItem } from '@g4rcez/components/masonry'"
category: display
---

# Masonry

`Masonry` measures its children with `ResizeObserver` and places each child in the shortest column. DOM order and reading order stay the same as the child order you write. It uses absolute positioning, not experimental CSS masonry.

## Import

```tsx
import { Masonry, MasonryItem } from "@g4rcez/components/masonry";
```

## Props

### Masonry

`Masonry` accepts the standard props of its polymorphic root element (`ul` by default) and these props:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `number` | `3` | Number of columns. Values below `1` become `1`. |
| `gutter` | `number` | `16` | Gap between columns and rows, in pixels. |
| `fresh` | `React.Key` | — | Change this value to request a new measurement. |
| `itemAs` | `React.ElementType` | `"li"` | Element for ordinary child items. |
| `itemClassName` | `string` | — | Class for every item wrapper. |
| `onLayoutChange` | `(layout: MasonryLayout) => void` | — | Receives the computed columns, height, gutter, and item positions. |

### MasonryItem

`MasonryItem` is an optional wrapper for an item that needs an explicit width. It accepts the standard props of its polymorphic root (`li` by default) and:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `React.CSSProperties["width"]` | — | Requested item width. `"100%"` reserves a full row. |
| `children` | `React.ReactNode` | — | Item content. |

`MasonryLayout` has the shape `{ columns, gutter, height, items }`. Each item has `index`, `column`, `top`, `left`, `width`, and `height`.

## Design Tokens

Masonry has no component-specific design tokens. Its generated CSS contract is `.__masonry` and `.__masonry__item`. Add spacing, surface, and color tokens to the child content, or override these selectors in your stylesheet.

## Examples

### Basic layout

```tsx
<Masonry columns={3} gutter={16}>
    {" "}
    <Card title="First">Short content.</Card> <Card title="Second">Content with a different height.</Card> <Card title="Third">More content.</Card>
</Masonry>
```

### Full-width item

```tsx
<Masonry columns={3}>
    {" "}
    <MasonryItem width="100%">
        {" "}
        <Card title="Featured">This item spans the available row.</Card>{" "}
    </MasonryItem>{" "}
    <Card title="One">Column content.</Card> <Card title="Two">Column content.</Card>
</Masonry>
```

### Observe the calculated layout

```tsx
<Masonry onLayoutChange={(layout) => console.info(layout)}>
    {" "}
    {items.map((item) => (
        <Card key={item.id} title={item.title}>
            {" "}
            {item.content}{" "}
        </Card>
    ))}
</Masonry>
```

## Do

- Keep child keys stable, so measurements map to the correct items.
- Use `MasonryItem` for featured or explicit-width content.
- Change `fresh` after an external layout change that `Masonry` does not observe.
- Keep the semantic root (`ul`/`li`) unless the content needs another structure.

## Don't

- Don't give meaning to visual column order. Source order is the accessible order.
- Don't use `Masonry` for content that users must read row by row across columns.
- Don't use experimental CSS masonry rules on the same root.

## Accessibility

- The default root is a `ul`. Ordinary items are `li` elements.
- Children stay in source order for screen readers and keyboard navigation.
- When the content is not a list, set `itemAs` and the root `as` prop to the correct semantics.

## Data Attributes

- `data-component="masonry"`: root layout element.
- `data-component="masonry-item"`: each item wrapper.

## Notes

- Measurements update after mount, on resize, and after captured image `load` or `error` events.
- The layout height is set on the root, so absolutely positioned items do not collapse the container.
- `Masonry` uses `ResizeObserver` when available. It needs no CSS masonry browser feature.
