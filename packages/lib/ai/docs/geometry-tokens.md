---
title: Geometry tokens
description: Independent spacing and rounding bases, scoped defaults, and explicit overrides.
package: "@g4rcez/components"
---
# Geometry tokens

- Library spacing and sizing defaults derive from `--var-spacing-base`.
- Ordinary corner defaults derive independently from `--var-radius-base`.
- Foundation CSS supplies the shared defaults of both bases.
- Text font sizes and full-circle primitives do not depend on density.

```css
.compact {
    --var-spacing-base: 12px;
    --var-radius-base: 4px;
}
.compact.square {
    --var-radius-base: 0px;
}
.fixed-button {
    --var-button-height: 40px;
}
```

- Changing spacing affects library padding, margins, gaps, control dimensions, icon geometry, and related offsets.
- Changing rounding does not change spacing.
- Explicit consumer values stay authoritative: a `40px` height stays `40px`, even inside a compact scope.
- A base change does not replace explicit component radii or full-circle primitives.

## Why defaults are fallbacks

- An inherited custom property that contains `calc` resolves at the element where it is declared.
- A derived token defined on `:root` would freeze its default against the root base and break nested density scopes.
- Component CSS therefore uses an override followed by a local default:

```css
.__button {
    min-block-size: var(--var-button-height, calc(var(--var-spacing-base) * 2.5));
}
```

- Do not redeclare every semantic token on every element. That hides inherited consumer overrides.
- Default semantic geometry properties are deliberately absent from root computed custom properties.
- To read defaults, import the exported library defaults. Do not use `getComputedStyle`.

```ts
import { defaultGeometryBases, defaultGeometryTokens } from "@g4rcez/components";
const spacingBase = defaultGeometryBases.spacing;
const roundingBase = defaultGeometryBases.radius;
const height = defaultGeometryTokens["--var-button-height"];
```

- `defaultGeometryTokens` covers CSS geometry, including tokens absent from older component-token schemas.
- Derived geometry defaults stay use-site fallbacks. Sparse serialization emits them only when supplied explicitly.
- Copying a complete default object into a root rule pins derived values at that root and defeats nested recomputation.

## Theme overrides and migration

- The breaking CSS-token release replaces app-wide full-object injection with sparse `configureTheme(config, options?)` overrides and ordinary CSS.
- Use `--var-radius-base` as the sole rounding base, not the retired radius alias.
- See [Theme customization](theme-customization.md#breaking-release-migration) for the old API, property, provider, and activation migrations.
- `tokens.spacing` and `tokens.rounding` map to `--var-spacing-base` and `--var-radius-base`.
- Numeric values mean pixels, including zero. CSS strings keep explicit units and formulas.

```ts
import { configureTheme } from "@g4rcez/components";
configureTheme({ name: "default", tokens: { spacing: 16, rounding: 0 } });
configureTheme({ name: "dense", tokens: { spacing: 12 } });
```

- The default scope is `:root`. A named scope is `html.<name>`.
- Overrides are sparse. The `dense` example changes spacing only. It inherits rounding and all colors through CSS and does not copy a complete theme object.
- Foundation CSS supplies built-in light and dark colors. Activate dark with `.dark` on `<html>`. JavaScript registers overrides and does not toggle classes.
- Reconfiguring `dense` replaces its previous overrides. `configureTheme({ name: "dense" })` clears them and keeps the active class.
- Built-in dark changes colors, not shared geometry. A deliberate dark spacing override is possible.
- Numeric convenience applies only to spacing/rounding. Component heights, radii, and all other properties require CSS strings.
- For scoped previews, use plain wrapper custom properties:

```css
.preview {
    --var-spacing-base: 12px;
    --var-radius-base: 4px;
}
```

- An explicit component property inherited from a wrapper wins. Without that property, a nested base change recomputes fallback geometry at the component.
- `createThemeProperties({ tokens: { spacing: 12, rounding: 4 } })` produces the same sparse wrapper properties, without a theme name or defaults.
- `ComponentsProvider` accepts canonical component keys. It injects wrapper values with `injectComponentTokens`. Context alone is not CSS registration.
- Wrapper styles reach only DOM descendants, not portals rendered elsewhere. Root styles reach body portals.
- Named theme activation is root-only. It is not a nested theme provider. It does not promise arbitrary typography or color-base recomputation.
- For server first paint, owned style IDs, hydration, CSP nonces, and cascade precedence, see [Theme customization](theme-customization.md).

## Coverage and exceptions

- Density affects geometry that derives from spacing or rounding.
- Calendar hour rows, event positions, and gutters use density-derived defaults. Explicit hour-block sizing stays an override.
- Popup caps and initial size estimates can derive from density. Measured content sizes stay physical measurements.
- Not density-scaled: text font sizes, line heights, letter spacing, full circles, zeros, structural percentages, viewport constraints, breakpoints, border hairlines, shadows, accessibility-only clipping dimensions, animation durations, dimensionless factors.
- Virtualizer pixel estimates and modal keyboard resize increments are algorithmic inputs, not authored CSS dimensions.
- Verify browser layout and animation after changing density.
