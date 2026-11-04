---
title: AnimatedList
description: Animated list that expands each item into a floating detail overlay on click.
package: "@g4rcez/components"
export: "{ AnimatedList, AnimatedListItem }"
import: "import { AnimatedList, AnimatedListItem } from '@g4rcez/components'"
category: display
---

# AnimatedList

Animated list that expands each item into a floating detail overlay on click.

## Import

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components";
```

## Props

### AnimatedList props

| Prop       | Type              | Default | Description                              |
| ---------- | ----------------- | ------- | ---------------------------------------- |
| `children` | `React.ReactNode` | —       | One or more `AnimatedListItem` elements. |

### AnimatedListItem

| Prop          | Type                           | Default | Description                                                                                                                                 |
| ------------- | ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `Label`                        | —       | Primary heading shown in the list row and the overlay header.                                                                               |
| `titleText`   | `string`                       | —       | Optional plain-text alternative for the localized open-action label when a non-string title has no clear rendered text.                     |
| `description` | `Label`                        | —       | Secondary text shown below the title in both the row and overlay header.                                                                    |
| `children`    | `Label`                        | —       | Content rendered inside the expanded overlay below the header.                                                                              |
| `avatar`      | `Label`                        | —       | Optional node (icon, image, or element) shown at the leading edge of the row.                                                               |
| `leading`     | `React.FC<{ open: () => void }>` | —       | Optional render-prop component placed at the trailing edge of the row. Receives an `open` function to trigger the overlay programmatically. |

`Label` accepts a string, number, or React node.

## Design Tokens

Tokens this component reads. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable             | Purpose                          |
| ------------------------ | -------------------------------- | ---------------------------------------------- |
| `border-border`          | `--var-color-border`             | Row separator and overlay border               |
| `bg-background`          | `--var-color-background`         | Overlay card background                        |
| CSS override             | `--var-modal-surface-radius`     | Current detail overlay border radius           |
| `shadow-shadow-floating` | `--var-shadow-floating`          | Current Modal detail surface shadow            |
| `text-foreground`        | `--var-color-foreground`         | Row body text                                  |
| `text-muted-foreground`  | `--var-color-muted-foreground`   | Description text                               |
| `text-primary`           | `--var-color-primary`            | Row action hover color                         |
| `text-danger`            | `--var-color-danger`             | Close button hover/focus color                 |
| CSS override             | `--var-modal-overlay-background` | Current Modal backdrop tint, including opacity |
| `z-floating`             | `--var-layer-floating`           | Overlay layer (default: 22)                    |
| `z-overlay`              | `--var-layer-overlay`            | Backdrop layer                                 |

## Examples

### Basic list

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components";
const items = [
    { id: "1", name: "Alice Johnson", role: "Engineering" },
    { id: "2", name: "Bob Smith", role: "Design" },
];
export function TeamList() {
    return (
        <AnimatedList>
            {" "}
            {items.map((member) => (
                <AnimatedListItem key={member.id} title={member.name} description={member.role}>
                    {" "}
                    <p className="text-foreground">Full profile details for {member.name}.</p>{" "}
                </AnimatedListItem>
            ))}{" "}
        </AnimatedList>
    );
}
```

### With avatar

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components";
import { UserCircleIcon } from "@phosphor-icons/react";
export function UserDirectory() {
    return (
        <AnimatedList>
            {" "}
            <AnimatedListItem
                title="Carol White"
                description="Product Manager"
                avatar={<UserCircleIcon size={40} className="text-muted-foreground" />}
            >
                {" "}
                <div className="flex flex-col gap-2 text-foreground">
                    {" "}
                    <p>Department: Product</p> <p>Location: San Francisco</p>{" "}
                </div>{" "}
            </AnimatedListItem>{" "}
        </AnimatedList>
    );
}
```

### With trailing action using `leading`

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
export function OrderList({ orders }: { orders: Order[] }) {
    return (
        <AnimatedList>
            {" "}
            {orders.map((order) => (
                <AnimatedListItem
                    key={order.id}
                    title={`Order #${order.id}`}
                    description={`Total: ${order.total}`}
                    leading={({ open }) => (
                        <Button size="small" theme="ghost-muted" onClick={open}>
                            {" "}
                            View details{" "}
                        </Button>
                    )}
                >
                    {" "}
                    <OrderDetailContent order={order} />{" "}
                </AnimatedListItem>
            ))}{" "}
        </AnimatedList>
    );
}
```

### Activity feed

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components";
import { BellIcon, CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";
const activities = [
    {
        id: "a1",
        icon: <CheckCircleIcon size={20} className="text-success" />,
        title: "Deployment succeeded",
        description: "2 minutes ago",
        detail: "All 3 services started.",
    },
    {
        id: "a2",
        icon: <WarningIcon size={20} className="text-warn" />,
        title: "High memory usage",
        description: "15 minutes ago",
        detail: "Instance i-0ab2c was at 91%.",
    },
];
export function ActivityFeed() {
    return (
        <AnimatedList>
            {" "}
            {activities.map((a) => (
                <AnimatedListItem key={a.id} title={a.title} description={a.description} avatar={a.icon}>
                    {" "}
                    <p className="text-sm text-muted-foreground">{a.detail}</p>{" "}
                </AnimatedListItem>
            ))}{" "}
        </AnimatedList>
    );
}
```

