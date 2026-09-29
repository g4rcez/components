---
title: Theme customization
description: Sparse root theme overrides with CSS or configureTheme.
package: "@g4rcez/components"
---

# Theme customization

Foundation CSS supplies built-in light and dark palettes. Customize with ordinary CSS or sparse JavaScript overrides; neither requires Tailwind, a provider, or copying library defaults.

## CSS-only setup and activation

Import foundation before the component chunks you use, from an application stylesheet:

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";

:root {
    --var-spacing-base: 16px;
    --var-radius-base: 0px;
}

html.dark {
    --var-color-primary: hsla(201, 49%, 60%, 1);
    --var-button-secondary-background: hsla(240, 6%, 15%, 1);
}
```

Alternatively, import `@g4rcez/components/index.css` for foundation plus all components. Default/light is `:root`; dark activation is `<html class="dark">`. Remove the theme class to return to light. Named themes target `html.<name>`, not wrappers. The application must keep at most one named-theme class active while preserving unrelated classes.

## Sparse configuration and replacement

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

`configureTheme(config, { document?, nonce? })` returns CSS and, when a document is available, registers it in that document's head. It never changes classes or root inline properties. Without a document it returns CSS without DOM work.

Each call replaces that name's **entire override set**. Omitted values are not serialized; omitted earlier overrides are removed, not merged. Updating one name does not alter another name. A partial dark override leaves unsupplied built-in dark colors intact unless a higher-priority shared override replaces them.

```ts
configureTheme({ name: "default", tokens: { spacing: 12 } });
// The earlier rounding override is gone; foundation rounding applies again.

configureTheme({ name: "dark" });
// Clears managed dark declarations (including colorScheme), not built-in dark CSS.
```

Reset keeps the managed style node in place. It does not remove the active class or undo application-authored CSS.

## Configuration paths and values

`ThemeConfiguration` requires `name` and accepts optional `tokens`, `colors`, `components`, and `colorScheme`. `ThemeTokenOverrides` is the same sparse property grouping without `name` or `colorScheme`; `ThemeComponentOverrides` describes the component group. Import these types and the helpers from `@g4rcez/components` or `@g4rcez/components/theme`.

| Configuration path | CSS property | Value |
| --- | --- | --- |
| `tokens.spacing` | `--var-spacing-base` | Finite number in pixels or CSS string |
| `tokens.rounding` | `--var-radius-base` | Finite number in pixels or CSS string |
| `tokens.fontsize` | `--var-fontsize` | CSS string |
| `tokens["motion-duration-normal"]` | `--var-motion-duration-normal` | CSS string |
| `tokens["layer-tooltip"]` | `--var-layer-tooltip` | CSS string, e.g. `"22"` |
| `colors.primary` | `--var-color-primary` | Complete CSS color string |
| `colors["primary-foreground"]` | `--var-color-primary-foreground` | Complete CSS color string |
| `components.button.height` | `--var-button-height` | CSS string, e.g. `"40px"` |
| `components.button["secondary-background"]` | `--var-button-secondary-background` | Complete CSS color string |

Only spacing and rounding accept numbers: `0` emits `0px`, `16` emits `16px`, and `"1rem"` preserves its unit. Other values must be CSS strings. `undefined` is omitted; explicit zero, literal values, and formulas remain overrides even when equal to a default. Keys are shallow, retaining CSS suffix spelling; there are no nested `DEFAULT` leaves or automatic camel-case conversions. Use `spacing`/`rounding`, not `spacing-base`/`radius-base`, as configuration keys.

`themeTokenRegistry.tokens`, `.colors`, and `.components` list the supported shared keys, global color keys, and component properties. The `spacing` and `rounding` primitive paths are additional ergonomic configuration keys; the registry does not expose `spacing-base` or `radius-base` as object keys. They map to the CSS properties `--var-spacing-base` and `--var-radius-base`. Unsupported supplied keys and invalid value shapes are rejected before DOM mutation. Names must match `[a-z][a-z0-9_-]*`; `default` is reserved for `:root`. `colorScheme` accepts `"light"`, `"dark"`, or `"normal"` and emits the native `color-scheme` property, not a palette or activation class.

Colors are complete CSS values, such as `hsla(201, 49%, 60%, 1)` or `transparent`; do not strip color-function wrappers into channels. Values are developer-authored CSS, not sanitized untrusted input. Serialization checks declaration/rule/style-tag boundaries, not whether each CSS value is valid for its destination property. Use ordinary CSS for application-owned properties.

## Custom themes and inspection defaults

A partial custom theme uses the default palette plus its overrides; names do not imply dark inheritance. To start from the complete effective dark color palette, copy its color-only groups explicitly:

```ts
import { configureTheme, defaultDarkThemeTokens } from "@g4rcez/components";

