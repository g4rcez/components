---
title: Dropdown
description: Floating dropdown panel with an optional title, arrow pointer, and automatic collision-aware positioning.
package: "@g4rcez/components"
export: "{ Dropdown }"
import: "import { Dropdown } from '@g4rcez/components/dropdown'"
category: floating
---

# Dropdown

Floating dropdown panel with an optional title, arrow pointer, and automatic collision-aware positioning.

## Import

```tsx
import { Dropdown } from "@g4rcez/components/dropdown";
```

## Props

| Prop                 | Type                                    | Default | Description                                                                                  |
| -------------------- | --------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `trigger`            | `React.ReactElement \| React.ReactNode` | —       | Noninteractive content placed inside the built-in trigger button; do not pass another button |
| `open`               | `boolean`                               | —       | Controlled open state                                                                        |
| `arrow`              | `boolean`                               | `false` | Accepted prop, currently unused: the arrow is rendered regardless of its value               |
| `hover`              | `boolean`                               | `false` | Also open the panel from pointer hover                                                       |
| `lockPositionOnOpen` | `boolean`                               | `false` | Keep the panel at its initial position while open                                            |
| `title`              | `React.ReactNode \| string`             | —       | Header title rendered inside the panel                                                       |
| `restoreFocus`       | `boolean`                               | `true`  | Public focus option; the current implementation restores focus to the trigger                |
| `returnFocus`        | `boolean`                               | `true`  | Public focus option; the current implementation returns focus to the trigger                 |
| `onChange`           | `(nextValue: boolean) => void`          | —       | Callback fired when the open state changes                                                   |
| `buttonProps`        | `React.HTMLProps<"button">`             | —       | Additional props forwarded to the trigger `<button>`                                         |
| `children`           | `React.ReactNode`                       | —       | Panel content                                                                                |
| `aria-label`         | `string`                                | —       | Accessible name for the panel when no nonempty `title` is provided.                          |
| `aria-labelledby`    | `string`                                | —       | ID reference for the panel name when no nonempty `title` is provided.                        |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                 | Library default                     |
| ---------------------------------------- | ----------------------------------- |
| `--var-dropdown-surface-radius`          | `calc(var(--var-radius-base) / 2)`  |
| `--var-dropdown-surface-padding`         | `calc(var(--var-spacing-base) * 1)` |
| `--var-dropdown-header-margin-block-end` | `calc(var(--var-spacing-base) / 2)` |

| Token | CSS Variable                      | Purpose                             |
| --------------------------------- | ----------------------------------- | ------------------------------ |
| `bg-floating-background`          | `--var-dropdown-surface-background` | Panel surface background       |
| `border-floating-border`          | `--var-dropdown-surface-border`     | Panel border and arrow stroke  |
| `fill-floating-background`        | `--var-dropdown-surface-background` | Arrow fill color               |
| `z-floating`                      | `--var-layer-floating`              | Z-index for the floating panel |
| `shadow-shadow-floating`          | `--var-shadow-floating`             | Panel drop shadow              |
| `rounded-dropdown-surface-radius` | `--var-dropdown-surface-radius`     | Panel corner radius            |

## Examples

### Simple Action Panel

```tsx
import { Dropdown } from "@g4rcez/components/dropdown";
import { Button } from "@g4rcez/components/button";
function SimpleDropdown() {
    return (
        <Dropdown trigger="Actions" title="Actions">
            {" "}
            <div className="flex min-w-48 flex-col py-1">
                {" "}
                <Button theme="ghost-neutral">Edit</Button> <Button theme="ghost-neutral">Duplicate</Button> <hr className="border-border my-1" />{" "}
                <Button theme="ghost-danger">Delete</Button>{" "}
            </div>{" "}
        </Dropdown>
    );
}
```

### With Title and Arrow

```tsx
import { CaretDownIcon, UserIcon } from "@phosphor-icons/react";
import { Button } from "@g4rcez/components/button";
import { Dropdown } from "@g4rcez/components/dropdown";

function AccountDropdown() {
    return (
        <Dropdown
            trigger={
                <span className="inline-flex items-center gap-2">
                    <UserIcon aria-hidden="true" size={16} />
                    Account
                    <CaretDownIcon aria-hidden="true" size={16} />
                </span>
            }
            title="Account options"
        >
            <div className="flex min-w-48 flex-col py-1">
                <Button theme="ghost-neutral">Profile settings</Button>
                <Button theme="ghost-neutral">Billing</Button>
                <Button theme="ghost-neutral">Sign out</Button>
            </div>
        </Dropdown>
    );
}
```

### Named Panel Without a Title

```tsx
<Dropdown
    trigger={<span aria-hidden="true">⋯</span>}
    buttonProps={{ "aria-label": "Open filters" }}
    aria-label="Filter options"
>
    <div>Filter controls</div>
</Dropdown>
```

### Controlled Dropdown

```tsx
import { useState } from "react";
import { Button } from "@g4rcez/components/button";
import { Dropdown } from "@g4rcez/components/dropdown";

function ControlledDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dropdown trigger="Options" title="Options" open={isOpen} onChange={setIsOpen}>
            <div className="min-w-48 p-4">
                <p className="text-foreground">Controlled dropdown content</p>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
        </Dropdown>
    );
}
```

### Filter Dropdown with Form Content

