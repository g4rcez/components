---
title: Tooltip
description: Polymorphic tooltip for noninteractive descriptions, with hover/focus triggers, optional click mode, and cursor-following.
package: "@g4rcez/components"
export: "{ Tooltip }"
import: "import { Tooltip } from '@g4rcez/components/tooltip'"
category: floating
---

# Tooltip

Polymorphic tooltip for noninteractive descriptions, with hover/focus triggers, optional click mode, and cursor-following.

## Import

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `Label` | — | Trigger element the user interacts with |
| `children` | `React.ReactNode` | — | Tooltip popup content |
| `open` | `boolean` | — | Controlled open state |
| `enabled` | `boolean` | `true` | Enable or disable the tooltip entirely |
| `hover` | `boolean` | `true` | Show tooltip on hover |
| `focus` | `boolean` | `true` | Show tooltip on focus |
| `popover` | `boolean` | `false` | Enables click toggle and popup role `dialog`; adds no focus management. |
| `placement` | `Placement` | auto | Preferred placement; falls back via `autoPlacement` |
| `followCursor` | `boolean` | `false` | Tooltip follows the mouse cursor |
| `onChange` | `(open: boolean) => void` | — | Open state change handler |
| `as` | `React.ElementType` | `"span"` | Element type of the trigger wrapper |

> Note: `title` is the **trigger** and `children` is the **popup content**. This inverts the HTML `title` attribute convention. The prop names follow the history of the component API.

## Design Tokens

Defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides take precedence. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The table shows examples; the exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-tooltip-surface-radius` | `calc(var(--var-radius-base) / 2)` |
| `--var-tooltip-surface-padding` | `calc(var(--var-spacing-base) * 0.75)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-tooltip-background` | `--var-tooltip-surface-background` | Tooltip popup background |
| `text-tooltip-foreground` | `--var-tooltip-surface-foreground` | Tooltip popup text color |
| `border-tooltip-border` | `--var-tooltip-surface-border` | Tooltip popup border and arrow stroke |
| `fill-tooltip-background` | `--var-tooltip-surface-background` | Arrow fill color |
| `z-tooltip` | `--var-layer-tooltip` | Z-index of the tooltip popup |
| `shadow-shadow-floating` | `--var-shadow-floating` | Tooltip drop shadow |

## Placement Options

Supported values are all Floating UI placements: `"top"`, `"top-start"`, `"top-end"`, `"bottom"`, `"bottom-start"`, `"bottom-end"`, `"left"`, `"left-start"`, `"left-end"`, `"right"`, `"right-start"`, `"right-end"`. When `placement` is omitted, `autoPlacement` picks the best available side.

## Examples

### Basic Hover Tooltip

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";
import { Button } from "@g4rcez/components/button";
<Tooltip as={Button} theme="primary" title="Hover or focus me">
    {" "}
    This is a helpful tooltip
</Tooltip>;
```

### Icon Button with Label

```tsx
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { Tooltip } from "@g4rcez/components/tooltip";
import { Button } from "@g4rcez/components/button";
<Tooltip as={Button} size="icon" theme="ghost-neutral" aria-label="Save" title={<FloppyDiskIcon aria-hidden="true" size={16} />}>
    {" "}
    Save (Ctrl+S)
</Tooltip>;
```

### Interaction Modes

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";
import { Button } from "@g4rcez/components/button";
{
    /* Hover only */
}
<Tooltip as={Button} title="Hover Only" focus={false} popover={false}>
    {" "}
    Shown on hover
</Tooltip>;
{
    /* Focus only — use a focusable, named reference */
}
<Tooltip as={Button} title="Focus me with Tab" hover={false} popover={false}>
    {" "}
    Shown on focus
</Tooltip>;
{
    /* Click-only informational popup — no managed popover focus */
}
<Tooltip as={Button} title="Click me" popover hover={false} focus={false}>
    {" "}
    Shown on click
</Tooltip>;
```

The hover-only example illustrates the flag. Before application use, add an equivalent keyboard/touch path. Click mode sets the role to `dialog` but is not a complete interactive Popover.

### Cursor-Following Tooltip

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";
<Tooltip
    followCursor
    placement="top-start"
    title={
        <div className="w-full h-32 rounded-card-radius border border-border bg-muted flex items-center justify-center">
            {" "}
            <span className="text-muted-foreground">Move your mouse over this area</span>{" "}
        </div>
    }
>
    {" "}
    Follows your cursor
</Tooltip>;
```

### Controlled Tooltip

```tsx
import { useState } from "react";
import { Tooltip } from "@g4rcez/components/tooltip";
import { Button } from "@g4rcez/components/button";
function ControlledTooltip() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {" "}
            <Tooltip as={Button} theme="ghost-neutral" title="Target" open={isOpen} onChange={setIsOpen} hover={false} focus={false} popover={false}>
                {" "}
                Externally controlled{" "}
            </Tooltip>{" "}
            <div className="mt-4 flex gap-2">
                {" "}
                <Button onClick={() => setIsOpen(true)} theme="primary">
                    {" "}
                    Show{" "}
                </Button>{" "}
                <Button onClick={() => setIsOpen(false)} theme="ghost-neutral">
                    {" "}
                    Hide{" "}
                </Button>{" "}
            </div>{" "}
        </>
    );
}
```

