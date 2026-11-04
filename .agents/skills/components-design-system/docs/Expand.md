---
title: Expand
description: A button that expands in-place into a floating container using shared-element layout animations.
package: "@g4rcez/components"
export: "{ Expand }"
import: "import { Expand } from '@g4rcez/components/expand'"
category: floating
---

# Expand

A button that expands in-place into a floating container using shared-element layout animations.

## Import

```tsx
import { Expand } from "@g4rcez/components/expand";
```

## Props

`Expand` accepts all `Button` props plus the following:

| Prop           | Type                      | Default | Description                                                             |
| -------------- | ------------------------- | ------- | ----------------------------------------------------------------------- |
| `trigger`      | `Label`                   | —       | Content displayed on the button before expansion                        |
| `open`         | `boolean`                 | —       | Controlled open state; omitted uses internal state, initially closed    |
| `onOpenChange` | `(open: boolean) => void` | —       | Reports requested open/close changes; update `open` in controlled usage |
| `disabled`     | `boolean`                 | `false` | When `true`, the button cannot be expanded                              |
| `children` | `React.ReactNode` | — | Content shown inside the expanded floating container |

Inherits all `Button` props: `theme`, `size`, `rounded`, `className`, etc.

## Design Tokens

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable    | Purpose                  |
| --------------- | ------------------------ | ------------------------------------------------------- |
| `bg-background` | `--var-color-background` | Default expanded panel background (applied by consumer) |
| `border-border` | `--var-color-border` | Default expanded panel border (applied by consumer) |

The `Expand` component itself only renders the trigger button and an animated wrapper; visual tokens for the expanded content are your responsibility via `children` className.

## Examples

### Action FAB

```tsx
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@g4rcez/components/button";
import { Expand } from "@g4rcez/components/expand";
<Expand trigger={<PlusIcon size={16} />} aria-label="Create new" theme="primary" size="icon" rounded="circle">
    {" "}
    <div className="w-64 rounded-card-radius border border-border bg-background p-4 shadow-shadow-floating">
        {" "}
        <h3 className="font-bold mb-2 text-foreground">Create New</h3>{" "}
        <ul className="space-y-2">
            {" "}
            <li>
                {" "}
                <Button theme="ghost-neutral" size="small">
                    Project
                </Button>{" "}
            </li>{" "}
            <li>
                {" "}
                <Button theme="ghost-neutral" size="small">
                    Task
                </Button>{" "}
            </li>{" "}
        </ul>{" "}
    </div>
</Expand>;
```

### With Label



```tsx
import { Expand } from "@g4rcez/components/expand";
import { Button } from "@g4rcez/components/button";
<Expand trigger="Open Menu">
    {" "}
    <div className="rounded-card-radius border border-border bg-background p-4 shadow-shadow-floating">
        {" "}
        <p className="text-foreground">Expanded content goes here.</p>{" "}
        <Button theme="primary" className="mt-2">
            {" "}
            Action{" "}
        </Button>{" "}
    </div>
</Expand>;
```

### Controlled Expand

```tsx
import { useState } from "react";
import { Expand } from "@g4rcez/components/expand";
import { Button } from "@g4rcez/components/button";
function ControlledExpand() {
    const [open, setOpen] = useState(false);
    return (
        <Expand trigger="Options" open={open} onOpenChange={setOpen} theme="ghost-neutral">
            {" "}
            <div className="rounded-card-radius border border-border bg-background p-4 shadow-shadow-floating">
                {" "}
                <Button onClick={() => setOpen(false)} theme="ghost-neutral">
                    {" "}
                    Close{" "}
                </Button>{" "}
            </div>{" "}
        </Expand>
    );
}
```

## Do

- Use `Expand` when you want the expanded panel to appear to "grow out of" the trigger button — the shared-element transition reinforces spatial context.
- Apply design-token classes on the expanded content (`bg-background`, `border-border`, `shadow-shadow-floating`) for consistent theming.
- Provide visible trigger text; for an icon-only trigger, pass a localized `aria-label` as an inherited `Button` prop.

