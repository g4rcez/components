---
title: List
description: Animated list that expands each item into a focused floating detail overlay when clicked.
package: "@g4rcez/components"
export: "{ AnimatedList, AnimatedListItem }"
import: "import { AnimatedList, AnimatedListItem } from '@g4rcez/components/list'"
category: display
---

# List

Animated list that expands each item into a focused floating detail overlay when clicked. `AnimatedList` and `AnimatedListItem` are exported from the `@g4rcez/components/list` subpath. Each item's title/description button, optional avatar button, or consumer `leading` action opens a `motion/react`-animated `Modal` with the item's full content. The entire `<li>` is not a click target.

## Import

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list";
```

## Props

### AnimatedList

| Prop       | Type              | Default | Description                              |
| ---------- | ----------------- | ------- | ---------------------------------------- |
| `children` | `React.ReactNode` | —       | One or more `AnimatedListItem` elements. |

### AnimatedListItem

| Prop          | Type                           | Default | Description                                                                                                                      |
| ------------- | ------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `Label`                        | —       | Primary heading shown in the list row and in the overlay header.                                                                 |
| `titleText`   | `string`                       | —       | Optional plain-text alternative for the localized open-action label when a non-string title has no clear rendered text.          |
| `description` | `Label`                        | —       | Secondary text rendered below the title in both the row and the overlay.                                                         |
| `children`    | `Label`                        | —       | Content rendered inside the expanded overlay below the header section.                                                           |
| `avatar`      | `Label`                        | —       | Optional leading node (image, icon, or element) displayed before the title in the row.                                           |
| `leading` | `React.FC<{ open:  => void }>` | — | Optional render-prop component at the trailing end of the row. Receives an `open` callback to open the overlay programmatically. |

`Label` is `string | number | ReactNode`.

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                              | Library default                           |
| ------------------------------------- | ----------------------------------------- |
| `--var-modal-surface-min-inline-size` | `calc(var(--var-spacing-base) * 20)`      |
| `--var-modal-surface-gap`             | `calc(var(--var-spacing-base) * 1)`       |
| `--var-modal-surface-radius`          | `calc(var(--var-radius-base) * 1.333333)` |
| `--var-modal-body-padding-block` | `calc(var(--var-spacing-base) * 1)` |

The detail overlay uses [Modal](Modal.md) surface/body tokens. Legacy list detail-card, backdrop, and close selectors remain in the CSS but are not rendered by the current component. Tailwind utility mappings and component tokens. Where a historical utility targets a different surface, the component's actual token is noted.

| Token | CSS Variable             | Purpose                          |
| ------------------------ | -------------------------------- | --------------------------------------------------------------------------------- |
| `border-card-border`     | `--var-card-border`              | Card border utility; row separators and the overlay card use `--var-color-border` |
| `bg-card-background`     | `--var-card-background`          | Card background utility; the overlay card uses `--var-color-background`           |
| CSS override             | `--var-modal-surface-radius`     | Current detail overlay corner radius                                              |
| `shadow-shadow-floating` | `--var-shadow-floating`          | Current Modal detail surface shadow                                               |
| `text-foreground`        | `--var-color-foreground`         | Default text color for row and overlay content                                    |
| `text-secondary`         | `--var-color-secondary`          | Secondary text utility; descriptions use `--var-color-muted-foreground`           |
| `text-primary`           | `--var-color-primary`            | Row title action hover color                                                      |
| `text-danger`            | `--var-color-danger`             | Close button hover color in the overlay                                           |
| `bg-floating-overlay`    | `--var-modal-overlay-background` | Current Modal backdrop color, including opacity                                   |
| `z-floating`             | `--var-layer-floating`           | `z-index` for the overlay card                                                    |
| `z-overlay`              | `--var-layer-overlay`            | `z-index` for the backdrop scrim                                                  |

## Examples

### Basic usage

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list";
const members = [
    { id: "1", name: "Alice Johnson", role: "Engineering" },
    { id: "2", name: "Bob Smith", role: "Design" },
];
export function TeamList() {
    return (
        <AnimatedList>
            {" "}
            {members.map((m) => (
                <AnimatedListItem key={m.id} title={m.name} description={m.role}>
                    {" "}
                    <p className="text-foreground">Full profile for {m.name}.</p>{" "}
                </AnimatedListItem>
            ))}{" "}
        </AnimatedList>
    );
}
```

### With avatar

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list";
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
                    <span>Department: Product</span> <span>Location: San Francisco</span>{" "}
                </div>{" "}
            </AnimatedListItem>{" "}
        </AnimatedList>
    );
}
```

### With trailing action using `leading`

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list";
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

### Notification / activity feed

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list";
import { CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";
const feed = [
    {
        id: "n1",
        icon: <CheckCircleIcon size={20} className="text-success" />,
        title: "Deployment succeeded",
        time: "2 min ago",
        detail: "All 3 services are healthy.",
    },
    {
        id: "n2",
        icon: <WarningIcon size={20} className="text-warn" />,
        title: "High CPU usage",
        time: "10 min ago",
        detail: "Instance i-0ab2 is at 94 %.",
    },
];
export function NotificationFeed() {
    return (
        <AnimatedList>
            {" "}
            {feed.map((n) => (
                <AnimatedListItem key={n.id} title={n.title} description={n.time} avatar={n.icon}>
                    {" "}
                    <p className="text-sm text-muted-foreground">{n.detail}</p>{" "}
                </AnimatedListItem>
            ))}{" "}
        </AnimatedList>
    );
}
```

