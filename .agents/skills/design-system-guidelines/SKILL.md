---
name: design-system-guidelines
description: "always use this skill when creating new components, modifying existing components, adding styling, working with design tokens, migrating CSS, or doing anything related to this component library. Use this before writing any component code. Enforce the token-first design system: prioritize `packages/lib/src/styles/tokens.css`, follow the simplified CSS-variable usage pattern from `packages/lib/src/components/display/card/card.css`, derive component tokens from base tokens with `calc()`, avoid two-level variable alias/fallback chains, never use `color-mix()`, prefer broadly supported `hsla()` color tokens, and preserve the shadcn/ui mindset of semantic tokens that are easy to theme rather than hardcoded values."
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
        danger: "bg-button-danger-bg text-button-danger-text",
        muted: "bg-button-muted-bg text-button-muted-text",
    },
    size: {
        default: "h-button-height px-button-padding-x py-button-padding-y",
        small: "h-button-height-small px-button-padding-x-small py-button-padding-y-small text-typography-sm",
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
type MyComponentProps<T extends React.ElementType = "div"> = PropsWithChildren<PolymorphicProps<Variants & Partial<{ extraProp: string }>, T>>;

// Override source props with new ones:
type CustomProps = Override<React.HTMLAttributes<HTMLDivElement>, { onClick: (id: string) => void }>;
```

- `CvaVariants<T>` — extracts variant keys from the variants object (the plain object, not the cva() call)
- `PolymorphicProps<Props, T>` — merges custom props with the element's native props, adding `as?: T`
- `Override<Source, New>` — `Omit<Source, keyof New> & New`

---

## CSS Mental Model

The library styling contract has four layers. Keep them separate:

1. **Component TSX emits stable semantic classes** — use `defineComponentStyles()` from `*.styles.ts` for the base class and variants, and explicit slot classes such as `__button__icon`, `__checkbox__control`, or `__input-field__error-text`.
2. **Component CSS owns visual implementation** — styles live in `*.css` files and target stable selectors. Do not encode visual rules as long utility strings in TSX.
3. **Design tokens are CSS variables** — component CSS reads tokens with `var(...)`; changing a token must update the component live without changing classes.
4. **Manifests/docs describe the public contract** — when selectors, variants, slots, or dependencies change, update the style sidecar/docs/manifest source so agents and tools can discover the contract.

### Stable selector rules

- Public class contract: `__component`, `__component--variant-value`, `__component__slot`.
- Never add or preserve generated migration classes like `__form-input-field__tw-17`, `__component__tw-extra-1`, or `__component__tw-state-1`.
- Rename generated classes to semantic slots based on purpose, not source order (`__radiobox__control-state`, not `tw-state-1`).
- Shared selectors must target stable component roots/slots. Do not make new CSS depend on another component's generated `tw-*` hook.
- TSX class names should be small and structural: base + variants + slots + user `className`. Put visual declarations in CSS.

### Token customization model

- Component defaults are defined in `packages/lib/src/styles/components.ts` and emitted as CSS custom properties.
- New handwritten v6 CSS should prefer the `--var-*` token namespace when available (for example `--var-button-height`, `--var-color-primary`, `--var-rounded-full`). Some legacy chunks still read direct component variables such as `--radiobox-size`; preserve those until the component is migrated.
- Component demos/token editors should override CSS variables on a wrapper or theme scope so changes apply in real time:

```tsx
<div style={{ "--radiobox-size": "1.25rem", "--radiobox-gap": "0.75rem" } as React.CSSProperties}>
    <Radiobox name="plan" value="pro">
        Pro
    </Radiobox>
</div>
```

- Consumer apps customize globally through theme objects + `createTokenStyles()`/`createCssProperties()`, and locally through scoped CSS variable overrides. Do not customize by reaching into generated classes or hardcoding Tailwind utilities.

---

## Design Token Rules

### Token source of truth

Treat `packages/lib/src/styles/tokens.css` as the base token source for new CSS. Component CSS should consume a single semantic `--var-*` token when the value is component-specific, or consume a global semantic/base token directly when the component does not need its own meaning. Derive component sizes from base tokens with `calc()` instead of inventing new literal values.

Use this simplified pattern from `card.css`:

```css
/* tokens.css */
:root {
    --var-card-gap: calc(var(--var-spacing-base) * 1);
    --var-card-padding-inline: calc(var(--var-spacing-base) * 1.5);
    --var-card-title-padding-block-end: calc(var(--var-spacing-base) / 2);
}

/* component CSS */
.__card__body {
    gap: var(--var-card-gap);
    border-color: var(--var-color-border);
    padding-inline: var(--var-card-padding-inline);
}
```

Token hierarchy rules:

1. **No two-level variable aliases.** Do not define a component token whose value is only a fallback/alias to another token, then consume that alias in CSS. For example, avoid `--var-card-border-color: var(--var-card-border, var(--var-color-border))` if the component can read `--var-color-border` directly. Avoid `--var-input-padding: var(--var-input-spacing, var(--var-spacing))` if the component can read `--var-spacing` directly.
2. **Component tokens must earn their name.** Create `--var-component-slot-property` only when the value represents a real semantic part of the component/DOM, or when consumers should customize that part independently. Otherwise use the global semantic/base token directly.
3. **Derived component tokens use base-token math.** Prefer `--var-card-title-padding-block-end: calc(var(--var-spacing-base) / 2)` over literal deltas like `0.5rem`.
4. **CSS usage stays shallow.** Component CSS should read one variable per declaration (`padding-inline: var(--var-card-padding-inline);`) instead of nested fallback chains.
5. **Legacy fallbacks are temporary migration code.** If an existing component still needs old `--component-*` support, keep that compatibility close to the old CSS while migrating, but do not introduce new alias/fallback chains in `tokens.css`.
6. **Avoid modern color-computation functions.** Never use `color-mix()` in tokens or component CSS. Prefer explicit semantic color tokens whose default values are broadly supported `hsla(...)` colors.
7. Literal values are allowed only when they represent browser primitives, structural resets, math constants, or token primitive defaults (`0`, `1`, `100%`, `transparent`, `currentColor`, `inherit`, `none`, `linear`, `hsla(...)`, etc.).

### Shadcn-style semantic token mindset

Follow the shadcn/ui token philosophy without copying names blindly: components should depend on semantic CSS variables (`background`, `foreground`, `border`, `primary`, `muted`, `card`, `button`) that can be remapped by themes. Do not bind component intent to raw color families, one-off spacing, or visual adjectives like “blue card” or “large 24px gap.” Prefer tokens that describe role and relationship, then derive variants from those tokens.

Variable names must describe the semantic DOM role, not implementation mechanics or visual coincidence. Prefer `--var-card-title-padding-block-end`, `--var-card-stats-icon-size`, and `--var-input-field-padding-inline`; avoid vague aliases like `--var-card-border-color` when the semantic value is just the global border, or generic names like `--var-input-spacing` when the DOM role is input field padding/gap.

### Color tokens and legacy browser support

Define color primitives and semantic color tokens as explicit `hsla(...)` values in `tokens.css` or theme files. Component CSS should consume those tokens directly with `color: var(--var-color-...)`, `background-color: var(--var-...-background)`, or `border-color: var(--var-...-border)`.

Do not use `color-mix()`, relative color syntax, `oklch()`, `lab()`, or other modern color math for defaults. They make theming harder to reason about and reduce legacy browser compatibility. If a lighter/darker/subtle state is needed, add an explicit semantic token such as `--var-alert-danger-background: hsla(...)` or reuse an existing token like `--var-color-danger-subtle`.

### Core Rule: NEVER hardcode values

No `text-[#fff]`, `rounded-[8px]`, `z-[9999]`, `p-[12px]`, `color: #2563eb`, or `height: 1rem` inside component styling. Use design-token CSS variables or token utilities only.

### Component Token System

All component-specific tokens are defined in `packages/lib/src/styles/components.ts` and auto-registered in Tailwind by `preset.tailwind.ts`. The mapping rule is:

| Attribute in `components.ts` | Tailwind class pattern                                       |
| ---------------------------- | ------------------------------------------------------------ |
| `radius`                     | `rounded-{component}-radius`                                 |
| `border` or `*-border`       | `border-{component}-{attr}` (also usable as spacing)         |
| `text`, `*-text`, `text-*`   | `text-{component}-{attr}` (also usable as spacing)           |
| anything else                | spacing — `h-`, `p-`, `px-`, `py-`, `gap-`, `w-`, `m-`, etc. |

Typography sizes are a special case: attrs from `components.typography` register as `text-typography-{size}` (not `text-{size}`):

- `text-typography-xs` · `text-typography-sm` · `text-typography-base`
- `text-typography-lg` · `text-typography-xl` · `text-typography-2xl`
- `text-typography-3xl` · `text-typography-4xl` · `text-typography-5xl`

**Common examples:**

Button:

- `h-button-height`, `px-button-padding-x`, `py-button-padding-y`
- `h-button-height-small`, `px-button-padding-x-small`, `py-button-padding-y-small`
- `h-button-height-big`, `h-button-height-min`, `h-button-height-tiny`
- `rounded-button-radius`, `gap-button-gap`, `p-button-padding-icon`

Input:

- `h-input-height`, `px-input-padding-x`, `py-input-padding-y`
- `rounded-input-radius`, `gap-input-gap`
- `text-input-text`, `text-input-label-text`, `text-input-hint-text`

Card:

- `rounded-card-radius`, `px-card-padding-x`, `py-card-padding-y`, `gap-card-gap`

Modal:

- `rounded-modal-radius`, `px-modal-padding-x`, `py-modal-padding-y`

Tag:

- `h-tag-height`, `px-tag-padding-x`, `py-tag-padding-y`, `gap-tag-gap`
- `rounded-tag-radius`, `size-tag-indicator-size`

For any component token not listed here, read `packages/lib/src/styles/components.ts` directly — every key maps to a Tailwind class following the rule above.

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

### Global Spacing — from `common.ts`

- `gap-base`, `p-base`, `px-base`, `py-base` (1rem)
- `gap-lg`, `p-lg` (1.125rem)
- `gap-sm`, `p-sm` (0.75rem)
- `gap-hairline`, `p-hairline` (0.0625rem)
- `w-dialog` (modal/dialog width: 20rem)

### Rounded — Global Tokens

Only `pill` and `full` remain as global rounded tokens:

- `rounded-pill` — pill-shaped elements (e.g. tags, indicators)
- `rounded-full` — circles / avatars

All other component radii use the component token pattern: `rounded-{component}-radius` (e.g. `rounded-button-radius`, `rounded-card-radius`, `rounded-modal-radius`, `rounded-input-radius`).

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
        danger: "bg-button-danger-bg text-button-danger-text",
        muted: "bg-button-muted-bg text-button-muted-text",
    },
    size: {
        default: "h-button-height px-button-padding-x py-button-padding-y",
        small: "h-button-height-small px-button-padding-x-small py-button-padding-y-small text-typography-sm",
    },
};