## Don't

- Don't use `Expand` when a standard `Dropdown` or `Modal` would feel more familiar to the user — the animation is distinctive and should be reserved for intentional moments.
- Don't nest multiple `Expand` components inside each other; layout animations can conflict.
- Don't pass raw utility color classes (`bg-gray-50`, `border-gray-200`) inside the expanded content — use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`, `shadow-[--my-shadow]`) — override CSS variables in your `@theme` block.

## Accessibility

- The trigger renders as a focusable `<button>` via the `Button` component.
- By default, the expanded dialog is named from the trigger button. An icon-only trigger can use `aria-label`; when `aria-labelledby` is provided, it is forwarded to both the trigger and dialog.
- `FloatingFocusManager` is configured with modal focus management, guards, `restoreFocus`, `returnFocus`, and visually hidden dismiss controls. Verify focus entry, containment, and return in the consuming layout.
- Pressing Escape requests closing the expanded panel (`useDismiss` with `escapeKey: true`).
- Clicking outside also requests closing (`outsidePress: true`); controlled parents must update `open`.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use a descriptive trigger for related, supplementary content. Keep essential instructions visible, and use a link when the action changes location rather than revealing content.

- This mapping is partial: `Expand` opens an absolutely positioned, modal-focus `dialog`, not an inline accordion or native `details`/`summary`. It does not provide grouped headers, a one-section-open rule, arrow-key navigation between headers, or uninterrupted in-flow reading after disclosure.
- Clicking, tapping, or activating the trigger with Enter/Space requests opening or closing. The trigger exposes `aria-expanded` and `aria-haspopup="dialog"`; the dialog uses the trigger's name unless `aria-labelledby` is supplied. Closed content is not rendered after the exit animation completes.
- Escape and outside press request closing. In controlled usage, these requests do not change visibility until the consumer updates `open` through `onOpenChange`. There is no built-in visible close button; provide a named `Button` when users need an explicit close action. **Consumer responsibilities and design targets** Check visible focus, comfortable touch targets, and whether the floating content obscures its trigger or important nearby content at narrow widths and zoom. Verify focus moves into the dialog and returns to a usable trigger after dismissal. No live-region announcement is implemented; inspect the exposed name/state and verify their presentation with the assistive technologies used by the application. The inline reading and header-navigation expectations in must not be assumed for this floating implementation. **Acceptance criteria — verify in the consuming application** 1. **Given** a closed, enabled instance, **when** its named trigger is clicked or tapped, **then** the dialog opens and the trigger's `aria-expanded` becomes `true`; a disabled trigger does not open it.

2. **Given** keyboard focus on the trigger, **when** Enter or Space activates it, **then** focus is visibly indicated and moves to a usable point inside the opened dialog.
3. **Given** a controlled instance, **when** opening, Escape, or outside press requests a change, **then** `onOpenChange` receives the requested state and visibility changes only when the consumer updates `open`.
4. **Given** an open dialog with a consumer-provided Close `Button`, **when** it is activated, **then** the dialog closes, its content leaves the focus order after exit, and focus returns to a predictable control.
5. **Given** a named trigger and its dialog, **when** their accessibility properties are inspected, **then** the name and expanded state identify the revealed content; verify announcement and narrow-screen usability separately rather than treating this as an inline accordion.

## Notes

- Uses `motion/react` (`layoutId`) to animate a seamless transition between the collapsed button and the expanded container.
- The expanded container uses `.__expand__content` with `top: -75%` and `left: -25%`. There is no placement prop; a child's `className` does not reposition this wrapper.
- When `disabled` is `true`, the trigger is disabled and the click interaction is not enabled.
- Rendered inside a `FloatingPortal` scoped to the component's own root `<div>` so it stays visually attached.
