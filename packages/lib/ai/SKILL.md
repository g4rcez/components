---
name: g4rcez-components
description: >
    Use when: setting up @g4rcez/components in a new project, migrating native
    HTML elements or hand-rolled UI to this design system, building any React UI
    that should use @g4rcez/components, or when the user's project already has
    @g4rcez/components as a dependency. Covers installation, plain CSS setup,
    theming with createTokenStyles/TokenRemap, ComponentsProvider/tweaks,
    parsers, the full component catalog (components,
    hooks, React, UI, design-system, tokens, forms, modals,
    notifications, tables, calendar, theming), and native-element migration.
---

Loaded automatically when this package is present. Read fully before writing or modifying UI.

# @g4rcez/components — Agent Skill

A React design system built on stable CSS component contracts, semantic design tokens, and shipped plain CSS. This skill covers
installation, CSS setup, theming APIs, conventions, the full
component catalog, style dependency metadata, and migration from native HTML patterns.

---

## 1 — Installation

```bash
pnpm add @g4rcez/components
```

The package ships:

- `dist/` — compiled JS/TS and CSS
- `dist/index.css` — convenience bundle with foundation + all component CSS
- `dist/foundation.css` — required token/base foundation for component CSS
- `dist/*.css` — per-component CSS chunks such as `button.css`
- `dist/style-manifest.json` — machine-readable CSS dependency and selector manifest
- `ai/SKILL.md` — this file
- `ai/component-style-manifest.json` — AI/CLI-readable copy of the style manifest
- `ai/docs/` — per-component documentation (51 pages)

Access any file via the package specifier: `@g4rcez/components/ai/SKILL.md`, `@g4rcez/components/ai/docs/Button.md`, etc.

---

## 2 — CSS Setup (v6+)

The v6 styling migration moves component styling toward generated plain CSS chunks. Import generated component CSS from an app stylesheet, not from JS/TS modules.

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
```

Rules for agents and tools:

- Always include `foundation.css` before component CSS.
- Prefer per-component CSS imports for production apps.
- Use `g4rcez-components styles --css <stylesheet>` to detect used components and maintain the CSS import block automatically.
- `index.css` is a convenience bundle that includes foundation + all component CSS.
- Every public component has a CSS chunk, style contract sidecar, and manifest entry.
- Button is fully ported to handwritten v6 CSS; remaining component chunks preserve the stable selector surface while legacy utility class names are retired component-by-component.
- Component CSS has stable public selectors such as `.__button`, `.__button--theme-primary`, and `.__button__icon`.
- Use `ai/component-style-manifest.json` or `ai/docs/style-dependencies.md` to resolve CSS dependencies before adding imports.
- CSS variables use the `--var-*` prefix and semantic names such as `--var-color-primary`, `--var-button-primary-background`, and `--var-button-rounded`.

The library styling model does not require consumer utility generation, framework-specific preset configuration, or generated utility classes.

---

## 3 — Theme scope

Defaults render light variables on `:root`. Apply a named theme scope to switch variables at runtime:

```tsx
<html data-g4-theme="dark">...</html>
```

### ComponentsProvider (optional)

Wrap your app root to enable i18n strings, locale-aware masks, and `Modal.confirm`:

```tsx
import { ComponentsProvider } from "@g4rcez/components";

export default function App({ children }) {
    return <ComponentsProvider locale="en-US">{children}</ComponentsProvider>;
}
```

---

## 3 — Theme Setup with createTokenStyles

Use `createTokenStyles` to generate scoped CSS strings for light and dark themes, then inject them into `<head>` via a `<style>` element.

```ts
import { createTokenStyles, createCssProperties, type TokenRemap } from "@g4rcez/components";
```

- `createTokenStyles(theme, map?)` — returns a scoped CSS string, e.g. `html { --primary: … }`
- `createCssProperties(theme, map?)` — returns an inline style object with CSS custom properties
- When `map.name` is set (e.g. `"dark"`), the output scopes to `html.dark { … }`
- Use `createTokenStyles` for `<style>` injection; use `createCssProperties` for inline `style` props

### Two-theme pattern (light + dark)

```tsx
import { createTokenStyles, type TokenRemap, defaultLightTheme, defaultDarkTheme } from "@g4rcez/components";

const tokenRemap: TokenRemap = {
    colors: (t) => {
        // Strip hsla( wrapper so opacity utility classes (bg-primary/50) work
        t.value = t.value.replace("hsla(", "").replace(/\)$/, "");
        return t;
    },
};

const stylesLight = createTokenStyles(defaultLightTheme, tokenRemap);
const stylesDark = createTokenStyles(defaultDarkTheme, { ...tokenRemap, name: "dark" });

// Inject stylesLight and stylesDark as <style> elements in your layout <head>.
// Both are internally-generated CSS strings (design tokens only), not user input.
```

---

## 4 — TokenRemap

`TokenRemap` transforms each design token value before it is emitted as a CSS custom property.

```ts
export type TokenRemap = Partial<Record<"colors" | "spacing" | "rounded" | "customTokens" | "zIndex", (t: Token) => Token> & { name: string }>;
```

Stripping `hsla(…)` in the colors transformer is required for opacity utility classes (`bg-primary/50`) — they expect raw channel values (`210 40% 60%`), not a wrapped `hsla(210 40% 60%)`.

---

## 5 — ComponentsProvider & Tweaks

```tsx
import { ComponentsProvider, type Tweaks, parsers } from "@g4rcez/components";

const tweaks: Tweaks = {
    table: {
        sorters: true,
        filters: true,
        operations: true,
        sticky: 55,
    },
};

<ComponentsProvider locale="en-US" tweaks={tweaks} parser={parsers.hsla}>
    {children}
</ComponentsProvider>;
```

---

## 6 — Key Conventions

### Never use raw utility color classes

```tsx
// Wrong
<div className="bg-blue-500 text-white">...</div>

// Right — use design-token classes
<div className="bg-primary text-primary-foreground">...</div>
```

### Always use component `theme` / `variant` props

```tsx
// Wrong
<button className="bg-red-600 text-white">Delete</button>

// Right
<Button theme="danger">Delete</Button>
```

---

## 7 — Component Catalog

The library supports both barrel imports and sub-path imports for tree-shaking:

- `Button` — `@g4rcez/components` or `@g4rcez/components/button`
- `Input` — `@g4rcez/components` or `@g4rcez/components/input`
- `Modal` — `@g4rcez/components` or `@g4rcez/components/modal`
- `Table` — `@g4rcez/components` or `@g4rcez/components/table`
- `Select` — `@g4rcez/components` or `@g4rcez/components/select`

See `@g4rcez/components/ai/docs/index.md` for the complete export list.

---

## 8 — Migration from Native HTML

- `<button>` → `Button`
- `<input type="text">` → `Input`
- `<input type="date">` → `DatePicker`
- `<input type="checkbox">` → `Checkbox`
- `<select>` → `Select`
- Custom modal / dialog → `Modal` (type `"dialog"`)
- Side panel / drawer → `Modal` (type `"drawer"`)
- Toast / notifications → `Notifications`
- Data table → `Table`

---

## 9 — Per-Component Documentation

Each component has a dedicated doc page with full props, design tokens, and usage examples:

`@g4rcez/components/ai/docs/<ComponentName>.md`

Examples:

- `@g4rcez/components/ai/docs/Button.md`
- `@g4rcez/components/ai/docs/Input.md`
- `@g4rcez/components/ai/docs/Modal.md`
- `@g4rcez/components/ai/docs/Table.md`
- `@g4rcez/components/ai/docs/Form.md`
