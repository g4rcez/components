---
title: List
description: Animated list that expands each item into a focused floating detail overlay when clicked.
package: "@g4rcez/components"
export: "{ AnimatedList, AnimatedListItem }"
import: "import { AnimatedList, AnimatedListItem } from '@g4rcez/components/list'"
category: display
---

# List

Animated list. Clicking an item expands it into a focused floating detail overlay.

- `AnimatedList` and `AnimatedListItem` are exported from the `@g4rcez/components/list` subpath.
- The title and description button, the optional avatar button, or the consumer `leading` action opens a `motion/react`-animated `Modal` with the full item content.
- The `<li>` is not a click target.

## Import

```tsx
import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list";
```

## Props

### AnimatedList

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | — | One or more `AnimatedListItem` elements |

### AnimatedListItem

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `Label` | — | Primary heading in the row and the overlay header |
| `titleText` | `string` | — | Plain-text name for the localized open action when a non-string title has no clear text |
| `description` | `Label` | — | Secondary text below the title in the row and the overlay |
| `children` | `Label` | — | Overlay content below the header section |
| `avatar` | `Label` | — | Optional leading node (image, icon, or element) before the row title |
| `leading` | `React.FC<{ open:  => void }>` | — | Optional render prop at the trailing end of the row; receives an `open` callback that opens the overlay |

`Label` is `string | number | ReactNode`.

## Design Tokens

- Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides stay unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The table lists current plain-CSS geometry examples. The exported `defaultGeometryTokens` map holds the full set.

| Override | Library default |
|---|---|
| `--var-modal-surface-min-inline-size` | `calc(var(--var-spacing-base) * 20)` |
| `--var-modal-surface-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-modal-surface-radius` | `calc(var(--var-radius-base) * 1.333333)` |
| `--var-modal-body-padding-block` | `calc(var(--var-spacing-base) * 1)` |

- The detail overlay uses [Modal](Modal.md) surface and body tokens.
- The CSS keeps legacy list detail-card, backdrop, and close selectors. The current component does not render them.
- The table maps Tailwind utilities to component tokens. When a historical utility targets a different surface, the Purpose column names the actual token.

| Token | CSS Variable | Purpose |
|---|---|---|
| `border-card-border` | `--var-card-border` | Card border utility; row separators and overlay card use `--var-color-border` |
| `bg-card-background` | `--var-card-background` | Card background utility; overlay card uses `--var-color-background` |
| CSS override | `--var-modal-surface-radius` | Current detail overlay corner radius |
| `shadow-shadow-floating` | `--var-shadow-floating` | Current Modal detail surface shadow |
| `text-foreground` | `--var-color-foreground` | Default text color for row and overlay content |
| `text-secondary` | `--var-color-secondary` | Secondary text utility; descriptions use `--var-color-muted-foreground` |
| `text-primary` | `--var-color-primary` | Row title action hover color |
| `text-danger` | `--var-color-danger` | Close button hover color in the overlay |
| `bg-floating-overlay` | `--var-modal-overlay-background` | Current Modal backdrop color, including opacity |
| `z-floating` | `--var-layer-floating` | `z-index` for the overlay card |
| `z-overlay` | `--var-layer-overlay` | `z-index` for the backdrop scrim |

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

- Keep `title` and `description` short. The title action shares its row with any trailing action, and no automatic truncation exists.
- Give `children` meaningful overlay content. It justifies the row click.
- Use `leading` to expose a primary call-to-action next to the title, without opening the overlay.
- Use design-token classes inside the overlay content (`bg-card-background`, `text-foreground`, `border-card-border`).

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use this component for informational lists without a detail overlay. Use a plain `<ul>`.
- Don't embed full applications or heavy forms in the overlay `children`. Use a `Modal` for complex workflows.
- Don't use `AnimatedListItem` outside `AnimatedList`. Outside `AnimatedList`, it only returns its children in a `Fragment`.

## Interaction design and acceptance criteria

- Use this component for an unordered collection whose items need a short detail panel.
- It is not a general `List` wrapper. The public API is `AnimatedList` and `AnimatedListItem`, with a fixed `<ul role="list">` and `<li>` rows.
- For static collections or meaningful sequences, use ordinary `ul` or `ol` semantics. Do not open an unnecessary panel.
- Keep the supplied item order and hierarchy.
- Titles and descriptions sit inside an opening button. Do not put links or other controls inside those labels.
- Put separate actions in `leading`. Use existing `Button` themes and clear action names.
- Pointer and touch activation belong to the visible buttons. Distinguish those controls from static detail text. Give images suitable alternatives.
- A string title produces a localized "open details" name.
- A non-string title uses `titleText` when set. Otherwise the rendered title names the button.
- Both opening buttons refer to the rendered description.
- The title names the detail panel. Only a string description is passed as its accessible description.
- Row buttons expose no `aria-expanded` or `aria-controls`. Do not treat them as accordion toggles.
- Opening uses the Modal focus manager and scroll lock. Escape, the named close button, or an outside press dismisses the panel.
- Keep the opening control mounted so focus can return.
- Internal row and layout IDs are index-based. Selected content is copied when opened.
- When children are reordered or removed while a panel is open, the application MUST define a focus and content policy. React child keys do not solve this.
- Check long labels, trailing actions, and detail content at 200% text size and a 320 CSS-pixel viewport.
- The row content does not wrap its action layout automatically. The detail view uses the responsive sheet and scrollable body of `Modal`.
- `MotionConfig reducedMotion="user"` is configured. Still check reading order, focus visibility, touch targets, and reduced-motion presentation in the integration.

## Accessibility

- The list renders as `<ul role="list">`.
- Each row title and description area is a `<button>`: keyboard focusable, activated with `Enter` or `Space`.
- A string title uses a localized open-action label. A complex title uses `titleText` or the rendered title.
- Opening controls reference the rendered description with `aria-describedby`.
- The detail view delegates to `Modal`: named dialog, `FloatingFocusManager`, and scroll-locking `FloatingOverlay`.
- Pressing `Escape`, clicking outside, or clicking the close button dismisses the overlay.
- The overlay close button is a focusable `<button>` with a localized accessible name and a decorative `XIcon`.
- `MotionConfig reducedMotion="user"` sets user-preference handling for the list and its shared-layout transitions.

## Data Attributes

- `layoutId="item-{id}"` is shared between the list row `<li>` and the overlay card `<motion.div>`. It drives the shared-element expand and collapse animation.
- Title, description, and avatar use matching shared layout IDs. Each list instance scopes them.

## Notes

- One detail panel is open at a time. Selecting an item replaces the selected content.
- `AnimatedListItem` is a shell. It returns a `Fragment` and holds no state.
- `AnimatedList` holds all rendering logic and reads child props via `React.Children.toArray`.
- The overlay renders in a `FloatingPortal`, outside the DOM tree, to avoid stacking-context and overflow clipping.
- Animations use `motion/react` shared-layout (`layoutId`) with a 0.3 s spring and no bounce.
- Desktop uses a dialog. Narrow viewports use the responsive sheet of `Modal`.
- Detail content fades separately and stays mounted during dismissal, so the surface collapses toward its row. Verify focus return in the application.

## Verification

Acceptance criteria for tests and reviews: [verify/List.md](verify/List.md).
