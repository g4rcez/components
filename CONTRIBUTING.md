# Contributing Guide

Thank you for your interest in contributing to @g4rcez/components! This guide will help you get started with development and understand our contribution process.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Component Development](#component-development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

- **Node.js**: >= 20.14.0
- **pnpm**: Latest version (recommended package manager)
- **Git**: For version control

### Getting Started

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/components.git
   cd components
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Start Development Server**

   ```bash
   pnpm dev
   ```

   This starts the documentation site at `http://localhost:3000`

4. **Build the Library**
   ```bash
   pnpm build
   ```

### Available Scripts

```bash
# Development
pnpm dev              # Start docs development server
pnpm start            # Start docs production server

# Building
pnpm build            # Build both library and docs
pnpm --filter ./packages/lib build  # Build library only

# Testing
pnpm --filter ./packages/lib test        # Run tests
pnpm --filter ./packages/lib test:watch  # Run tests in watch mode

# Code Quality
pnpm format           # Format code with Prettier
```

## Project Structure

```
packages/
├── lib/                          # Main component library
│   ├── src/
│   │   ├── components/           # Component implementations
│   │   │   ├── core/            # Basic components
│   │   │   ├── form/            # Form components
│   │   │   ├── display/         # Display components
│   │   │   ├── floating/        # Floating components
│   │   │   └── table/           # Table components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── styles/              # Theme system
│   │   └── config/              # Configuration
│   ├── tests/                   # Unit tests
│   └── dist/                    # Built output
└── docs/                        # Documentation site
    ├── src/app/docs/            # Documentation pages
    └── src/components/examples/ # Live examples
```

## Development Workflow

### 1. Issue Creation

Before starting work:

- Check existing issues to avoid duplication
- Create an issue describing the feature/bug
- Wait for maintainer approval for new features

### 2. Branch Creation

```bash
# Feature branch
git checkout -b feature/component-name

# Bug fix branch
git checkout -b fix/issue-description

# Documentation branch
git checkout -b docs/update-readme
```

### 3. Development Process

1. **Make Changes**: Implement your feature/fix
2. **Add Tests**: Write comprehensive tests
3. **Update Documentation**: Add/update docs and examples
4. **Test Locally**: Ensure everything works
5. **Format Code**: Run `pnpm format`

## Component Development

### Creating a New Component

1. **Choose the Right Category**

   - `core/` - Basic building blocks
   - `form/` - Input and form-related
   - `display/` - Information display
   - `floating/` - Overlays and popups
   - `table/` - Data table related

2. **Component Template**

````tsx
// packages/lib/src/components/category/my-component.tsx
import React, { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { css } from "../../lib/dom";

/**
 * Component variant definitions
 * @internal
 */
const variants = {
  variant: {
    default: "default-classes",
    primary: "primary-classes",
  },
  size: {
    sm: "small-classes",
    md: "medium-classes",
  },
};

/**
 * Class variance authority configuration
 * @internal
 */
const componentVariants = cva("base-classes", {
  variants,
  defaultVariants: { variant: "default", size: "md" },
});

/**
 * Props for the MyComponent
 */
export interface MyComponentProps {
  /** Component variant */
  variant?: keyof typeof variants.variant;
  /** Component size */
  size?: keyof typeof variants.size;
  /** Additional CSS classes */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
}

/**
 * A description of what this component does.
 *
 * @example
 * ```tsx
 * <MyComponent variant="primary" size="lg">
 *   Content
 * </MyComponent>
 * ```
 */
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={css(componentVariants({ variant, size }), className)}
        data-component="my-component"
        {...props}
      >
        {children}
      </div>
    );
  },
);

MyComponent.displayName = "MyComponent";
````

3. **Export the Component**

Add to `packages/lib/src/components/index.ts`:

```tsx
export * from "./category/my-component";
```

4. **Add to Package Exports**

Update `packages/lib/package.json` exports section:

```json
{
  "./my-component": {
    "type": "./dist/components/category/my-component.d.ts",
    "import": "./dist/components/category/my-component.js",
    "require": "./dist/components/category/my-component.js",
    "default": "./dist/components/category/my-component.js"
  }
}
```

### Component Guidelines

1. **TypeScript First**

   - All components must be fully typed
   - Use proper interfaces for props
   - Export all relevant types

2. **Accessibility**

   - Use semantic HTML elements
   - Include proper ARIA attributes
   - Support keyboard navigation
   - Test with screen readers

