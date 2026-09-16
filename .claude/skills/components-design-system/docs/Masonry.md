---
title: Masonry
description: Measured masonry layout that preserves source order while placing items in columns of uneven height.
package: "@g4rcez/components"
export: "{ Masonry, MasonryItem }"
import: "import { Masonry, MasonryItem } from '@g4rcez/components/masonry'"
category: display
---

# Masonry

`Masonry` measures its children with `ResizeObserver` and positions them in the shortest column. The DOM and reading order stay the same as the authored child order. It uses absolute positioning rather than experimental CSS masonry support.

## Import

```tsx
import { Masonry, MasonryItem } from "@g4rcez/components/masonry";
```

## Props

### Masonry

`Masonry` accepts the standard props for its polymorphic root element (`ul` by default) and these component props:

| Prop             | Type                         | Default | Description |
| ---------------- | ---------------------------- | ------- | ----------- |
| `columns`        | `number`                     | `3`     | Number of layout columns. Values below `1` are clamped to `1`. |
| `gutter`         | `number`                     | `16`    | Gap between columns and rows in pixels. |
| `fresh`          | `React.Key`                 | —       | Changes this value to request a fresh measurement. |
| `itemAs`         | `React.ElementType`          | `"li"` | Element used for ordinary child items. |
| `itemClassName`  | `string`                     | —       | Class applied to every rendered item wrapper. |
| `onLayoutChange` | `(layout: MasonryLayout) => void` | —    | Receives the computed columns, height, gutter, and item positions. |

### MasonryItem

`MasonryItem` is an optional wrapper for an item that needs an explicit width. It accepts standard props for its polymorphic root (`li` by default) and:

| Prop       | Type                    | Default | Description |
| ---------- | ----------------------- | ------- | ----------- |
| `width`    | `React.CSSProperties["width"]` | — | Requested item width, such as `"100%"` to reserve a full row. |
| `children` | `React.ReactNode`       | —       | Item content. |

`MasonryLayout` has the shape `{ columns, gutter, height, items }`. Each item contains `index`, `column`, `top`, `left`, `width`, and `height`.

## Design Tokens

Masonry has no component-specific design tokens. Its generated CSS contract is `.__masonry` and `.__masonry__item`; add spacing, surface, and color tokens to the child content or override the component selectors in your stylesheet.

## Examples

### Basic layout

```tsx
<Masonry columns={3} gutter={16}>
    <Card title="First">Short content.</Card>
    <Card title="Second">Content with a different height.</Card>
    <Card title="Third">More content.</Card>
</Masonry>
```

### Full-width item

```tsx
<Masonry columns={3}>
    <MasonryItem width="100%">
        <Card title="Featured">This item spans the available row.</Card>
    </MasonryItem>
    <Card title="One">Column content.</Card>
    <Card title="Two">Column content.</Card>
</Masonry>
```

### Observe the calculated layout

```tsx
<Masonry onLayoutChange={(layout) => console.info(layout)}>
    {items.map((item) => (
        <Card key={item.id} title={item.title}>
            {item.content}
        </Card>
    ))}
</Masonry>
```

## Do

- Keep child keys stable so measurements map to the correct items.
- Use `MasonryItem` for featured or explicit-width content.
- Use `fresh` after an external layout change that is not observed automatically.
- Keep the root semantic (`ul`/`li`) unless another structure is required.

## Don't

- Don't depend on visual column order for meaning; source order is the accessible order.
- Don't use Masonry for content that must be read row-by-row across columns.
- Don't use experimental CSS masonry rules on the same root.

## Accessibility

- The default root is a `ul` and ordinary items are `li` elements.
- Children remain in source order for screen readers and keyboard navigation.
- Use `itemAs` and the root `as` prop to provide the correct semantics when the content is not a list.

## Data Attributes

- `data-component="masonry"` — root layout element.
- `data-component="masonry-item"` — each rendered item wrapper.

## Notes

- Measurements update after mount, on resize, and after captured image `load` or `error` events.
- The layout height is applied to the root so absolutely positioned items do not collapse the container.
- `Masonry` uses `ResizeObserver` when available and does not require a CSS masonry browser feature.
