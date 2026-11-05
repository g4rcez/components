---
title: Toolbar
description: Sticky floating toolbar for surfacing persistent actions at the bottom of a scrollable area.
package: "@g4rcez/components"
export: "{ Toolbar }"
import: "import { Toolbar } from '@g4rcez/components'"
category: floating
---

# Toolbar

Sticky floating toolbar with a shared border and connected buttons. Place buttons directly inside the toolbar. Adjacent button edges are square. Exposed edges keep each button's design-system radius. A single button keeps all its corners. A separator starts a new connected group. Button themes, disabled states, and focus rings are preserved. The toolbar is not a menubar and adds no menu navigation.

## Import

```tsx
import { Toolbar } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | Items displayed inside the toolbar |
| `root` | `HTMLElement` | — | Scrolling-context root; accepted but unused, reserved for future use. |

## Design Tokens

Override these CSS variables in your theme to customize the component.

| CSS Variable | Purpose |
|---|---|
| `--var-toolbar-bottom` | Sticky bottom offset |
| `--var-toolbar-p` | Toolbar padding |
| `--var-layer-normal` | Keeps focused buttons above adjacent controls |

- The toolbar root paints no surface or border and uses no radius token. Connected controls keep their own outer corners.
- Offset and padding read only the canonical properties above, with no legacy-name fallbacks.
- The root selector is `.__toolbar`.
- Connected styling targets direct native buttons and direct `.__button` elements, including polymorphic button links. A layout element around controls opts out of connected styling.
- Load `button.css` separately when composing with `Button`. Toolbar CSS does not replace button styles.

## Examples

### Form Actions Toolbar

```tsx
import { Toolbar } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
<Toolbar>
    {" "}
    <Button theme="ghost-muted">Cancel</Button> <Button theme="primary">Save Changes</Button>
</Toolbar>;
```

### Rich Text Editor Toolbar

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@phosphor-icons/react";
import { Toolbar } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
import { Tooltip } from "@g4rcez/components/tooltip";
<Toolbar>
    {" "}
    <Tooltip title="Bold">
        {" "}
        <Button size="icon" theme="ghost-neutral">
            {" "}
            <BoldIcon size={16} />{" "}
        </Button>{" "}
    </Tooltip>{" "}
    <Tooltip title="Italic">
        {" "}
        <Button size="icon" theme="ghost-neutral">
            {" "}
            <ItalicIcon size={16} />{" "}
        </Button>{" "}
    </Tooltip>{" "}
    <Tooltip title="Underline">
        {" "}
        <Button size="icon" theme="ghost-neutral">
            {" "}
            <UnderlineIcon size={16} />{" "}
        </Button>{" "}
    </Tooltip>{" "}
    <div className="mx-2 h-6 w-px bg-card-border" />{" "}
    <Button theme="primary" size="small">
        {" "}
        Publish{" "}
    </Button>
</Toolbar>;
```

### Batch Action Toolbar

```tsx
import { TrashIcon, DownloadIcon } from "@phosphor-icons/react";
import { Toolbar } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
function BatchToolbar({ selectedCount }: { selectedCount: number }) {
    if (selectedCount === 0) return null;
    return (
        <Toolbar>
            {" "}
            <span className="text-sm text-muted-foreground">{selectedCount} selected</span>{" "}
            <Button theme="ghost-neutral" size="small">
                {" "}
                <DownloadIcon size={16} /> Export{" "}
            </Button>{" "}
            <Button theme="danger" size="small">
                {" "}
                <TrashIcon size={16} /> Delete{" "}
            </Button>{" "}
        </Toolbar>
    );
}
```

## Do

- Keep the toolbar small. It overlays content, so cover only a thin strip at the bottom.
- Use the toolbar for primary actions that users need at any scroll position.
- Use controls with large enough touch targets. Connected controls have no gap by design.
- Use design-token classes for custom styling inside the toolbar (`bg-background`, `border-card-border`, `text-foreground`).

## Don't

- Don't use `Toolbar` for secondary or rarely used actions. Keep the surface focused.
- Don't cram too many items into the toolbar. It wraps awkwardly on narrow viewports.
- Don't pass raw color classes (`bg-gray-100`, `border-gray-300`). Use design-token classes.
- Don't use arbitrary values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Accessibility

- The component has `role="toolbar"`. Pass `aria-label="Page actions"` to it. Do not add a nested toolbar wrapper.
- Give each icon-only button an accessible name through `aria-label` or a `Tooltip` with `focus={true}`.
- Tab moves through toolbar items in order.

## Notes

- The component renders `motion.div` from `motion/react` with `sticky bottom-4` positioning.
- The toolbar is `sticky`, not `fixed`. It flows with the document and sticks to the bottom of its scrolling container, not the viewport.
