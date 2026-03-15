---
name: g4rcez-components
description: >
  Use when: setting up @g4rcez/components in a new project, migrating native
  HTML elements or hand-rolled UI to this design system, building any React UI
  that should use @g4rcez/components, or when the user's project already has
  @g4rcez/components as a dependency. Covers installation, Tailwind preset,
  theming with createTokenStyles/TokenRemap, ComponentsProvider/tweaks,
  parsers, the full component catalog (components, hooks, React, UI,
  design-system, tokens, Tailwind, forms, modals, notifications, tables,
  calendar, theming), and native-element migration.
---

# @g4rcez/components — Agent Skill

A React design system built on Tailwind CSS and design tokens. This skill covers
installation, Tailwind preset setup, theming APIs, conventions, the full
component catalog, and migration from native HTML patterns.

---

## 1 — Installation & Setup

```bash
pnpm add @g4rcez/components
```

### Tailwind Preset (recommended)

Add the library preset in your `tailwind.config.ts` (or `.js`). The preset
wires all design tokens as Tailwind utilities — colors, spacing, shadows,
rounded, zIndex. No manual CSS import is needed.

```ts
// tailwind.config.ts
import preset from "@g4rcez/components/preset/preset.tailwind";

export default {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx}",
    // include node_modules so Tailwind scans the library's classes:
    "./node_modules/@g4rcez/components/dist/**/*.js",
  ],
};
```

### Theme class (required)

Apply `light` or `dark` on your root element:

```tsx
<html className="light">…</html>
// or
<html className="dark">…</html>
```

### ComponentsProvider (optional, mandatory for dark-mode)

Wrap your app root to enable i18n strings, locale-aware masks, and the
programmatic `Modal.confirm` utility:

```tsx
import { ComponentsProvider } from "@g4rcez/components";

export default function App({ children }) {
  return (
    <ComponentsProvider locale="en-US">
      {children}
    </ComponentsProvider>
  );
}
```

---

## 2 — Theme Setup with createTokenStyles

Use `createTokenStyles` to generate scoped CSS strings for light and dark
themes, then inject them into `<head>`. This is the canonical pattern used by
the library's own docs app.

### API

```ts
import {
  createTokenStyles,
  createCssProperties,
  type TokenRemap,
} from "@g4rcez/components";
```

| Function | Signature | Returns |
|----------|-----------|---------|
| `createTokenStyles` | `(theme: DesignTokens, map?: TokenRemap) => string` | Scoped CSS string, e.g. `html { --primary: … }` |
| `createCssProperties` | `(theme: DesignTokens, map?: TokenRemap) => CSSProperties` | Inline style object with CSS custom properties |

- When `map.name` is set (e.g. `"dark"`), the output is scoped to
  `html.dark { … }` instead of `html { … }`.
- Use `createTokenStyles` for `<style>` injection; use `createCssProperties`
  for inline `style` props.

### Two-theme pattern (light + dark)

```tsx
import {
  createTokenStyles,
  type TokenRemap,
} from "@g4rcez/components";
import {
  defaultLightTheme,
  defaultDarkTheme,
} from "@g4rcez/components"; // or from the internal theme module

const tokenRemap: TokenRemap = {
  colors: (t) => {
    // Strip hsla( prefix and ) suffix so the raw value can be used
    // by consumers that wrap it themselves (e.g. Tailwind opacity utilities)
    t.value = t.value.replace("hsla(", "").replace(/\)$/, "");
    return t;
  },
};

const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
const stylesDark  = createTokenStyles(defaultDarkTheme, {
  ...tokenRemap,
  name: "dark", // scopes output to html.dark { … }
});

// In your layout:
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{stylesLight}</style>
        <style>{stylesDark}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 3 — TokenRemap

`TokenRemap` lets you transform each design token value before it is emitted
as a CSS custom property. It is passed as the second argument to
`createTokenStyles` or `createCssProperties`.

```ts
export type TokenRemap = Partial<
  Record<
    "colors" | "spacing" | "rounded" | "customTokens" | "zIndex",
    (t: Token) => Token
  > & { name: string }
