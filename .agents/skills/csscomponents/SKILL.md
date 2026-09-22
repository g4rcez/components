---
name: csscomponents
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
- `dist/css/index.css` — convenience bundle with foundation + all component CSS
- `dist/css/foundation.css` — required token/base foundation for component CSS
- `dist/css/*.css` — per-component CSS chunks such as `button.css`
- `dist/style-manifest.json` — machine-readable CSS dependency and selector manifest
- `SKILL.md` — node_modules-discoverable copy for `npx skills experimental_sync`
- `ai/SKILL.md` — this file
- `ai/component-style-manifest.json` — AI/CLI-readable copy of the style manifest
- `ai/docs/` — per-component references, the catalog, and style dependencies

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
- Use `csscomponents styles --css <stylesheet>` to detect used components and maintain the CSS import block automatically. The same runner is exportable from `@g4rcez/components/cli` for tooling integrations.
- `index.css` is a convenience bundle that includes foundation + all component CSS.
- Every public component has a CSS chunk, style contract sidecar, and manifest entry.
- Button is fully ported to handwritten v6 CSS; remaining component chunks preserve the stable selector surface while legacy utility class names are retired component-by-component.
- Component CSS has stable public selectors such as `.__button`, `.__button--theme-primary`, and `.__button__icon`.
- Use `ai/component-style-manifest.json` or `ai/docs/style-dependencies.md` to resolve CSS dependencies before adding imports.
- CSS variables use the `--var-*` prefix and semantic names such as `--var-color-primary`, `--var-button-primary-background`, and `--var-button-rounded`.

The library styling model does not require consumer utility generation, framework-specific preset configuration, or generated utility classes.

### Component CSS mental model

- React components emit stable class contracts: `__component`, `__component--variant-value`, and `__component__slot`.
- CSS chunks own visual rules and target those stable selectors.
- Tokens are CSS variables; overriding the variable changes the component live without changing classes.
- Manifests (`dist/style-manifest.json`, `ai/component-style-manifest.json`, `ai/docs/style-dependencies.md`) describe which CSS files, dependencies, variants, and slots belong to each component.
- Generated migration selectors such as `__component__tw-17`, `__component__tw-extra-1`, or `__component__tw-state-1` are private cleanup artifacts. Never depend on them in examples, docs, tests, or app code.

### Token customization mental model

Customize by overriding variables at the narrowest useful scope:

```tsx
<div style={{ "--var-radiobox-control-size": "1.5rem", "--var-radiobox-label-gap": "0.75rem" } as React.CSSProperties}>
    <Radiobox name="plan" value="pro">
        Pro
    </Radiobox>
</div>
```

Use scoped wrapper variables for demos and token playgrounds. Use `createTokenStyles()`/`createCssProperties()` for app-wide themes. Do not customize by targeting generated selectors or by adding hardcoded colors/sizes.

Current CSS uses the `--var-*` namespace (`--var-button-height`, `--var-color-primary`, `--var-rounded-full`). Preserve explicit legacy fallbacks where the component still supports them, such as Stats.

Library geometry derives from one `--var-spacing-base` and an independent `--var-radius-base`, both defaulting to `1rem`. Override either on a wrapper; use `--var-radius-base: 0px` for square default corners. Typography and full-circle primitives remain independent. Explicit component values, including zero and literal sizes, always win.

Derived semantic defaults are use-site CSS fallbacks, not root custom-property declarations, so nested base overrides remain reactive. Inspect exported `defaultGeometryTokens`, `defaultGeometryBases`, or `defaultLightThemeTokens` instead of reading default custom properties with `getComputedStyle()`. Runtime theme helpers omit implicit geometry but preserve every explicitly supplied entry; passing a complete default object explicitly pins its formulas to that scope. Legacy theme generators preserve supplied values and remaps. See `ai/docs/geometry-tokens.md` for the radius appearance change, provider variants, compatibility paths, and exceptions.

---

## 3 — Theme scope

Defaults render light variables on `:root`. Apply a named theme scope to switch variables at runtime:

```tsx
<html data-theme="dark">...</html>
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

## 9 — Component References and Context Loading

Use the component references as on-demand context. Do not guess a component's props,
slots, variants, defaults, controlled state, keyboard behavior, CSS tokens, or style
dependencies.

When a task uses a component:

1. Identify the component reference from the map below.
2. Read that reference before writing or changing its code.
3. Read references for every component in a composition, not only the parent.
4. Read `@g4rcez/components/ai/docs/index.md` when you need the complete
   catalog or import path.
5. Read `@g4rcez/components/ai/docs/style-dependencies.md` when adding or
   changing CSS imports.
6. If a reference is missing or does not answer the question, inspect the package
   export and source before making an assumption.

Load a new component context whenever the component is unfamiliar, the task uses
non-default props or compound children, behavior depends on focus/keyboard/async
state, the component replaces native HTML, or styling and accessibility details
matter. A component name in the task is enough reason to read its reference
before implementation.

Reference paths:

- Installed package: `@g4rcez/components/ai/docs/<ComponentName>.md`
- This repository: `packages/lib/ai/docs/<ComponentName>.md`

### Component reference map

- `Alert` — `@g4rcez/components/ai/docs/Alert.md`
- `AnimatedList` — `@g4rcez/components/ai/docs/AnimatedList.md`
- `Autocomplete` — `@g4rcez/components/ai/docs/Autocomplete.md`
- `Button` — `@g4rcez/components/ai/docs/Button.md`
- `Calendar` — `@g4rcez/components/ai/docs/Calendar.md`
- `Card` — `@g4rcez/components/ai/docs/Card.md`
- `Checkbox` — `@g4rcez/components/ai/docs/Checkbox.md`
- `CommandPalette` — `@g4rcez/components/ai/docs/CommandPalette.md`
- `DatePicker` — `@g4rcez/components/ai/docs/DatePicker.md`
- `Dropdown` — `@g4rcez/components/ai/docs/Dropdown.md`
- `Empty` — `@g4rcez/components/ai/docs/Empty.md`
- `Expand` — `@g4rcez/components/ai/docs/Expand.md`
- `FileUpload` — `@g4rcez/components/ai/docs/FileUpload.md`
- `Form` — `@g4rcez/components/ai/docs/Form.md`
- `FormReset` — `@g4rcez/components/ai/docs/FormReset.md`
- `Heading` — `@g4rcez/components/ai/docs/Heading.md`
- `Input` — `@g4rcez/components/ai/docs/Input.md`
- `InputField` — `@g4rcez/components/ai/docs/InputField.md`
- `List` — `@g4rcez/components/ai/docs/List.md`
- `Masonry` — `@g4rcez/components/ai/docs/Masonry.md`
- `Menu` — `@g4rcez/components/ai/docs/Menu.md`
- `Modal` — `@g4rcez/components/ai/docs/Modal.md`
- `MultiSelect` — `@g4rcez/components/ai/docs/MultiSelect.md`
- `Notifications` — `@g4rcez/components/ai/docs/Notifications.md`
- `PageCalendar` — `@g4rcez/components/ai/docs/PageCalendar.md`
- `Polymorph` — `@g4rcez/components/ai/docs/Polymorph.md`
- `Progress` — `@g4rcez/components/ai/docs/Progress.md`
- `Radiobox` — `@g4rcez/components/ai/docs/Radiobox.md`
- `RenderOnView` — `@g4rcez/components/ai/docs/RenderOnView.md`
- `Resizable` — `@g4rcez/components/ai/docs/Resizable.md`
- `Select` — `@g4rcez/components/ai/docs/Select.md`
- `Shortcut` — `@g4rcez/components/ai/docs/Shortcut.md`
- `Skeleton` — `@g4rcez/components/ai/docs/Skeleton.md`
- `Slider` — `@g4rcez/components/ai/docs/Slider.md`
- `Slot` — `@g4rcez/components/ai/docs/Slot.md`
- `Spinner` — `@g4rcez/components/ai/docs/Spinner.md`
- `Stats` — `@g4rcez/components/ai/docs/Stats.md`
- `Step` — `@g4rcez/components/ai/docs/Step.md`
- `SwipeableList` — `@g4rcez/components/ai/docs/SwipeableList.md`
- `Switch` — `@g4rcez/components/ai/docs/Switch.md`
- `Table` — `@g4rcez/components/ai/docs/Table.md`
- `Tabs` — `@g4rcez/components/ai/docs/Tabs.md`
- `Tag` — `@g4rcez/components/ai/docs/Tag.md`
- `TaskList` — `@g4rcez/components/ai/docs/TaskList.md`
- `Textarea` — `@g4rcez/components/ai/docs/Textarea.md`
- `Timeline` — `@g4rcez/components/ai/docs/Timeline.md`
- `Toolbar` — `@g4rcez/components/ai/docs/Toolbar.md`
- `Tooltip` — `@g4rcez/components/ai/docs/Tooltip.md`
- `Typography` — `@g4rcez/components/ai/docs/Typography.md`
- `Wizard` — `@g4rcez/components/ai/docs/Wizard.md`
