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

| Prop           | Type                      | Default  | Description                                                                                |
| -------------- | ------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `title`        | `Label`                   | —        | Tooltip trigger element — the element the user interacts with                              |
| `children`     | `React.ReactNode`         | —        | Tooltip popup content                                                                      |
| `open`         | `boolean`                 | —        | Controlled open state                                                                      |
| `enabled`      | `boolean`                 | `true`   | Enable or disable the tooltip entirely                                                     |
| `hover`        | `boolean`                 | `true`   | Show tooltip on hover                                                                      |
| `focus`        | `boolean`                 | `true`   | Show tooltip on focus                                                                      |
| `popover`      | `boolean`                 | `false`  | Enable click toggling and change the popup role to `dialog`; does not add focus management |
| `placement`    | `Placement`               | auto     | Preferred placement; falls back via `autoPlacement`                                        |
| `followCursor` | `boolean`                 | `false`  | Tooltip follows the mouse cursor position                                                  |
| `onChange`     | `(open: boolean) => void` | —        | Open state change handler                                                                  |
| `as` | `React.ElementType` | `"span"` | HTML element to render the trigger wrapper as |

> Note: `title` is the **trigger** and `children` is the **popup content**. This is the inverse of the HTML `title` attribute convention — the prop name matches how the component API evolved.

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                        | Library default                        |
| ------------------------------- | -------------------------------------- |
| `--var-tooltip-surface-radius`  | `calc(var(--var-radius-base) / 2)`     |
| `--var-tooltip-surface-padding` | `calc(var(--var-spacing-base) * 0.75)` |

| Token | CSS Variable              | Purpose                            |
| ------------------------- | ---------------------------------- | ------------------------------------- |
| `bg-tooltip-background`   | `--var-tooltip-surface-background` | Tooltip popup background              |
| `text-tooltip-foreground` | `--var-tooltip-surface-foreground` | Tooltip popup text color              |
| `border-tooltip-border`   | `--var-tooltip-surface-border`     | Tooltip popup border and arrow stroke |
| `fill-tooltip-background` | `--var-tooltip-surface-background` | Arrow fill color                      |
| `z-tooltip`               | `--var-layer-tooltip`              | Z-index of the tooltip popup          |
| `shadow-shadow-floating`  | `--var-shadow-floating`            | Tooltip drop shadow                   |

## Placement Options

Supports all Floating UI placements: `"top"`, `"top-start"`, `"top-end"`, `"bottom"`, `"bottom-start"`, `"bottom-end"`, `"left"`, `"left-start"`, `"left-end"`, `"right"`, `"right-start"`, `"right-end"`. When `placement` is omitted, `autoPlacement` picks the best available side.

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

The hover-only example illustrates the flag; it needs an equivalent keyboard/touch path before use in an application. Click mode changes the role to `dialog` but is not a complete interactive Popover.

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

- Keep `focus={true}` (default) and put the reference on a focusable, named control, such as `as={Button}`. Enabling focus does not make the default `<span>` focusable.
- Keep tooltip content short — one or two sentences at most.
- Use `followCursor` for large interactive areas (charts, canvases) to keep the tip near the pointer.
- Use design-token classes for any custom elements inside the tooltip popup (`text-tooltip-foreground`, `bg-muted`, etc.).

## Don't

- Don't put essential information only in a tooltip — users on touch devices may never see it.
- Don't use tooltips for long text or complex layouts — use `Modal` or `Dropdown` instead.
- Don't pass raw utility color classes (`bg-gray-900`, `text-white`) inside tooltip content — use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`, `z-[9999]`) — override CSS variables in your `@theme` block.
- Don't use tooltips on elements that are already self-explanatory.

## Accessibility

- Hover and focus are enabled by default; click is opt-in through `popover`.
- Default popup semantics are `role="tooltip"` with `aria-describedby` on the reference wrapper. With `popover`, `useRole` switches to `dialog`.
- `useDismiss` handles Escape and outside press; focus-driven opening/closing comes from `useFocus`. No `FloatingFocusManager`, focus trap, focus return, or visible dismiss button is rendered.
- Safe-polygon pointer handling is enabled only in `popover` mode; it does not provide a keyboard path into popup controls.
- Use `as={Button}` to put the interaction and description on the actual control. With a nested button in `title`, the generated ARIA relationship is on the outer wrapper rather than that button.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use a default `Tooltip` for a short, noninteractive description of an already named control. Keep essential instructions visible. Links, form fields, and action/close controls belong in a named `Dropdown` or `Modal`, not a `role="tooltip"` popup.

- 's combined page emphasizes explicit activation, outside/Escape dismissal, and reachable close controls. That is popover-like guidance, not the default implemented tooltip behavior: this component opens on hover/focus, with a shared hover delay, and click is disabled unless `popover` is set.
- `popover` only adds click interaction, dialog semantics, and safe-polygon hover handling. There is no popup naming prop, initial-focus policy, focus manager, visible close control, or return-focus configuration. It is a partial composition, not a fully provided interactive Popover; see [Dropdown](Dropdown.md) for the managed nonmodal panel alternative.
- `open` is strictly controlled when supplied: `onChange` reports requests, and the parent must update `open`. `enabled={false}` disables interaction hooks but does not suppress a popup forced open by the prop. **Consumer responsibilities and design targets** Place the reference on a focusable control with visible focus and its own accessible name; tooltip text supplements that name. Provide an equivalent touch-accessible path rather than relying on hover or cursor-following. Verify Escape, focus-driven closure, description announcements, and whether pointer-triggered text remains usable while moving toward it; hover persistence is not guaranteed by the default mode. Positioning middleware does not prove that important content remains unobscured at zoom or on a small screen. These are application checks, not tested assistive-technology claims. **Acceptance criteria — verify in the consuming application** 1. **Given** a named `as={Button}` reference in default mode, **when** it receives keyboard focus, **then** the noninteractive tooltip opens, focus stays on the control, and its `aria-describedby` references the tooltip.

2. **Given** a pointer-enabled tooltip, **when** the pointer hovers over its reference, **then** the description appears after the shared delay; verify readable placement and persistence separately because default mode has no safe-polygon handling.
3. **Given** a controlled open tooltip, **when** Escape or outside press requests dismissal, **then** `onChange(false)` is reported and the popup remains until the parent changes `open`.
4. **Given** a touch-only user or an unfocusable reference, **when** the supplementary information is needed, **then** an equivalent explicit control or visible text provides access; default hover behavior alone does not satisfy this target.
5. **Given** information requiring interactive controls, **when** a popup is chosen, **then** it uses a named managed panel with a reachable close action and verified focus return; setting `popover` on `Tooltip` alone does not satisfy this target.

## Notes

- When `open` is provided it is the source of truth; interaction requests call `onChange` without changing internal visibility. Without it, the component manages internal state.
- `autoPlacement` middleware runs alongside `flip` — placement is fully automatic when `placement` is omitted.
- Hover delay is controlled by the shared `FLOATING_DELAY` constant; there is no per-instance delay prop.
- The component is polymorphic via the `Polymorph` core component for the popup and `as` for the trigger wrapper.
