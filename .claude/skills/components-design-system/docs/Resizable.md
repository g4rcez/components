---
title: Resizable
description: Motion wrapper that animates its height when content changes or when it opens and closes.
package: "@g4rcez/components"
export: "{ Resizable }"
import: "import { Resizable } from '@g4rcez/components'"
category: core
---

# Resizable

`Resizable` measures its content with `ResizeObserver` and animates an outer height value with `motion/react`. It is useful for collapsible content and dynamic panels.

## Import

```tsx
import { Resizable } from "@g4rcez/components";
```

## Props

| Prop               | Type              | Default | Description                                                                                              |
| ------------------ | ----------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `children`         | `React.ReactNode` | —       | Content to measure and render.                                                                           |
| `open`             | `boolean`         | `true`  | Animates to the measured height when true and to `0` when false.                                         |
| `destroyOnUnmount` | `boolean`         | `false` | When false, keep children mounted while closed. When true, unmount them after the close animation delay. |
| `className`        | `string`          | —       | Class for the animated outer wrapper.                                                                    |

## Design Tokens and CSS

The component has a plain CSS contract rooted at `.__resizable` and `.__resizable__content`. It does not add color tokens; style the content or override the component selectors with semantic variables.

## Examples

### Collapsible content

```tsx
const [open, setOpen] = useState(false);

<button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
    Details
</button>
<Resizable open={open} destroyOnUnmount>
    <div>Content is measured and animated.</div>
</Resizable>
```

### Dynamic content

```tsx
<Resizable>
    {items.map((item) => (
        <p key={item.id}>{item.label}</p>
    ))}
</Resizable>
```

### Custom wrapper class

```tsx
<Resizable className="border border-border rounded-card-radius">
    <PanelContent />
</Resizable>
```

## Do

- Put only the changing section inside `Resizable`.
- Add `aria-expanded` and `aria-controls` to the trigger when using it for an accordion.
- Use `destroyOnUnmount` when closed content should not remain interactive or consume resources.

## Don't

- Don't use it for per-frame height changes or continuously streaming content.
- Don't assume `open={false}` removes children unless `destroyOnUnmount` is enabled.
- Don't place a second independently animated height wrapper around the same content.

## Accessibility

- `Resizable` is a layout wrapper and does not create an accordion relationship by itself.
- Keep the trigger and content semantics in the surrounding component.
- When content is destroyed on close, ensure focus is moved before removing a focused control.

## Notes

- The content is measured with `ResizeObserver`.
- The outer height animates with a spring transition.
- `destroyOnUnmount` unmounts closed children after a 600 ms delay.
- The component is client-only because it uses motion and `ResizeObserver`.
