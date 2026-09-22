---
title: Toolbar
description: Sticky floating toolbar for surfacing persistent actions at the bottom of a scrollable area.
package: "@g4rcez/components"
export: "{ Toolbar }"
import: "import { Toolbar } from '@g4rcez/components'"
category: floating
---

# Toolbar

Sticky floating toolbar with a shared border and connected buttons. Place buttons directly inside the toolbar: adjacent button edges are square, while exposed edges retain each button’s design-system radius. A single button keeps all its corners, and a separator starts a new connected group. Button themes, disabled states, and focus rings are preserved. This is not a menubar and does not add menu navigation.

## Import

```tsx
import { Toolbar } from "@g4rcez/components";
```

## Props

| Prop       | Type              | Default | Description                                           |
| ---------- | ----------------- | ------- | ----------------------------------------------------- |
| `children` | `React.ReactNode` | —       | Items displayed inside the toolbar                    |
| `root`     | `HTMLElement`     | —       | Optional root element reference for scrolling context |

## Design Tokens

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| CSS Variable | Purpose |
| --- | --- |
| `--var-color-background` | Shared toolbar surface |
| `--var-color-border` | Shared border |
| `--var-border-hairline` | Border width |
| `--var-toolbar-bottom` | Sticky bottom offset; legacy `--toolbar-bottom` fallback |
| `--var-toolbar-rounded` | Toolbar surface corners; legacy `--toolbar-radius` fallback |
| `--var-toolbar-p` | Compact surface padding; legacy `--toolbar-p` fallback |
| `--var-layer-normal` | Keeps focused buttons above adjacent controls |

The root selector is `.__toolbar`. Connected styling targets direct native buttons and direct `.__button` elements, including polymorphic button links. Wrapping controls in a layout element opts out of connected styling. Load `button.css` separately when composing with `Button`; toolbar CSS does not replace button styles.

## Examples

### Form Actions Toolbar

```tsx
import { Toolbar } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";

<Toolbar>
    <Button theme="ghost-muted">Cancel</Button>
    <Button theme="primary">Save Changes</Button>
</Toolbar>;
```

### Rich Text Editor Toolbar

```tsx
import { BoldIcon, ItalicIcon, UnderlineIcon } from "@phosphor-icons/react";
import { Toolbar } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
import { Tooltip } from "@g4rcez/components/tooltip";

<Toolbar>
    <Tooltip title="Bold">
        <Button size="icon" theme="ghost-neutral">
            <BoldIcon size={16} />
        </Button>
    </Tooltip>
    <Tooltip title="Italic">
        <Button size="icon" theme="ghost-neutral">
            <ItalicIcon size={16} />
        </Button>
    </Tooltip>
    <Tooltip title="Underline">
        <Button size="icon" theme="ghost-neutral">
            <UnderlineIcon size={16} />
        </Button>
    </Tooltip>
    <div className="mx-2 h-6 w-px bg-card-border" />
    <Button theme="primary" size="small">
        Publish
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
            <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
            <Button theme="ghost-neutral" size="small">
                <DownloadIcon size={16} />
                Export
            </Button>
            <Button theme="danger" size="small">
                <TrashIcon size={16} />
                Delete
            </Button>
        </Toolbar>
    );
}
```

## Do

- Keep the toolbar small — it overlays content and should not obscure more than a thin strip at the bottom.
- Reserve the toolbar for primary actions users may need at any scroll position.
- Use controls with sufficient touch-target sizes; connected controls intentionally have no gap.
- Use design-token classes for any custom styling inside the toolbar (`bg-background`, `border-card-border`, `text-foreground`).

## Don't

- Don't use `Toolbar` for secondary or rarely used actions — keep the surface focused.
- Don't cram too many items into the toolbar; it will wrap awkwardly on narrow viewports.
- Don't pass raw utility color classes (`bg-gray-100`, `border-gray-300`) — use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block.

## Accessibility

- The component already has `role="toolbar"`. Pass `aria-label="Page actions"` directly to it; do not add a nested toolbar wrapper.
- Ensure each icon-only button inside the toolbar has an accessible name via `aria-label` or a `Tooltip` with `focus={true}`.
- Tab key navigates through items in the toolbar naturally.

## Notes

- The component is a thin wrapper around `motion.div` from `motion/react` with `sticky bottom-4` positioning.
- The `root` prop is accepted but not yet used in the current implementation — it is reserved for future scrolling context support.
- Because the toolbar is `sticky` (not `fixed`), it flows with the document and sticks at the bottom of its scrolling container, not the viewport.