### Polymorphic — Render as Different Elements

```tsx
import { Tooltip } from "@g4rcez/components/tooltip";
{
    /* Render as <div> */
}
<Tooltip as="div" title={<span className="p-3 bg-muted rounded-button-radius inline-block text-foreground">Div with tooltip</span>}>
    {" "}
    Tooltip on a div
</Tooltip>;
{
    /* Wrap a paragraph */
}
<Tooltip as="p" title={<span className="text-primary cursor-pointer">Hover this paragraph</span>}>
    {" "}
    Paragraph tooltip
</Tooltip>;
```

### Form Field Help Tooltip

```tsx
import { InfoIcon } from "@phosphor-icons/react";
import { Tooltip } from "@g4rcez/components/tooltip";
import { Button } from "@g4rcez/components/button";
<div className="block text-sm font-medium text-foreground mb-1">
    {" "}
    Username{" "}
    <Tooltip as={Button} size="icon" theme="ghost-neutral" aria-label="Username rules" title={<InfoIcon aria-hidden="true" size={14} />}>
        {" "}
        3–20 characters; letters, numbers, and underscores only{" "}
    </Tooltip>
</div>;
```

## Do

- Keep `focus={true}` (default). Put the reference on a focusable, named control such as `as={Button}`. Enabling focus does not make the default `<span>` focusable.
- Keep tooltip content to one or two sentences at most.
- Use `followCursor` for large interactive areas (charts, canvases) to keep the tip near the pointer.
- Use design-token classes for custom elements in the popup (`text-tooltip-foreground`, `bg-muted`).

## Don't

- Don't put essential information only in a tooltip. Users on touch devices may never see it.
- Don't use tooltips for long text or complex layouts. Use `Modal` or `Dropdown` instead.
- Don't pass raw color classes (`bg-gray-900`, `text-white`) in tooltip content. Use design-token classes.
- Don't use arbitrary values (`bg-[#abc]`, `z-[9999]`). Override CSS variables in your `@theme` block.
- Don't use tooltips on self-explanatory elements.

## Accessibility

- Hover and focus are on by default. Click is opt-in through `popover`.
- Default popup semantics are `role="tooltip"`, with `aria-describedby` on the reference wrapper. With `popover`, `useRole` switches the role to `dialog`.
- `useDismiss` handles Escape and outside press. `useFocus` handles focus-driven open and close.
- The component renders no `FloatingFocusManager`, focus trap, focus return, or visible dismiss button.
- Safe-polygon pointer handling is on only in `popover` mode. It gives no keyboard path into popup controls.
- Use `as={Button}` to put the interaction and description on the real control. With a nested button in `title`, the ARIA relationship sits on the outer wrapper, not on that button.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use a default `Tooltip` for a short, noninteractive description of an already named control. Keep essential instructions visible.
- Put links, form fields, and action/close controls in a named `Dropdown` or `Modal`, not in a `role="tooltip"` popup.
- Combined guidance emphasizes explicit activation, outside/Escape dismissal, and reachable close controls. That is popover-like guidance, not default tooltip behavior.
- The component opens on hover/focus with a shared hover delay. Click is disabled unless `popover` is set.
- `popover` only adds click interaction, dialog semantics, and safe-polygon hover handling.
- There is no popup naming prop, initial-focus policy, focus manager, visible close control, or return-focus configuration.
- `popover` is a partial composition, not a full interactive Popover. See [Dropdown](Dropdown.md) for the managed nonmodal panel.

### Consumer responsibilities and design targets

- Put the reference on a focusable control with visible focus and its own accessible name. Tooltip text supplements that name.
- Provide an equivalent touch-accessible path. Do not rely on hover or cursor-following.
- Verify Escape, focus-driven closure, and description announcements.
- Verify that pointer-triggered text stays usable while the pointer moves toward it. Default mode does not guarantee hover persistence.
- Positioning middleware does not prove that important content stays unobscured at zoom or on a small screen.
- These are application checks, not tested assistive-technology claims.

## Notes

- When `open` is provided, it is the source of truth. Interaction requests call `onChange` without changing internal visibility, so the parent MUST update `open`. Without `open`, the component manages state.
- `enabled={false}` disables the interaction hooks. It does not suppress a popup that `open` forces open.
- `autoPlacement` middleware runs with `flip`. Placement is fully automatic when `placement` is omitted.
- The shared `FLOATING_DELAY` constant sets the hover delay. There is no per-instance delay prop.
- The `Polymorph` core component renders the popup. The `as` prop sets the trigger wrapper.

## Verification

Acceptance criteria for tests and reviews: [verify/Tooltip.md](verify/Tooltip.md).