## Do

- Keep `title` and `description` concise — the title action shares its row with any trailing action, and truncation is not automatic.
- Provide meaningful `children` content in the overlay; it should justify opening the detail view.
- Use `leading` to surface a primary call-to-action without forcing the user to click the title.
- Use design-token classes for any content inside the overlay (`bg-card-background`, `text-foreground`, `border-card-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use `AnimatedList` for purely informational lists with no actionable detail — use a semantic `<ul>` or `<ol>`. `List.md` documents this same compound API, not a separate static `List` component.
- Don't embed full sub-applications inside the overlay `children`; keep the detail view focused and lightweight.
- Don't use `AnimatedListItem` alone expecting a row or overlay — it returns its children in a `Fragment`; the parent builds the interactive list.

## Interaction design and acceptance criteria

**List guidance adaptation:** This is the same implementation documented in [List](List.md), accessed through the package-root import; it does not have a separate implementation.

- Use animated summary-to-detail rows when the extra panel helps users inspect an unordered collection. The root is a semantic `ul` with `li` children, not an ordered-list, listbox, or accordion API. Preserve meaningful sequence/nesting with appropriate static list markup instead.

- Only the title/description button, optional avatar button, and consumer `leading` action open details; the whole row is not clickable. Keep interactive descendants out of `title`/`description`, and use existing `Button` controls for trailing actions. String titles get localized action names; `titleText` supplies a plain-text alternative for complex titles. Descriptions label the row's purpose without claiming tested item-count announcements.
- The named detail view uses [Modal](Modal.md), including focus containment, scroll lock, responsive sheet layout, and a scrollable body. Its accessible description is supplied only for string descriptions. Verify keyboard focus entry, Escape/close/outside dismissal, and return to the exact opening button. There are no row `aria-expanded`/`aria-controls` attributes.
- `MotionConfig reducedMotion="user"` is configured. Animation must not be required to understand which item is open. Internal layout IDs use item indexes, and selected detail props are copied on opening, so stable child keys alone do not guarantee continuity if rows change while open. Keep the trigger available or manage its replacement. Long labels plus `leading` share a non-wrapping row layout; zoom/reflow and touch target usability remain consumer checks.

## Acceptance criteria

These are integration targets, not verification already performed for assistive technologies. 1. **Given** a collection with clear titles/descriptions, **when** users read or Tab through rows, **then** visual and DOM order agree and opening controls have item-specific accessible names and descriptions. 2. **Given** a visible title, avatar, or trailing action, **when** pointer/touch or Enter/Space activates it, **then** the matching titled detail view opens without nested-control conflicts. 3. **Given** an open panel, **when** users traverse it and dismiss it, **then** focus is contained while open and returns predictably, including when the original item was changed or removed. 4. **Given** reduced motion, 200% text size, or a 320 CSS-pixel viewport, **when** details are opened and read, **then** the selected item remains clear and all text/actions, including close, stay reachable.

## Accessibility

- The list renders as a semantic `<ul role="list">`.
- Each item's title/description area is a `<button>` that triggers the overlay, making it keyboard accessible.
- String titles use localized open-action labels; complex titles use `titleText` or the rendered title. Opening controls reference the rendered description with `aria-describedby`.
- The detail view delegates to `Modal`, including its named dialog, `FloatingFocusManager`, and scroll-locking `FloatingOverlay`.
- Pressing `Escape` or clicking outside the overlay dismisses it.
- The close button inside the overlay is a focusable `<button>` with a localized accessible name.
- `MotionConfig reducedMotion="user"` configures reduced-motion handling; verify the complete presentation with that preference enabled.

## Data Attributes

- `layoutId="item-{id}"` — shared between the list row and the overlay card to drive the expand/collapse shared-element animation.
- Title, description, and avatar use matching shared layout IDs scoped to each list instance.

## Notes

- Animations use a spring with no bounce to expand the row surface and carry its title, description, and avatar into the overlay. Desktop uses a dialog; narrow viewports use the Modal's responsive sheet.
- Detail content fades in separately and remains mounted during dismissal so the surface can collapse back into its row. Escape, the close button, and backdrop dismissal restore focus to the opening control.
- The overlay is rendered in a `FloatingPortal`, outside the normal DOM tree, to avoid stacking-context issues.
- Only one detail panel is open at a time; selecting an item replaces its selected content.
- `AnimatedListItem` is a thin shell — it returns children in a `Fragment` and holds no state. `AnimatedList` reads child props via `React.Children.toArray` to build the rows and detail view.
