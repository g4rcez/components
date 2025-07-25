# Button Component

A versatile button component with multiple variants, sizes, and states. Built with polymorphic capabilities to render as different HTML elements.

## Import

```tsx
import { Button } from "@g4rcez/components/button";
```

## Basic Usage

```tsx
<Button>Click me</Button>
```

## Props

| Prop        | Type                                                                                                                                                                                                                                                       | Default     | Description                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------- |
| `theme`     | `"main" \| "primary" \| "secondary" \| "info" \| "warn" \| "danger" \| "success" \| "muted" \| "neutral" \| "ghost-primary" \| "ghost-secondary" \| "ghost-info" \| "ghost-warn" \| "ghost-danger" \| "ghost-success" \| "raw" \| "disabled" \| "loading"` | `"main"`    | Visual theme/variant of the button |
| `size`      | `"icon" \| "min" \| "small" \| "default" \| "big"`                                                                                                                                                                                                         | `"default"` | Size of the button                 |
| `rounded`   | `"rough" \| "squared" \| "default" \| "circle"`                                                                                                                                                                                                            | `"default"` | Border radius style                |
| `icon`      | `React.ReactNode`                                                                                                                                                                                                                                          | -           | Icon to display in the button      |
| `loading`   | `boolean`                                                                                                                                                                                                                                                  | `false`     | Shows loading state with animation |
| `disabled`  | `boolean`                                                                                                                                                                                                                                                  | `false`     | Disables the button                |
| `as`        | `React.ElementType`                                                                                                                                                                                                                                        | `"button"`  | HTML element to render as          |
| `type`      | `string`                                                                                                                                                                                                                                                   | `"button"`  | Button type attribute              |
| `className` | `string`                                                                                                                                                                                                                                                   | -           | Additional CSS classes             |
| `children`  | `React.ReactNode`                                                                                                                                                                                                                                          | -           | Button content                     |

## Theme Variants

### Solid Variants

- **main**: Primary brand color
- **primary**: Primary action color
- **secondary**: Secondary action color
- **info**: Information/neutral actions
- **warn**: Warning actions
- **danger**: Destructive actions
- **success**: Success/confirmation actions
- **muted**: Subtle/disabled appearance
- **neutral**: Transparent with border

### Ghost Variants

- **ghost-primary**: Transparent with primary border/text
- **ghost-secondary**: Transparent with secondary border/text
- **ghost-info**: Transparent with info border/text
- **ghost-warn**: Transparent with warning border/text
- **ghost-danger**: Transparent with danger border/text
- **ghost-success**: Transparent with success border/text

### Special Variants

- **raw**: No default styling
- **disabled**: Disabled appearance
- **loading**: Loading state with animation

## Size Variants

- **icon**: Square button for icons only (`p-1`)
- **min**: Minimal height (`h-7 px-3 py-1 text-sm`)
- **small**: Small button (`h-8 px-4 py-2 text-sm`)
- **default**: Standard button (`h-10 px-4 py-2`)
- **big**: Large button (`h-12 px-6 py-4`)

## Rounded Variants

- **rough**: Slightly rounded (`rounded-sm`)
- **squared**: No border radius (`rounded-none`)
- **default**: Standard border radius (`rounded-button`)
- **circle**: Fully rounded (`rounded-full aspect-square`)

## Examples

### Basic Variants

```tsx
<Button theme="primary">Primary</Button>
<Button theme="secondary">Secondary</Button>
<Button theme="danger">Delete</Button>
<Button theme="success">Save</Button>
```

### Sizes

```tsx
<Button size="min">Mini</Button>
<Button size="small">Small</Button>
<Button size="default">Default</Button>
<Button size="big">Big</Button>
```

### With Icons

```tsx
import { PlusIcon } from "lucide-react";

<Button icon={<PlusIcon size={16} />}>
  Add Item
</Button>

<Button size="icon" theme="ghost-primary">
  <PlusIcon size={16} />
</Button>
```

### Loading State

```tsx
<Button loading>Saving...</Button>
```

### Ghost Variants

```tsx
<Button theme="ghost-primary">Ghost Primary</Button>
<Button theme="ghost-danger">Ghost Danger</Button>
```

### Polymorphic Usage

```tsx
// Render as link
<Button as="a" href="/dashboard" theme="primary">
  Go to Dashboard
</Button>

// Render as div
<Button as="div" theme="neutral">
  Custom Element
</Button>
```

### Rounded Variants

```tsx
<Button rounded="squared">Squared</Button>
<Button rounded="circle" size="icon">
  <PlusIcon size={16} />
</Button>
```

## Accessibility

