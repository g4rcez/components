---
name: design-system-guidelines
description: ALWAYS use this skill when creating new components, modifying existing components, adding styling, working with design tokens, or doing anything related to this component library. Use this before writing any component code.
---

# Design System Guidelines

Enforce design system rules and best practices for the components library.

## React Patterns

All components MUST follow these patterns:

### 1. `forwardRef` — Always

Every component uses `forwardRef`:

```tsx
export const MyComponent: <T extends React.ElementType = "div">(_: MyComponentProps<T>) => React.ReactNode = forwardRef(function MyComponent(
    { className, theme, size, ...props }: MyComponentProps,
    ref: React.Ref<"div">
) {
    return (
        <Polymorph
            {...props}
            ref={ref}
            data-component="my-component"
            as={props.as ?? "div"}
            className={css(myVariants({ theme, size }), className)}
        />
    );
}) as any;
```

### 2. `cva()` — Variant Management

Use `cva()` from `class-variance-authority` for all variant-based styling:

```tsx
import { cva } from "class-variance-authority";

const variants = {
    theme: {
        primary: "bg-button-primary-bg text-button-primary-text",
        danger:  "bg-button-danger-bg text-button-danger-text",
        muted:   "bg-button-muted-bg text-button-muted-text",
    },
    size: {
        default: "h-10 px-4 py-2",
        small:   "h-8 px-3 py-1 text-sm",
    },
};

const myVariants = cva("base-classes-here", {
    variants,
    defaultVariants: { theme: "primary", size: "default" },
});
```

### 3. `Polymorph` — Polymorphic Rendering

When the element type can vary, use `Polymorph`:

```tsx
import { Polymorph, PolymorphicProps } from "./polymorph";
// Usage: <MyComponent as="a" href="/link"> renders an <a> tag
```

### 4. `css()` — Class Merging

Import `css` from `../../lib/dom` (NOT clsx or cn directly):

```tsx
import { css } from "../../lib/dom";
// css() = twMerge(clsx(...)) — handles conflicts + conditional classes
className={css(myVariants({ theme, size }), className)}
```

### 5. `data-component` — Debugging Attribute

Every component root element must have `data-component="kebab-case-name"`:

```tsx
<Polymorph data-component="my-component" ... />
```

### 6. Compound Components — Complex Components

Use compound component pattern (Tabs, Step, List, etc.):

```tsx
export const Tabs = { Root: TabsRoot, List: TabsList, Item: TabsItem };
// Usage: <Tabs.Root><Tabs.List><Tabs.Item /></Tabs.List></Tabs.Root>
```

---

## TypeScript Rules

### No `any`

Use `unknown`, generics, or proper union types. Never `any`.

### Polymorphic Props

```tsx
import { PolymorphicProps } from "./polymorph";
import { CvaVariants, Override } from "../../types";

// Variant keys extracted from CVA variants object (NOT the cva() result):
type Variants = CvaVariants<typeof variants>;

// Full component props:
type MyComponentProps<T extends React.ElementType = "div"> = PropsWithChildren<
    PolymorphicProps<Variants & Partial<{ extraProp: string }>, T>
>;

// Override source props with new ones:
type CustomProps = Override<React.HTMLAttributes<HTMLDivElement>, { onClick: (id: string) => void }>;
```

- `CvaVariants<T>` — extracts variant keys from the variants object (the plain object, not the cva() call)
- `PolymorphicProps<Props, T>` — merges custom props with the element's native props, adding `as?: T`
- `Override<Source, New>` — `Omit<Source, keyof New> & New`

---

## Design Token Rules

### Core Rule: NEVER hardcode values

No `text-[#fff]`, `rounded-[8px]`, `z-[9999]`, `p-[12px]`. Use tokens only.

### Colors — Semantic Tokens

Use as `bg-{token}`, `text-{token}`, `border-{token}`:

**Global:**
- `foreground`, `background`, `border`, `muted`, `muted-foreground`, `disabled`
- `primary`, `primary-foreground`, `primary-subtle`, `primary-hover`
- `secondary`, `secondary-foreground`, `secondary-subtle`, `secondary-hover`, `secondary-background`
- `info`, `info-foreground`, `info-subtle`, `info-hover`, `info-notification`
- `danger`, `danger-foreground`, `danger-subtle`, `danger-hover`, `danger-notification`
- `warn`, `warn-foreground`, `warn-subtle`, `warn-hover`, `warn-notification`
- `success`, `success-foreground`, `success-subtle`, `success-hover`, `success-notification`
- `emphasis`, `emphasis-foreground`, `emphasis-subtle`, `emphasis-hover`

**Component-specific:**
- Card: `bg-card-background`, `border-card-border`, `bg-card-muted`
- Button: `bg-button-primary-bg`, `text-button-primary-text`, `bg-button-danger-bg`, `text-button-danger-text`, `bg-button-muted-bg`, `text-button-muted-text`, `bg-button-warn-bg`, `text-button-warn-text`, `bg-button-info-bg`, `text-button-info-text`, `bg-button-success-bg`, `text-button-success-text`, `bg-button-secondary-bg`, `text-button-secondary-text`, `bg-button-neutral-bg`, `text-button-neutral-text`
- Tag: `bg-tag-primary-bg`, `text-tag-primary-text`, `bg-tag-danger-bg`, `text-tag-danger-text`, `bg-tag-warn-bg`, `text-tag-warn-text`, `bg-tag-success-bg`, `text-tag-success-text`, `bg-tag-muted-bg`, `text-tag-muted-text`, `bg-tag-neutral-bg`, `text-tag-neutral-text`, `bg-tag-secondary-bg`, `text-tag-secondary-text`
- Alert: `bg-alert-{theme}-bg`, `text-alert-{theme}-text`, `border-alert-{theme}-border` (themes: primary, danger, warn, info, success, muted, neutral, secondary)
- Floating: `bg-floating-background`, `text-floating-foreground`, `border-floating-border`, `bg-floating-hover`, `bg-floating-overlay`
- Tooltip: `bg-tooltip-background`, `text-tooltip-foreground`, `border-tooltip-border`
- Table: `bg-table-header`, `bg-table-background`, `border-table-border`
- Input: `border-input-border`, `text-input-placeholder`, `bg-input-mask-error`, `bg-input-switch-bg`, `bg-input-switch`, `bg-input-slider`

