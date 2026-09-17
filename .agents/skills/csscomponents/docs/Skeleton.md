---
title: Skeleton
description: Accessible animated loading placeholders for blocks, cells, and lists.
package: "@g4rcez/components"
export: "{ Skeleton, SkeletonCell, SkeletonList }"
import: "import { Skeleton, SkeletonCell, SkeletonList } from '@g4rcez/components'"
category: display
---

# Skeleton

The skeleton components indicate that content is loading while preserving a stable layout. They render status semantics and use the library's pulse animation.

## Import

```tsx
import { Skeleton, SkeletonCell, SkeletonList } from "@g4rcez/components";
```

## Props

### Skeleton

| Prop        | Type                  | Default  | Description                           |
| ----------- | --------------------- | -------- | ------------------------------------- |
| `as`        | `React.ElementType`   | `"span"` | Element used for the placeholder.     |
| `className` | `string`              | —        | Additional classes.                   |
| `style`     | `React.CSSProperties` | —        | Inline styles such as a custom width. |

### SkeletonCell

`SkeletonCell` is a ready-to-render element with no props. It renders a status placeholder sized for a table/list cell.

### SkeletonList

| Prop        | Type     | Default | Description                             |
| ----------- | -------- | ------- | --------------------------------------- |
| `rows`      | `number` | —       | Number of skeleton list rows to render. |
| `className` | `string` | —       | Additional classes for the list.        |

## Design Tokens and CSS

The component ships `@g4rcez/components/skeleton.css`. Stable selectors include `.__skeleton`, `.__skeleton__cell`, `.__skeleton__block`, and `.__skeleton__list`. The stylesheet reads semantic variables such as `--var-skeleton-radius`, `--var-skeleton-pulse-duration`, `--var-skeleton-pulse-opacity`, `--var-skeleton-block-inline-size`, and `--var-color-muted`.

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
    <tbody>
        <tr>
            <td>{loading ? <SkeletonCell /> : value}</td>
        </tr>
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

- Use a skeleton where the loaded content will occupy the same region.
- Set `rows` to the approximate number of items users will see.
- Use `as` and `style` when the placeholder needs the same semantic element or dimensions as the final content.

## Don't

- Don't use a skeleton for a short operation where a spinner or no indicator is less disruptive.
- Don't expose placeholder text as if it were completed content.
- Don't rely on the animation alone to communicate loading; keep the status semantics intact.

## Accessibility

- `Skeleton` and `SkeletonList` expose `role="status"`, `aria-busy="true"`, and a localized loading label.
- `SkeletonCell` exposes `role="status"`, `aria-busy="true"`, and the label `Loading content`.
- Replace or remove the placeholder when loading finishes so assistive technology does not announce stale status.

## Data Attributes

- The components do not add custom `data-*` attributes; their stable styling contract is class-based.

## Notes

- `Skeleton` renders a `span` by default; use `as="div"` or `as="li"` to match the surrounding structure.
- `SkeletonList` creates `li` children inside a `ul`.
- The current list implementation assigns each generated row a minimum width of `100%`; use `Skeleton` directly when varied widths are required.
