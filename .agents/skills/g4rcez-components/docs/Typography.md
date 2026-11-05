---
title: Typography
description: A set of text and page-structure components for consistent typographic styling.
package: "@g4rcez/components"
export: "{ Paragraph, Description, Info, PageTitle, PageHeader }"
import: "import { Paragraph, Description, Info, PageTitle, PageHeader } from '@g4rcez/components'"
category: core
---

# Typography

Text and page-structure components for consistent typographic styling. Exports `Paragraph`, `Description`, `Info`, `PageTitle`, and `PageHeader`.

## Import

```tsx
import { Paragraph, Description, Info, PageTitle, PageHeader } from "@g4rcez/components";
```

## Props

### Paragraph

Renders a `<p>` element with `text-base leading-snug`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | - | Paragraph content |
| `className` | `string` | - | Extra CSS classes |
| `...props` | `React.ComponentProps<"p">` | - | All standard `<p>` attributes |

### Description

Renders a `<p>` element with `text-sm text-secondary mb-kilo`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | - | Description content |
| `className` | `string` | - | Extra CSS classes |
| `...props` | `React.ComponentProps<"p">` | - | All standard `<p>` attributes |

### Info

Renders a labeled key-value pair in a flex container.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `Label` | - | Label text (required) |
| `children` | `React.ReactNode` | - | Value content |
| `row` | `boolean` | `false` | Show label and value side by side, not stacked |
| `disabled` | `Label` | - | When set, applies `text-disabled` to the value |
| `className` | `string` | - | Extra classes for the container |
| `info` | `Label` | - | Reserved; in the type, not rendered |
| `infoDescription` | `string` | - | Reserved; in the type, not rendered |

### PageTitle

Renders an `<h2>` title with a paragraph subtitle.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | - | Main title text (required) |
| `children` | `React.ReactNode` | - | Subtitle beneath the title |

### PageHeader

Renders a `<header>` element with title and description on the left and action slots on the right.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | - | Page title (required) |
| `description` | `Label` | - | Short description beneath the title (required) |
| `children` | `React.ReactNode` | - | Action buttons or other right-aligned content |

## Design Tokens

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-typography-description-margin-block-end` | `calc( var(--var-spacing-base) * 1 )` |
| `--var-typography-info-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-typography-page-header-gap` | `calc(var(--var-spacing-base) * 1.5)` |
| `--var-typography-page-header-actions-gap` | `calc(var(--var-spacing-base) * 1)` |

Override these CSS variables in your theme to customize the tokens the components read.

| Token | CSS Variable | Purpose |
|---|---|---|
| `text-muted-foreground` | `--var-color-muted-foreground` | Description, subtitle, and disabled `Info` value text |
| CSS override | `--var-typography-description-margin-block-end` | Description bottom margin |
| CSS override | `--var-typography-page-header-gap` | PageHeader section gap |
| CSS override | `--var-typography-page-header-actions-gap` | PageHeader action gap |

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

- Use `PageHeader` for a section title with actions when its fixed `h2` fits the page outline.
- Use `Heading as="h1"` for a page-level title.
- Use `Paragraph` instead of a raw `<p>` to inherit the base styling.
- Use `Description` for secondary text. It signals lower visual hierarchy.
- Use design-token classes for extra styling (`text-foreground`, `bg-background`).

## Don't

- Don't use `PageTitle` more than once per page. It represents the main topic of the page.
- Don't pass raw utility color classes (`text-gray-500`, `text-black`). Use `text-secondary` or `text-foreground`.
- Don't use arbitrary utility values (`text-[#555]`). Override CSS variables in your `@theme` block.
- Don't use `Info` for long-form content. It is for short labeled values.

## Accessibility

- `PageTitle` renders an `<h2>`. Make sure an `<h1>` exists elsewhere on the page.
- `PageHeader` wraps content in a semantic `<header>` element.
- `Info` labels are `<span>` elements. When the label identifies a form field, use a `<label>` with `htmlFor`.
- Keep `Description` text short and supplementary. Do not place critical content only in `Description`.

## Interaction design and acceptance criteria

- `PageTitle` always renders an `h2`. `PageHeader` embeds `PageTitle`. Neither has a heading-level prop.
- When the composition needs an `h1` or another level, use [Heading](Heading.md) with the matching `as`. Compose supporting text and actions separately.
- `Paragraph` and `Description` stay paragraphs. Larger or bolder text does not replace a semantic heading.
- Do not put required instructions only in low-contrast supporting text.
- Put actions in the `PageHeader` children, using the shared `Button` and its themes.
- Keep the static title text out of the tab order. Keep each action's specific name and visible focus.
- `PageHeader` permits action wrapping. The product MUST verify long titles, translations, 200% text enlargement, and narrow layouts. The CSS layout alone does not prove reflow or contrast compliance.
- `Info` is visual label and value markup. It is not a form-label or definition-list association.
- When assistive technology must expose that relationship, use native semantics.

## Notes

- `Paragraph` and `Description` forward standard paragraph props and merge `className`.
- `PageHeader` accepts native header props through `containerProps`.
- `PageTitle` has only `title` and `children`. `Info` accepts only its documented props.
- `PageHeader` reads `--var-typography-page-header-gap` and `--var-typography-page-header-actions-gap` for layout spacing.
- `Info` with a truthy `disabled` prop applies the muted-foreground value style. It does not disable interaction or change the label.

## Verification

Acceptance criteria for tests and reviews: [verify/Typography.md](verify/Typography.md).