const badgeVariants = cva("inline-flex items-center font-medium rounded-button-radius", {
    variants,
    defaultVariants: { theme: "primary", size: "default" },
});

type Variants = CvaVariants<typeof variants>;

export type BadgeProps<T extends React.ElementType = "span"> = PropsWithChildren<PolymorphicProps<Variants, T>>;

export const Badge: <T extends React.ElementType = "span">(_: BadgeProps<T>) => React.ReactNode = forwardRef(function Badge(
    { className, theme, size, ...props }: BadgeProps,
    ref: React.Ref<"span">
) {
    return (
        <Polymorph {...props} ref={ref} data-component="badge" as={props.as ?? "span"} className={css(badgeVariants({ theme, size }), className)} />
    );
}) as any;
```

---

## Component-Specific Rules

### Card (`/packages/lib/src/components/display/card/card.css`)

Use `card.css` as a reference implementation for token migration and fallback order.

- Prefer direct global tokens for shared meanings: `--var-color-background`, `--var-color-border`, `--var-color-primary`, `--var-color-primary-foreground`, `--var-shadow-card`.
- Add `--var-card-*` tokens only for card-specific DOM semantics such as body gap, title padding, stats icon size, or stats value typography.
- Do not create card aliases like `--var-card-border-color: var(--var-card-border, var(--var-color-border))`; use `--var-color-border` directly in `card.css` unless card border needs independent semantics.
- Derive secondary card metrics with `calc(var(--var-spacing-base) / 2)` or similar base-token math.
- DO NOT add custom `rounded-*`, `p-*`, `shadow-*`, `border-*` overrides.
- Tailwind-era token utilities, when present in TSX examples, should map to card tokens: `rounded-card-radius`, `shadow-shadow-card`, `border-card-border`, `bg-card-background`.

```tsx
<Card container="custom-layout-class" />  // OK
<Card className="rounded-lg p-4" />       // WRONG
```

### Modal (`/packages/lib/src/components/floating/modal.tsx`)

- DO NOT add custom `z-*`, `rounded-*`, `p-*` overrides
- Use tokens: `z-floating`, `bg-floating-background`, `border-floating-border`, `rounded-modal-radius`

```tsx
<Modal type="dialog" />                          // OK
<Modal className="rounded-xl p-8 z-[9999]" />   // WRONG
```

---

## Validation Checklist

When creating or reviewing component code:

- [ ] No generated `tw-*` selector contracts (`__component__tw-17`, `tw-extra-*`, `tw-state-*`)
- [ ] Component TSX emits stable base/variant/slot classes from `defineComponentStyles()` or semantic slots
- [ ] Component CSS targets stable selectors and keeps visual rules out of TSX utility strings
- [ ] No hardcoded color values (`#3B82F6`, `rgb(...)`, `text-blue-500`) in component CSS; color defaults live as semantic `hsla(...)` tokens
- [ ] No hardcoded spacing/sizing (`p-[12px]`, `gap-[8px]`, `height: 1rem`)
- [ ] No arbitrary Tailwind values (`rounded-[8px]`, `z-[9999]`)
- [ ] Component CSS reads a single semantic `--var-*` token per declaration instead of nested fallback chains
- [ ] `tokens.css` does not introduce two-level aliases such as `--var-card-border-color: var(--var-card-border, var(--var-color-border))`
- [ ] `tokens.css` and component CSS do not use `color-mix()` or modern color math; use explicit semantic `hsla(...)` tokens instead
- [ ] Component-specific token names describe the semantic DOM role/property, not a vague alias or implementation detail
- [ ] Related token variants are derived from base tokens with `calc()` rather than hardcoded literal sizes
- [ ] Component CSS reads design-token variables (`var(--...)`) for geometry, color, radii, focus rings, and motion-sensitive values
- [ ] Primary color uses `primary` token, not "blue"
- [ ] Card: no custom `rounded-*`, `p-*`, `shadow-*` — use `rounded-card-radius`
- [ ] Modal: no custom `z-*`, `rounded-*`, `p-*` — use `rounded-modal-radius`
- [ ] Button: uses `rounded-button-radius` not `rounded-button` or `rounded-md`
- [ ] All z-index from token system (`z-floating`, `z-tooltip`, etc.)
- [ ] Typography font sizes use `text-typography-{size}` not `text-sm`, `text-xs`, etc.
- [ ] Component sizes/spacing use `{component}-{attr}` tokens not hardcoded values
- [ ] Component uses `forwardRef`
- [ ] Component uses `cva()` for variants
- [ ] Variant types use `CvaVariants<typeof variants>` (variants object, not cva result)
- [ ] Polymorphic components use `Polymorph` + `PolymorphicProps`
- [ ] Class merging uses `css()` from `../../lib/dom`
- [ ] Root element has `data-component="kebab-name"`
- [ ] No `any` types — use generics/`unknown`/unions

---

## Quick Reference

| Concern                                                | File                                             |
| ------------------------------------------------------ | ------------------------------------------------ |
| Base CSS variable tokens                               | `packages/lib/src/styles/tokens.css`             |
| Colors                                                 | `packages/lib/src/styles/light.ts` / `dark.ts`   |
| Component tokens (sizing, radius, spacing, font sizes) | `packages/lib/src/styles/components.ts`          |
| Global spacing / Rounded / Z-Index                     | `packages/lib/src/styles/common.ts`              |
| Stable selector sidecars                               | `packages/lib/src/components/**/**.styles.ts`    |
| Component CSS chunks                                   | `packages/lib/src/components/**/*.css`           |
| Style manifest registry                                | `packages/lib/src/styles/style-manifest.ts`      |
| Tailwind token registration (legacy utility support)   | `packages/lib/preset.tailwind.ts`                |
| `css()` utility                                        | `packages/lib/src/lib/dom.ts`                    |
| Type utilities                                         | `packages/lib/src/types.ts`                      |
| Polymorph                                              | `packages/lib/src/components/core/polymorph.tsx` |
| Tailwind config                                        | `packages/lib/tailwind.config.ts`                |
