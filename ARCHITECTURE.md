# Architecture Documentation

This document explains the architectural decisions, patterns, and structure of the @g4rcez/components library.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Design Principles](#design-principles)
- [Component Architecture](#component-architecture)
- [Theme System](#theme-system)
- [Build System](#build-system)
- [Testing Strategy](#testing-strategy)
- [Performance Considerations](#performance-considerations)

## Overview

The @g4rcez/components library is built as a modern React component library with the following architectural goals:

- **Modularity**: Each component is independently importable and tree-shakeable
- **Consistency**: Unified design system and component patterns
- **Accessibility**: WCAG compliant components by default
- **Customization**: Flexible theming and styling system
- **Performance**: Optimized for bundle size and runtime performance
- **Developer Experience**: Full TypeScript support with excellent IntelliSense

## Project Structure

### Monorepo Organization

```
packages/
├── lib/                    # Main component library
│   ├── src/
│   │   ├── components/     # Component implementations
│   │   ├── hooks/          # Reusable React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── styles/         # Theme system and design tokens
│   │   ├── config/         # Configuration and context
│   │   ├── flow/           # Flow diagram components
│   │   └── types.ts        # Global type definitions
│   ├── tests/              # Unit tests
│   └── dist/               # Built output
└── docs/                   # Documentation site
    ├── src/app/docs/       # Documentation pages
    └── src/components/     # Example components
```

### Component Organization

Components are organized into logical categories based on their purpose:

#### Core Components (`src/components/core/`)

- **Purpose**: Basic building blocks and foundational components
- **Examples**: `Button`, `Tag`, `Polymorph`, `Heading`
- **Characteristics**: Minimal dependencies, highly reusable

#### Form Components (`src/components/form/`)

- **Purpose**: Input and form-related functionality
- **Examples**: `Input`, `Select`, `Checkbox`, `DatePicker`
- **Characteristics**: Form validation integration, accessibility focus

#### Display Components (`src/components/display/`)

- **Purpose**: Information presentation and layout
- **Examples**: `Alert`, `Card`, `Timeline`, `Calendar`
- **Characteristics**: Content-focused, responsive design

#### Floating Components (`src/components/floating/`)

- **Purpose**: Overlay and positioning-dependent components
- **Examples**: `Modal`, `Tooltip`, `Dropdown`, `Menu`
- **Characteristics**: Uses Floating UI for positioning, portal rendering

#### Table Components (`src/components/table/`)

- **Purpose**: Data table functionality
- **Examples**: `Table`, `Filter`, `Pagination`, `Sort`
- **Characteristics**: Complex state management, virtualization support

## Design Principles

### 1. Composition over Configuration

Components are designed to be composable rather than highly configurable:

```tsx
// Good: Composable
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card>

// Avoid: Over-configured
<Card
  title="Title"
  content="Content"
  showHeader={true}
  headerStyle="primary"
/>
```

### 2. Polymorphic Components

Core components support polymorphism through the `Polymorph` base:

```tsx
// Can render as different elements
<Button as="a" href="/link">Link Button</Button>
<Button as="button" onClick={handler}>Button</Button>
```

### 3. Controlled vs Uncontrolled

Components support both controlled and uncontrolled usage patterns:

```tsx
// Controlled
<Input value={value} onChange={setValue} />

// Uncontrolled
<Input defaultValue="initial" />
```

### 4. Accessibility First

All components are built with accessibility as a primary concern:

- Semantic HTML elements
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

## Component Architecture

### Base Component Pattern

Most components follow this structure:

```tsx
// Component interface
interface ComponentProps {
  // Props definition
}

// Main component
export const Component = forwardRef<HTMLElement, ComponentProps>(
  (props, ref) => {
    // Component logic
    return <element ref={ref} {...props} />;
  },
);

// Display name for debugging
Component.displayName = "Component";

// Subcomponents (if applicable)
Component.SubComponent = SubComponent;
```

### Hook Integration

Components integrate with custom hooks for common functionality:

```tsx
const Component = (props) => {
  const theme = useTweaks(); // Theme access
  const translations = useTranslations(); // i18n
  const id = useInputId(); // Unique IDs

  // Component implementation
};
```

### Styling Architecture

Components use a combination of:

1. **Tailwind CSS**: Utility-first styling
2. **Class Variance Authority (CVA)**: Variant-based styling
3. **Design Tokens**: Consistent values across components

```tsx
const buttonVariants = cva("base-button-classes", {
  variants: {
    variant: {
      primary: "primary-classes",
      secondary: "secondary-classes",
    },
    size: {
      sm: "small-classes",
      md: "medium-classes",
    },
  },
});
```

## Theme System

### Design Tokens

The theme system is built on design tokens defined in `src/styles/`:

```typescript
// design-tokens.ts
export const designTokens = {
  colors: {
    primary: {
      /* color scale */
    },
    secondary: {
      /* color scale */
    },
    // ...
  },
  spacing: {
    /* spacing scale */
  },
  typography: {
    /* font definitions */
  },
  // ...
};
```

### Theme Context

Themes are provided through React Context:

```tsx
// ComponentsProvider wraps the app
<ComponentsProvider theme={customTheme}>
  <App />
</ComponentsProvider>
```

### Dark Mode Support

The library includes built-in dark mode support:

- CSS custom properties for theme values
- Automatic system preference detection
- Manual theme switching

## Build System

### Vite Configuration

The library uses Vite for building with the following setup:

- **Entry Point**: `src/index.ts`
- **Output Formats**: ESM, CJS, UMD
- **External Dependencies**: React, React-DOM marked as externals
- **CSS Processing**: PostCSS with Tailwind CSS

### Bundle Optimization

- **Tree Shaking**: Individual component imports
- **Code Splitting**: Separate chunks for large dependencies
- **Minification**: Terser for production builds
- **Type Generation**: TypeScript declaration files

### Export Strategy

Components are exported in multiple ways:

```typescript
// Main export (all components)
export * from "./components";

// Individual exports (tree-shaking friendly)
export { Button } from "./components/core/button";
export { Input } from "./components/form/input";
```

## Testing Strategy

### Unit Testing

- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **Coverage**: Components, hooks, utilities

### Test Organization

```
tests/
├── components/     # Component tests
├── hooks/          # Hook tests
├── lib/            # Utility tests
└── __mocks__/      # Test mocks
```

### Testing Patterns

```tsx
// Component test example
describe("Button", () => {
  it("renders with correct variant", () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("primary-classes");
  });
});
```

## Performance Considerations

### Bundle Size Optimization

1. **Tree Shaking**: Individual component imports
2. **External Dependencies**: React marked as external
3. **Dynamic Imports**: Lazy loading for large components
4. **Bundle Analysis**: Regular bundle size monitoring

### Runtime Performance

1. **React.memo**: Memoization for expensive components
2. **useMemo/useCallback**: Hook optimization
3. **Virtual Scrolling**: For large lists (Table component)
4. **Debouncing**: For search and input components

### CSS Performance

1. **Tailwind Purging**: Unused styles removed
2. **CSS Custom Properties**: Efficient theme switching
3. **Critical CSS**: Above-the-fold styles prioritized

## Development Workflow

### Local Development

```bash
# Start development environment
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build
```

### Component Development Process

1. **Design**: Define component API and behavior
2. **Implementation**: Build component with TypeScript
3. **Testing**: Write comprehensive tests
4. **Documentation**: Add to docs site with examples
5. **Integration**: Export from main index

### Release Process

1. **Version Bump**: Semantic versioning
2. **Build**: Generate distribution files
3. **Test**: Run full test suite
4. **Publish**: NPM package publication
5. **Documentation**: Update docs site

## Future Considerations

### Planned Improvements

1. **Component Variants**: More styling options
2. **Animation System**: Motion components integration
3. **Form Validation**: Enhanced validation system
4. **Accessibility**: WCAG 2.2 compliance
5. **Performance**: Further bundle size optimization

### Migration Strategy

The library is designed to support gradual migration:

- Backward compatibility maintenance
- Deprecation warnings for breaking changes
- Migration guides for major versions
- Codemods for automated updates

This architecture ensures the library remains maintainable, performant, and developer-friendly while providing a solid foundation for future growth.