>;
```

### Fields

| Field | Purpose |
|-------|---------|
| `name` | Scopes the generated CSS to `html.{name}` (e.g. `"dark"` → `html.dark { … }`). Omit for `:root` / `html {}` scope. |
| `colors` | Transform each color token before emission. Receives a `Token` (`{ key: string; value: string }`) and must return a `Token`. |
| `spacing` | Same transformer signature for spacing tokens. |
| `rounded` | Same transformer signature for border-radius tokens. |
| `customTokens` | Same transformer signature for custom tokens. |
| `zIndex` | Same transformer signature for z-index tokens. |

### Why strip `hsla(…)` in the colors transformer

Tailwind v4 opacity utilities (e.g. `bg-primary/50`) expect raw channel values
like `210 40% 60%` — not a wrapped `hsla(210 40% 60%)`. The library stores
colors as `hsla(…)` strings, so the remap strips the function wrapper:

```ts
const tokenRemap: TokenRemap = {
  colors: (t) => {
    t.value = t.value.replace("hsla(", "").replace(/\)$/, "");
    return t;
  },
};
```

---

## 4 — ComponentsProvider & Tweaks

```tsx
import { ComponentsProvider, type Tweaks } from "@g4rcez/components";

const tweaks: Tweaks = {
  table: {
    sorters:    true,   // show/hide column sort controls    (default: true)
    filters:    true,   // show/hide column filter controls  (default: true)
    operations: true,   // show/hide table operation buttons (default: true)
    sticky:     55,     // px offset for sticky header       (default: undefined)
  },
  input: {
    iconFeedback: true, // show validation icon inside input (default: true)
  },
};

<ComponentsProvider
  locale="en-US"          // locale string for masks, e.g. "pt-BR"
  tweaks={tweaks}         // Tweaks — behavioral overrides
  map={translationOverrides} // Translations partial — override i18n strings
  parser={parsers.hsla}   // color parser; defaults to parsers.hsla
  rootFloating={el}       // HTMLElement for floating portal container
>
  {children}
</ComponentsProvider>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `locale` | `string` | Locale for masked inputs (e.g. `"en-US"`, `"pt-BR"`) |
| `tweaks` | `Tweaks` | Behavioral overrides for table and input components (see table above) |
| `map` | `Partial<Translations>` | Override i18n strings; see all keys in `packages/lib/src/config/default-translations.ts` |
| `parser` | parser function | Color parser used by the design token system; defaults to `parsers.hsla` |
| `rootFloating` | `HTMLElement` | DOM node used as the portal container for floating elements |

---

## 5 — Parsers Utility

`parsers` is exported from `@g4rcez/components` and used with `createDesignTokens`
to build custom token maps or passed as the `parser` prop to `ComponentsProvider`.

```ts
import { parsers } from "@g4rcez/components";
```

| Parser | Output example |
|--------|---------------|
| `parsers.hex` | raw string passthrough |
| `parsers.raw` | raw string passthrough |
| `parsers.hsl` | `hsl(…)` |
| `parsers.rgb` | `rgb(…)` |
| `parsers.hsla` | `hsla(…)` *(default)* |
| `parsers.rgba` | `rgba(…)` |
| `parsers.cssVariable` | `var(--key)` |
| `parsers.z` | `var(--z-key)` |
| `parsers.formatWithVar(format)` | `format(var(--key), <alpha-value>)` |

---

## 6 — Key Conventions

### Never use raw Tailwind color classes

```tsx
// ❌ Wrong
<div className="bg-blue-500 text-white border-gray-300">…</div>

// ✅ Right — use design-token classes
<div className="bg-primary text-primary-foreground border-border">…</div>
```

### Never use arbitrary values

```tsx
// ❌ Wrong
<div className="bg-[#3b82f6] z-[9999] p-[13px]">…</div>

// ✅ Right — override CSS variables in your @theme block
```

### Always use component `theme` / `variant` props

```tsx
// ❌ Wrong
<button className="bg-red-600 text-white">Delete</button>

// ✅ Right
<Button theme="danger">Delete</Button>
```

### Use design-token spacing classes

Prefer `gap-base`, `gap-sm`, `gap-lg`, `p-base`, `mt-base` (the library's
token-based spacing) over arbitrary Tailwind values.

```tsx
<div className="flex flex-col gap-base">…</div>
```

---

## 7 — Component Catalog

### Import paths

The default import path is the barrel: `@g4rcez/components`. Sub-paths (e.g.
`@g4rcez/components/button`) are available as alternatives for tree-shaking
optimization but are not required.

### Core

