---
name: g4rcez-components
description: >
    Use when: setting up @g4rcez/components in a new project, migrating native
    HTML elements or hand-rolled UI to this design system, building any React UI
    that should use @g4rcez/components, or when the user's project already has
    @g4rcez/components as a dependency. Covers installation, plain CSS component
    chunks, stable selector contracts, token customization, legacy Tailwind v3/v4
    setup, theming with createTokenStyles/TokenRemap, ComponentsProvider/tweaks,
    parsers, the full component catalog (components,
    hooks, React, UI, design-system, tokens, Tailwind, forms, modals,
    notifications, tables, calendar, theming), and native-element migration.
---

Loaded automatically when this package is present. Read fully before writing or modifying UI.

# @g4rcez/components — Agent Skill

A React design system built on stable CSS component contracts and semantic design tokens. This skill covers
installation, CSS setup, token customization, legacy Tailwind setup, theming APIs, conventions, the full
component catalog, and migration from native HTML patterns.

---

## 0 — Styling Mental Model

Think of @g4rcez/components styling as **plain CSS + stable selectors + CSS variables**:

1. **React components emit class contracts**, not visual implementation. Public classes are stable and semantic: `__button`, `__button--theme-primary`, `__button__icon`, `__radiobox__control`.
2. **Component CSS chunks implement visuals**. Import `foundation.css` plus the CSS for the components you use, or import `index.css` for the full bundle.
3. **Tokens are CSS variables**. CSS reads variables with `var(...)`, so overriding a variable on a theme scope or wrapper updates the component in real time.
4. **Manifests tell agents/tools what to import**. Use `ai/component-style-manifest.json` or `ai/docs/style-dependencies.md` to discover a component's CSS file, dependencies, base class, variants, and slots.

Do not use or document generated migration selectors such as `__component__tw-17`, `__component__tw-extra-1`, or `__component__tw-state-1`. Treat those as private cleanup artifacts; replace them with stable semantic slots before relying on them.

### CSS import model

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
@import "@g4rcez/components/radiobox.css";
```

- `foundation.css` must come first.
- Prefer per-component CSS chunks for apps and examples.
- `index.css` is a convenience bundle containing foundation + all component CSS.
- In this repo, component CSS lives beside components under `packages/lib/src/components/**`.

### Token customization model

Customize by overriding token variables, not by adding raw colors/sizes or targeting internals:

```tsx
<div style={{ "--radiobox-size": "1.5rem", "--radiobox-gap": "0.75rem" } as React.CSSProperties}>
    <Radiobox name="plan" value="pro">
        Pro
    </Radiobox>
</div>
```

For global themes, use `createTokenStyles()` or `createCssProperties()` with `defaultLightTheme`, `defaultDarkTheme`, and optional `TokenRemap`. For local previews/docs, scoped wrapper variables are preferred because they update live and do not mutate the app theme.

New handwritten v6 CSS uses the `--var-*` namespace (`--var-button-height`, `--var-color-primary`, `--var-rounded-full`). Some legacy migrated CSS still reads direct component variables (`--radiobox-size`, `--checkbox-gap`). Preserve the component's current variable contract unless migrating that component fully.

---

## 1 — Installation

```bash
pnpm add @g4rcez/components
```

The package ships:

- `dist/` — compiled JS/TS and CSS
- `dist/foundation.css` — required token/base foundation for component CSS
- `dist/index.css` — convenience bundle with foundation + all component CSS
- `dist/*.css` — per-component CSS chunks such as `button.css`
- `dist/style-manifest.json` — machine-readable CSS dependency and selector manifest
- `ai/SKILL.md` — this file
- `ai/component-style-manifest.json` — AI-readable style manifest copy
- `ai/docs/` — per-component documentation (51 pages)

Access any file via the package specifier: `@g4rcez/components/ai/SKILL.md`, `@g4rcez/components/ai/docs/Button.md`, etc.

---

## 2 — Tailwind Setup (legacy utility support)

The primary styling path is imported plain CSS chunks. Tailwind setup is still useful for apps that also want token utility classes (`bg-primary`, `rounded-button-radius`, etc.).

### v3 (preset-based)

Add the library preset to `tailwind.config.ts`. The preset registers design tokens as Tailwind utilities.

```ts
import preset from "@g4rcez/components/preset.tailwind";

export default {
    presets: [preset],
    content: ["./src/**/*.{ts,tsx}", "./node_modules/@g4rcez/components/dist/**/*.js"],
};
```

### v4 (CSS-first)

Import Tailwind and the library stylesheet, then reference the library config via `@config`:

```css
@import "tailwindcss";
@import "@g4rcez/components/dist/index.css";
@config "./tailwind.config.ts";
```

The library's `tailwind.config.ts` uses `plugin.tailwind` (the v4-compatible plugin):

```ts
import plugin from "@g4rcez/components/plugin.tailwind";

export default {
    plugins: [plugin],
    content: ["./src/**/*.{ts,tsx}", "./node_modules/@g4rcez/components/dist/**/*.js"],
};
```

### Theme class (required for both versions)

Apply `light` or `dark` on your root element:

```tsx
<html className="light">...</html>
// or
<html className="dark">...</html>
```

### ComponentsProvider (optional, required for dark-mode toggle)

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
        // Strip hsla( wrapper so Tailwind opacity utilities (bg-primary/50) work
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

Stripping `hsla(…)` in the colors transformer is required for Tailwind opacity utilities (`bg-primary/50`) — they expect raw channel values (`210 40% 60%`), not a wrapped `hsla(210 40% 60%)`.

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

### Never use raw Tailwind color classes

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
