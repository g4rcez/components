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

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `React.ReactElement \| React.ReactNode` | — | Noninteractive trigger content. Pass a button only with `asChild`. |
| `asChild` | `boolean` | `false` | Use `trigger` as the trigger, with no wrapper `<button>`; avoids nested `<Button>`. |
| `open` | `boolean` | — | Controlled open state |
| `arrow` | `boolean` | `false` | Accepted but unused: the arrow always renders. |
| `hover` | `boolean` | `false` | Also open the panel on pointer hover |
| `lockPositionOnOpen` | `boolean` | `false` | Keep the initial panel position while open |
| `title` | `React.ReactNode \| string` | — | Header title rendered inside the panel |
| `restoreFocus` | `boolean` | `true` | Public focus option; the implementation restores focus to the trigger. |
| `returnFocus` | `boolean` | `true` | Public focus option; the implementation returns focus to the trigger. |
| `onChange` | `(nextValue: boolean) => void` | — | Called when the open state changes |
| `buttonProps` | `React.HTMLProps<"button">` | — | Extra props forwarded to the trigger `<button>` |
| `children` | `React.ReactNode` | — | Panel content |
| `aria-label` | `string` | — | Panel name when no nonempty `title` is set. |
| `aria-labelledby` | `string` | — | ID reference for the panel name when no nonempty `title` is set. |

## Design Tokens

Defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides take precedence. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The table shows examples; the exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-dropdown-surface-radius` | `calc(var(--var-radius-base) / 2)` |
| `--var-dropdown-surface-padding` | `calc(var(--var-spacing-base) * 1)` |
| `--var-dropdown-header-margin-block-end` | `calc(var(--var-spacing-base) / 2)` |

| Token | CSS Variable | Purpose |
|---|---|---|
| `bg-floating-background` | `--var-dropdown-surface-background` | Panel surface background |
| `border-floating-border` | `--var-dropdown-surface-border` | Panel border and arrow stroke |
| `fill-floating-background` | `--var-dropdown-surface-background` | Arrow fill color |
| `z-floating` | `--var-layer-floating` | Z-index for the floating panel |
| `shadow-shadow-floating` | `--var-shadow-floating` | Panel drop shadow |
| `rounded-dropdown-surface-radius` | `--var-dropdown-surface-radius` | Panel corner radius |

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

- Use design-token classes for item hover states (`hover:bg-floating-hover`, `text-foreground`), not raw color utilities.
- Set a `title` and readable trigger content so users know the panel context.
- Do not rely on `arrow={false}` to hide the arrow. The arrow always renders.
- Group related items with separators when a panel has more than 5 items.

## Don't

- Don't pass raw color classes (`bg-blue-500`, `text-white`, `hover:bg-gray-100`). Use design-token classes.
- Don't use arbitrary values (`bg-[#abc]`, `z-[9999]`). Override CSS variables in your `@theme` block.
- Don't put more than 10–15 items in one dropdown. Use `CommandPalette` or `Modal` instead.
- Don't put critical destructive actions in a dropdown without a confirmation step.

## Accessibility

- The built-in trigger is a `<button>`. Pass `aria-label` through `buttonProps` when the trigger has no visible text.
- A nonempty `title` names the panel and takes precedence over `aria-label` and `aria-labelledby`. Without a title, pass one of those props.
- The panel has `dialog` semantics. Role interactions expose disclosure state. The component announces nothing through a live region.
- `FloatingFocusManager` is nonmodal. It has guards, focus restoration/return, and visually hidden dismiss controls. It does not trap focus in the panel.
- Outside click or Escape requests close through `useDismiss`.
- Children use ordinary Tab navigation. The component supplies no arrow-key item navigation, typeahead, or automatic close on item selection.

## Interaction design and acceptance criteria

### Selection and current behavior

- Use `Dropdown` for a temporary, named, nonmodal panel with supplementary information, links, or controls.
- Use [Menu](Menu.md) for an application-action menu with arrow keys and typeahead.
- Use [Tooltip](Tooltip.md) for a noninteractive description.
- Use [Modal](Modal.md) for a task that must contain focus.
- Click, tap, Enter, or Space on the built-in button toggles the panel. Hover is off by default.
- Put text or decorative icons in `trigger`. Name an icon-only trigger through `buttonProps`.
- To use an existing `Button`, link, or input as the trigger, pass `asChild`. The element receives the trigger props directly and MUST forward `ref` and DOM props.
- Built-in dismiss controls are visually hidden. For a visible close action, add a named `Button` in a controlled panel.
- This is a partial Popover composition, not a public `Popover` API.
- It supplies positioning, panel naming, nonmodal focus management, and dismissal.
- It has no visible close control, initial-focus or placement prop, trigger slot, or configurable outside-dismiss policy.

### Consumer responsibilities and design targets

- For page links in the panel, keep native link behavior. Label the navigation region when the panel serves as page navigation.
- Do not add `role="menu"` to an ordinary link list.
- Child actions do not close the panel. Update controlled state when an action must dismiss the panel.
- Verify focus entry and return, and natural Tab order into and out of the portal.
- The trigger has no component-specific styling or focus-ring rule. Verify visible focus on the built-in trigger.
- Verify comfortable touch targets and access to a visible Close action.
- Verify readable naming and announcements.
- Verify collision behavior at zoom, at narrow widths, and with a virtual keyboard. `lockPositionOnOpen` stops position updates while open.

## Notes

- Built on `@floating-ui/react` with `flip`, `shift`, and `offset(10)` middleware. The panel flips to the opposite side when space is insufficient.
- When a focus event's `relatedTarget` has `data-floating="true"`, the panel ignores the close request before it updates state or calls `onChange`. This coordinates nested portals.
- When `open` is supplied, it owns visibility. Requests call `onChange` without changing internal state, so the parent MUST update `open`. When `open` is omitted, the component manages state.
- `hover` is opt-in. It adds Floating UI hover interactions to the default click interaction.
- The focus manager always receives `restoreFocus={true}` and `returnFocus={true}`, even when the props are `false`. Verify the actual return destination for each dismissal path.

## Verification

Acceptance criteria for tests and reviews: [verify/Dropdown.md](verify/Dropdown.md).
