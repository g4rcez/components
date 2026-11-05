---
title: Theme customization
description: Sparse root theme overrides with CSS or configureTheme.
package: "@g4rcez/components"
---
# Theme customization

Foundation CSS supplies built-in light and dark palettes. Customize with ordinary CSS or sparse JavaScript overrides. Neither needs Tailwind, a provider, or copied defaults.

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

- Import `@g4rcez/components/index.css` for foundation plus all components.
- Default/light is `:root`. Dark is `<html class="dark">`. Remove the class to return to light.
- Named themes target `html.<name>`, not wrappers.
- The application MUST keep at most one named-theme class active, and MUST keep unrelated classes.

## Sparse configuration and replacement

```ts
import { configureTheme } from "@g4rcez/components";
configureTheme({ name: "default", tokens: { spacing: 16, rounding: 0 } });
configureTheme({
    name: "dark",
    colors: { primary: "hsla(201, 49%, 60%, 1)" },
    components: { button: { "secondary-background": "hsla(240, 6%, 15%, 1)" } },
});
```

- `configureTheme(config, { document?, nonce? })` returns CSS. With a document, it also registers the CSS in that document's head. Without one, it does no DOM work.
- It never changes classes or root inline properties.
- Each call replaces the **entire override set** of that name. Omitted values and earlier overrides are removed, not merged. Other names stay unchanged.
- A partial dark override keeps unsupplied built-in dark colors, unless a higher-priority shared override replaces them.

```ts
configureTheme({ name: "default", tokens: { spacing: 12 } });
// The earlier rounding override is gone; foundation rounding applies again. configureTheme({ name: "dark" });
// Clears managed dark declarations (including colorScheme), not built-in dark CSS.
```

- Reset keeps the managed style node. It keeps the active class and application CSS.

## Configuration paths and values

- `ThemeConfiguration` requires `name`. It accepts optional `tokens`, `colors`, `components`, `colorScheme`.
- `ThemeTokenOverrides` is the same grouping without `name` or `colorScheme`. `ThemeComponentOverrides` describes the component group.
- Import types and helpers from `@g4rcez/components` or `@g4rcez/components/theme`.

| Configuration path | CSS property | Value |
|---|---|---|
| `tokens.spacing` | `--var-spacing-base` | Finite number in pixels or CSS string |
| `tokens.rounding` | `--var-radius-base` | Finite number in pixels or CSS string |
| `tokens.fontsize` | `--var-fontsize` | CSS string |
| `tokens["motion-duration-normal"]` | `--var-motion-duration-normal` | CSS string |
| `tokens["layer-tooltip"]` | `--var-layer-tooltip` | CSS string, e.g. `"22"` |
| `colors.primary` | `--var-color-primary` | Complete CSS color string |
| `colors["primary-foreground"]` | `--var-color-primary-foreground` | Complete CSS color string |
| `components.button.height` | `--var-button-height` | CSS string, e.g. `"40px"` |
| `components.button["secondary-background"]` | `--var-button-secondary-background` | Complete CSS color string |

- Only spacing and rounding accept numbers: `0` emits `0px`, `16` emits `16px`, `"1rem"` keeps its unit. Other values MUST be CSS strings.
- `undefined` is omitted. Zero, literals, and formulas stay overrides, even when equal to a default.
- Keys are shallow and keep CSS suffix spelling. No nested `DEFAULT` leaves. No camel-case conversion.
- Use `spacing` and `rounding` as keys, not `spacing-base` and `radius-base`. They map to `--var-spacing-base` and `--var-radius-base`.
- `themeTokenRegistry.tokens`, `.colors`, and `.components` list the supported shared keys, global color keys, and component properties. The registry does not list `spacing` and `rounding` (extra configuration keys). It does not expose `spacing-base` or `radius-base` as object keys.
- The API rejects unsupported keys and invalid value shapes before DOM mutation.
- Names MUST match `[a-z][a-z0-9_-]*`. `default` is reserved for `:root`.
- `colorScheme` accepts `"light"`, `"dark"`, or `"normal"`. It emits the native `color-scheme` property, not a palette or activation class.
- Colors are complete CSS values, such as `hsla(201, 49%, 60%, 1)` or `transparent`. Do not strip color-function wrappers into channels.
- Values are developer-authored CSS, not sanitized untrusted input. Serialization checks declaration, rule, and style-tag boundaries only, not value validity per property.
- Use ordinary CSS for application-owned properties.

