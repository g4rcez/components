---
title: Button
description: A versatile button component with multiple variants, sizes, and states.
package: "@g4rcez/components"
export: "{ Button }"
import: "import { Button } from '@g4rcez/components/button'"
category: core
---

# Button

Button with variants, sizes, and states. It renders as other HTML elements through the polymorphic `as` prop.

## Import

```tsx
import { Button } from "@g4rcez/components/button";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `theme` | `"main" \| "primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral" \| "ghost-primary" \| "ghost-secondary" \| "ghost-info" \| "ghost-warn" \| "ghost-danger" \| "ghost-success" \| "ghost-muted" \| "ghost-neutral" \| "raw" \| "disabled" \| "loading"` | `"main"` | Visual variant. |
| `size` | `"icon" \| "min" \| "small" \| "default" \| "big" \| "tiny"` | `"default"` | Button size. |
| `rounded` | `"rough" \| "squared" \| "default" \| "circle"` | `"default"` | Border radius style. |
| `icon` | `React.ReactNode` | - | Icon shown before the content. |
| `loading` | `boolean` | `false` | Shows a disabled loading state. Reduced motion omits the pulse. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `as` | `React.ElementType` | `"button"` | Element to render. |
| `type` | `string` | `"button"` | Button `type` attribute. |
| `className` | `string` | - | Extra CSS classes. |
| `children` | `React.ReactNode` | - | Button content. |

## Design Tokens

- `--var-button-icon-font-size` keeps its legacy name but controls icon geometry, including SVG dimensions. Its default derives from spacing.
- Button text uses the independent typography tokens.
- Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The exported `defaultGeometryTokens` map has the full set. Current plain-CSS geometry examples:

| Override | Library default |
| --- | --- |
| `--var-button-gap` | `calc(var(--var-spacing-base) * 0.375)` |
| `--var-button-focus-ring-width` | `calc(var(--var-spacing-base) / 4)` |
| `--var-button-height` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-button-py` | `calc(var(--var-spacing-base) / 2)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `bg-button-primary-bg` | `--var-color-primary` | Background for primary/main theme |
| `text-button-primary-text` | `--var-color-primary-foreground` | Text for primary/main theme |
| `bg-button-secondary-bg` | `--var-button-secondary-background` | Background for secondary theme |
| `text-button-secondary-text` | `--var-button-secondary-foreground` | Text for secondary theme |
| `bg-button-info-bg` | `--var-color-info` | Background for info theme |
| `text-button-info-text` | `--var-color-info-foreground` | Text for info theme |
| `bg-button-warn-bg` | `--var-color-warn` | Background for warn theme |
| `text-button-warn-text` | `--var-color-warn-foreground` | Text for warn theme |
| `bg-button-danger-bg` | `--var-color-danger` | Background for danger theme |
| `text-button-danger-text` | `--var-color-danger-foreground` | Text for danger theme |
| `bg-button-success-bg` | `--var-color-success` | Background for success theme |
| `text-button-success-text` | `--var-color-success-foreground` | Text for success theme |
| `bg-button-muted-bg` | `--var-color-muted` | Background for muted theme |
| `text-button-muted-text` | `--var-color-muted-foreground` | Text for muted theme |
| `bg-disabled` | `--var-color-disabled` | Background for disabled/loading states |
| `border-border` | `--var-color-border` | Neutral theme border |
| `rounded-button-rounded` | `--var-button-rounded` | Default border radius |
| `text-button-text` | `--var-button-font-size` | Default font size |
| `text-button-text-big` | `--var-button-big-font-size` | Big font size |
| `text-button-text-small` | `--var-button-small-font-size` | Small font size |
| `text-button-text-min` | `--var-button-min-font-size` | Min font size |
| `text-button-text-tiny` | `--var-button-tiny-font-size` | Tiny font size |
| `text-button-text-icon` | `--var-button-icon-font-size` | Icon geometry |
| `focus-visible:ring-ring` | `--var-color-ring` | Focus ring color |

## Theme Variants

### Solid Variants

- `main` / `primary`: primary brand action.
- `secondary`: secondary action.
- `info`: informational action.
- `warn`: warning action.
- `danger`: destructive action.
- `success`: confirmation or success action.
- `muted`: subdued appearance.
- `neutral`: transparent with card border.

### Ghost Variants

Transparent background, colored text, tinted background on hover.

- `ghost-primary`, `ghost-secondary`, `ghost-info`, `ghost-warn`, `ghost-danger`, `ghost-success`, `ghost-muted`, `ghost-neutral`

### Special Variants

- `raw`: no default styling. Supply all classes through `className`.
- `disabled`: disabled appearance. Use the `disabled` prop for full behavior.
- `loading`: muted loading appearance. Reduced motion omits its pulse.

## Examples

### Basic Variants

```tsx
<>
    <Button theme="primary">Primary</Button>
    <Button theme="secondary">Secondary</Button>
    <Button theme="danger">Delete</Button>
    <Button theme="success">Save</Button>
