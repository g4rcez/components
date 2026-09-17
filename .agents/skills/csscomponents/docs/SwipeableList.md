---
title: SwipeableList
description: Virtualized list with draggable rows and configurable actions revealed from the left or right.
package: "@g4rcez/components"
export: "{ SwipeableList }"
import: "import { SwipeableList } from '@g4rcez/components/swipeable-list'"
category: display
---

# SwipeableList

`SwipeableList` renders a virtualized list whose rows can be dragged horizontally to reveal actions. It supports controlled or uncontrolled open-row state, left and right action rails, keyboard activation, and reduced-motion preferences.

## Import

```tsx
import { SwipeableList } from "@g4rcez/components/swipeable-list";
```

## Props

| Prop              | Type                                           | Default | Description                                                          |
| ----------------- | ---------------------------------------------- | ------- | -------------------------------------------------------------------- |
| `items`           | `SwipeableListItem[]`                          | —       | Rows to render. Each item needs a stable `id`.                       |
| `value`           | `SwipeableListValue \| null`                   | —       | Controlled open row and side.                                        |
| `defaultValue`    | `SwipeableListValue \| null`                   | `null`  | Initial open row for uncontrolled usage.                             |
| `onValueChange`   | `(value: SwipeableListValue \| null) => void`  | —       | Called when a row opens or closes.                                   |
| `onAction`        | `(payload: { item; action; side }) => void`    | —       | Called after an action is activated.                                 |
| `actionWidth`     | `number`                                       | `56`    | Width of each action slot in pixels.                                 |
| `revealThreshold` | `number`                                       | `34`    | Drag distance in pixels required to reveal an action rail.           |
| `closeOnAction`   | `boolean`                                      | `true`  | Closes the row after an action is activated.                         |
| `className`       | `string`                                       | —       | Class for the virtualized root.                                      |
| `classNames`      | `SwipeableListClassNames`                      | —       | Classes for root, row, surface, content, labels, rails, and actions. |
| `renderItem`      | `(item: SwipeableListItem) => React.ReactNode` | —       | Replaces the default row content while preserving swipe behavior.    |

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

The `onAction` payload includes the item, the activated action, and its `side` (`"left"` or `"right"`).

## Design Tokens and CSS

The component ships a plain CSS chunk at `@g4rcez/components/swipeable-list.css`. Import `foundation.css` before it, or use `index.css`.

The stable selectors start with `.__swipeable-list`, with slots such as `.__swipeable-list__surface`, `.__swipeable-list__action`, and `.__swipeable-list__description`. Component variables include `--var-swipeable-list-surface-radius`, `--var-swipeable-list-surface-padding-block`, `--var-swipeable-list-action-icon-size`, and semantic color tokens such as `--var-color-border` and `--var-card-background`.

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
            <strong>{item.title}</strong>
            <p>{item.description}</p>
        </article>
    )}
/>
```

## Do

- Give every item and action a stable `id`.
- Provide visible `label` content for every action; it is used for the action button's accessible name.
- Use `disabled` for rows or actions that must not be moved or activated.
- Keep row content concise so action affordances remain clear on touch devices.

## Don't

- Don't depend on drag alone for important actions; every action is also a button.
- Don't put destructive actions on both sides without a clear label and confirmation strategy.
- Don't pass unstable item arrays or IDs when the list is virtualized.

## Accessibility

- Rows expose action buttons with the supplied labels and support keyboard activation.
- The surface uses `touch-action: pan-y`, so vertical page scrolling remains available on touch devices.
- `useReducedMotion` reduces row animation when the user requests reduced motion.
- Add an accessible name to custom content when its visible title is not sufficient.

## Data Attributes

- `data-component="swipeable-list"` — virtualized root.
- `data-side` — active action side on the row surface.
- `data-open` — whether the row is open.
- `data-disabled` — disabled state for rows and actions.

## Notes

- The list uses `react-virtuoso` and `useWindowScroll`; size it as part of the page flow rather than expecting a fixed-height internal scroller.
- A row opens after crossing the reveal threshold or with a sufficiently fast fling, then settles to the action rail width.
- An open row closes when another row opens. `closeOnAction` controls whether action activation closes the current row.