| Component | Import | Description |
|-----------|--------|-------------|
| `Button` | `@g4rcez/components` | Versatile button with theme, size, rounded, and polymorphic `as` prop |
| `Tag` | `@g4rcez/components` | Label/badge for metadata, status, and categorization |
| `Heading` | `@g4rcez/components` | Semantic heading with consistent typography tokens |
| `Typography` | `@g4rcez/components` | Body text with semantic token styling |
| `Polymorph` | `@g4rcez/components` | Polymorphic base that renders as any HTML element |
| `Slot` | `@g4rcez/components` | Render-prop slot for component composition |
| `RenderOnView` | `@g4rcez/components` | Lazy-renders children when they scroll into the viewport |
| `Resizable` | `@g4rcez/components` | Drag-to-resize panel container |

### Display

| Component | Import | Description |
|-----------|--------|-------------|
| `Alert` | `@g4rcez/components` | Dismissible alert for messages, warnings, and status updates |
| `AnimatedList` | `@g4rcez/components` | List with enter/exit animation for dynamic items |
| `Calendar` | `@g4rcez/components` | Inline date-picker calendar |
| `Card` | `@g4rcez/components` | Surface container with card tokens and elevation |
| `Empty` | `@g4rcez/components` | Empty-state placeholder with optional icon and action |
| `List` | `@g4rcez/components` | Virtualized scrollable list for large data sets |
| `Notifications` | `@g4rcez/components` | Toast notification system with queue management |
| `Progress` | `@g4rcez/components` | Progress bar with themed fill |
| `Shortcut` | `@g4rcez/components` | Keyboard shortcut badge display |
| `Skeleton` | `@g4rcez/components` | Loading placeholder with pulse animation |
| `Spinner` | `@g4rcez/components` | Animated loading spinner |
| `Stats` | `@g4rcez/components` | Metric/statistics display with label and value |
| `Step` | `@g4rcez/components` | Multi-step wizard progress indicator |
| `Tabs` | `@g4rcez/components` | Tabbed navigation with panel switching |
| `Timeline` | `@g4rcez/components` | Vertical event timeline with themed markers |

### Form

| Component | Import | Description |
|-----------|--------|-------------|
| `Autocomplete` | `@g4rcez/components` | Text input with dropdown suggestions; use for large searchable lists |
| `Checkbox` | `@g4rcez/components` | Checkbox with indeterminate support |
| `DatePicker` | `@g4rcez/components` | Date input with calendar popover |
| `FileUpload` | `@g4rcez/components` | Drag-and-drop file upload with preview |
| `Form` | `@g4rcez/components` | Form wrapper with Zod validation and `useForm` field management |
| `FormReset` | `@g4rcez/components` | Reset button wired to the nearest Form context |
| `Input` | `@g4rcez/components` | Text input with mask, prefix/suffix slots, and error states |
| `InputField` | `@g4rcez/components` | Layout wrapper providing label, helper text, and error message |
| `MultiSelect` | `@g4rcez/components` | Multi-value select with search and tag display |
| `Radiobox` | `@g4rcez/components` | Styled radio button group |
| `Select` | `@g4rcez/components` | Styled native select with validation and loading state |
| `Slider` | `@g4rcez/components` | Range slider input |
| `Switch` | `@g4rcez/components` | Toggle switch for boolean values |
| `TaskList` | `@g4rcez/components` | Checklist with completion tracking |
| `Textarea` | `@g4rcez/components` | Multi-line text input with auto-resize |
| `TransferList` | `@g4rcez/components` | Dual-pane list for moving items between sets |

### Floating

| Component | Import | Description |
|-----------|--------|-------------|
| `CommandPalette` | `@g4rcez/components` | Spotlight-style command palette with keyboard navigation |
| `Dropdown` | `@g4rcez/components` | Floating dropdown menu anchored to a trigger |
| `Expand` | `@g4rcez/components` | Collapsible accordion/expand panel |
| `Menu` | `@g4rcez/components` | Context menu or navigation menu |
| `Modal` | `@g4rcez/components` | Dialog/drawer/sheet overlay with focus trap, scroll lock, and programmatic confirm |
| `Toolbar` | `@g4rcez/components` | Grouped action bar with button slots |
| `Tooltip` | `@g4rcez/components` | Hover tooltip with floating positioning |
| `Wizard` | `@g4rcez/components` | Multi-step guided flow overlay |

### Table

| Component | Import | Description |
|-----------|--------|-------------|
| `Table` | `@g4rcez/components` | Feature-rich data table with sorting, filtering, and virtualization |

### Calendar

