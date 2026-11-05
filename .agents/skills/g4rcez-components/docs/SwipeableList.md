---
title: SwipeableList
description: Virtualized list with draggable rows and configurable actions revealed from the left or right.
package: "@g4rcez/components"
export: "{ SwipeableList }"
import: "import { SwipeableList } from '@g4rcez/components/swipeable-list'"
category: display
---

# SwipeableList

`SwipeableList` renders a virtualized list. Drag a row horizontally to reveal actions. It supports controlled or uncontrolled open-row state, left and right action rails, keyboard activation, and reduced motion.

## Import

```tsx
import { SwipeableList } from "@g4rcez/components/swipeable-list";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `SwipeableListItem[]` | — | Rows to render. Each item needs a stable `id`. |
| `value` | `SwipeableListValue \| null` | — | Controlled open row and side. |
| `defaultValue` | `SwipeableListValue \| null` | `null` | Initial open row, uncontrolled. |
| `onValueChange` | `(value: SwipeableListValue \| null) => void` | — | Called when a row opens or closes. |
| `onAction` | `(payload: { item; action; side }) => void` | — | Called after an action activates. |
| `actionWidth` | `number` | `56` | Width of each action slot in pixels. |
| `revealThreshold` | `number` | `34` | Drag distance in pixels that reveals an action rail. |
| `closeOnAction` | `boolean` | `true` | Closes the row after an action activates. |
| `className` | `string` | — | Class for the virtualized root. |
| `classNames` | `SwipeableListClassNames` | — | Classes for root, row, surface, content, labels, rails, actions. |
| `renderItem` | `(item: SwipeableListItem) => React.ReactNode` | — | Replaces default row content; swipe behavior stays. |

### SwipeableListItem

```tsx
type SwipeableListItem = {
    id: string;
    meta?: React.ReactNode;
    title?: React.ReactNode;
    disabled?: boolean;
    content?: React.ReactNode;
    leading?: React.ReactNode;
    description?: React.ReactNode;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
};
```

### SwipeAction

```tsx
type SwipeAction = {
    id: string;
    icon: React.ReactNode;
    label: React.ReactNode;
    disabled?: boolean;
    tone?: "neutral" | "primary" | "success" | "warning" | "danger";
    onClick?: (item: SwipeableListItem) => void;
};
```

The `onAction` payload has the item, the activated action, and its `side` (`"left"` or `"right"`).

## Design Tokens and CSS

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map has the full set. Current plain-CSS geometry examples:

| Override | Library default |
| --- | --- |
| `--var-swipeable-list-root-gap` | `calc(var(--var-spacing-base) * 0.5)` |
| `--var-swipeable-list-surface-radius` | `calc(var(--var-radius-base) * 0.75)` |
| `--var-swipeable-list-action-focus-ring-width` | `calc( var(--var-spacing-base) * 0.125 )` |
| `--var-swipeable-list-action-focus-ring-offset` | `calc( var(--var-spacing-base) * 0.125 )` |

- The CSS chunk is `@g4rcez/components/swipeable-list.css`. Import `foundation.css` before it, or use `index.css`.
- Stable selectors start with `.__swipeable-list`. Slots: `.__swipeable-list__surface`, `.__swipeable-list__action`, `.__swipeable-list__description`.
- Component variables: `--var-swipeable-list-surface-radius`, `--var-swipeable-list-surface-padding-block`, `--var-swipeable-list-action-icon-size`.
- Semantic color tokens: `--var-color-border`, `--var-card-background`.

## Examples

### Actions on both sides

```tsx
const items = [
    {
        id: "invoice-42",
        title: "Invoice #42",
        description: "Due tomorrow",
        leftActions: [{ id: "archive", label: "Archive", icon: <ArchiveIcon />, tone: "neutral" }],
        rightActions: [{ id: "delete", label: "Delete", icon: <TrashIcon />, tone: "danger" }],
    },
];
<SwipeableList items={items} onAction={({ item, action }) => handleAction(item.id, action.id)} />;
```

### Controlled open row

```tsx
const [open, setOpen] = useState<SwipeableListValue | null>(null);
<SwipeableList items={items} value={open} onValueChange={setOpen} />;
```

### Custom row content

```tsx
<SwipeableList
    items={items}
    renderItem={(item) => (
        <article>
            {" "}
            <strong>{item.title}</strong> <p>{item.description}</p>{" "}
        </article>
    )}
/>
```

## Do

- Give every item and action a stable `id`.
- Give every action visible `label` content. It is the accessible name of the action button.
- Use `disabled` for rows or actions that must not move or activate.
- Keep row content short so action affordances stay clear on touch devices.

## Don't

- Don't depend on drag alone for important actions. Every action is also a button.
- Don't put destructive actions on both sides without a clear label and a confirmation strategy.
- Don't pass unstable item arrays or IDs. The list is virtualized.

## Accessibility

- Each enabled action button is reachable by Tab while its row is closed.
- Focus on an action reveals the rail of that row. After that, the opposite rail leaves the tab order and is hidden from assistive technology.
- Action buttons are native. Enter and Space activate them. Disabled actions stay disabled.
- The surface uses `touch-action: pan-y`. Vertical page scroll works on touch devices.
- `useReducedMotion` reduces row animation when the user requests reduced motion.
- Add an accessible name to custom content when its visible title is not enough.

## Data Attributes

- `data-component="swipeable-list"`: virtualized root.
- `data-side`: active action side on the row surface.
- `data-open`: whether the row is open.
- `data-disabled`: disabled state of rows and actions.

## Notes

- The list uses `react-virtuoso` and `useWindowScroll`. Size the list in the page flow. It has no fixed-height internal scroller.
- A row opens after the drag crosses the reveal threshold, or after a fast fling. The row then settles to the action rail width.
- An open row closes when another row opens.
- `closeOnAction` controls whether an action closes the current row.
