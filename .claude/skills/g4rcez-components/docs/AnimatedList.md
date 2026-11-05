---
title: AnimatedList
description: Animated list that expands each item into a floating detail overlay on click.
package: "@g4rcez/components"
export: "{ AnimatedList, AnimatedListItem }"
import: "import { AnimatedList, AnimatedListItem } from '@g4rcez/components'"
category: display
---

# AnimatedList

Animated list. A click expands an item into a floating detail overlay.

## Import

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components";
```

## Props

### AnimatedList props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | One or more `AnimatedListItem` elements. |

### AnimatedListItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `Label` | — | Heading in the row and the overlay header. |
| `titleText` | `string` | — | Plain-text label for the open action when a non-string `title` has no clear rendered text. |
| `description` | `Label` | — | Text below the title in the row and the overlay header. |
| `children` | `Label` | — | Content in the overlay below the header. |
| `avatar` | `Label` | — | Node (icon, image, or element) at the leading edge of the row. |
| `leading` | `React.FC<{ open: () => void }>` | — | Component at the trailing edge of the row. Receives `open` to open the overlay. |

`Label` accepts a string, number, or React node.

## Design Tokens

The component reads these tokens. Override these CSS variables in your theme.

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `border-border` | `--var-color-border` | Row separator and overlay border |
| `bg-background` | `--var-color-background` | Overlay card background |
| CSS override | `--var-modal-surface-radius` | Detail overlay border radius |
| `shadow-shadow-floating` | `--var-shadow-floating` | Modal detail surface shadow |
| `text-foreground` | `--var-color-foreground` | Row body text |
| `text-muted-foreground` | `--var-color-muted-foreground` | Description text |
| `text-primary` | `--var-color-primary` | Row action hover color |
| `text-danger` | `--var-color-danger` | Close button hover and focus color |
| CSS override | `--var-modal-overlay-background` | Modal backdrop tint, including opacity |
| `z-floating` | `--var-layer-floating` | Overlay layer (default: 22) |
| `z-overlay` | `--var-layer-overlay` | Backdrop layer |

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

- Keep `title` and `description` short. The title action shares its row with any trailing action, and truncation is not automatic.
- Put meaningful content in `children`. It must justify opening the detail view.
- Use `leading` for a primary call to action, so users need not click the title.
- Use design-token classes for overlay content (`bg-card-background`, `text-foreground`, `border-card-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use `AnimatedList` for informational lists with no actionable detail. Use a semantic `<ul>` or `<ol>`.
- Don't embed full sub-applications in the overlay `children`. Keep the detail view small.
- Don't use `AnimatedListItem` alone. It returns its children in a `Fragment`, and the parent builds the interactive list.

## Interaction design and acceptance criteria

**List guidance adaptation:** this is the implementation documented in [List](List.md), reached through the package-root import. `List.md` documents this same compound API, not a separate static `List` component.

- Use animated summary-to-detail rows when an extra panel helps users inspect an unordered collection.
- The root is a semantic `ul` with `li` children. It is not an ordered-list, listbox, or accordion API. For meaningful sequence or nesting, use static list markup.
- Only the title/description button, the optional avatar button, and the consumer `leading` action open details. The whole row is not clickable.
- Keep interactive descendants out of `title` and `description`. Use existing `Button` controls for trailing actions.
- String titles get localized action names. Use `titleText` for a plain-text name of complex titles.
- Descriptions label the row purpose. Item-count announcements are untested.
- The detail view uses [Modal](Modal.md): focus containment, scroll lock, responsive sheet layout, and a scrollable body.
- The accessible description is supplied only for string descriptions.
- Verify keyboard focus entry, Escape, close, and outside dismissal, and return of focus to the exact opening button.
- Rows have no `aria-expanded` or `aria-controls`.
- `MotionConfig reducedMotion="user"` is set. Animation must not be required to know which item is open.
- Internal layout IDs use item indexes. Selected detail props are copied on opening. Stable child keys alone do not keep continuity when rows change while a detail is open. Keep the trigger available or manage its replacement.
- Long labels plus `leading` share a non-wrapping row layout. Zoom, reflow, and touch target usability are consumer checks.

## Accessibility

- The list renders as a semantic `<ul role="list">`.
- The title/description area of each item is a `<button>` that opens the overlay, so it is keyboard accessible.
- String titles use localized open-action labels. Complex titles use `titleText` or the rendered title.
- Opening controls reference the rendered description with `aria-describedby`.
- The detail view delegates to `Modal`: its named dialog, `FloatingFocusManager`, and scroll-locking `FloatingOverlay`.
- `Escape` or a click outside the overlay dismisses it.
- The close button in the overlay is a focusable `<button>` with a localized accessible name.
- `MotionConfig reducedMotion="user"` sets reduced-motion handling. Verify the full presentation with that preference enabled.

## Data Attributes

- `layoutId="item-{id}"`: shared between the list row and the overlay card. It drives the expand and collapse shared-element animation.
- Title, description, and avatar use matching shared layout IDs, scoped to each list instance.

## Notes

- A spring with no bounce expands the row surface and carries its title, description, and avatar into the overlay.
- Desktop uses a dialog. Narrow viewports use the responsive sheet of `Modal`.
- Detail content fades in separately and stays mounted during dismissal, so the surface collapses back into its row.
- Escape, the close button, and backdrop dismissal restore focus to the opening control.
- The overlay renders in a `FloatingPortal`, outside the normal DOM tree, to avoid stacking-context issues.
- One detail panel is open at a time. Selecting an item replaces the selected content.
- `AnimatedListItem` holds no state. It returns children in a `Fragment`.
- `AnimatedList` reads child props with `React.Children.toArray` to build the rows and the detail view.

## Verification

Acceptance criteria for tests and reviews: [verify/AnimatedList.md](verify/AnimatedList.md).
