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

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `React.ElementType` | `"h2"` | Element used for the heading. |
| `children` | `React.ReactNode` | — | Heading content. |
| `className` | `string` | — | Additional classes. |
| `...props` | Element-specific props | — | Standard props for the element selected by `as`. |

## Design Tokens

- Shared geometry uses scoped spacing/radius fallbacks. Explicit overrides win.
- Read [Geometry tokens](geometry-tokens.md) before you change density or look up library defaults.
- The component uses the `.__heading` selector and the typography tokens of the heading stylesheet, including `--var-typography-xl` and `--var-font-weight-bold`.
- Override the variables or add `className` for local styling.

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
- Don't skip heading levels to get a visual size. Style the heading instead.

## Accessibility

- The default element is a semantic `h2`.
- The `as` prop sets the rendered element to match the page outline.
- Do not rely on visual styling alone to communicate heading hierarchy.

## Interaction design and acceptance criteria

- Select `as="h1"` through `as="h6"` from the content hierarchy, independent of visual size.
- The default `h2` fits a section under the page title. It is not automatically the page title.
- Describe each section with meaningful text, so heading navigation works out of context.
- Use paragraphs for body text. Do not choose headings for their bold styling.
- Static headings MUST NOT enter the tab order.
- If a heading has a link or an adjacent action, keep the child control's native semantics, clear name, and visible focus. Do not make a static heading clickable.
- At narrow widths and 200% text enlargement, verify that long titles wrap. They MUST NOT truncate the topic or obscure nearby controls.
- Use the library typography tokens to change heading size, not the heading level.
- The component does not validate the surrounding outline and does not choose a level.
- Changing `as` to a non-heading element removes native heading semantics.

## Verification

Acceptance criteria for tests and reviews: [verify/Heading.md](verify/Heading.md).

## Data Attributes

- `data-component="heading"`: set on the rendered heading element.

## Notes

- `Heading` delegates rendering to `Polymorph` and passes standard element props through its polymorphic type.