3. **Styling**

   - Use Tailwind CSS classes
   - Implement variants with CVA
   - Support custom className prop
   - Follow design system tokens

4. **Performance**

   - Use React.forwardRef for ref forwarding
   - Implement React.memo when appropriate
   - Avoid unnecessary re-renders

5. **Documentation**
   - Add comprehensive JSDoc comments
   - Include usage examples
   - Document all props and variants

## Testing

### Writing Tests

Create test files alongside components:

```tsx
// packages/lib/tests/components/my-component.test.tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "../../src/components/category/my-component";

describe("MyComponent", () => {
  it("renders with default props", () => {
    render(<MyComponent>Test content</MyComponent>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    render(<MyComponent variant="primary">Test</MyComponent>);
    const element = screen.getByText("Test");
    expect(element).toHaveClass("primary-classes");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MyComponent ref={ref}>Test</MyComponent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

### Testing Guidelines

1. **Test Coverage**

   - Component rendering
   - Prop variations
   - Event handlers
   - Accessibility features
   - Error states

2. **Testing Tools**

   - Vitest for test runner
   - React Testing Library for component testing
   - Jest DOM matchers for assertions

3. **Running Tests**

   ```bash
   # Run all tests
   pnpm --filter ./packages/lib test

   # Watch mode
   pnpm --filter ./packages/lib test:watch

   # Coverage report
   pnpm --filter ./packages/lib test --coverage
   ```

## Documentation

### Adding Component Documentation

1. **Create Documentation Page**

```tsx
// packages/docs/src/app/docs/my-component/page.tsx
import { MyComponent } from "@g4rcez/components/my-component";

export default function MyComponentPage() {
  return (
    <div>
      <h1>MyComponent</h1>
      <p>Component description...</p>

      <h2>Examples</h2>
      <MyComponent variant="primary">Example usage</MyComponent>

      <h2>API Reference</h2>
      {/* Props table */}
    </div>
  );
}
```

2. **Add Live Examples**

```tsx
// packages/docs/src/components/examples/my-component.tsx
import { MyComponent } from "@g4rcez/components/my-component";

export const MyComponentExample = () => {
  return (
    <div className="space-y-4">
      <MyComponent variant="default">Default</MyComponent>
      <MyComponent variant="primary">Primary</MyComponent>
    </div>
  );
};
```

3. **Update Navigation**

Add to the docs navigation in `packages/docs/src/components/navigation.tsx`.

## Code Style

### Formatting

- **Prettier**: Automatic code formatting
- **ESLint**: Code quality and consistency
- **TypeScript**: Type checking

### Style Guidelines

1. **File Naming**

   - Components: `kebab-case.tsx`
   - Hooks: `use-hook-name.ts`
   - Utilities: `kebab-case.ts`

2. **Component Structure**

   ```tsx
   // 1. Imports
   import React from "react";

   // 2. Types and interfaces
   interface Props {}

   // 3. Component implementation
   export const Component = () => {};

   // 4. Display name
   Component.displayName = "Component";
   ```

3. **Naming Conventions**
   - Components: PascalCase
   - Props: camelCase
   - CSS classes: kebab-case
   - Files: kebab-case

## Pull Request Process

### Before Submitting

1. **Code Quality**

   - [ ] All tests pass
   - [ ] Code is formatted with Prettier
   - [ ] No TypeScript errors
   - [ ] No console warnings

2. **Documentation**

   - [ ] JSDoc comments added
   - [ ] Documentation page created/updated
   - [ ] Examples provided
   - [ ] README updated if needed

3. **Testing**
   - [ ] Unit tests written
   - [ ] Manual testing completed
   - [ ] Accessibility tested

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Accessibility tested

## Screenshots

(If applicable)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**

   - CI/CD pipeline runs
   - Tests must pass
   - Build must succeed

2. **Code Review**

   - Maintainer review required
   - Address feedback promptly
   - Keep discussions constructive

3. **Merge**
   - Squash and merge preferred
   - Clear commit messages
   - Update changelog if needed

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Version Bump**

   ```bash
   # Update version in package.json
   npm version patch|minor|major
   ```

2. **Build and Test**

   ```bash
   pnpm build
   pnpm test
   ```

3. **Publish**

   ```bash
   npm publish
   ```

4. **Tag Release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Getting Help

- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: allan.f.garcez@gmail.com

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this together!

---

Thank you for contributing to @g4rcez/components! 🎉
