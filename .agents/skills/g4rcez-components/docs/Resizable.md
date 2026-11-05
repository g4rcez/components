---
title: Resizable
description: Motion wrapper that animates its height when content changes or when it opens and closes.
package: "@g4rcez/components"
export: "{ Resizable }"
import: "import { Resizable } from '@g4rcez/components'"
category: core
---

# Resizable

`Resizable` measures its content with `ResizeObserver` and animates the outer height with `motion/react` and a spring transition. Use it for collapsible content and dynamic panels. It is client-only.

## Import

```tsx
import { Resizable } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Content to measure and render. |
| `open` | `boolean` | `true` | True animates to the measured height. False animates to `0`. |
| `destroyOnUnmount` | `boolean` | `false` | True unmounts closed children after a 600 ms delay. False keeps them mounted. |
| `className` | `string` | — | Class for the animated outer wrapper. |

## Design Tokens and CSS

- CSS roots: `.__resizable` and `.__resizable__content`.
- The component adds no color tokens. Style the content, or override the selectors with semantic variables.

## Examples

### Collapsible content

```tsx
import { useState } from "react";
import { Button } from "@g4rcez/components/button";
import { Resizable } from "@g4rcez/components";

const [open, setOpen] = useState(false);
<>
    <Button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        Details
    </Button>
    <Resizable open={open} destroyOnUnmount>
        {" "}
        <div>Content is measured and animated.</div>
    </Resizable>
</>;
```

### Dynamic content

```tsx
<Resizable>
    {" "}
    {items.map((item) => (
        <p key={item.id}>{item.label}</p>
    ))}
</Resizable>
```

### Custom wrapper class

```tsx
<Resizable className="border border-border rounded-card-radius">
    {" "}
    <PanelContent />
</Resizable>
```

## Do

- Put only the changing section inside `Resizable`.
- For an accordion, add `aria-expanded` and `aria-controls` to the trigger.
- Use `destroyOnUnmount` when closed content must not stay interactive or use resources.

## Don't

- Don't use it for per-frame height changes or continuously streaming content.
- Don't put a second independently animated height wrapper around the same content.

## Accessibility

- `Resizable` is a layout wrapper. It creates no accordion relationship.
- Keep trigger and content semantics in the surrounding component.
- With `destroyOnUnmount`, move focus out of a focused control before the close removes it.
