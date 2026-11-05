---
title: Tag
description: A label/badge component for displaying metadata, status, or categorization information.
package: "@g4rcez/components"
export: "{ Tag }"
import: "import { Tag } from '@g4rcez/components/tag'"
category: core
---

# Tag

Label badge for metadata, status, or category. Polymorphic, with several visual variants.

## Import

```tsx
import { Tag } from "@g4rcez/components/tag";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral" \| "custom" \| "disabled" \| "loading"` | `"primary"` | Visual theme of the tag. |
| `appearance` | `"solid" \| "soft"` | `"solid"` | `soft` applies to six themes only. See Appearance. |
| `size` | `"icon" \| "small" \| "default" \| "big" \| "tiny"` | `"default"` | Size of the tag. |
| `icon` | `React.ReactNode` | - | Icon inside the tag. |
| `indicator` | `"primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral"` | - | Shows a small colored dot before the label. |
| `loading` | `boolean` | `false` | Overrides `theme` with the loading appearance. |
| `as` | `React.ElementType` | `"span"` | HTML element to render. |
| `className` | `string` | - | Additional CSS classes. |
| `children` | `React.ReactNode` | - | Tag content. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks of `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. For default lookup, radius migration, theme emission, and exceptions, see [Geometry tokens](geometry-tokens.md). The table shows examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
| --- | --- |
| `--var-tag-surface-gap` | `calc(var(--var-spacing-base) * 0.375)` |
| `--var-tag-surface-radius` | `calc(var(--var-radius-base) * 2.666667)` |
| `--var-tag-indicator-size` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-tag-default-min-block-size` | `calc(var(--var-spacing-base) * 2)` |

Tailwind utility mappings and component tokens. When a legacy utility targets another surface, the Purpose column names the actual token.

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `bg-tag-primary-bg` | `--var-tag-primary-background` | Primary background |
| `text-tag-primary-text` | `--var-tag-primary-foreground` | Primary text color |
| `bg-tag-secondary-bg` | `--var-tag-secondary-background` | Secondary background |
| `text-tag-secondary-text` | `--var-tag-secondary-foreground` | Secondary text color |
| `bg-tag-info-bg` | `--var-tag-info-background` | Info background |
| `text-tag-info-text` | `--var-tag-info-foreground` | Info text color |
| `bg-tag-warn-bg` | `--var-tag-warn-background` | Warn background |
| `text-tag-warn-text` | `--var-tag-warn-foreground` | Warn text color |
| `bg-tag-danger-bg` | `--var-tag-danger-background` | Danger background |
| `text-tag-danger-text` | `--var-tag-danger-foreground` | Danger text color |
| `bg-tag-success-bg` | `--var-tag-success-background` | Success background |
| `text-tag-success-text` | `--var-tag-success-foreground` | Success text color |
| `bg-tag-muted-bg` | `--var-tag-muted-background` | Muted background |
| `text-tag-muted-text` | `--var-tag-muted-foreground` | Muted text color |
| `bg-disabled` | `--var-color-disabled` | Disabled utility. Disabled and loading tags use `--var-tag-disabled-background`. |
| `border-card-border` | `--var-card-border` | Card border utility. Neutral tags use `--var-tag-neutral-border`. |
| `rounded-tag-surface-radius` | `--var-tag-surface-radius` | Border radius |
| `bg-primary` | `--var-color-primary` | Primary indicator dot |
| `bg-secondary` | `--var-color-secondary` | Secondary indicator dot |
| `bg-info` | `--var-color-info` | Info indicator dot |
| `bg-warn` | `--var-color-warn` | Warn indicator dot |
| `bg-danger` | `--var-color-danger` | Danger indicator dot |
| `bg-success` | `--var-color-success` | Success indicator dot |
| `bg-muted` | `--var-color-muted` | Muted indicator dot |
| CSS override | `--var-tag-soft-<theme>-background` | Soft background (`primary`, `info`, `warn`, `danger`, `success`, `neutral`) |
| CSS override | `--var-tag-soft-<theme>-foreground` | Soft text color. Each pair has a contrast of 7:1 or more in light and dark. |
| CSS override | `--var-tag-soft-<theme>-border` | Soft hairline border (decorative) |

## Theme Variants

- `primary`: primary brand color.
- `secondary`: secondary color scheme.
- `info`: informational style.
- `warn`: warning style.
- `danger`: error or destructive style.
- `success`: success style.
- `muted`: subdued style.
- `neutral`: transparent with card border.
- `custom`: no default style. Supply all classes through `className`.
- `disabled`: disabled appearance with reduced opacity.
- `loading`: muted loading appearance. The `loading` prop also sets it. The pulse is omitted when reduced motion is preferred.

