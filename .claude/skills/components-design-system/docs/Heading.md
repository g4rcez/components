---
title: Heading
description: Semantic heading wrapper that renders h2 by default and accepts a polymorphic element type.
package: "@g4rcez/components"
export: "{ Heading }"
import: "import { Heading } from '@g4rcez/components'"
category: core
---

# Heading

`Heading` renders an `h2` by default and applies the heading typography contract. Use `as` when the heading level must match the document outline.

## Import

```tsx
import { Heading } from "@g4rcez/components";
```

## Props

`Heading` accepts the standard props for the selected element through `PolymorphicProps`.

| Prop        | Type                   | Default | Description                                      |
| ----------- | ---------------------- | ------- | ------------------------------------------------ |
| `as`        | `React.ElementType`    | `"h2"`  | Element used for the heading.                    |
| `children`  | `React.ReactNode`      | —       | Heading content.                                 |
| `className` | `string`               | —       | Additional classes.                              |
| `...props`  | Element-specific props | —       | Standard props for the element selected by `as`. |

## Design Tokens

The component uses the `.__heading` selector and the typography tokens used by the heading stylesheet, including `--var-typography-xl` and `--var-font-weight-bold`. Override the variables or add `className` for local styling.

## Examples

### Default section heading

```tsx
<Heading>Account settings</Heading>
```

### Match the document outline

```tsx
<Heading as="h1">Dashboard</Heading>
<Heading as="h3">Billing details</Heading>
```

### Local styling

```tsx
<Heading className="text-foreground">Project overview</Heading>
```

## Do

- Keep heading levels in document order.
- Use `as="h1"` for the page title when the page needs an `h1`.
- Use design tokens for local color and spacing changes.

## Don't

- Don't use `Heading` for text that is not a heading.
- Don't skip heading levels only to get a visual size; style the heading instead.

## Accessibility

- The default element is a semantic `h2`.
- The `as` prop lets the rendered element match the page outline.
- Do not rely on visual styling alone to communicate heading hierarchy.

## Data Attributes

- `data-component="heading"` — set on the rendered heading element.

## Notes

- `Heading` delegates element rendering to `Polymorph` and forwards standard element props and refs through the polymorphic type.
