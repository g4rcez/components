---
title: Menu
description: Floating application-action menu with nested submenus, keyboard navigation, hover support, and typeahead.
package: "@g4rcez/components"
export: "{ Menu, MenuItem }"
import: "import { Menu, MenuItem } from '@g4rcez/components/menu'"
category: floating
---

# Menu

Floating application-action menu with nested submenus, keyboard navigation, hover support, and typeahead.

## Import

```tsx
import { Menu, MenuItem } from "@g4rcez/components/menu";
```

## Props

### Menu props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| React.ReactElement` | — | Trigger content. |
| `title` | `string` | — | Trigger `title` attribute. Set it for an element label. Not an accessible name. |
| `hover` | `boolean` | `true` | Open on hover in addition to click. |
| `open` | `boolean` | `false` | Initial open state only. |
| `asChild` | `boolean` | `false` | Use the `Slot` pattern: merge props onto the child instead of a `<button>`. |
| `restoreFocus` | `boolean` | `false` | Passed as the root focus manager's `returnFocus`. Returns focus to the root trigger on close. |
| `floatingClassName` | `string` | — | Extra classes for the floating list container. |
| `FloatingComponent` | `React.ElementType` | `"div"` | Element type for the floating container. |

### MenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Item text. Used for typeahead matching and the `title` attribute. |
| `children` | `React.ReactNode` | — | Visual content of the item. |
| `disabled` | `boolean` | `false` | Removes the item from keyboard navigation and typeahead. |
| `Right` | `React.FC<IconProps>` | — | Icon on the right side. |
| `role` | `"menuitem" \| "menuitemradio" \| "menuitemcheckbox"` | `"menuitem"` | ARIA role. Use `menuitemradio` for one choice in a group and `menuitemcheckbox` for an independent toggle. |
| `checked` | `boolean` | `false` | Selection state of a radio or checkbox item. Sets `aria-checked` and draws a `Check` icon. Ignored for `menuitem`. |
| `onClick` | `function` | — | Click handler. |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override | Library default |
| --- | --- |
| `--var-menu-item-min-inline-size` | `calc(var(--var-spacing-base) * 9)` |
| `--var-menu-item-padding` | `calc(var(--var-spacing-base) * 0.625)` |
| `--var-menu-item-outline-width` | `calc(var(--var-spacing-base) * 0.125)` |
| `--var-menu-item-outline-offset` | `calc(var(--var-spacing-base) * 0.125)` |

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| CSS override | `--var-menu-surface-background` | Menu list surface background |
| CSS override | `--var-menu-surface-border` | Menu list border |
| `shadow-shadow-floating` | `--var-shadow-floating` | Menu list drop shadow |
| `z-floating` | `--var-layer-floating` | Floating list z-index |
| CSS override | `--var-menu-item-active-background` | Active/focused item background |
| CSS override | `--var-menu-item-active-foreground` | Active/focused item text |

## Examples

### Basic Menu

```tsx
import { Menu, MenuItem } from "@g4rcez/components/menu";
<Menu label="Actions">
    {" "}
    <MenuItem title="Edit">Edit Profile</MenuItem> <MenuItem title="Share">Share Profile</MenuItem>
</Menu>;
```

### With Icons and Shortcuts

```tsx
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { Menu, MenuItem } from "@g4rcez/components/menu";
<Menu label="Settings">
    {" "}
    <MenuItem title="Edit" Right={PencilSimpleIcon}>
        {" "}
        Edit{" "}
    </MenuItem>{" "}
    <MenuItem title="Delete" Right={TrashIcon} className="text-danger">
        {" "}
        Delete{" "}
    </MenuItem>
</Menu>;
```

### Nested Submenus

```tsx
import { Menu, MenuItem } from "@g4rcez/components/menu";
<Menu label="Actions">
    {" "}
    <MenuItem title="Edit">Edit Profile</MenuItem> <MenuItem title="Share">Share Profile</MenuItem>{" "}
    <Menu label="More Options" title="More Options">
        {" "}
        <MenuItem title="Archive">Archive Account</MenuItem>{" "}
        <MenuItem title="Delete" className="text-danger">
            {" "}
            Delete Account{" "}
        </MenuItem>{" "}
    </Menu>
</Menu>;
```

### Using asChild for Custom Triggers

```tsx
import { Menu, MenuItem } from "@g4rcez/components/menu";
import { Button } from "@g4rcez/components/button";
<Menu label={<Button theme="primary">Main Action</Button>} asChild title="Main Action">
    {" "}
    <MenuItem title="Save">Save Version</MenuItem> <MenuItem title="Publish">Publish Now</MenuItem>
</Menu>;
```

### Selection state

```tsx
import { Menu, MenuItem } from "@g4rcez/components/menu";
<Menu label="Theme" hover={false}>
    <MenuItem title="Light" role="menuitemradio" checked={theme === "light"} onClick={() => setTheme("light")}>
        Light
    </MenuItem>
    <MenuItem title="Dark" role="menuitemradio" checked={theme === "dark"} onClick={() => setTheme("dark")}>
        Dark
    </MenuItem>
</Menu>;
```

