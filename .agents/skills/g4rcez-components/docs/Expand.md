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

`Expand` accepts all `Button` props plus the props below. Inherited `Button` props include `theme`, `size`, `rounded`, `className`.

|Prop|Type|Default|Description|
|---|---|---|---|
|`trigger`|`Label`|—|Button content before expansion.|
|`open`|`boolean`|—|Controlled open state. Omitted: internal state, initially closed.|
|`onOpenChange`|`(open: boolean) => void`|—|Reports requested open/close changes. Update `open` in controlled use.|
|`disabled`|`boolean`|`false`|When `true`, the button cannot expand.|
|`children`|`React.ReactNode`|—|Content inside the expanded floating container.|

## Design Tokens

Override these CSS variables in your theme to customize the tokens this component reads.

|Token|CSS Variable|Purpose|
|---|---|---|
|`bg-background`|`--var-color-background`|Default expanded panel background (applied by consumer)|
|`border-border`|`--var-color-border`|Default expanded panel border (applied by consumer)|

`Expand` renders only the trigger button and an animated wrapper. Style the expanded content with the `className` of `children`.

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

- Use `Expand` when the expanded panel must appear to "grow out of" the trigger button. The shared-element transition reinforces spatial context.
- Apply design-token classes on the expanded content (`bg-background`, `border-border`, `shadow-shadow-floating`).
- Provide visible trigger text. For an icon-only trigger, pass a localized `aria-label` as an inherited `Button` prop.

## Don't

- Don't use `Expand` when a standard `Dropdown` or `Modal` is more familiar. Reserve the distinctive animation for intentional moments.
- Don't nest `Expand` components. Layout animations can conflict.
- Don't pass raw utility color classes (`bg-gray-50`, `border-gray-200`) in the expanded content. Use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`, `shadow-[--my-shadow]`). Override CSS variables in your `@theme` block.

## Accessibility

- The trigger is a focusable `<button>` from the `Button` component.
- The expanded dialog takes its name from the trigger button.
- An icon-only trigger can use `aria-label`.
- When `aria-labelledby` is set, `Expand` forwards it to both the trigger and the dialog.
- `FloatingFocusManager` uses modal focus management, guards, `restoreFocus`, `returnFocus`, and visually hidden dismiss controls.
- Verify focus entry, containment, and return in the consuming layout.
- Escape requests closing (`useDismiss` with `escapeKey: true`).
- Outside click requests closing (`outsidePress: true`). Controlled parents MUST update `open`.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use a descriptive trigger for related, supplementary content.
- Keep essential instructions visible.
- Use a link, not `Expand`, when the action changes location.
- The accordion mapping is partial. `Expand` opens an absolutely positioned, modal-focus `dialog`. It is not an inline accordion or native `details`/`summary`.
- `Expand` has no grouped headers, no one-section-open rule, no arrow-key navigation between headers, and no uninterrupted in-flow reading after disclosure.
- Do not assume inline reading or header-navigation expectations for this floating implementation.
- Click, tap, or Enter/Space on the trigger requests opening or closing.
- The trigger exposes `aria-expanded` and `aria-haspopup="dialog"`.
- The dialog uses the trigger name unless `aria-labelledby` is supplied.
- Closed content is not rendered after the exit animation completes.
- Escape and outside press request closing. In controlled usage, visibility changes only when the consumer updates `open` through `onOpenChange`.
- There is no built-in visible close button. Provide a named `Button` when users need an explicit close action.

### Consumer responsibilities and design targets

- Check visible focus and comfortable touch targets.
- Check whether the floating content obscures its trigger or important nearby content at narrow widths and zoom.
- Verify focus moves into the dialog and returns to a usable trigger after dismissal.
- No live-region announcement exists. Inspect the exposed name and state. Verify their presentation with the assistive technologies the application supports.

## Verification

Acceptance criteria for tests and reviews: [verify/Expand.md](verify/Expand.md).

## Notes

- `motion/react` (`layoutId`) animates the transition between the collapsed button and the expanded container.
- The expanded container uses `.__expand__content` with `top: -75%` and `left: -25%`.
- There is no placement prop. A child's `className` does not reposition this wrapper.
- When `disabled` is `true`, the trigger is disabled and the click interaction is not enabled.
- `Expand` renders inside a `FloatingPortal` scoped to the component's own root `<div>`, so it stays visually attached.