</>
```

### Sizes

```tsx
<>
    <Button size="min">Mini</Button>
    <Button size="small">Small</Button>
    <Button size="default">Default</Button>
    <Button size="big">Big</Button>
</>
```

### With Icons

```tsx
import { PlusIcon } from "@phosphor-icons/react";
<>
    <Button icon={<PlusIcon size={16} />}>Add Item</Button>{" "}
    <Button size="icon" theme="ghost-primary" aria-label="Add item">
        {" "}
        <PlusIcon aria-hidden="true" />
    </Button>
</>;
```

### Loading State

```tsx
<Button loading>Saving...</Button>
```

### Ghost Variants

```tsx
<>
    <Button theme="ghost-primary">Ghost Primary</Button>
    <Button theme="ghost-danger">Ghost Danger</Button>
</>
```

### Polymorphic Usage

```tsx
<Button as="a" href="/dashboard" theme="primary">
    {" "}
    Go to Dashboard
</Button>
```

### Rounded Variants

```tsx
<>
    <Button rounded="squared">Squared</Button>
    <Button rounded="circle" size="icon" aria-label="Add item">
        {" "}
        <PlusIcon aria-hidden="true" />
    </Button>
</>
```

## Do

- Use `theme="primary"` for the single main action on a page.
- Use `theme="danger"` for destructive actions (delete, remove).
- Use the `loading` prop for immediate feedback on async operations.
- Use `as="a"` with `href` when the button navigates to a URL.
- Use design-token classes on wrapper elements (`bg-primary`, `text-foreground`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`). Use the `theme` prop.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't place multiple `theme="primary"` buttons in one view.
- Don't use `theme="primary"` for destructive actions. Use `theme="danger"`.

## Interaction design and acceptance criteria

- Use the default button to submit, change state, or open a panel.
- Use `as="a"` with a real `href` for navigation.
- A ghost theme does not turn an action into a link. A solid theme does not turn a link into an action.
- Give each action a specific visible label.
- Icon-only controls need an accessible name such as `aria-label`. Hide decorative icons from assistive technology.
- Include contextual names when several rows have the same action.
- Keep the shipped hover, pressed, and focus-visible feedback.
- Verify touch-target size, spacing, contrast, and label clipping in the selected size and theme. `size="icon"` alone does not guarantee an adequate target.
- Use `loading`, not only `theme="loading"`, to prevent repeat activation.
- Explain an unavailable action with nearby text. Do not use a tooltip on a disabled button.
- Provide perceivable completion and error feedback. `aria-busy` is not a success announcement.
- When a button opens hidden content, the composition owns `aria-expanded`, `aria-controls`, initial focus, and focus restoration.
- A link that opens a new window needs an understandable warning. The component adds none.

## Accessibility

- The default element is a semantic `<button>`.
- Native buttons support Enter and Space. They leave the tab order when `disabled` or `loading`.
- Those native semantics do not apply to arbitrary `as` targets. A custom `as` target needs its own semantic contract.
- Keyboard behavior of native buttons and anchors follows the rendered element.
- `aria-disabled` is set when `disabled` or `loading` is true.
- `aria-busy` is set during loading.
- Click handlers are removed while loading or disabled.
- For `as="a"`, disabled or loading states remove `href`, so native link activation cannot navigate. A custom router component MUST preserve equivalent behavior.
- A CSS `:focus-visible` ring shows focus. Forced-colors mode uses a system-color outline.

## Data Attributes

- `data-component="button"`: identifies the component for styling and testing.
- `data-theme`: current theme variant value.
- `data-loading`: `"true"` when loading. Omitted otherwise.

## Notes

- When `loading` is `true`, `disabled` is also set to `true`.
- Refs forward to the underlying element.
- All standard HTML attributes of the button or target element are forwarded.
- The `as` prop renders any HTML element or React component and keeps full TypeScript type safety.

## Verification

Acceptance criteria for tests and reviews: [verify/Button.md](verify/Button.md).