## Custom themes and inspection defaults

A partial custom theme uses the default palette plus its overrides. Names do not imply dark inheritance. To start from the complete effective dark color palette, copy its color-only groups explicitly:

```ts
import { configureTheme, defaultDarkThemeTokens } from "@g4rcez/components";
configureTheme({
    name: "midnight",
    colorScheme: "dark",
    colors: { ...defaultDarkThemeTokens.colors, primary: "hsla(201, 49%, 60%, 1)" },
    components: { ...defaultDarkThemeTokens.components },
}); // Application-owned activation; remove any other named-theme class first.
document.documentElement.classList.remove("dark");
document.documentElement.classList.add("midnight");
```

- `defaultLightThemeTokens` holds shared defaults and light colors.
- `defaultDarkThemeTokens` holds effective global and component colors only (including Card/Table surfaces and state colors). It has no shared geometry.
- These generated exports are inspection data, not mandatory initialization. Supplying defaults pins those values. Do not inject full defaults for ordinary customization.
- `defaultGeometryTokens` and `defaultGeometryBases` expose geometry inspection data separately.
- A global color change affects consumers of that token, not independently authored Alert/Tag/component state palettes. Configure those component colors separately.
- There is no automatic palette generation and no runtime `extends` relationship.

### Shadows

Notification and Table shadow defaults split shared shape from theme color:

- `tokens["shadow-notification-shape"]` / `tokens["shadow-table-shape"]`: offsets, blur, spread.
- `colors["shadow-notification"]` / `colors["shadow-table"]`: full colors.
- `tokens["shadow-notification"]` / `tokens["shadow-table"]`: explicit full-shadow overrides. They take precedence over the shape/color composition.
- Card and Floating keep shared full-shadow controls: `--var-shadow-card`, `--var-shadow-floating`.
- The old dark-only Card shadow shape is now the shared transparent default `0px 1px 2px 1px`. Built-in dark no longer changes Card shadow geometry.
- `--var-shadow-card` stays a full-shadow override and intentionally stops following the split color controls.

## Cascade precedence

Foundation and serialized output establish the same order:

```css
@layer var.tokens, var.theme, var.base, var.components, var.utilities;
```

For normal declarations on the same root element, precedence increases:

1. Library token defaults in `var.tokens`.
2. Configured overrides in `var.theme`.
3. Unlayered application CSS.
4. Consumer inline styles, if used outside this API.

- Within a layer, `html.dark` is more specific than `:root`, regardless of call order.
- Layer priority comes first: unlayered `:root` beats configured `html.dark`.
- A configured default color also beats the built-in dark color in the earlier layer. To differ in dark, configure that color in the dark scope.
- Use `html.dark` for CSS values that apply only in dark mode.
- Applications with their own layers own that ordering.
- The library emits no important declarations (CSS reverses important-layer order).
- Root rules match one element and inherit to descendants. Theme switching is CSS cascade, not object merging.
- Reconfiguration updates a style in place and keeps its cascade position.

## SSR, hydration, and CSP

- `createThemeCss(config)` is pure and injects nothing.
- Emit its result in `<head>`. Emit the selected root class in server HTML before paint.
- Hydration requires the deterministic ID **and both ownership attributes** shown here:

