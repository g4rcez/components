---
title: Typography
description: A set of text and page-structure components for consistent typographic styling.
package: "@g4rcez/components"
export: "{ Paragraph, Description, Info, PageTitle, PageHeader }"
import: "import { Paragraph, Description, Info, PageTitle, PageHeader } from '@g4rcez/components'"
category: core
---

# Typography

A set of text and page-structure components for consistent typographic styling across the application. Exports `Paragraph`, `Description`, `Info`, `PageTitle`, and `PageHeader`.

## Import

```tsx
import { Paragraph, Description, Info, PageTitle, PageHeader } from "@g4rcez/components";
```

## Props

### Paragraph

Renders a `<p>` element with `text-base leading-snug`.

| Prop        | Type                        | Default | Description                   |
| ----------- | --------------------------- | ------- | ----------------------------- |
| `children`  | `React.ReactNode`           | -       | Paragraph content             |
| `className` | `string`                    | -       | Additional CSS classes        |
| `...props`  | `React.ComponentProps<"p">` | -       | All standard `<p>` attributes |

### Description

Renders a `<p>` element with `text-sm text-secondary mb-kilo`.

| Prop        | Type                        | Default | Description                   |
| ----------- | --------------------------- | ------- | ----------------------------- |
| `children`  | `React.ReactNode`           | -       | Description content           |
| `className` | `string`                    | -       | Additional CSS classes        |
| `...props`  | `React.ComponentProps<"p">` | -       | All standard `<p>` attributes |

### Info

Renders a labeled key-value pair in a flex container.

| Prop              | Type              | Default | Description                                                |
| ----------------- | ----------------- | ------- | ---------------------------------------------------------- |
| `label`           | `Label`           | -       | The label text (required)                                  |
| `children`        | `React.ReactNode` | -       | The value content                                          |
| `row`             | `boolean`         | `false` | Renders label and value side-by-side instead of stacked    |
| `disabled`        | `Label`           | -       | When set, applies `text-disabled` to the value             |
| `className`       | `string`          | -       | Additional classes for the container                       |
| `info`            | `Label`           | -       | Reserved field (available in type, not currently rendered) |
| `infoDescription` | `string`          | -       | Reserved field (available in type, not currently rendered) |

### PageTitle

Renders an `<h2>` title with a paragraph subtitle.

| Prop       | Type              | Default | Description                               |
| ---------- | ----------------- | ------- | ----------------------------------------- |
| `title`    | `string`          | -       | Main title text (required)                |
| `children` | `React.ReactNode` | -       | Subtitle or description beneath the title |

### PageHeader

Renders a `<header>` element with title/description on the left and action slots on the right.

| Prop          | Type              | Default | Description                                    |
| ------------- | ----------------- | ------- | ---------------------------------------------- |
| `title`       | `string`          | -       | Page title (required)                          |
| `description` | `Label`           | -       | Short description beneath the title (required) |
| `children`    | `React.ReactNode` | -       | Action buttons or other right-aligned content  |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                        | Library default                       |
| ----------------------------------------------- | ------------------------------------- |
| `--var-typography-description-margin-block-end` | `calc( var(--var-spacing-base) * 1 )` |
| `--var-typography-info-gap`                     | `calc(var(--var-spacing-base) * 1)`   |
| `--var-typography-page-header-gap`              | `calc(var(--var-spacing-base) * 1.5)` |
| `--var-typography-page-header-actions-gap` | `calc(var(--var-spacing-base) * 1)` |

Tokens these components read. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable            | Purpose                                         |
| ----------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| `text-muted-foreground` | `--var-color-muted-foreground`                  | Description, subtitle, and disabled `Info` value text |
| CSS override            | `--var-typography-description-margin-block-end` | Description bottom margin                             |
| CSS override            | `--var-typography-page-header-gap`              | PageHeader section gap                                |
| CSS override            | `--var-typography-page-header-actions-gap`      | PageHeader action gap                                 |

## Examples

### Page Header with Actions

```tsx
import { Button } from "@g4rcez/components/button";
<PageHeader title="Orders" description="List of all orders from your shop">
    {" "}
    <Button size="small">Export CSV</Button>{" "}
    <Button theme="primary" size="small">
        {" "}
        Create Order{" "}
    </Button>
</PageHeader>;
```

### Standalone Page Title

```tsx
<PageTitle title="Dashboard">Overview of your application metrics</PageTitle>
```

### Paragraph