## Appearance

- `solid` (default): the theme colors above.
- `soft`: light background, dark text, and a hairline border. Use it for status tags in dense views such as a `Table`. Example: `<Tag theme="success" appearance="soft">Won</Tag>`.
- `soft` applies to `primary`, `info`, `warn`, `danger`, `success`, and `neutral`. Other themes ignore it. For other hues, use `theme="custom"`.

## Examples

### Basic Variants

```tsx
<>
    <Tag theme="primary">Primary</Tag>
    <Tag theme="secondary">Secondary</Tag>
    <Tag theme="info">Info</Tag>
    <Tag theme="warn">Warning</Tag>
    <Tag theme="danger">Error</Tag>
    <Tag theme="success">Success</Tag>
    <Tag theme="muted">Muted</Tag>
    <Tag theme="neutral">Neutral</Tag>
</>
```

### Sizes

```tsx
<>
    <Tag size="small">Small</Tag>
    <Tag size="default">Default</Tag>
    <Tag size="big">Big</Tag>
</>
```

### With Icons

```tsx
import { StarIcon, CheckIcon } from "@phosphor-icons/react";
<>
    <Tag icon={<StarIcon size={14} />} theme="warn">
        Featured
    </Tag>
    <Tag icon={<CheckIcon size={14} />} theme="success">
        Completed
    </Tag>
</>;
```

### With Indicators

```tsx
<>
    <Tag indicator="success">Online</Tag>
    <Tag indicator="danger">Offline</Tag>
    <Tag indicator="warn">Pending</Tag>
</>
```

### Status Tags

```tsx
const statusMap: Record<string, { theme: "success" | "warn" | "muted" | "danger" }> = {
    active: { theme: "success" },
    pending: { theme: "warn" },
    inactive: { theme: "muted" },
    error: { theme: "danger" },
};
const StatusTag = ({ status }: { status: string }) => {
    const config = statusMap[status] ?? statusMap.inactive;
    return (
        <Tag theme={config.theme} indicator={config.theme}>
            {" "}
            {status.charAt(0).toUpperCase + status.slice(1)}{" "}
        </Tag>
    );
};
```

### Loading State

```tsx
<Tag loading theme="primary">
    {" "}
    Processing...
</Tag>
```

### Polymorphic Usage

```tsx
<>
    <Tag as="button" onClick={() => void 0} theme="primary">
        {" "}
        Clickable Tag
    </Tag>{" "}
    <Tag as="a" href="/category/react" theme="info">
        {" "}
        React
    </Tag>
</>
```

### Content Categorization

```tsx
const categories = [
    { name: "React", theme: "info" },
    { name: "TypeScript", theme: "primary" },
    { name: "CSS", theme: "success" },
] as const;
<div className="flex gap-2 flex-wrap">
    {" "}
    {categories.map((cat) => (
        <Tag key={cat.name} theme={cat.theme}>
            {" "}
            {cat.name}{" "}
        </Tag>
    ))}
</div>;
```

### Notification Badge

```tsx
import { BellIcon } from "@phosphor-icons/react";
<div className="relative">
    {" "}
    <BellIcon size={24} />{" "}
    <Tag size="small" theme="danger" className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs">
        {" "}
        3{" "}
    </Tag>
</div>;
```

## Do

- Use `theme="success"` for positive states and `theme="danger"` for errors. Keep the mapping consistent.
- Keep tag labels short.
- Use `indicator` to add color meaning without extra text.
- Use `as="button"` when the tag runs an action (for example, removing a filter).
- Use design-token classes on wrapper elements (`bg-muted`, `border-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`). Use the `theme` prop.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use many different themes on one screen.
- Don't use `Tag` instead of `Button` for primary actions.
- Don't combine `icon` and `indicator` on a small tag.

## Accessibility

- The `as` prop sets the semantic element. The default is `<span>`.
- The indicator dot has `aria-hidden="true"`. It is decorative.
- When `as` is `button` or `a`, standard keyboard navigation applies.
- Supplement color meaning with text. Do not rely on color alone.

## Data Attributes

- `data-component="tag"`: identifies the component for styling and tests.
- `data-theme`: current theme value.

## Notes

- `loading` overrides `theme`. When `loading` becomes `false`, the original `theme` returns.
- The component forwards refs to the underlying element.
- The component forwards all standard HTML attributes of the target element.
