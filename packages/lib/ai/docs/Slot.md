---
title: Slot
description: A composition primitive that merges its props into a single child element, enabling the asChild pattern.
package: "@g4rcez/components"
export: "{ Slot, Slottable, createSlot, createSlottable }"
import: "import { Slot, Slottable } from '@g4rcez/components'"
category: core
---

# Slot

`Slot` merges its props into a single child element. This enables the `asChild` pattern: the consumer supplies the element and still receives component-level styles, event handlers, and ARIA attributes. The implementation follows the Radix UI `Slot` pattern.

## Import

```tsx
import { Slot, Slottable } from "@g4rcez/components";
```

## Exports

| Export | Description |
| --- | --- |
| `Slot` | Merges props into the single child element |
| `Slottable` | Marks the slot target among internal children |
| `createSlot(ownerName)` | Factory for a named `Slot`, for design-system components |
| `createSlottable(ownerName)` | Factory for a named `Slottable` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | One valid React element; receives all `Slot` props |
| `ref` | `React.ForwardedRef<HTMLElement>` | - | Forwarded to the child element |
| `...props` | `React.HTMLAttributes<HTMLElement>` | - | Props merged into the child |

### Slottable

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | The element to render as the slot target |

## Design Tokens

None. `Slot` applies no styles. `Slot` merges its `className` into the child `className`.

## How It Works

1. `Slot` receives props and one child element.
2. `Slot` merges `className`, `style`, and event handlers with those of the child.
3. Event handlers: `Slot` calls the child handler first, then the `Slot` handler.
4. `className`: values are joined with a space.
5. `style`: the `Slot` style is spread first. The child style overrides it.
6. `Slot` renders the child element type. `Slot` renders no DOM element.

## Examples

### The asChild Pattern

```tsx
interface ButtonProps {
    asChild?: boolean;
    children: React.ReactNode;
    className?: string;
}

const StyledButton = ({ asChild, children, ...props }: ButtonProps) => {
    const Component = asChild ? Slot : "button";
    return (
        <Component
            className="inline-flex items-center rounded-button-radius bg-button-primary-bg text-button-primary-text px-4 py-2 font-medium"
            {...props}
        >
            {children}
        </Component>
    );
};

const examples = (
    <>
        <StyledButton>Click me</StyledButton>
        <StyledButton asChild>
            <a href="/dashboard">Go to Dashboard</a>
        </StyledButton>
    </>
);
```

### Using Slottable for Internal Structure

Use `Slottable` to mark the slot target when the component wraps children with internal elements.

```tsx
import { CheckIcon } from "@phosphor-icons/react";

const IconButton = ({ asChild, children, ...props }: { asChild?: boolean; children: React.ReactNode }) => {
    const Component = asChild ? Slot : "button";
    return (
        <Component
            className="inline-flex items-center gap-1.5 rounded-button-radius bg-button-success-bg text-button-success-text px-4 py-2"
            {...props}
        >
            <Slottable>{children}</Slottable>
            <CheckIcon size={14} aria-hidden="true" />
        </Component>
    );
};

const examples = (
    <>
        <IconButton>Confirm</IconButton>
        <IconButton asChild>
            <a href="/confirm">Confirm</a>
        </IconButton>
    </>
);
```

### Creating a Named Slot

Use `createSlot` in design-system components to get named DevTools display names.

```tsx
import { createSlot, createSlottable } from "@g4rcez/components";
const CardSlot = createSlot("Card");
const CardSlottable = createSlottable("Card");
```

### Merging Event Handlers

When `Slot` and the child define the same event, both handlers run.

```tsx
import { Button } from "@g4rcez/components/button";
import { Slot } from "@g4rcez/components";

<Slot onClick={() => console.log("slot handler")}>
    {" "}
    <Button onClick={() => console.log("child handler")}>Click me</Button>
</Slot>
// Logs: "child handler", then "slot handler"
```

## Do

- Use `Slot` in reusable components that accept any element type through `asChild`.
- Use `Slottable` when the component wraps children with internal structure (icons, labels).
- Pass `aria-*` and `role` to `Slot`. `Slot` merges them into the child.
- Use design-token classes in the `Slot` `className` (`rounded-button-radius`, `bg-button-primary-bg`).

## Don't

- Don't pass multiple direct children to `Slot` without `Slottable`. `Slot` expects one valid element.
- Don't use `Slot` when the element type is fixed.
- Don't pass raw utility color classes (`bg-blue-500`, `text-white`). Use design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`). Override CSS variables in your `@theme` block.

## Accessibility

- The semantics of the rendered element come from the child element type.
- Handlers from `Slot` and the child are composed. Neither is dropped.

## Data Attributes

- `Slot` and `Slottable` use `displayName` for React DevTools. They add no DOM attributes.
- `Slot` merges any `data-*` attributes into the child element.

## Notes

- `Slot` supports `React.lazy` children through `React.use` when the React version provides it.
- When `Slot` and the child both have refs, `composeRefs` composes them.
- `Slottable` identifies itself with the internal symbol `__radixId`. Do not replicate this check.
- `Slot` supports `Fragment` children. It does not apply the composed ref to `Fragment` (React 19 compatibility).
