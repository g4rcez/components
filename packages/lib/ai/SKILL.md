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

## 1 — Package Structure & Installation

```bash
pnpm add @g4rcez/components
```

When installed in `node_modules`, the package follows this structure:
- `node_modules/@g4rcez/components/dist/` — Compiled JS/TS and CSS.
- `node_modules/@g4rcez/components/index.css` — Main stylesheet.
- `node_modules/@g4rcez/components/ai/` — This skill and detailed markdown documentation.
- `node_modules/@g4rcez/components/ai/docs/` — Component-specific documentation files.

### Tailwind Preset (recommended)

Add the library preset in your `tailwind.config.ts` (or `.js`). The preset
wires all design tokens as Tailwind utilities.

```ts
// tailwind.config.ts
import preset from "@g4rcez/components/preset.tailwind";

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
themes, then inject them into `<head>`.

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
  defaultLightTheme,
  defaultDarkTheme,
} from "@g4rcez/components";

const tokenRemap: TokenRemap = {
  colors: (t) => {
    // Strip hsla( prefix and ) suffix for Tailwind opacity utility support
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
        <style dangerouslySetInnerHTML={{ __html: stylesLight }} />
        <style dangerouslySetInnerHTML={{ __html: stylesDark }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 3 — TokenRemap

`TokenRemap` lets you transform each design token value before it is emitted
as a CSS custom property.

```ts
export type TokenRemap = Partial<
  Record<
    "colors" | "spacing" | "rounded" | "customTokens" | "zIndex",
    (t: Token) => Token
  > & { name: string }
>;
```

### Why strip `hsla(…)` in the colors transformer

Tailwind v4 opacity utilities (e.g. `bg-primary/50`) expect raw channel values
like `210 40% 60%` — not a wrapped `hsla(210 40% 60%)`.

---

## 4 — ComponentsProvider & Tweaks

```tsx
import { ComponentsProvider, type Tweaks, parsers } from "@g4rcez/components";

const tweaks: Tweaks = {
  table: {
    sorters:    true,   // show/hide column sort controls
    filters:    true,   // show/hide column filter controls
    operations: true,   // show/hide table operation buttons
    sticky:     55,     // px offset for sticky header
  },
};

<ComponentsProvider
  locale="en-US"
  tweaks={tweaks}
  parser={parsers.hsla}
>
  {children}
</ComponentsProvider>
```

---

## 5 — Key Conventions

### Never use raw Tailwind color classes

```tsx
// ❌ Wrong
<div className="bg-blue-500 text-white">…</div>

// ✅ Right — use design-token classes
<div className="bg-primary text-primary-foreground">…</div>
```

### Always use component `theme` / `variant` props

```tsx
// ❌ Wrong
<button className="bg-red-600 text-white">Delete</button>

// ✅ Right
<Button theme="danger">Delete</Button>
```

---

## 6 — Component Catalog

### Import paths

The library supports both barrel imports and sub-path imports for better tree-shaking.

| Component | Main Export | Sub-path Export |
|-----------|-------------|-----------------|
| `Button` | `@g4rcez/components` | `@g4rcez/components/button` |
| `Input` | `@g4rcez/components` | `@g4rcez/components/input` |
| `Modal` | `@g4rcez/components` | `@g4rcez/components/modal` |
| `Table` | `@g4rcez/components` | `@g4rcez/components/table` |
| `Select` | `@g4rcez/components` | `@g4rcez/components/select` |

See `node_modules/@g4rcez/components/ai/docs/index.md` for the full list of exports.

---

## 7 — Migration Guide

Use this table when migrating native HTML elements to library equivalents.

| Native / custom pattern | Library replacement |
|-------------------------|---------------------|
| `<button>` | `Button` |
| `<input type="text">` | `Input` |
| `<input type="date">` | `DatePicker` |
| `<input type="checkbox">` | `Checkbox` |
| `<select>` | `Select` |
| Custom modal / dialog | `Modal` (type `"dialog"`) |
| Side panel / drawer | `Modal` (type `"drawer"`) |
| Toast / notifications | `Notifications` |
| Data table | `Table` |

---

## 8 — Where to Find Detailed Docs

For any specific component, read its doc file for full props, design tokens,
and usage examples. These files are located within the package in `node_modules`:

`node_modules/@g4rcez/components/ai/docs/<ComponentName>.md`

**Examples:**
- `node_modules/@g4rcez/components/ai/docs/Button.md`
- `node_modules/@g4rcez/components/ai/docs/Input.md`
- `node_modules/@g4rcez/components/ai/docs/Modal.md`
- `node_modules/@g4rcez/components/ai/docs/Table.md`
- `node_modules/@g4rcez/components/ai/docs/Form.md`