### Disabled Items

```tsx
import { Menu, MenuItem } from "@g4rcez/components/menu";
<Menu label="Options">
    {" "}
    <MenuItem title="Export">Export Data</MenuItem>{" "}
    <MenuItem title="Import" disabled>
        {" "}
        Import (unavailable){" "}
    </MenuItem>{" "}
    <MenuItem title="Delete" className="text-danger">
        {" "}
        Delete{" "}
    </MenuItem>
</Menu>;
```

## Do

- Set `title` whenever `label` is a React element.
- Keep meaningful visible text or an explicit `aria-label` on the trigger.
- Use nested `Menu` components (not just `MenuItem`) to group secondary actions.
- Use `disabled` for temporarily unavailable actions, so users see the option exists.
- Use design-token classes (`text-danger`, `text-foreground`) for item text colors.
- Use short, distinct trigger and item names, and consistent typeahead titles.
- Use `asChild` when the label is an existing `Button`, to avoid nested buttons.

## Don't

- Don't nest menus deeper than 2–3 levels.
- Don't use raw utility color classes (`text-red-600`, `hover:bg-gray-100`) on items. Use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.
- Don't use `Menu` for primary navigation that must be crawlable. Use standard `<a>` links.

## Accessibility

- Floating UI provides looping list navigation, nested-menu navigation, Enter/Space activation, Escape/outside-press dismissal, and title-based item typeahead.
- The container uses `menu`. Each `MenuItem` is a native button with `menuitem`, `menuitemradio`, or `menuitemcheckbox`.
- Radio and checkbox items always set `aria-checked`. Plain `menuitem` items never set it.
- Every item reserves the width of the check icon, so labels stay aligned whether or not an item is checked. The icon is `aria-hidden`; the state comes from `aria-checked`.
- The library draws the check only. Group semantics for radio items (one checked at a time) belong to the caller.
- Nested triggers expose submenu state through the role interaction.
- `MenuItem.title` supplies the typeahead label and the HTML `title` attribute. Rendered children normally supply the accessible name.
- Keep `MenuItem.title` and children consistent, or supply a suitable inherited `aria-label`.
- `data-active` marks the focused menu item. The stylesheet uses active/hover/focus foreground and background tokens.
- `FloatingFocusManager` is nonmodal. It is not a focus trap.
- Root focus return is opt-in through `restoreFocus={true}`. List navigation handles nested focus.

## Interaction design and acceptance criteria

### Selection and current behavior

- covers both navigation and action choices.
- This `Menu` is an application-action menu, not a site navigation region.
- For page destinations, use a named `nav` and native links or `Button as="a"` with `aria-current="page"`. Do not apply `menu` semantics to visually grouped links.
- Use `Menu` for command lists that need arrows, typeahead, or nested submenus.
- Use [Dropdown](Dropdown.md) for a named temporary panel whose links or controls follow ordinary Tab order. It has no menu keyboard model.
- Root menus support pointer activation, optional delayed hover, keyboard activation, Escape, and outside press.
- Selecting a `MenuItem` runs its click handler and emits a tree event that closes open menus.
- Opening a sibling submenu closes the other sibling.
- Hover is on by default. It MUST NOT be the only access path.
- Nested triggers use different click settings from the root (`toggle: false`, `ignoreMouse: true`).
- When you disable hover, verify pointer and touch access for each submenu. Do not assume root click behavior.
- `open` initializes `useState` and does not sync on later prop changes. There is no controlled `onChange` API.
- Set `restoreFocus` when closing the root must return focus to its trigger.
- The built-in submenu hint is the English text “Next menu”. No per-instance translation option exists.
- Verify focus visibility and touch targets with the selected theme, submenu reachability, and root focus return.
- Names, menu roles, expanded state, and disabled buttons are source-backed. Spoken announcements and mobile reading order need application testing.

## Data Attributes

| Attribute | Applied to | Description |
| --- | --- | --- |
| `data-open` | Menu trigger, MenuItem | Present when the menu/item is open |
| `data-nested` | Nested menu trigger | Present on triggers that open a submenu |
| `data-focus-inside` | Menu trigger | Present when focus is inside an open submenu |
| `data-active` | MenuItem | Present on the currently focused item |

## Notes

- The root `Menu` wraps itself in a `FloatingTree`. Nested `Menu` components detect it with `useFloatingParentNodeId` and act as submenus.
- The `FLOATING_DELAY` constant sets the hover delay. The safe-polygon handler keeps the menu open while the pointer moves toward the submenu.
- With `hover={false}`, the root still supports click and keyboard activation. Nested triggers ignore mouse click.
- The floating list has a token-defined maximum block size and vertical scrolling. The cap does not guarantee a fit in every viewport, zoom level, or virtual keyboard.

## Verification

Acceptance criteria for tests and reviews: [verify/Menu.md](verify/Menu.md).
