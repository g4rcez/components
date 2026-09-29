---
name: csscomponents
description: >
    Use when: setting up @g4rcez/components in a new project, migrating native
    HTML elements or hand-rolled UI to this design system, building any React UI
    that should use @g4rcez/components, or when the user's project already has
    @g4rcez/components as a dependency. Covers installation, plain CSS setup,
    plain CSS and configureTheme, ComponentsProvider/tweaks,
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

Use scoped wrapper variables for local changes and plain `:root` / `html.dark` CSS or `configureTheme(config, options?)` for root-level overrides. Do not target generated selectors or hardcode component styling.

Use only canonical `--var-*` properties (`--var-button-height`, `--var-color-primary`, `--var-rounded-full`). Retired radius and unprefixed/component aliases are not compatibility fallbacks; use each component's current reference and `themeTokenRegistry`.

Library geometry derives from `--var-spacing-base` and `--var-radius-base`. Their shipped values come from foundation CSS; numeric `spacing` and `rounding` in `configureTheme` mean pixels (including zero), or use explicit CSS strings. Typography and full-circle primitives remain independent. Explicit component values, including zero and literal sizes, always win.

Derived semantic defaults are use-site CSS fallbacks, not root custom-property declarations, so nested base overrides remain reactive. Inspect exported `defaultGeometryTokens`, `defaultGeometryBases`, or `defaultLightThemeTokens` instead of reading default custom properties with `getComputedStyle()`. See `ai/docs/geometry-tokens.md` for geometry behavior and scope boundaries.

---

## 3 — Theme scope

Built-in light and dark colors are supplied by foundation CSS. Activate dark mode by putting `.dark` on `<html>`; JavaScript configuration registers overrides but never changes classes. The application owns activation:

```html
<html class="dark">...</html>
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

## 4 — Theme customization

Use sparse `configureTheme` overrides or ordinary CSS. Built-in colors remain in foundation CSS; configuration should contain only intentional overrides. This is the breaking CSS-token API, not a second full-object injection path.

```ts
import { configureTheme } from "@g4rcez/components";

configureTheme({
    name: "default",
    tokens: { spacing: 16, rounding: 0 },
});

configureTheme({
    name: "dark",
    colors: { primary: "hsla(201, 49%, 60%, 1)" },
    components: { button: { "secondary-background": "hsla(240, 6%, 15%, 1)" } },
});
```

`default` writes a `:root` override; named themes write to `html.<name>`. Names match `[a-z][a-z0-9_-]*`; keep at most one named-theme class active and preserve unrelated classes. Only `tokens.spacing` and `tokens.rounding` accept finite numbers, interpreted as pixels (including zero). All other values are CSS strings; colors are complete CSS values, never stripped channels. Use shallow CSS suffix keys, not nested `DEFAULT` leaves.

Each call is a sparse override set; `undefined` is omitted. Reconfiguring a name replaces its previous overrides, not a deep merge. `configureTheme({ name: "dark" })` clears that managed override set, including `colorScheme`, without changing the active class, built-in dark CSS, or another theme. A partial dark override leaves other built-in dark colors intact unless higher-priority shared overrides replace them.

Equivalent ordinary CSS needs no JavaScript:

```css
:root {
    --var-spacing-base: 16px;
    --var-radius-base: 0px;
}

html.dark {
    --var-color-primary: hsla(201, 49%, 60%, 1);
    --var-button-secondary-background: hsla(240, 6%, 15%, 1);
}
```

Normal declarations cascade from `var.tokens` defaults to `var.theme` configuration to unlayered application CSS, then consumer inline styles. Within a layer, `html.dark` beats `:root`; layer priority comes before specificity, so unlayered `:root` even beats configured `html.dark`. Configured default colors also beat built-in dark colors; configure the dark scope explicitly if that color should differ. Use `html.dark` for CSS values that should apply only in dark mode. JavaScript does not change classes or root inline properties.

### Custom themes and inspection

`ThemeConfiguration` adds `name` and optional `colorScheme: "light" | "dark" | "normal"` to `ThemeTokenOverrides` (`tokens`, `colors`, `components`). `ThemeComponentOverrides` types component values. These types, helpers, and `themeTokenRegistry` are exported from the package root and `/theme`.

A custom name inherits the default palette, not another named theme. To start dark, explicitly spread `defaultDarkThemeTokens.colors` and `defaultDarkThemeTokens.components` into the configuration and set `colorScheme: "dark"` for native controls; activation remains application-owned. `defaultDarkThemeTokens` contains effective global/component colors only. `defaultLightThemeTokens` includes shared defaults and light colors. They are inspection data: injecting all defaults explicitly pins values and can freeze derived geometry.

Global color changes do not automatically regenerate independent component palettes. Notification/Table shadows separate shared `tokens["shadow-<name>-shape"]` and `colors["shadow-<name>"]`; explicit `tokens["shadow-<name>"]` full-shadow overrides win over that composition. Card/Floating retain shared full-shadow controls.

### SSR, hydration, and CSP

`createThemeCss(config)` is pure. Emit its CSS in a server `<head>` style with `id="g4rcez-theme-<name>"`, `data-g4rcez-theme-owner="theme-runtime"`, and `data-g4rcez-theme-name="<name>"`, plus the request's CSP nonce when needed. Render the active root class before paint. `configureTheme(config, { document?, nonce? })` returns CSS and registers it when a document exists; hydration updates the matching owned style in place. Duplicate IDs or conflicting non-owned elements throw. Later updates preserve an existing nonce when `nonce` is omitted; the API does not generate nonces or set CSP policy.

Values are developer-authored CSS, not sanitized user input. Unknown supplied keys, invalid shapes, names, and declaration/rule/style-tag boundary escapes are rejected before registration. See `ai/docs/theme-customization.md` for the full owned-style SSR example, supported paths, precedence, and migration table.

### Local scope and geometry

Use wrapper custom properties or `createThemeProperties({ tokens: { spacing: 12, rounding: 0 } })` for local previews. This pure helper takes sparse `ThemeTokenOverrides`, not a name/color scheme, and emits no implicit defaults. Wrapper styles do not reach portals rendered elsewhere; root themes naturally reach body portals. Spacing and rounding bases remain reactive through use-site fallbacks; explicit component values remain authoritative. Named theme configuration is root-only and does not promise arbitrary nested typography/color-base recomputation.

### Breaking-release migration

Replace retired root registration and full-object serializers with `configureTheme`/`createThemeCss`, and local injection with `createThemeProperties` or CSS. Migrate old nested theme shapes to shallow `tokens`, `colors`, and canonical `components`; replace theme-attribute activation with `.dark` on `<html>`, and replace retired aliases with canonical properties. Import from the package root or `@g4rcez/components/theme`; the removed `/styles` and `/themes` theme entry points are not re-exported. Component `data-theme` variants remain unrelated and supported. Do not retain old signatures, channel stripping, or competing rounding inputs. Built-in dark now shares the default Card shadow shape. See the canonical theme reference for explicit old-to-new migration paths.

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

The provider is not required for styling or root theme activation. Its `components` prop accepts canonical `ThemeComponentOverrides`; `injectComponentTokens` opts into scoped wrapper CSS and supported size-variant derivation. Without that option, component values remain context only. Provider wrappers do not guarantee CSS inheritance for outside portals.

The optional Tailwind preset reads the same canonical variables and complete CSS colors; no channel stripping or additional default injection is needed. Parsers and low-level preset transformations retain their distinct uses, not app-wide theme serialization. New applications can use the plain CSS setup without a preset.

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
