# Agentic Coding Guidelines

This document provides instructions and guidelines for AI agents operating within this codebase.

## 1. Project Overview

- **Architecture**: Monorepo managed with pnpm workspaces.
- **Packages**:
  - `packages/lib` (`@g4rcez/components`): The main React component library.
  - `packages/docs`: Documentation site built with Next.js 16.
  - `packages/tailwindcss-v4`: Tailwind CSS v4 integration/test app.
- **Tech Stack**: React 19, TypeScript, Tailwind CSS, Radix UI/Base UI, Framer Motion, Vitest.

## 2. Build, Lint, and Test Commands

Run all commands from the root directory unless specified otherwise. Use `pnpm --filter <package>` to target specific packages.

### Build

- **Build all**: `pnpm build` (Runs library build first, then docs)
- **Build library only**: `pnpm --filter @g4rcez/components build`
- **Build docs**: `pnpm --filter docs build`

### Lint & Format

- **Format code**: `pnpm --filter @g4rcez/components format` (Runs Prettier)
- **Lint library**: `npx eslint .` (inside `packages/lib`) or rely on format/build checks.
- **Lint docs**: `pnpm --filter docs lint` (Runs Next.js linting)

### Test (Library)

Testing is primarily focused on `packages/lib`.

- **Run all tests**: `pnpm --filter @g4rcez/components test` (Runs Vitest)
- **Watch mode**: `pnpm --filter @g4rcez/components test:watch`
- **Run a single test file**:
  `pnpm --filter @g4rcez/components test <path-to-file>`
  Example: `pnpm --filter @g4rcez/components test tests/modal.test.tsx`

## 3. Code Style & Conventions

### File Organization

- **Library Components**: `packages/lib/src/components/<category>/<kebab-case-name>.tsx`
  - Categories: `core`, `display`, `floating`, `form`, `table`.
- **Library Tests**: `packages/lib/tests/<kebab-case-name>.test.tsx` or alongside components.
- **Library Styles**: `packages/lib/src/styles/`
- **Docs Pages**: `packages/docs/app/...`

### Naming Conventions

- **Files**: `kebab-case.ts` / `kebab-case.tsx`
- **Components**: `PascalCase` (e.g., `MyComponent`)
- **Props Interface**: `MyComponentProps` (exported) or `Props` (local)
- **Props**: `camelCase`
- **CSS Classes**: `kebab-case` (Tailwind)
- **Test Files**: `*.test.tsx`

### Component Implementation (Library)

Follow this template for new components in `packages/lib`:

```tsx
"use client"; // if interactive or using hooks
import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { css } from "../../lib/dom"; // Utility for merging classes (clsx + tailwind-merge)

// Define variants using CVA
const variants = cva("base-classes focus:outline-none focus:ring-2", {
  variants: {
    variant: {
      default: "bg-primary text-white",
      outline: "border border-input bg-background",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  // Add custom props here
  asChild?: boolean; // If using Radix Slot
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={css(variants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
MyComponent.displayName = "MyComponent";
```

- **Styling**: Use Tailwind CSS via `cva`. Always allow `className` prop to override.
- **Class Merging**: Use the `css` utility (wrapper around `clsx` and `tailwind-merge`).
- **Types**: Explicitly type all props. Use `React.HTMLAttributes<T>` for standard props.
- **Refs**: Always use `forwardRef` for reusable components.

### Imports

- **Library (`packages/lib`)**:
  - Use **relative imports** (e.g., `../../lib/dom`).
  - Do NOT use path aliases like `@/` in the library package.
- **Docs (`packages/docs`)**:
  - Use **path aliases** (`@/*`) for internal imports.
  - Import library components from `@g4rcez/components`.

### Testing Guidelines

- **Framework**: Vitest + React Testing Library + JSDOM.
- **Location**: `packages/lib/tests/`.
- **Structure**:

  ```tsx
  import { render, screen, fireEvent } from "@testing-library/react";
  import { describe, it, expect, vi } from "vitest";
  import { MyComponent } from "../src/components/category/my-component";

  describe("MyComponent", () => {
    it("renders correctly with default props", () => {
      render(<MyComponent>Label</MyComponent>);
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<MyComponent onClick={handleClick}>Click me</MyComponent>);
      fireEvent.click(screen.getByText("Click me"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
  ```

## 4. Documentation & comments

- Add concise JSDoc comments for complex logic or public APIs.
- Update `packages/docs` when adding new components or features.
- Do not leave commented-out code.

## 5. Error Handling & Safety

- Use `try/catch` blocks for async operations or external API calls.
- Ensure components fail gracefully.
- Do not commit secrets or sensitive data.
- Validate props where necessary, but rely on TypeScript for type safety.