- Uses semantic `button` element by default
- Supports `aria-disabled` when disabled or loading
- Includes `aria-busy` during loading state
- Proper focus management with visible focus rings
- Keyboard navigation support

## Styling

The Button component uses Tailwind CSS classes and supports:

- Hover and focus states
- Smooth transitions
- Disabled states
- Loading animations
- Custom className override

## Data Attributes

- `data-component="button"`: Identifies the component
- `data-theme`: Current theme variant
- `data-loading`: Loading state (true/false)

## Tailwind CSS v4 Integration

The Button component works seamlessly with Tailwind CSS v4's new features and syntax.

### Using CSS Variables and @theme

```tsx
// Custom button with Tailwind v4 CSS variables
<Button
  className="bg-[--color-primary] text-[--color-on-primary] hover:bg-[--color-primary-hover]"
  theme="raw"
>
  Custom Theme Button
</Button>

// Using @theme directive in CSS
<Button
  className="btn-custom"
  theme="raw"
>
  Styled with @theme
</Button>
```

```css
/* In your CSS file with Tailwind v4 */
@theme {
  --color-brand-primary: #3b82f6;
  --color-brand-secondary: #64748b;
}

.btn-custom {
  @apply bg-[--color-brand-primary] text-white px-4 py-2 rounded-lg;
  @apply hover:bg-[--color-brand-primary]/90 transition-colors;
  @apply focus:ring-2 focus:ring-[--color-brand-primary]/50;
}
```

### Container Queries with Button Groups

```tsx
// Button group with container queries (Tailwind v4)
<div className="@container">
  <div className="flex @sm:flex-col @md:flex-row gap-2">
    <Button theme="primary" className="@sm:w-full @md:w-auto">
      Responsive Button 1
    </Button>
    <Button theme="secondary" className="@sm:w-full @md:w-auto">
      Responsive Button 2
    </Button>
  </div>
</div>
```

### Advanced Styling with Tailwind v4

```tsx
// Using new color-mix() function support
<Button
  className="bg-[color-mix(in_srgb,theme(colors.blue.500)_80%,white)] hover:bg-[color-mix(in_srgb,theme(colors.blue.500)_90%,white)]"
  theme="raw"
>
  Color Mix Button
</Button>

// Using CSS Grid areas (Tailwind v4)
<div className="grid [grid-template-areas:'icon_text_arrow'] grid-cols-[auto_1fr_auto] gap-2">
  <Button className="[grid-area:icon] w-10 h-10" size="icon" theme="ghost-primary">
    🏠
  </Button>
  <Button className="[grid-area:text]" theme="primary">
    Main Action
  </Button>
  <Button className="[grid-area:arrow] w-10 h-10" size="icon" theme="ghost-secondary">
    →
  </Button>
</div>
```

### Dynamic Styling with CSS Custom Properties

```tsx
const DynamicButton = ({ color = "blue" }) => {
  return (
    <Button
      className="bg-[--btn-color] text-white hover:bg-[--btn-color-hover]"
      style={{
        '--btn-color': `rgb(from theme(colors.${color}.500) r g b)`,
        '--btn-color-hover': `rgb(from theme(colors.${color}.600) r g b)`
      }}
      theme="raw"
    >
      Dynamic Color Button
    </Button>
  );
};

// Usage
<DynamicButton color="red" />
<DynamicButton color="green" />
<DynamicButton color="purple" />
```

### Responsive Button Layouts

```tsx
// Advanced responsive design with Tailwind v4
<div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
  <Button
    theme="primary"
    className="@sm:col-span-2 @lg:col-span-1 text-sm @md:text-base"
  >
    Responsive Text
  </Button>
  <Button
    theme="secondary"
    className="@container-normal:px-6 @container-wide:px-8"
  >
    Container Aware
  </Button>
</div>
```

### Modern Animation with Tailwind v4

```tsx
// Using new animation features
<Button
  className="animate-[pulse_2s_ease-in-out_infinite] hover:animate-none"
  theme="primary"
>
  Pulsing Button
</Button>

// Custom keyframe animation
<Button
  className="hover:animate-[wiggle_1s_ease-in-out_infinite]"
  theme="ghost-primary"
>
  Wiggle on Hover
</Button>
```

```css
/* Define custom animation in CSS */
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}
```

## Notes

- When `loading` is true, the button becomes disabled automatically
- The component forwards refs properly for external access
- Supports all standard HTML button attributes
- Click handlers are disabled during loading state
- Uses polymorphic pattern for maximum flexibility
- Fully compatible with Tailwind CSS v4's new features including CSS variables, container queries, and color functions
