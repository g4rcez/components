---
title: Skeleton
description: Accessible animated loading placeholders for blocks, cells, and lists.
package: "@g4rcez/components"
export: "{ Skeleton, SkeletonCell, SkeletonList }"
import: "import { Skeleton, SkeletonCell, SkeletonList } from '@g4rcez/components'"
category: display
---

# Skeleton

Skeleton components show that content is loading and keep the layout stable. They render status semantics. They pulse, unless the user prefers reduced motion. Then they stay static.

## Import

```tsx
import { Skeleton, SkeletonCell, SkeletonList } from "@g4rcez/components";
```

## Props

### Skeleton props

|Prop|Type|Default|Description|
|---|---|---|---|
|`as`|`React.ElementType`|`"span"`|Element used for the placeholder.|
|`className`|`string`|—|Additional classes.|
|`style`|`React.CSSProperties`|—|Inline styles, such as a custom width.|

### SkeletonCell

`SkeletonCell` takes no props. It renders a status placeholder sized for a table or list cell.

### SkeletonList

|Prop|Type|Default|Description|
|---|---|---|---|
|`rows`|`number`|—|Number of skeleton list rows to render.|
|`className`|`string`|—|Additional classes for the list.|

## Design Tokens and CSS

- Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides remain unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

|Override|Library default|
|---|---|
|`--var-skeleton-radius`|`calc(var(--var-radius-base) / 3)`|
|`--var-skeleton-cell-block-size`|`calc(var(--var-spacing-base) * 1.5)`|
|`--var-skeleton-block-inline-size`|`calc(var(--var-spacing-base) * 8)`|
|`--var-skeleton-block-size`|`calc(var(--var-spacing-base) * 2)`|

- The stylesheet is `@g4rcez/components/skeleton.css`.
- Stable selectors: `.__skeleton`, `.__skeleton__cell`, `.__skeleton__block`, `.__skeleton__list`.
- The stylesheet reads these semantic variables: `--var-skeleton-radius`, `--var-skeleton-pulse-duration`, `--var-skeleton-pulse-opacity`, `--var-skeleton-block-inline-size`, `--var-color-muted`.

## Examples

### Block placeholder

```tsx
{
    loading ? <Skeleton as="div" /> : <Article />;
}
```

### Cell placeholder

```tsx
<table>
    {" "}
    <tbody>
        {" "}
        <tr>
            {" "}
            <td>{loading ? <SkeletonCell /> : value}</td>{" "}
        </tr>{" "}
    </tbody>
</table>
```

### List placeholder

```tsx
<SkeletonList rows={5} />
```

### Preserve a custom size

```tsx
<Skeleton as="div" style={{ inlineSize: "18rem", blockSize: "4rem" }} />
```

## Do

- Place a skeleton where the loaded content will occupy the same region.
- Set `rows` to the approximate number of items users will see.
- Use `as` and `style` when the placeholder needs the same element or dimensions as the final content.

## Don't

- Don't use a skeleton for a short operation. A spinner or no indicator is less disruptive.
- Don't expose placeholder text as completed content.
- Don't rely on animation alone to show loading. The pulse is omitted when reduced motion is preferred. Status semantics stay intact.

## Accessibility

- `Skeleton` and `SkeletonList` expose `role="status"`, `aria-busy="true"`, and a localized loading label.
- `SkeletonCell` exposes `role="status"`, `aria-busy="true"`, and the label `Loading content`.
- Replace or remove the placeholder when loading finishes. Otherwise assistive technology announces stale status.

## Data Attributes

- The components add no custom `data-*` attributes. Their stable styling contract is class-based.

## Notes

- `Skeleton` renders a `span` by default. Use `as="div"` or `as="li"` to match the surrounding structure.
- `SkeletonList` creates `li` children inside a `ul`.
- The list implementation gives each generated row a minimum width of `100%`. Use `Skeleton` directly for varied widths.