and Description

```tsx
<>
    <Paragraph> This is a standard paragraph with base font size and snug line height.</Paragraph>{" "}
    <Description> Secondary description text, typically used beneath form fields or titles.</Description>
</>
```

### Info

— Stacked (default)

```tsx
<>
    <Info label="Full Name">John Doe</Info>
    <Info label="Email">john@example.com</Info>
    <Info label="Role">Administrator</Info>
</>
```

### Info

— Row Layout

```tsx
<>
    <Info label="Status" row>
        Active
    </Info>
    <Info label="Plan" row>
        Pro
    </Info>
</>
```

### Info

— Disabled Value

```tsx
<Info label="API Key" disabled="true">
    {" "}
    sk-••••••••••••••••
</Info>
```

### Profile Card

```tsx
<div className="flex flex-col gap-base rounded-card-radius border border-border bg-card-background p-4">
    {" "}
    <PageTitle title="John Doe">Software Engineer</PageTitle>{" "}
    <div className="flex flex-col gap-sm">
        {" "}
        <Info label="Email" row>
            {" "}
            john@example.com{" "}
        </Info>{" "}
        <Info label="Team" row>
            {" "}
            Platform{" "}
        </Info>{" "}
        <Info label="Joined" row>
            {" "}
            March 2024{" "}
        </Info>{" "}
    </div>
</div>
```

## Do

- Use `PageHeader` for a section title + action layout when its fixed `h2` fits the page outline; use `Heading as="h1"` for a page-level title
- Use `Paragraph` instead of raw `<p>` to inherit consistent base styling
- Use `Description` for secondary/supporting text — it signals lower visual hierarchy
- Use design-token classes for any additional styling (`text-foreground`, `bg-background`)

## Don't

- Don't use `PageTitle` more than once per page — it represents the page's main topic
- Don't pass raw utility color classes (`text-gray-500`, `text-black`) — use `text-secondary` or `text-foreground`
- Don't use arbitrary utility values (`text-[#555]`) — override CSS variables in your `@theme` block
- Don't use `Info` for long-form content — it is designed for short labeled values

## Accessibility

- `PageTitle` renders an `<h2>` — ensure there is an `<h1>` elsewhere on the page
- `PageHeader` wraps content in a semantic `<header>` element
- `Info` labels are `<span>` elements; if the label identifies a form field, prefer a `<label>` with `htmlFor` instead
- `Description` text should be concise and supplementary — do not place critical content only in `Description`

## Interaction design and acceptance criteria

- `PageTitle` always renders an `h2`, and `PageHeader` embeds `PageTitle`. Neither exposes a heading-level prop. If the composition needs an `h1` or another level, use [Heading](Heading.md) with the matching `as` and compose supporting text/actions separately.

- `Paragraph` and `Description` remain paragraphs; larger or bolder text is not a replacement for a semantic heading. Do not put required instructions only in low-contrast supporting text.
- Put actions in the `PageHeader` children using the shared `Button` and its themes. Keep the title's static text out of the tab order and preserve each action's specific name and visible focus.
- `PageHeader` permits action wrapping, but the product must verify long titles, translations, 200% text enlargement, and narrow layouts. Do not assume the CSS layout alone proves reflow or contrast compliance.
- `Info` is visual label/value markup, not a form-label or definition-list association. Use appropriate native semantics when those relationships must be exposed to assistive technology.

## Acceptance criteria

1. **Given** a page-title composition, **when** the document outline is inspected, **then** its fixed `h2` fits the surrounding hierarchy or is replaced by a correctly leveled `Heading` composition.
2. **Given** title actions, **when** the user navigates by keyboard, **then** static title text is skipped and actions receive visible focus in reading order.
3. **Given** a narrow viewport or enlarged text, **when** the title and actions wrap, **then** their full text remains readable and all actions remain operable.
4. **Given** heading navigation with assistive technology, **when** the title is reached, **then** its topic and level are available; supporting paragraphs do not masquerade as headings.

## Notes

- `Paragraph` and `Description` forward standard paragraph props and merge `className`. `PageHeader` accepts native header props through `containerProps`; `PageTitle` has only `title` and `children`, and `Info` accepts its documented props.
- `PageHeader` reads `--var-typography-page-header-gap` and `--var-typography-page-header-actions-gap` for layout spacing.
- `Info` with a truthy `disabled` prop applies the muted-foreground value style; it does not disable interaction or change the label.
