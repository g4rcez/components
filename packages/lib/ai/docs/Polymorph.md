---
title: Polymorph
description: A polymorphic component that renders as any HTML element while maintaining full TypeScript type safety.
package: "@g4rcez/components"
export: "{ Polymorph }"
import: "import { Polymorph } from '@g4rcez/components'"
category: core
---

# Polymorph

A polymorphic component. It renders as any HTML element and keeps full TypeScript type safety. `Button`, `Tag`, `Heading`, `RenderOnView`, and other library components use it internally as their base primitive.

## Import

```tsx
import { Polymorph } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `React.ElementType` | `"span"` | Element or component to render. |
| `ref` | `React.Ref` | - | Forwarded ref to the rendered element. |
| `...props` | `React.ComponentPropsWithoutRef<T>` | - | All props valid for the chosen element type. |

## Type Definitions

```tsx
export type PolymorphicProps<Props, T extends React.ElementType> = Props & { as?: T } & Omit<
        React.ComponentPropsWithoutRef<T>,
        keyof Props | "as" | "ref"
    > & { ref?: React.ComponentProps<T>["ref"] };
```

## Design Tokens

None. Polymorph is a structural primitive and applies no styles.

## Examples

### Basic Elements

```tsx
<>
    <Polymorph>Default span</Polymorph>{" "}
    <Polymorph as="button" onClick={() => void 0}>
        {" "}
        Button
    </Polymorph>{" "}
    <Polymorph as="a" href="https://example.com" target="_blank">
        {" "}
        External Link
    </Polymorph>
</>
```

### With Refs

```tsx
import { useRef } from "react";
const MyComponent = () => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    return (
        <Polymorph as="button" ref={buttonRef} onClick={() => buttonRef.current?.focus}>
            {" "}
            Focus Me{" "}
        </Polymorph>
    );
};
```

### Conditional Element Type

```tsx
const DynamicItem = ({ isLink, href }: { isLink: boolean; href?: string }) => (
    <Polymorph as={isLink ? "a" : "button"} href={isLink ? href : undefined} className="text-foreground">
        {" "}
        {isLink ? "Visit Link" : "Click Button"}{" "}
    </Polymorph>
);
```

### Building Higher-Order Components

```tsx
import { Polymorph, PolymorphicProps } from "@g4rcez/components";
type CardProps<T extends React.ElementType = "div"> = PolymorphicProps<{ variant?: "default" | "muted" }, T>;
const Card = <T extends React.ElementType = "div">({ as, variant = "default", className, ...props }: CardProps<T>) => (
    <Polymorph
        as={as ?? "div"}
        className={`rounded-card-radius border border-border ${variant === "muted" ? "bg-muted" : "bg-card-background"} ${className ?? ""}`}
        {...props}
    />
);
```

### TypeScript Safety

```tsx
// Valid — button accepts type and disabled
<>
    <Polymorph as="button" type="submit" disabled /> // Valid — anchor accepts href and target
    <Polymorph as="a" href="/link" target="_blank" /> // TypeScript error — href is not valid on button // <Polymorph as="button" href="/link" />
</>
```

## Do

- Use `Polymorph` as the base for library components that need element flexibility.
- Provide a meaningful default for `as` in derived components.
- Forward refs from your wrapper to `Polymorph`, so consumers can reach the DOM node.
- Use design-token classes for styling (`text-foreground`, `bg-primary`, etc.).

## Don't

- Don't use `Polymorph` when the element type is fixed. Use the native element.
- Don't pass raw utility color classes (`text-gray-800`, `bg-blue-500`) in styled wrappers.
- Don't use arbitrary utility values (`text-[#333]`). Override CSS variables in your `@theme` block.
- Don't pass props that are invalid for the target element. TypeScript flags them at compile time.

## Accessibility

- `Polymorph` adds no ARIA attributes. The `as` prop sets the semantics of the rendered element.
- For interactive behavior, use `as="button"`. Do not use `as="div"` with `onClick`.
- Forwarded refs enable programmatic focus management.

## Data Attributes

- `Polymorph` sets no data attributes.
- Components built on `Polymorph` (for example `Button`, `Tag`) add their own `data-component` attribute.

## Notes

- The default element is `<span>`.
- `Polymorph` removes `as` before it forwards props to the DOM element. This prevents unknown attribute warnings.
- `React.forwardRef` forwards refs.
- `PolymorphicProps` is exported. Use it to type custom components built on `Polymorph`.