## Do

- Keep `title` and `description` short — the title action shares its row with any trailing action, and content is not truncated automatically.
- Provide meaningful `children` content in the overlay to justify clicking the row.
- Use `leading` to expose a primary call-to-action alongside the title without forcing the user to open the overlay.
- Use design-token classes inside the overlay content (`bg-card-background`, `text-foreground`, `border-card-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use this component for purely informational lists where no detail overlay is needed — use a plain `<ul>` instead.
- Don't embed full applications or heavy forms inside the overlay `children`; use a `Modal` for complex workflows.
- Don't use `AnimatedListItem` alone expecting a list row or panel — outside `AnimatedList`, it only returns its children in a `Fragment`.

## Interaction design and acceptance criteria

- Choose this component for an unordered collection whose items need a short detail panel. It is not a general `List` wrapper: the public API is `AnimatedList`/`AnimatedListItem`, with a fixed `<ul role="list">` and `<li>` rows. Use ordinary `ul`/`ol` semantics for static collections or meaningful sequences instead of opening an unnecessary panel.

- Preserve the supplied item order and hierarchy. Titles and descriptions sit inside an opening button, so do not put links or other controls inside those labels. Put separate actions in `leading`, using existing `Button` themes and clear action names. Pointer/touch activation belongs to the visible buttons; distinguish those controls from static detail text and give images appropriate alternatives.
- String titles produce localized “open details” names; non-string titles use `titleText` when provided, otherwise the rendered title labels the button. Both opening buttons refer to the rendered description. The detail panel is named by its title; only string descriptions are passed as its accessible description. Row buttons do not expose `aria-expanded` or `aria-controls`; do not treat them as accordion toggles.
- Opening uses the existing Modal focus manager and scroll lock; Escape, its named close button, or outside press dismisses it. Keep the opening control mounted for focus return. Internal row/layout IDs are index-based, and selected content is copied when opened: reordering or removing children while a panel is open needs an application focus/content policy, not an assumption that React child keys solve it.
- Check long labels, trailing actions, and detail content at 200% text size and a 320 CSS-pixel viewport. The row content does not wrap its action layout automatically; the detail view uses Modal's responsive sheet and scrollable body. `MotionConfig reducedMotion="user"` is already configured, but reading order, focus visibility, touch targets, and reduced-motion presentation still require integration checks.

## Acceptance criteria

These are design targets to verify in the application, not claimed screen-reader test results. 1. **Given** several items, **when** the list is read or traversed with Tab, **then** item order is preserved and each opening control has a meaningful item-specific name and description. 2. **Given** a title or avatar button, **when** it is activated by pointer/touch or Enter/Space, **then** the matching named detail dialog opens; static row whitespace does not act as a hidden control. 3. **Given** an open detail panel, **when** Tab/Shift+Tab are used and the panel is dismissed with Escape or its close button, **then** focus remains inside while open and returns to the opening control when it still exists. 4. **Given** an item is removed or reordered during an open detail view, **when** the view closes, **then** the application preserves the intended item context and provides a predictable focus destination. 5. **Given** long text, a trailing action, zoom, or reduced motion, **when** users open and read details, **then** labels, content, and the close control remain reachable without overlap or motion being necessary to understand the change.

## Accessibility

- The list renders as `<ul role="list">`.
- Each row title/description area is a `<button>`, making it keyboard focusable and activatable with `Enter` or `Space`.
- String titles use localized open-action labels; complex titles use `titleText` or the rendered title. Opening controls reference the rendered description with `aria-describedby`.
- The detail view delegates to `Modal`, including its named dialog, `FloatingFocusManager`, and scroll-locking `FloatingOverlay`.
- Pressing `Escape`, clicking outside, or clicking the close button dismisses the overlay.
- The close button inside the overlay is a focusable `<button>` with a localized accessible name and decorative `XIcon`.
- `MotionConfig reducedMotion="user"` configures user-preference handling for the list and its shared-layout transitions.

## Data Attributes

- `layoutId="item-{id}"` — shared between the list row `<li>` and the overlay card `<motion.div>` to drive the shared-element expand/collapse animation.
- Title, description, and avatar use matching shared layout IDs scoped to each list instance.

## Notes

- Only one detail panel is open at a time; selecting an item replaces the selected content.
- `AnimatedListItem` is a shell — it returns a `Fragment` directly and holds no state. All rendering logic lives inside `AnimatedList`, which reads child props via `React.Children.toArray`.
- The overlay is rendered in a `FloatingPortal` (outside the DOM tree) to avoid stacking-context or overflow clipping issues.
- Animations use `motion/react` shared-layout (`layoutId`) with a 0.3 s spring and no bounce. Desktop uses a dialog; narrow viewports use Modal's responsive sheet.
- Detail content fades separately and remains mounted during dismissal so the surface can collapse toward its row; verify focus return in the application.
