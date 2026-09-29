---
title: Geometry tokens
description: Independent spacing and rounding bases, scoped defaults, and explicit overrides.
package: "@g4rcez/components"
---

# Geometry tokens

Library spacing and sizing defaults derive from `--var-spacing-base`; ordinary corner defaults derive independently from `--var-radius-base`. Foundation CSS supplies their shared defaults. Text font sizes remain independent of density. Full-circle primitives are independent as well.

```css
.compact {
    --var-spacing-base: 12px;
    --var-radius-base: 4px;
}

.compact .square {
    --var-radius-base: 0px;
}

.fixed-button {
    --var-button-height: 40px;
}
```

Changing spacing affects library padding, margins, gaps, control dimensions, icon geometry, and related offsets. Changing rounding does not change spacing. Explicit consumer values remain authoritative: a `40px` height stays `40px`, even inside a compact scope. Explicit component radii and full-circle primitives are not replaced by a base change.

## Why defaults are fallbacks

An inherited custom property containing `calc()` resolves at the element where it is declared. Defining every derived token on `:root` would freeze its default against the root base, preventing nested density scopes from working.

Component CSS therefore uses an override followed by a local default:

```css
.__button {
    min-block-size: var(--var-button-height, calc(var(--var-spacing-base) * 2.5));
}
```

Do not redeclare every semantic token on every element: that would hide inherited consumer overrides.

Default semantic geometry properties are deliberately absent from root computed custom properties. Read exported library defaults instead of using `getComputedStyle()` to discover defaults:

```ts
import { defaultGeometryBases, defaultGeometryTokens } from "@g4rcez/components";

const spacingBase = defaultGeometryBases.spacing;
const roundingBase = defaultGeometryBases.radius;
const height = defaultGeometryTokens["--var-button-height"];
```

`defaultGeometryTokens` covers CSS geometry, including tokens not present in older component-token schemas. Derived geometry defaults remain use-site fallbacks; sparse serialization does not emit them unless explicitly supplied. Copying a complete default object into a root rule can pin derived values at that root and defeat nested recomputation.

## Theme overrides and migration

The breaking CSS-token release replaces app-wide full-object injection with sparse `configureTheme(config, options?)` overrides and ordinary CSS. Use `--var-radius-base` as the sole rounding base, not the retired radius alias. See [Theme customization](theme-customization.md#breaking-release-migration) for old API, property, provider, and activation migrations.

The configuration's `tokens.spacing` and `tokens.rounding` map to `--var-spacing-base` and `--var-radius-base`. Numeric values mean pixels, including zero; CSS strings preserve explicit units and formulas. For example:

```ts
import { configureTheme } from "@g4rcez/components";

configureTheme({
    name: "default",
    tokens: { spacing: 16, rounding: 0 },
});

configureTheme({
    name: "dense",
    tokens: { spacing: 12 },
});
```

The default scope is `:root`; a named scope is `html.<name>`. Overrides are sparse. The `dense` example changes spacing only; it inherits rounding and all colors through CSS rather than copying a complete theme object. Built-in light and dark colors come from foundation CSS; activate dark with `.dark` on `<html>`. JavaScript registers overrides but does not toggle classes.

Reconfiguring `dense` replaces its previous overrides; `configureTheme({ name: "dense" })` clears them without removing the active class. Built-in dark changes colors, not shared geometry. A deliberate dark spacing override remains possible. Numeric convenience applies only to spacing/rounding: component heights, radii, and all other properties require CSS strings.

For scoped previews, plain wrapper custom properties remain appropriate:

```css
.preview {
    --var-spacing-base: 12px;
    --var-radius-base: 4px;
}
```

An explicit component property inherited from a wrapper wins; absent that property, a nested base change recomputes fallback geometry at the component. `createThemeProperties({ tokens: { spacing: 12, rounding: 4 } })` produces the same sparse wrapper properties without a theme name or defaults. `ComponentsProvider` accepts canonical component keys and can inject wrapper values with `injectComponentTokens`; context alone is not CSS registration.

Wrapper styles reach only DOM descendants and do not theme portals rendered elsewhere; root styles naturally reach body portals. Named theme activation remains root-only, not a nested theme provider or a promise of arbitrary typography/color-base recomputation. For server first paint, owned style IDs, hydration, CSP nonces, and normal cascade precedence, see [Theme customization](theme-customization.md).

## Coverage and exceptions

Density affects geometry that derives from spacing or rounding. Calendar hour rows, event positions, and gutters use density-derived defaults; explicit hour-block sizing remains an override. Popup caps and initial size estimates may derive from density, while measured content sizes remain physical measurements.

Not density-scaled: text font sizes, line heights and letter spacing; full circles; zeros and structural percentages; viewport constraints and breakpoints; border hairlines; shadows; accessibility-only clipping dimensions; animation durations and dimensionless factors. Virtualizer pixel estimates and modal keyboard resize increments are algorithmic inputs, not authored CSS dimensions. Browser layout and animation verification is recommended after changing density.
