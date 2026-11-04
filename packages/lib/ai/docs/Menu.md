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

| Prop                | Type                           | Default | Description                                                                                                  |
| ------------------- | ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------ |
| `label`             | `string \| React.ReactElement` | —       | Trigger content                                                                                              |
| `title`             | `string`                       | —       | Trigger `title` attribute; provide for an element label, but do not rely on it instead of an accessible name |
| `hover`             | `boolean`                      | `true`  | Open on hover in addition to click                                                                           |
| `open`              | `boolean`                      | `false` | Initial open state                                                                                           |
| `asChild`           | `boolean`                      | `false` | Use the `Slot` pattern — merge props onto the child element instead of wrapping in a `<button>`              |
| `restoreFocus`      | `boolean`                      | `false` | Passed as the root focus manager's `returnFocus` option; opt in to return to the root trigger on close       |
| `floatingClassName` | `string`                       | —       | Additional CSS classes for the floating list container                                                       |
| `FloatingComponent` | `React.ElementType`            | `"div"` | Element type for the floating container                                                                      |

### MenuItem

| Prop       | Type                  | Default | Description                                                      |
| ---------- | --------------------- | ------- | ---------------------------------------------------------------- |
| `title`    | `string`              | —       | Item text; used for typeahead matching and the `title` attribute |
| `children` | `React.ReactNode`     | —       | Visual content of the item                                       |
| `disabled` | `boolean`             | `false` | Removes item from keyboard navigation and typeahead              |
| `Right`    | `React.FC<IconProps>` | —       | Icon rendered on the right side                                  |
| `onClick`  | `function`            | —       | Click handler                                                    |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                          | Library default                         |
| --------------------------------- | --------------------------------------- |
| `--var-menu-item-min-inline-size` | `calc(var(--var-spacing-base) * 9)`     |
| `--var-menu-item-padding`         | `calc(var(--var-spacing-base) * 0.625)` |
| `--var-menu-item-outline-width`   | `calc(var(--var-spacing-base) * 0.125)` |
| `--var-menu-item-outline-offset`  | `calc(var(--var-spacing-base) * 0.125)` |

| Token | CSS Variable             | Purpose                             |
| ------------------------ | ----------------------------------- | ------------------------------ |
| CSS override             | `--var-menu-surface-background`     | Menu list surface background   |
| CSS override             | `--var-menu-surface-border`         | Menu list border               |
| `shadow-shadow-floating` | `--var-shadow-floating`             | Menu list drop shadow          |
| `z-floating`             | `--var-layer-floating`              | Floating list z-index          |
| CSS override             | `--var-menu-item-active-background` | Active/focused item background |
| CSS override             | `--var-menu-item-active-foreground` | Active/focused item text       |

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

- Provide a `title` string whenever `label` is a React element. Keep meaningful visible text or an explicit `aria-label` on the trigger; `MenuItem.title` supplies item typeahead labels.
- Use nested `Menu` components (not just `MenuItem`) for logical groupings of secondary actions.
- Use `disabled` for actions temporarily unavailable, so users know the option exists.
- Use design-token classes (`text-danger`, `text-foreground`) for item text colors.

## Don't

- Don't make menus deeper than 2–3 levels — deeply nested submenus are hard to navigate.
- Don't use raw utility color classes (`text-red-600`, `hover:bg-gray-100`) on items — use design-token classes.
- Don't use arbitrary utility values (`bg-[#abc]`) — override CSS variables in your `@theme` block.
- Don't use `Menu` for primary navigation that should be crawlable — use standard `<a>` links instead.

## Accessibility

- Floating UI provides looping list navigation, nested-menu navigation, Enter/Space activation, Escape/outside-press dismissal, and title-based item typeahead.
- The container uses `menu`; each `MenuItem` is a native button with `menuitem`. Nested triggers expose submenu state through the role interaction.
- `MenuItem.title` supplies the typeahead label and HTML `title` attribute; its rendered children normally supply the accessible name. Keep them consistent or supply a suitable inherited `aria-label`.
- `data-active` marks the focused menu item; the stylesheet uses active/hover/focus foreground and background tokens.
- `FloatingFocusManager` is nonmodal, not a focus trap. Root focus return is opt-in through `restoreFocus={true}`; nested focus behavior is delegated to list navigation.

