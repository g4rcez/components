# Polymorph Component

A polymorphic component that can render as different HTML elements while maintaining type safety. This is the foundation component used by many other components in the library.

## Import

```tsx
import { Polymorph } from "@g4rcez/components";
```

## Basic Usage

```tsx
<Polymorph as="button">Button Element</Polymorph>
<Polymorph as="a" href="/link">Link Element</Polymorph>
<Polymorph as="div">Div Element</Polymorph>
```

## Props

| Prop       | Type                             | Default  | Description                             |
| ---------- | -------------------------------- | -------- | --------------------------------------- |
| `as`       | `React.ElementType`              | `"span"` | HTML element type to render             |
| `...props` | `React.ComponentPropsWithRef<E>` | -        | All props of the specified element type |

## Type Definitions

```tsx
type PolymorphicProps<P extends object, E extends React.ElementType> = P &
  React.ComponentPropsWithRef<E> & { as?: E };
```

## How It Works

The Polymorph component:

1. Accepts an `as` prop that determines the HTML element to render
2. Forwards all other props to the rendered element
3. Maintains full TypeScript support for the target element's props
4. Forwards refs correctly to the underlying element

## Examples

### Basic Elements

```tsx
// Renders as span (default)
<Polymorph>Default span</Polymorph>

// Renders as button
<Polymorph as="button" onClick={() => console.log('clicked')}>
  Button
</Polymorph>

// Renders as link
<Polymorph as="a" href="https://example.com" target="_blank">
  External Link
</Polymorph>
```

### With TypeScript

```tsx
// TypeScript knows this is a button and provides button props
<Polymorph
  as="button"
  type="submit"
  disabled={false}
  onClick={(e) => {
    // e is properly typed as MouseEvent<HTMLButtonElement>
    console.log('Button clicked');
  }}
>
  Submit
</Polymorph>

// TypeScript knows this is an input and provides input props
<Polymorph
  as="input"
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => {
    // e is properly typed as ChangeEvent<HTMLInputElement>
    setValue(e.target.value);
  }}
/>
```

### With Refs

```tsx
import { useRef } from "react";

const MyComponent = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Polymorph
        as="button"
        ref={buttonRef}
        onClick={() => buttonRef.current?.focus()}
      >
        Focus Me
      </Polymorph>

      <Polymorph
        as="input"
        ref={inputRef}
        type="text"
        placeholder="I can be focused"
      />
    </>
  );
};
```

### Custom Components

```tsx
// You can also use custom components
const CustomComponent = ({ children, ...props }) => (
  <div className="custom" {...props}>
    {children}
  </div>
);

<Polymorph as={CustomComponent} customProp="value">
  Custom content
</Polymorph>;
```

## Usage in Other Components

Many components in the library use Polymorph internally:

```tsx
// Button component uses Polymorph
export const Button = ({ as = "button", ...props }) => {
  return <Polymorph as={as} className="button-styles" {...props} />;
};

// Usage
<Button as="a" href="/link">
  Link Button
</Button>;
```

## Type Safety

The Polymorph component provides full type safety:

```tsx
// ✅ Valid - button props
<Polymorph as="button" type="submit" disabled />

// ✅ Valid - anchor props
<Polymorph as="a" href="/link" target="_blank" />

// ❌ Invalid - TypeScript error
<Polymorph as="button" href="/link" /> // href not valid on button

// ❌ Invalid - TypeScript error
<Polymorph as="a" type="submit" /> // type not valid on anchor
```

## Advanced Usage

### Conditional Rendering

```tsx
const DynamicComponent = ({ isLink, ...props }) => {
  return (
    <Polymorph as={isLink ? "a" : "button"} {...props}>
      {isLink ? "Visit Link" : "Click Button"}
    </Polymorph>
  );
};
```

### With Generic Types

```tsx
type PolymorphicButtonProps<T extends React.ElementType> = {
  as?: T;
  variant?: "primary" | "secondary";
} & React.ComponentPropsWithRef<T>;

const PolymorphicButton = <T extends React.ElementType = "button">({
  as,
  variant = "primary",
  className,
  ...props
}: PolymorphicButtonProps<T>) => {
  return (
    <Polymorph
      as={as || "button"}
      className={`btn btn-${variant} ${className}`}
      {...props}
    />
  );
};
```

## Best Practices

1. **Default Element**: Always provide a sensible default for the `as` prop
2. **Type Safety**: Leverage TypeScript's type checking for prop validation
3. **Ref Forwarding**: Always forward refs when creating polymorphic components
4. **Prop Spreading**: Use proper prop spreading to maintain element-specific props
5. **Documentation**: Document which elements are supported and recommended

## Common Use Cases

- **Navigation Components**: Switch between `button` and `a` elements
- **Interactive Elements**: Create components that can be buttons, links, or divs
- **Layout Components**: Allow flexible HTML semantics
- **Accessibility**: Use appropriate semantic elements based on context
- **Design Systems**: Create consistent APIs across different element types

## Notes

- The default element is `span` if no `as` prop is provided
- All props are forwarded to the rendered element
- Refs are properly forwarded using React's `forwardRef`
- TypeScript provides full intellisense for the target element's props
- The component removes the `as` prop before forwarding to prevent HTML attribute warnings