configureTheme({
    name: "midnight",
    colorScheme: "dark",
    colors: { ...defaultDarkThemeTokens.colors, primary: "hsla(201, 49%, 60%, 1)" },
    components: { ...defaultDarkThemeTokens.components },
});

// Application-owned activation; remove any other named-theme class first.
document.documentElement.classList.remove("dark");
document.documentElement.classList.add("midnight");
```

`defaultLightThemeTokens` contains shared defaults and light colors; `defaultDarkThemeTokens` contains effective global and component colors only, including Card/Table surfaces and state colors, not shared geometry. These generated exports are inspection data, not mandatory initialization. Supplying defaults explicitly pins those values; avoid full-default injection for ordinary customization. `defaultGeometryTokens` and `defaultGeometryBases` expose geometry inspection data separately.

Changing a global color affects consumers of that token, not independently authored Alert/Tag/component state palettes. Configure those component colors separately. There is no automatic palette generation or runtime `extends` relationship.

### Shadows

Notification and Table shadow defaults split shared shape from theme color:

- `tokens["shadow-notification-shape"]` / `tokens["shadow-table-shape"]` contain offsets, blur, and spread.
- `colors["shadow-notification"]` / `colors["shadow-table"]` contain full colors.
- `tokens["shadow-notification"]` / `tokens["shadow-table"]` remain explicit full-shadow overrides and take precedence over the shape/color composition.

Card and Floating retain shared full-shadow controls (`--var-shadow-card`, `--var-shadow-floating`). The old dark-only Card shadow shape is normalized to the shared transparent default `0px 1px 2px 1px`; built-in dark no longer changes Card shadow geometry. `--var-shadow-card` remains a full-shadow override and intentionally stops following the split color controls.

## Cascade precedence

Foundation and serialized output establish the same order:

```css
@layer var.tokens, var.theme, var.base, var.components, var.utilities;
```

For normal declarations on the same root element, precedence increases from:

1. Library token defaults in `var.tokens`.
2. Configured overrides in `var.theme`.
3. Unlayered application CSS.
4. Consumer inline styles, if deliberately used outside this API.

Within a layer, `html.dark` is more specific than `:root`, regardless of configuration call order. Layer priority comes first: unlayered `:root` beats configured `html.dark`. A configured default color also beats the built-in dark color in the earlier layer; configure that color in the dark scope if it should differ. Use `html.dark` for CSS values that should apply only in dark mode. Applications using their own layers own that ordering. Important declarations follow CSS's reversed important-layer ordering; the library emits none.

Root rules match the same element and then inherit to descendants; theme switching is CSS cascade, not object merging. Reconfiguration updates a style in place, preserving its cascade position.

## SSR, hydration, and CSP

`createThemeCss(config)` is pure and does not inject anything. Emit its result in `<head>` and the selected root class in server HTML before paint. Hydration requires the deterministic ID **and both ownership attributes** shown here:

```tsx
import { createThemeCss, type ThemeConfiguration } from "@g4rcez/components";

const config: ThemeConfiguration = {
    name: "dark",
    colors: { primary: "hsla(201, 49%, 60%, 1)" },
};