| Component | Import | Description |
|-----------|--------|-------------|
| `PageCalendar` | `@g4rcez/components` | Full-page calendar with month, week, and day views |
| `Calendar` | `@g4rcez/components` | Calendar with month and years view - Simple view                    |

---

## 8 — Migration Guide

Use this table when migrating native HTML elements or common custom patterns to
library equivalents.

| Native / custom pattern | Library replacement | Import path |
|-------------------------|---------------------|-------------|
| `<button>` | `Button` | `@g4rcez/components` |
| `<input type="text">` | `Input` | `@g4rcez/components` |
| `<input type="text">` (search / typeahead) | `Autocomplete` | `@g4rcez/components` |
| `<input type="date">` | `DatePicker` | `@g4rcez/components` |
| `<input type="file">` | `FileUpload` | `@g4rcez/components` |
| `<input type="checkbox">` | `Checkbox` | `@g4rcez/components` |
| `<input type="radio">` | `Radiobox` | `@g4rcez/components` |
| `<input type="range">` | `Slider` | `@g4rcez/components` |
| Toggle / boolean switch | `Switch` | `@g4rcez/components` |
| `<textarea>` | `Textarea` | `@g4rcez/components` |
| `<select>` | `Select` | `@g4rcez/components` |
| Multi-value `<select>` | `MultiSelect` | `@g4rcez/components` |
| Custom modal / dialog | `Modal` (type `"dialog"`) | `@g4rcez/components` |
| Side panel / drawer | `Modal` (type `"drawer"`) | `@g4rcez/components` |
| Bottom sheet | `Modal` (type `"sheet"`) | `@g4rcez/components` |
| Custom tooltip | `Tooltip` | `@g4rcez/components` |
| Custom dropdown menu | `Dropdown` | `@g4rcez/components` |
| Context menu | `Menu` | `@g4rcez/components` |
| Custom tabs | `Tabs` | `@g4rcez/components` |
| Accordion / collapsible section | `Expand` | `@g4rcez/components` |
| Custom spinner / loader | `Spinner` | `@g4rcez/components` |
| Skeleton loading placeholder | `Skeleton` | `@g4rcez/components` |
| Toast / notification system | `Notifications` | `@g4rcez/components` |
| Data table | `Table` | `@g4rcez/components` |
| Multi-step flow | `Wizard` | `@g4rcez/components` |
| Progress bar / progress indicator | `Progress` | `@g4rcez/components` |
| Checklist / to-do list | `TaskList` | `@g4rcez/components` |
| Alert / banner message | `Alert` | `@g4rcez/components` |
| Empty state placeholder | `Empty` | `@g4rcez/components` |

### Common migration examples

**Confirm dialog** — replace custom `window.confirm` or hand-rolled confirm modal:

```tsx
// Wrap app once
import { ComponentsProvider } from "@g4rcez/components";
<ComponentsProvider>…</ComponentsProvider>

// Call anywhere
import { Modal } from "@g4rcez/components";
const ok = await Modal.confirm({ title: "Delete?", description: "Cannot be undone." });
```

**Masked input** — replace `<input>` with formatting libraries:

```tsx
import { Input } from "@g4rcez/components";
<Input name="phone" title="Phone" mask="(99) 99999-9999" />
<Input name="price" title="Price" mask="currency" currency="USD" locale="en-US" />
```

**Select for few options** — prefer `Radiobox` or `Switch` over `Select` when there are only 2–3 choices.

**Large searchable list** — use `Autocomplete` instead of `Select` when the option set is large or needs search.

---

## 9 — Where to Find Detailed Docs

For any specific component, read its doc file for full props, design tokens,
usage examples, and do/don't rules:

```
packages/lib/skill/docs/<ComponentName>.md
```

Examples:
- `packages/lib/skill/docs/Button.md` — all themes, sizes, polymorphic usage
- `packages/lib/skill/docs/Input.md` — mask patterns, left/right slots, currency input
- `packages/lib/skill/docs/Modal.md` — dialog/drawer/sheet variants, programmatic confirm
- `packages/lib/skill/docs/Select.md` — options array, loading state, cascading selects
- `packages/lib/skill/docs/Table.md` — column definitions, sorting, filtering, virtualization
- `packages/lib/skill/docs/Form.md` — Zod schema integration, `useForm` hook
- `packages/lib/skill/docs/Notifications.md` — toast API, queue management
- `packages/lib/skill/docs/index.md` — full component catalog with import paths
