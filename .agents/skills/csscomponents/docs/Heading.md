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

Shared geometry uses scoped spacing/radius fallbacks; explicit overrides win. Read [Geometry tokens](geometry-tokens.md) before changing density or looking up library defaults. The component uses the `.__heading` selector and the typography tokens used by the heading stylesheet, including `--var-typography-xl` and `--var-font-weight-bold`. Override the variables or add `className` for local styling.

## Examples

### Default section heading

```tsx
<Heading>Account settings</Heading>
```

### Match the document outline

```tsx
<>
    <Heading as="h1">Dashboard</Heading>
    <Heading as="h2">Billing</Heading>
    <Heading as="h3">Billing details</Heading>
</>
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

## Interaction design and acceptance criteria

- Select `as="h1"` through `as="h6"` from the content hierarchy, independently of visual size. The default `h2` is appropriate for a section under the page title, not automatically for the page title itself.

- Describe each section with meaningful text so heading navigation is useful out of context. Use paragraphs for body text rather than headings chosen for their bold styling.
- Static headings should not enter the tab order. If a heading includes a link or an adjacent action, retain the child control's native semantics, clear name, and visible focus; do not make an otherwise static heading clickable.
- At narrow widths and 200% text enlargement, verify that long titles wrap without truncating the topic or obscuring nearby controls. Use the library's typography tokens rather than changing heading level to change its size.
- The component does not validate the surrounding outline or automatically choose a level. Changing `as` to a non-heading element removes native heading semantics.

## Acceptance criteria

1. **Given** a page with sections and subsections, **when** its heading outline is inspected, **then** each level reflects the actual hierarchy, including a meaningful page heading.
2. **Given** static headings, **when** the user presses Tab, **then** only associated interactive controls receive focus, in logical document order.
3. **Given** desktop or mobile heading navigation, **when** the user moves between headings, **then** the topic and structural level are available without relying on visual styling.
4. **Given** a long title, **when** text is enlarged to 200% or the viewport narrows, **then** the title remains readable and associated actions remain reachable.

## Data Attributes

- `data-component="heading"` — set on the rendered heading element.

## Notes

- `Heading` delegates rendering to `Polymorph` and passes standard element props through its polymorphic type.