// Render inside the server document's <head>; nonce comes from your CSP setup.
<style
    id={`g4rcez-theme-${config.name}`}
    data-g4rcez-theme-owner="theme-runtime"
    data-g4rcez-theme-name={config.name}
    nonce={nonce}
    dangerouslySetInnerHTML={{ __html: createThemeCss(config) }}
/>
```

On the client, `configureTheme(config, { nonce })` reuses that style rather than appending another. Use one style per configured name (`g4rcez-theme-default`, `g4rcez-theme-dark`, or `g4rcez-theme-<custom-name>`). Duplicate IDs or an existing element with the wrong tag/ownership/name cause an error rather than overwriting unrelated page content. Validation completes before mutation.

Omitting `nonce` on a later update preserves the existing nonce; supplying one sets it. Supply the request's allowed nonce when initially emitting/registering a style under CSP. The API does not create a CSP policy or generate nonces. Pass `{ document: targetDocument }` when registering into a specific document. Server configuration must use the same name and overrides as client hydration to avoid changing the first-painted theme.

## Wrappers, portals, provider, and preset

For local inline properties, use the pure sparse serializer:

```tsx
import { createThemeProperties } from "@g4rcez/components";

<div style={createThemeProperties({ tokens: { spacing: 12, rounding: 0 } })}>
    {children}
</div>
```

`createThemeProperties({})` returns no defaults. It accepts only `ThemeTokenOverrides`, not a theme name or color scheme. Wrapper properties reach DOM descendants, not portals rendered elsewhere. Root themes naturally reach body portals. This is a root theme API, not nested named-theme activation; spacing/radius use-site fallbacks remain reactive, but arbitrary nested typography/color-base recomputation is not promised.

`ComponentsProvider` remains optional for styling and configures behavior such as locale, translations, parser, and tweaks. Its `components` prop accepts canonical `ThemeComponentOverrides`. With `injectComponentTokens`, it emits scoped wrapper properties and derives supported size variants from supplied base component values; without it, the values are context only. It neither registers nor activates a root theme. Its wrapper is not a guarantee that outside portals share its CSS inheritance.

The optional Tailwind preset reads the same canonical `--var-*` properties and complete CSS colors; it does not require channel stripping or separate default injection. Parsers and low-level preset token transformations still have distinct uses; they are not app-wide theme serializers. New applications can use CSS chunks without the preset.

## Breaking-release migration

This cutover is a breaking API/CSS-contract change, not a compatibility layer. Migrate consumers together before adopting the release:

- Replace removed `@g4rcez/components/styles` and `/themes` theme entry imports with the package root or `@g4rcez/components/theme`; these paths have no compatibility re-exports.
- Replace `applyTheme`/`registerTheme` with root `configureTheme`, or wrapper CSS/`createThemeProperties` for local overrides.
- Remove app-wide `createTokenStyles`/`TokenRemap` injection. Use foundation defaults and sparse overrides; do not serialize a complete default theme on every switch.
- Migrate old `createThemeCss`/`createThemeProperties` signatures to the grouping documented above: old `spacing.base` becomes `tokens.spacing`, rounding becomes `tokens.rounding`, and nested color `DEFAULT` leaves become flat color strings.
- Replace root `[data-theme="dark"]` activation with `.dark` on `<html>`. Component `data-theme` variant attributes (for example Alert/Tag) remain unrelated and supported.
- Replace retired `--var-radius` with `--var-radius-base`; replace unprefixed/retired component aliases with the consumed canonical properties in each component reference and registry. Do not preserve fallback aliases that compete with `rounding: 0`.
- Update provider component keys and any Tailwind integration to canonical properties and complete CSS colors. Remove channel-stripping transforms.
- Adopt the owned SSR style ID/attributes above and use replacement/reset semantics rather than assuming incremental merging.

See [Geometry tokens](geometry-tokens.md) for base units, use-site fallbacks, and density exceptions.
