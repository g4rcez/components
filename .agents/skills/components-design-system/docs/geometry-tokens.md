---
title: Geometry tokens
description: Independent spacing and corner-radius bases, scoped defaults, and explicit overrides.
package: "@g4rcez/components"
---

# Geometry tokens

Library spacing and sizing defaults derive from `--var-spacing-base` (default `1rem`). Ordinary corner defaults derive independently from `--var-radius-base` (default `1rem`). Text font sizes remain independent of density. The legacy `--var-button-icon-font-size` token controls icon geometry and therefore scales with spacing, including for text glyphs used as icons.

```css
.compact {
    --var-spacing-base: 0.75rem;
    --var-radius-base: 0.5rem;
}
.compact .square {
    --var-radius-base: 0px;
}
.fixed-button {
    --var-button-height: 40px;
    --var-button-rounded: 0px;
}
```

Changing the spacing base changes library padding, margins, gaps, control dimensions, icon geometry, and related offsets. Changing the radius base does not change spacing. Explicit consumer values remain authoritative: a `40px` height stays `40px`, even inside a compact scope. Explicit component radii and full-circle primitives are not replaced by a base change.

## Why defaults are fallbacks

An inherited custom property containing `calc()` resolves at the element where it is declared. Defining every derived token on `:root` would freeze its default against the root base, preventing nested density scopes from working.

Component CSS therefore uses an override followed by a local default:

```css
.__button {
    min-block-size: var(--var-button-height, calc(var(--var-spacing-base) * 2.5));
}
```

Do not redeclare every semantic token on every element: that would hide inherited consumer overrides. Existing legacy override paths, such as Stats variables and DatePicker's card-radius fallback, remain supported.

Default semantic geometry properties are deliberately absent from root computed custom properties. Read exported library defaults instead of using `getComputedStyle()` to discover defaults:

```ts
import { defaultGeometryBases, defaultGeometryTokens, defaultLightThemeTokens } from "@g4rcez/components";

const spacingBase = defaultGeometryBases.spacing; // "1rem"
const radiusBase = defaultGeometryBases.radius; // "1rem"
const height = defaultGeometryTokens["--var-button-height"];
// "calc(var(--var-spacing-base) * 2.5)"
```

`defaultGeometryTokens` covers CSS geometry, including tokens not present in the older component-token schema. `defaultLightThemeTokens` and the legacy theme component defaults retain inspectable formulas. `tokens.css` supplies primitives, colors, typography, motion, and other non-density tokens.

## Theme generation and overrides

- `createThemeProperties()`, `createThemeCss()`, `applyTheme()`, and `registerTheme()` omit implicit derived geometry and the implicit spacing primitive. Foundation CSS supplies the bases; CSS fallbacks supply geometry.
- Explicit theme or `options.base` entries are emitted unchanged, even if equal to an exported default. For example, `spacing: { base: "0.75rem" }` sets the spacing base; `components: { "radius-base": "0.5rem" }` sets the radius base.
- Passing an entire default theme object explicitly emits its formulas. Like any explicitly supplied CSS variable formula, it resolves at that theme scope. Prefer partial overrides when nested base-only scopes should remain reactive.
- Legacy `createTokenStyles()` and `createCssProperties()` preserve supplied values and `TokenRemap` behavior. They do not infer whether copied values were consumer-authored. Their default component formulas now use the spacing/radius bases; remap only the names you intend to override.
- `ComponentsProvider` merges supplied component tokens into context independently of CSS injection. With `injectComponentTokens`, explicit values are injected unchanged. Unspecified related variants use base-derived deltas: overriding button height to `40px` yields a big-height formula adding half the spacing base, unless big height was explicitly supplied.
- The Tailwind compatibility preset supplies the same geometry fallbacks for semantic token utilities.

## Radius migration

`--var-radius` is no longer a library-defined base. It remains an explicit legacy compatibility input: multiplier-based corners use it when present, and formerly offset-based corners retain their offset relationship using the radius base instead of spacing. Explicit zero values are not filtered out.

Previously, the library set `--var-radius: 0`, making many corners square by default. The independent nonzero radius base activates their existing coefficients. This affects Button, Calendar headers, Input/FreeText controls, Checkbox, Tag, List detail cards, Modal, Notifications, Progress, PageCalendar badges/view controls/event pills, Table, and Skeleton; Alert also receives a positive default. Card, dropdown/menu/tooltip/command surfaces, and other formerly spacing-derived corners retain their default positive size where possible.

To square all ordinary library-default corners, set `--var-radius-base: 0px` and leave legacy/component radius overrides unset. Circles (`50%` / `--var-rounded-full`), explicitly squared variants, and explicit consumer overrides remain intentional exceptions.

## Coverage and exceptions

All 46 component CSS chunks were audited; 36 needed geometry fallback changes. The remaining chunks contain no density-driven geometry requiring conversion. Day/week calendar hour rows, event positions, and gutters use density-derived defaults; `--var-page-calendar-hour-block-size` overrides their shared hour height. Autocomplete and MultiSelect popup caps and initial size estimates derive from density, while measured content sizes remain physical measurements.

Not density-scaled: text font sizes, line heights and letter spacing; full circles; zeros and structural percentages; viewport constraints and breakpoints; border hairlines; shadows; accessibility-only clipping dimensions; animation durations and dimensionless factors. Virtualizer pixel estimates and modal keyboard resize increments are algorithmic inputs, not authored CSS dimensions. Browser layout and animation verification is still recommended after changing density; source-contract tests do not replace it.