```tsx
import { useState } from "react";
import { FunnelIcon } from "@phosphor-icons/react";
import { Button } from "@g4rcez/components/button";
import { Dropdown } from "@g4rcez/components/dropdown";

function FilterDropdown() {
    const [status, setStatus] = useState("");

    return (
        <Dropdown
            trigger={
                <span className="inline-flex items-center gap-2">
                    <FunnelIcon aria-hidden="true" size={16} />
                    Filters
                    {status && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />}
                </span>
            }
            title="Filter options"
        >
            <div className="min-w-64 space-y-4 p-4">
                <label className="block text-sm font-medium text-foreground">
                    Status
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-1 w-full rounded-button-radius border border-border bg-background px-3 py-2 text-foreground"
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </label>
                <div className="flex gap-2 pt-2">
                    <Button onClick={() => setStatus("")} theme="ghost-neutral">
                        Clear
                    </Button>
                    <Button theme="primary">Apply</Button>
                </div>
            </div>
        </Dropdown>
    );
}
```

## Do

- Use design-token classes for dropdown item hover states (`hover:bg-floating-hover`, `text-foreground`) instead of raw color utilities.
- Provide a `title` to help users understand the panel's context.
- Use readable trigger content and a panel title for spatial context. The arrow currently renders even when `arrow={false}`; do not depend on this prop to hide it.
- Group related items with separators for panels with more than 5 items.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `hover:bg-gray-100`) — use design-token classes.
- Don't use arbitrary values (`bg-[#abc]`, `z-[9999]`) — override CSS variables in your `@theme` block.
- Don't put more than 10–15 items in a single dropdown; consider `CommandPalette` or `Modal` instead.
- Don't place critical destructive actions in a dropdown without a confirmation step.

## Accessibility

- The trigger is wrapped in a `<button>` element; pass `aria-label` via `buttonProps` when the trigger has no visible text.
- A nonempty `title` names the panel. Without one, pass `aria-label` or `aria-labelledby` to name the panel; a title takes precedence over these props.
- `FloatingFocusManager` is configured as nonmodal with guards, focus restoration/return, and visually hidden dismiss controls; it does not trap focus in the panel.
- Clicking outside or pressing Escape requests closing through `useDismiss`; a controlled parent must update `open`.
- Children use ordinary Tab navigation. No arrow-key item navigation, typeahead, or automatic close-on-item-selection is supplied.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use `Dropdown` for a temporary, named nonmodal panel containing supplementary information, links, or controls. Use [Menu](Menu.md) for an application-action menu with arrow keys/typeahead, [Tooltip](Tooltip.md) for a noninteractive description, or [Modal](Modal.md) for a task that must contain focus.

- Click/tap and Enter/Space on the built-in button toggle the panel; hover is optional and off by default. Put text or decorative icons in `trigger`, not an existing `Button`, link, or input: the component always wraps it in a button and has no `asChild` option.
- The panel has `dialog` semantics. A nonempty `title` takes naming precedence; otherwise supply `aria-label` or `aria-labelledby`. Name an icon-only trigger separately through `buttonProps`. Role interactions expose disclosure state; no live-region announcement is implemented.
- Escape and outside press request dismissal. A supplied `open` is strictly controlled, so `onChange` must update it. To offer 's visible close action, add a named `Button` in a controlled panel; built-in dismiss controls are visually hidden.
- This is a partial Popover composition, not a dedicated public `Popover` API. It supplies positioning, panel naming, nonmodal focus management, and dismissal, but no visible close control, initial-focus/placement prop, trigger slot, or configurable outside-dismiss policy. `returnFocus` and `restoreFocus` are currently ignored (the manager receives `true`), and `arrow` is ignored (the arrow always renders). **Consumer responsibilities and design targets** For page links in the panel, preserve native link behavior and label the navigation region when needed; do not add `role="menu"` to an ordinary link list. Child actions do not automatically close the panel, so update controlled state when the action should dismiss it. Verify focus entry and return, natural Tab order into/out of the portal, visible focus on the built-in trigger, comfortable touch targets, and access to a visible Close action. The trigger has no component-specific styling or focus-ring rule. Verify readable naming/announcements and collision behavior at zoom, narrow widths, and with a virtual keyboard; `lockPositionOnOpen` prevents ongoing position updates while open. **Acceptance criteria — verify in the consuming application** 1. **Given** a closed, named panel with noninteractive trigger content, **when** its button is clicked, tapped, or activated with Enter/Space, **then** the panel opens and the trigger exposes expanded state without nested interactive controls.

2. **Given** an open nonmodal panel with focusable children, **when** Tab/Shift+Tab is used, **then** focus follows a predictable sequence through the controls and can leave the panel; do not expect arrow-key menu navigation or a modal trap.
3. **Given** a controlled open panel, **when** Escape or outside press requests dismissal, **then** `onChange(false)` is reported and visibility remains unchanged until the parent updates `open`; verify focus return for keyboard dismissal.
4. **Given** a consumer-provided Close `Button`, **when** it is activated, **then** the parent closes the panel and focus returns to a usable trigger; selecting a different child action closes only if the consumer requests it.
5. **Given** an icon-only trigger and titleless panel, **when** their accessibility properties are inspected, **then** `buttonProps` names the button and panel ARIA props name the dialog separately; verify announcements and unobscured touch/focus access in the target viewport.

## Notes

- Built on `@floating-ui/react` with `flip`, `shift`, and `offset(10)` middleware. The panel flips to the opposite side if there is insufficient space.
- When a focus event's `relatedTarget` has `data-floating="true"`, a close request is ignored before updating state or calling `onChange` — useful for coordinated nested portals.
- When `open` is supplied, it directly owns visibility; requests call `onChange` without changing internal state. When omitted, the component manages state internally.
- `hover` is opt-in and uses Floating UI hover interactions in addition to the default click interaction.
- The focus manager is always configured with `restoreFocus={true}` and `returnFocus={true}`, even when the public option props are `false`; verify the actual return destination for each dismissal path.

```

```