```tsx
import { createThemeCss, type ThemeConfiguration } from "@g4rcez/components";
const config: ThemeConfiguration = { name: "dark", colors: { primary: "hsla(201, 49%, 60%, 1)" } }; // Render inside the server document's <head>; nonce comes from your CSP setup.
<style
    id={`g4rcez-theme-${config.name}`}
    data-g4rcez-theme-owner="theme-runtime"
    data-g4rcez-theme-name={config.name}
    nonce={nonce}
    dangerouslySetInnerHTML={{ __html: createThemeCss(config) }}
/>;
```

- On the client, `configureTheme(config, { nonce })` reuses that style. It does not append another.
- Use one style per name: `g4rcez-theme-default`, `g4rcez-theme-dark`, or `g4rcez-theme-<custom-name>`.
- A duplicate ID, or an existing element with the wrong tag, ownership, or name, causes an error. Validation completes before mutation, so unrelated page content is never overwritten.
- Omitting `nonce` on a later update keeps the existing nonce. Supplying one sets it.
- Supply the request's allowed nonce when you first emit or register a style under CSP. The API creates no CSP policy and no nonces.
- Pass `{ document: targetDocument }` to register into a specific document.
- Server configuration MUST use the same name and overrides as client hydration, so the first-painted theme does not change.

## Wrappers, portals, provider, and preset

For local inline properties, use the pure sparse serializer:

```tsx
import { createThemeProperties } from "@g4rcez/components";
<div style={createThemeProperties({ tokens: { spacing: 12, rounding: 0 } })}> {children}</div>;
```

- `createThemeProperties({})` returns no defaults. It accepts only `ThemeTokenOverrides`, not a theme name or color scheme.
- Wrapper properties reach DOM descendants, not portals rendered elsewhere. Root themes reach body portals.
- This is a root theme API, not nested named-theme activation. Spacing/radius use-site fallbacks stay reactive. Nested typography and color-base recomputation is not promised.
- `ComponentsProvider` is optional for styling. It configures behavior such as locale, translations, parser, and tweaks.
- Its `components` prop accepts canonical `ThemeComponentOverrides`.
- With `injectComponentTokens`, it emits scoped wrapper properties and derives supported size variants from supplied base component values. Without it, the values are context only.
- It neither registers nor activates a root theme. Outside portals do not inherit its wrapper CSS.
- The optional Tailwind preset reads the same canonical `--var-*` properties and complete CSS colors. It needs no channel stripping and no separate default injection.
- Parsers and low-level preset token transformations are not app-wide theme serializers.
- New applications can use CSS chunks without the preset.

## Breaking-release migration

This cutover is a breaking API/CSS-contract change, not a compatibility layer. Migrate consumers together before adopting the release:

- Replace removed `@g4rcez/components/styles` and `/themes` theme entry imports with the package root or `@g4rcez/components/theme`. These paths have no compatibility re-exports.
- Replace `applyTheme`/`registerTheme` with root `configureTheme`. For local overrides, use wrapper CSS or `createThemeProperties`.
- Remove app-wide `createTokenStyles`/`TokenRemap` injection. Use foundation defaults and sparse overrides. Do not serialize a complete default theme on every switch.
- Migrate old `createThemeCss`/`createThemeProperties` signatures to the grouping above. Old `spacing.base` becomes `tokens.spacing`. Rounding becomes `tokens.rounding`. Nested color `DEFAULT` leaves become flat color strings.
- Replace root `[data-theme="dark"]` activation with `.dark` on `<html>`. Component `data-theme` variant attributes (for example Alert/Tag) stay supported and unrelated.
- Replace retired `--var-radius` with `--var-radius-base`. Replace unprefixed or retired component aliases with the canonical properties in each component reference and registry. Do not keep fallback aliases that compete with `rounding: 0`.
- Update provider component keys and Tailwind integration to canonical properties. Remove channel-stripping transforms.
- Adopt the owned SSR style ID and attributes above.
- See [Geometry tokens](geometry-tokens.md) for base units, use-site fallbacks, and density exceptions.