### Spacing — from `common.ts`

- `gap-base`, `p-base`, `px-base`, `py-base` (1rem)
- `gap-lg`, `p-lg` (1.125rem)
- `gap-sm`, `p-sm` (0.75rem)
- `gap-hairline`, `p-hairline` (0.0625rem)
- `h-input-height` (2.5rem), `h-field-height` (1.5rem)
- `px-input-x`, `py-input-y`, `gap-input-gap`
- `w-dialog` (modal width: 20rem)

### Rounded

- `rounded-button` — for buttons
- `rounded-card` — for cards and panels
- `rounded-pill` — for pill-shaped elements
- `rounded-full` — for circles / avatars

### Shadows

- `shadow-shadow-card` — subtle card elevation
- `shadow-shadow-floating` — modals, dropdowns
- `shadow-shadow-notification` — toasts, notifications
- `shadow-shadow-table` — table container

### Z-Index

- `z-normal` (1) — default stacking
- `z-calendar` (2) — date pickers
- `z-tooltip` (20) — tooltips
- `z-overlay` (21) — modal overlays
- `z-navbar` (22) — nav bar
- `z-floating` (22) — floating panels, modals
- `z-wizard` (50) — wizard/stepper overlays

---

## Full Component Example

```tsx
import { cva } from "class-variance-authority";
import React, { forwardRef, PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { CvaVariants } from "../../types";
import { Polymorph, PolymorphicProps } from "../core/polymorph";

const variants = {
    theme: {
        primary: "bg-button-primary-bg text-button-primary-text",
        danger:  "bg-button-danger-bg text-button-danger-text",
        muted:   "bg-button-muted-bg text-button-muted-text",
    },
    size: {
        default: "h-10 px-4 py-2",
        small:   "h-8 px-3 py-1 text-sm",
    },
};

const badgeVariants = cva("inline-flex items-center font-medium rounded-button", {
    variants,
    defaultVariants: { theme: "primary", size: "default" },
});

type Variants = CvaVariants<typeof variants>;

export type BadgeProps<T extends React.ElementType = "span"> = PropsWithChildren<
    PolymorphicProps<Variants, T>
>;

export const Badge: <T extends React.ElementType = "span">(_: BadgeProps<T>) => React.ReactNode = forwardRef(function Badge(
    { className, theme, size, ...props }: BadgeProps,
    ref: React.Ref<"span">
) {
    return (
        <Polymorph
            {...props}
            ref={ref}
            data-component="badge"
            as={props.as ?? "span"}
            className={css(badgeVariants({ theme, size }), className)}
        />
    );
}) as any;
```

---

## Component-Specific Rules

### Card (`/packages/lib/src/components/display/card.tsx`)

- DO NOT add custom `rounded-*`, `p-*`, `shadow-*`, `border-*` overrides
- Use tokens: `rounded-card`, `shadow-shadow-card`, `border-card-border`, `bg-card-background`

```tsx
<Card container="custom-layout-class" />  // OK
<Card className="rounded-lg p-4" />       // WRONG
```

### Modal (`/packages/lib/src/components/floating/modal.tsx`)

- DO NOT add custom `z-*`, `rounded-*`, `p-*` overrides
- Use tokens: `z-floating`, `bg-floating-background`, `border-floating-border`

```tsx
<Modal type="dialog" />                          // OK
<Modal className="rounded-xl p-8 z-[9999]" />   // WRONG
```

---

## Validation Checklist

When creating or reviewing component code:

- [ ] No hardcoded color values (`#3B82F6`, `rgb(...)`, `text-blue-500`)
- [ ] No hardcoded spacing (`p-[12px]`, `gap-[8px]`)
- [ ] No arbitrary Tailwind values (`rounded-[8px]`, `z-[9999]`)
- [ ] Primary color uses `primary` token, not "blue"
- [ ] Card: no custom `rounded-*`, `p-*`, `shadow-*`
- [ ] Modal: no custom `z-*`, `rounded-*`, `p-*`
- [ ] All z-index from token system (`z-floating`, `z-tooltip`, etc.)
- [ ] Component uses `forwardRef`
- [ ] Component uses `cva()` for variants
- [ ] Variant types use `CvaVariants<typeof variants>` (variants object, not cva result)
- [ ] Polymorphic components use `Polymorph` + `PolymorphicProps`
- [ ] Class merging uses `css()` from `../../lib/dom`
- [ ] Root element has `data-component="kebab-name"`
- [ ] No `any` types — use generics/`unknown`/unions

---

## Quick Reference

| Concern | File |
|---------|------|
| Colors | `packages/lib/src/styles/light.ts` / `dark.ts` |
| Spacing / Rounded / Z-Index | `packages/lib/src/styles/common.ts` |
| `css()` utility | `packages/lib/src/lib/dom.ts` |
| Type utilities | `packages/lib/src/types.ts` |
| Polymorph | `packages/lib/src/components/core/polymorph.tsx` |
| Tailwind config | `packages/lib/tailwind.config.ts` |
