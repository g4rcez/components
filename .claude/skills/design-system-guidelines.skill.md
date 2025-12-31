# Design System Guidelines

Enforce design system rules and best practices for the components library.

## Design System Rules

### 1. Always Use Design Tokens

All styling must use design tokens defined in the theme system:
- Token files: `/packages/lib/src/styles/light.ts`, `/packages/lib/src/styles/dark.ts`, `/packages/lib/src/styles/common.ts`
- Never hardcode colors, spacing, shadows, or z-index values
- Use Tailwind classes that map to design tokens (e.g., `bg-primary`, `rounded-card`, `shadow-shadow-card`)

### 2. Primary Color Reference

The main brand color is referenced as `primary` in our tokens:
- Use `primary` for the main color (e.g., `bg-primary`, `text-primary`)
- Available variants: `primary-foreground`, `primary-subtle`, `primary-hover`
- Never use generic color names like "blue" or hardcoded color values

### 3. Card Component Styling

For Card components (`/packages/lib/src/components/display/card.tsx`):
- DO NOT add custom classnames for rounding, padding, borders, or shadows
- Use the built-in design tokens: `rounded-card`, `shadow-shadow-card`, `border-card-border`, `bg-card-background`
- Pass custom styling through the `container` prop if needed, but avoid overriding core design tokens
- Example of correct usage:
  ```tsx
  <Card container="custom-layout-class" /> // OK
  <Card className="rounded-lg p-4" /> // WRONG - overrides design tokens
  ```

### 4. Modal Component Styling

For Modal components (`/packages/lib/src/components/floating/modal.tsx`):
- DO NOT add custom classnames for rounding, padding, borders, or z-index
- Use built-in design tokens: `z-floating`, `bg-floating-background`, `border-floating-border`
- Modal positioning and animations are handled by Floating UI and Framer Motion
- Let the component manage its own styling through variants
- Example of correct usage:
  ```tsx
  <Modal type="dialog" /> // OK
  <Modal className="rounded-xl p-8 z-50" /> // WRONG - overrides design tokens
  ```

### 5. Component Patterns to Follow

All components should follow these patterns:
- Use CVA (Class Variance Authority) for variant management
- Use `css()` utility from `/packages/lib/src/lib/fns.ts` to merge classnames
- Implement polymorphic pattern with `Polymorph` component when appropriate
- Include proper `data-component` attributes for debugging
- Follow accessibility guidelines (ARIA attributes, semantic HTML)

### 6. Available Design Token Categories

Colors:
- Semantic: `primary`, `secondary`, `info`, `danger`, `warn`, `success`, `emphasis`, `neutral`
- Base: `foreground`, `background`, `border`, `muted`, `disabled`
- Component-specific: `card.*`, `button.*`, `tag.*`, `alert.*`, `floating.*`, `tooltip.*`, `table.*`, `input.*`

Spacing (from common.ts):
- Standard: `base`, `lg`, `sm`, `hairline`
- Components: `field-height`, `button-height`

Rounded:
- Options: `button`, `pill`, `card`, `full`

Z-Index:
- Layers: `navbar`, `normal`, `overlay`, `tooltip`, `calendar`, `floating`

Shadows:
- Available: `shadow-card`, `shadow-button`, `shadow-tooltip`, etc.

## Validation Checklist

When reviewing or creating code, check:
- [ ] No hardcoded color values (e.g., #3B82F6, rgb(59, 130, 246))
- [ ] No hardcoded spacing values outside design tokens
- [ ] Primary color uses `primary` token, not "blue" or custom values
- [ ] Card components don't have custom `rounded-*`, `p-*`, `shadow-*` classes
- [ ] Modal components don't have custom `z-*`, `rounded-*`, `p-*` classes
- [ ] All z-index values come from the z-index token system
- [ ] Component follows CVA + Polymorph patterns when appropriate
- [ ] Proper `data-component` attribute is present

## Quick Reference

Design token sources:
- Colors: `/packages/lib/src/styles/light.ts` and `dark.ts`
- Spacing/Rounded/Z-Index: `/packages/lib/src/styles/common.ts`
- Tailwind config: `/packages/lib/tailwind.config.ts`

Key components to protect:
- Card: `/packages/lib/src/components/display/card.tsx`
- Modal: `/packages/lib/src/components/floating/modal.tsx`
- Button: `/packages/lib/src/components/core/button.tsx`

## Examples

### Good
```tsx
// Using design tokens properly
<Card container="flex-1">
  <Button theme="primary" size="md">Submit</Button>
</Card>

<Modal type="dialog">
  <div className="text-primary">Primary colored text</div>
</Modal>
```

### Bad
```tsx
// Hardcoded values and overriding design tokens
<Card className="rounded-xl p-6 shadow-lg">
  <Button className="bg-blue-500">Submit</Button>
</Card>

<Modal className="z-[9999] rounded-2xl p-8">
  <div className="text-[#3B82F6]">Blue text</div>
</Modal>
```

## When to Use This Skill

Invoke this skill when:
- Creating new components
- Modifying existing Card or Modal components
- Adding styling to any component
- Reviewing pull requests
- Refactoring component styles
- User asks to "follow design system guidelines"
- User mentions colors, spacing, or component styling