## Interaction design and acceptance criteria

### Selection and current behavior

- covers both navigation and action choices. This `Menu` implements an application-action menu, not an ordinary site navigation region. For page destinations, use a named `nav` and native links or `Button as="a"` with `aria-current="page"`; do not apply `menu` semantics just because links are visually grouped.

- Prefer `Menu` for command lists needing arrows, typeahead, or nested submenus. Use [Dropdown](Dropdown.md) for a named temporary panel whose links or controls follow ordinary Tab order; it does not supply the menu keyboard model.
- Root menus support pointer activation and optional delayed hover, keyboard activation, Escape, and outside press. Selecting a `MenuItem` runs its click handler and emits a tree event that closes open menus. Opening a sibling submenu closes the other sibling.
- Hover is enabled by default but must not be the only access path. Nested triggers use different click settings from the root (`toggle: false`, `ignoreMouse: true`); verify pointer and touch access when disabling hover rather than assuming root click behavior applies to every submenu.
- `open` is an initial value only: it initializes `useState` and is not synchronized on later prop changes. There is no controlled `onChange` API. Set `restoreFocus` when closing the root should return focus to its trigger. **Consumer responsibilities and design targets** Use short, distinct trigger/item names, meaningful text for element labels, and consistent typeahead titles. Use `asChild` when the label is an existing `Button` to avoid nested buttons. The built-in submenu hint is the English text “Next menu”; no per-instance translation option is exposed for it. Verify focus visibility and touch targets with the selected theme, submenu reachability, and root focus return. Names, menu roles, expanded state, and disabled buttons are source-backed properties; actual spoken announcements and mobile reading order require application testing. **Acceptance criteria — verify in the consuming application** 1. **Given** a named root trigger, **when** it is activated by pointer, touch, Enter, or Space, **then** its menu opens and exposes the matching expanded state; verify the same access paths for each nested submenu.

2. **Given** an open action menu, **when** arrow navigation or a matching typeahead sequence is used, **then** focus reaches the appropriate enabled item, wraps where configured, and never activates a disabled action.
3. **Given** an enabled `MenuItem`, **when** it is clicked or activated with Enter/Space, **then** its handler runs and the menu tree closes; the item's name and typeahead title describe the same action.
4. **Given** an open root with `restoreFocus={true}`, **when** Escape dismisses it, **then** the menu closes and focus returns to the root trigger; verify outside-press focus behavior separately so the clicked destination remains usable.
5. **Given** ordinary page-navigation links, **when** Tab and Enter are used, **then** they follow native link order and destination behavior inside a named navigation region, not the roving action-menu model of this component.

## Data Attributes

| Attribute           | Applied to             | Description                                  |
| ------------------- | ---------------------- | -------------------------------------------- |
| `data-open`         | Menu trigger, MenuItem | Present when the menu/item is open           |
| `data-nested`       | Nested menu trigger    | Present on triggers that open a submenu      |
| `data-focus-inside` | Menu trigger           | Present when focus is inside an open submenu |
| `data-active`       | MenuItem               | Present on the currently focused item        |

## Notes

- The root `Menu` wraps itself in a `FloatingTree`; nested `Menu` components detect this via `useFloatingParentNodeId` and behave as submenus.
- Hover delay is controlled by the `FLOATING_DELAY` constant. The safe-polygon handler keeps the menu open while the pointer moves toward the submenu.
- With `hover={false}`, the root still supports click and keyboard activation. Nested triggers ignore mouse click through their click interaction; verify the chosen submenu composition without hover.
- The floating list has a token-defined maximum block size and vertical scrolling; this cap is not a guarantee that every viewport, zoom level, or virtual keyboard fits the menu.
