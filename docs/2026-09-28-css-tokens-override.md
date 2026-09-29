# CSS token overrides and theme configuration

Date: 2026-09-28  
Status: implementation completed; verification results and remaining limits are in §10.

## 1. Goal and recommended contract

Make customization work through either ordinary CSS or a small typed JavaScript API, using the same public `--var-*` properties. Neither route should require Tailwind, a React provider, or copying the library's complete defaults.

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

Equivalent unlayered application CSS:

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

Decisions:

1. `default` means `:root`, not `html.default` and not a theme attribute. Named themes mean `html.<name>`.
2. Foundation defines shared non-color defaults once. Built-in theme differences contain colors only, including component colors. Consumers may explicitly override **any** token in a named theme.
3. Theme configuration is a **sparse override**, never an implicit full-theme merge. Omitted values are not serialized.
4. Shared values belong in `default`. Named themes do not inherit from one another. A value declared only in `dark` cannot flow backwards into `default` or sideways into another theme; that is not how CSS works.
5. Colors need theme-aware library defaults, but users do not need to repeat a complete palette to override one color. Existing dark colors remain in effect when a dark configuration only changes spacing.
6. Numeric `spacing` and `rounding` values mean pixels, including zero. Correct the example spelling `rouding` to **`rounding`**; do not introduce a misspelled alias.
7. JavaScript registers CSS rules; it does not activate a theme or write inline properties on `<html>`.
8. Normal unlayered application CSS has final precedence over library defaults and JavaScript configuration. No generated `!important` declarations.
9. Preserve reactive use-site geometry fallbacks. Do not redeclare every derived dimension on `:root` or every element.
10. This is a clean public-theme API cutover with migration documentation, not a third parallel theme system. Removing existing public signatures requires a breaking release.

## 2. Investigation: what exists today

Paths below are relative to the repository root; line ranges identify the investigated source snapshot and may move during implementation.

| Surface | Evidence | Consequence |
| --- | --- | --- |
| Shipped defaults | `packages/lib/src/styles/tokens.css:1–255,257–385,387–550` | Two root blocks mix non-colors, global/component colors, aliases and shadows. Dark is currently a delta under `[data-theme="dark"], html.dark`. |
| Geometry contract | `geometry-defaults.ts:5–195,473–477`; `ai/docs/geometry-tokens.md:25–69` | Independent spacing/radius bases already exist. Derived geometry intentionally lives in consuming declarations, not inherited root variables. |
| Modern runtime | `theme-runtime.ts:4–30,1160–1265` | String-tree schema; `createThemeProperties`, `createThemeCss`, `applyTheme`, `registerTheme`; semantic `--var-*` names. No `configureTheme`. |
| Runtime defaults | `theme-runtime.ts:34–1158,1202–1221` | Separately authored light/dark data. Partial serialization still inserts light defaults except selected geometry. |
| Legacy runtime | `design-tokens.ts:16–110`; `theme.types.ts:729–768` | Full legacy object, unprefixed variables, remaps and different selectors. Not a safe serializer for the new API. |
| Legacy defaults | `components.ts`, `common.ts`, `light.ts`, `dark.ts`, `default-tokens.ts` | Additional hand-maintained defaults and historical token names; dark reuses a component object containing light colors. |
| CSS build | `vite.css.config.mts:12–46`; `package.json:657–671` | Bundles existing source CSS; does not generate it from the runtime token objects. Sourcemap and style-manifest scripts are not token generators. |
| Provider | `hooks/use-components-provider.tsx:31–239`; `config/context.ts:13–36` | Separate context merging, optional wrapper injection, legacy name mappings, and dependent size-variant formulas. |
| Public exports | `src/index.ts:13–17`; `styles/tokens.ts:1–14`; `package.json:118–140`; `vite.config.mts:53–60` | Root plus `/theme`, `/tokens`, `/styles`, `/themes` expose overlapping contracts. |
| Tailwind compatibility | `preset.tailwind.ts:18–43,241–354` | Colors already read modern variables. Some utility dimensions still embed legacy formulas rather than read component override variables. |

### Concrete problems to resolve

- `createThemeProperties({ spacing: { base: "20px" } })` currently emits **309 properties**, not one. Of these, 308 come from implicit defaults. Registration of a partial theme can reset unrelated colors or layering.
- `createThemeCss({}, { name: "default" })` produces `[data-theme="default"]`, not `:root`. `name: "dark"` produces an unrestricted attribute selector rather than the requested root class selector.
- Runtime/static drift is real: `--var-layer-tooltip` is `22` in CSS but `20` in runtime defaults. DatePicker selected-preset background is `var(--var-color-primary)` in CSS but a literal light blue in the runtime tree. These should not change merely because an unrelated override is configured.
- Static Card and Table color families are not fully represented in the runtime default component trees. Type generation solely from that tree would miss public CSS tokens.
- The current `TokenTree` permits arbitrary string paths but does not accept numeric primitives. It provides weak spelling guidance and can serialize variables no component consumes.
- `registerTheme` already provides stable style replacement and an SSR string return. Reuse that lifecycle rather than introducing a global theme store.
- `applyTheme` writes inline values and does not remove previous keys. Using it for root theme switching can retain overrides and outrank stylesheet themes. The new API must not use it internally.
- Color/geometry classification cannot be inferred just from token names or `hsla(...)` text. Border widths, border colors, focus rings, opacity and compound shadows need explicit ownership.
- Root-defined aliases resolve where declared. Nested primitive changes do not recompute inherited aliases. Geometry already addresses this; typography and color aliases do not universally do so.

### Active callers and documentation drift

Migrate these actual callers, not just export declarations:

- `packages/docs/src/components/root-layout.tsx`: injects legacy light/dark strings and renders `html.dark`.
- `packages/docs/src/components/toggle-mode.tsx`: toggles `.dark` but also writes `data-g4-theme`, which is not the runtime's `data-theme`.
- `packages/docs/src/app/docs/setup/page.tsx`: edits legacy full themes, creates previews, and exports legacy snippets. Its state shape and downloadable examples need migration.
- `packages/bundled/src/App.tsx`: root-package legacy imports.
- `packages/tailwindcss-v4/src/app/layout.tsx`: legacy `/styles` and `/themes` imports in SSR.
- `packages/lib/src/hooks/use-components-provider.tsx` and `src/config/context.ts`: runtime serializer and old/new component type intersection.
- `packages/lib/preset.tailwind.ts`: legacy metadata, parser and theme dependencies.

The canonical skill `skills/csscomponents/SKILL.md:89–164` teaches legacy generators and raw color-channel stripping while describing modern `--var-*` CSS. The current preset accepts complete CSS colors; that channel-stripping advice is stale. README teaches the newer API instead. Canonical component references live in `packages/lib/ai/docs/`, not `docs/components/`.

Do not delete `design-tokens.ts` wholesale: parsers and low-level token transformations also serve `use-color-parser.ts`, provider configuration, and the Tailwind preset. Retire superseded theme-generation APIs while retaining functions with a distinct, live purpose.

## 3. Ownership, inheritance and colors

### Shared defaults versus theme overrides

The default scope owns spacing, rounding, typography, motion, font weights, border widths, opacity, layers, viewport constraints and component geometry. Dark must not repeat those defaults. A consumer can deliberately create a denser dark theme:

```ts
configureTheme({ name: "default", tokens: { spacing: 16, rounding: 4 } });
configureTheme({ name: "dark", tokens: { spacing: 12 } });
```

Default: 16px spacing / 4px rounding. Dark: 12px / 4px. Removing `.dark` restores 16px / 4px, without running another configuration call.

Root rules and `html.dark` rules match the same element. This is cascade-based fallback on `<html>`, followed by ordinary inheritance to descendants—not object merging at every switch.

### Colors include component colors

`colors` contains global semantic colors. `components` contains each component's public properties, including both colors and non-colors. Internal metadata classifies leaves individually; it must not treat the entire `components` group as shared geometry.

Built-in default and dark palettes must cover the same effective color inventory. Identical colors may be authored once and reused by generated inspection data; different dark values are authored in the dark CSS block. Do not repeat shared geometry to complete a palette.

A partial custom theme inherits the default palette plus its supplied changes. To base a custom theme on the full dark palette, explicitly spread the generated dark **color-only** groups into its configuration. Do not add automatic name-based dark guessing or a runtime `extends`/merge system. Complete built-in palette exports must include Card/Table surfaces and component state colors, not only global colors.

Changing a global color affects consumers of that global token; it does not algorithmically recolor independently authored alert, tag, or component state palettes. Document those independent controls rather than promise automatic palette generation.

### Compound shadows

The current dark card shadow changes geometry as well as color. To satisfy “only colors vary by built-in theme,” split theme-dependent shadow colors from shared shadow shape where needed:

- Preserve existing full-shadow override names, such as `--var-shadow-card`, as explicit consumer controls.
- Put shared shape defaults in use-site fallbacks; add semantic shadow-color inputs only where the color must vary.
- Define shape once and dark color separately. Multi-shadow values need separate color inputs only if their actual colors differ.
- Normalize the built-in dark card shape to the shared default and call out the appearance change. Its current color is transparent, but do not silently preserve theme-dependent geometry.
- Explicit user full-shadow overrides remain authoritative in default or named themes.

Avoid new forwarding-only aliases, deep fallback chains, and `color-mix()` in authored token/component defaults. Keep built-in colors as complete, broadly supported `hsla(...)` values or intentional CSS primitives such as `transparent`.

### Scoped behavior boundary

The new **theme configuration** API is root-only. It is not a nested theme provider, and it does not promise nested typography/color-base recomputation. Local CSS custom-property overrides and the existing reactive spacing/radius geometry contract remain supported.

Root themes naturally reach body portals. Wrapper styles only reach DOM descendants; provider previews must not claim to theme portals rendered elsewhere. Supporting arbitrary nested theme activation or retargeting every portal is outside this task.

## 4. Public API and value rules

### One configuration shape

`configureTheme(config, options?)` accepts:

- `name`: required, `"default"` or a named root class.
- `tokens`: partial known global non-color overrides.
- `colors`: partial known global color overrides.
- `components`: partial known component token overrides.
- `colorScheme`: optional `"light" | "dark" | "normal"` for custom themes' native controls; omitted means no additional declaration. Foundation supplies default/dark schemes.

Use finite generated key unions/mapped types, not an unrestricted recursive index signature. The flattening model is deliberately shallow:

| Configuration path | CSS variable | Accepted value |
| --- | --- | --- |
| `tokens.spacing` | `--var-spacing-base` | finite number in px or CSS string |
| `tokens.rounding` | `--var-radius-base` | finite number in px or CSS string |
| `tokens.fontsize` | `--var-fontsize` | CSS string |
| `tokens["motion-duration-normal"]` | `--var-motion-duration-normal` | CSS string |
| `tokens["layer-tooltip"]` | `--var-layer-tooltip` | CSS string, e.g. `"22"` |
| `colors.primary` | `--var-color-primary` | complete CSS color string |
| `colors["primary-foreground"]` | `--var-color-primary-foreground` | complete CSS color string |
| `components.button.height` | `--var-button-height` | CSS string, e.g. `"40px"` |
| `components.button["big-height"]` | `--var-button-big-height` | CSS string |
| `components.button["secondary-background"]` | `--var-button-secondary-background` | complete CSS color string |
| `components.card["surface-radius"]` | `--var-card-surface-radius` | CSS string |

Keep existing CSS suffix spelling rather than introduce automatic camel-case transformations or ambiguous nested `DEFAULT` leaves. Only spacing/rounding have numeric convenience conversion in this contract. Other properties accept CSS strings so unit semantics stay explicit. Exclude `spacing-base` and `radius-base` as competing object keys; their CSS names remain unchanged and are mapped through the two friendly primitive names.

Include every supported public token in the mapping, including tokens present only in CSS or geometry fallbacks. Assign pseudo-component families such as typography consistently with existing consumers, using explicit ownership metadata. Do not derive component ownership by splitting at the first hyphen (`date-picker`, `free-text`, etc.).

`undefined` means omitted. Preserve explicit `0`, `"0px"`, literal sizes, and explicit formulas—even when equal to a library default. Reject unsupported keys rather than silently emitting dead variables. Plain CSS remains the escape hatch for application-owned properties; no arbitrary CSS-key bag is needed in the configuration API.

### Serialization and registration

Keep a pure `createThemeCss(config)` companion for SSR/static generation and `createThemeProperties(overrides)` for scoped inline objects. Migrate their old signatures; do not overload them to preserve the old theme schema. Both use the same mapping/normalization, and property generation emits only supplied values.

`configureTheme(config, { document?, nonce? })`:

1. Validates and normalizes the entire config before mutating DOM.
2. Serializes exactly the supplied overrides in the configuration cascade layer.
3. Creates or replaces one library-owned `<style>` per theme in the selected document, in place.
4. Returns the CSS string in both browser and server environments.
5. Without a document, performs no registration and returns the string. It never retains request-specific server state.
6. Does not add/remove classes, choose system color mode, or persist preferences.

Calling it twice for the same name **replaces that name's entire override set**. Omitting a previously supplied property removes it from that style, exposing shared/built-in CSS again. It is not an incremental deep merge. `configureTheme({ name: "dark" })` clears the managed dark override declarations while leaving built-in dark CSS intact. Updating one theme must not touch other themes.

Use deterministic owned IDs and ownership attributes, with a documented SSR style-ID recipe. Hydration updates the matching server style instead of adding a second node. Detect a conflicting non-owned element rather than overwrite arbitrary page content. Keep registration position stable so repeated updates do not change cascade order.

For CSP, accept a nonce on the style element; changing tokens must not strip it. For server rendering, use the pure helper, place its output in `<head>` with the same deterministic ID and nonce, and activate the desired root class in server HTML before paint. The helper alone does not inject CSS into an SSR response.

### Names and serializer boundaries

Reserve `default`; validate named themes as one safe class identifier (recommended documented grammar: `[a-z][a-z0-9_-]*`). Reject empty names, whitespace, selectors and markup rather than interpolating them as selectors. The app must have at most one configured named-theme class active; utilities such as `scroll-smooth` are unaffected. Theme activation/removal remains application-owned.

Values are developer-authored CSS, not a sanitizer for untrusted user styling. Nevertheless, the string emitter must not allow a value to break out into a second declaration, rule, or closing style element. Use the existing PostCSS dependency to validate declaration boundaries during development/generation or an equivalent focused serializer check; preserve legitimate `var()`, `calc()`, quoted font names and CSS functions. Reject nonfinite numeric primitives and unsupported value shapes before updating an existing style. Do not call browser-only `CSS.supports()` on the server or build a general CSS-value parser.

## 5. Cascade: CSS and JavaScript cooperate

Use an explicit token-layer order:

```css
@layer var.tokens, var.theme, var.base, var.components, var.utilities;

@layer var.tokens {
    :root { /* shared defaults and default colors */ }
    html.dark { /* built-in dark colors only */ }
}

@layer var.theme {
    :root { /* configured default overrides */ }
    html.dark { /* configured dark overrides */ }
}
```

Only move token declarations into their default layer; do not move all component rules into layers as an unrelated styling rewrite. Preserve the existing component selector specificity contract. Layer declarations must establish the same order in foundation and standalone serialized output, including when configuration appears first in `<head>`.

Precedence for normal declarations on the same root element:

1. Library token defaults (`var.tokens`).
2. JavaScript-configured overrides (`var.theme`).
3. Unlayered application CSS.
4. Consumer inline styles, if deliberately used outside this API.

Within a layer, `html.dark` is more specific than `:root`; a dark-specific override wins over a shared override regardless of configuration call order. A configured default color overrides the library's built-in dark value because configuration is a later layer; to use a different configured dark color, supply it explicitly. This is also what an unlayered `:root` color override does against layered defaults. Document it plainly.

An unlayered `:root` token override also beats a configured `html.dark` override: **layer priority precedes specificity**. To make a CSS value dark-only, place it under `html.dark`. An application that deliberately participates in named layers owns its own layer ordering. Normal `!important` rules follow CSS's reversed important-layer ordering; the library does not generate them.

Avoid registration via root `style.setProperty()`, constructable sheets with a different cascade contract, selector weight escalation, or timing-dependent style appending. A runtime update must not unexpectedly defeat already-authored plain CSS.

Move root theme activation to classes throughout the repository. Remove the root theme `[data-theme="dark"]` compatibility selector when shipping the cutover. Keep unrelated component `data-theme` variant attributes on Alert/Tag; they are not theme activation and must never be matched by `configureTheme`.

## 6. Single source of defaults without freezing geometry

Recommended ownership:

- `tokens.css`: canonical authored primitive, shared non-color and color defaults.
- `geometry-defaults.ts`: canonical inspectable use-site geometry formulas, retaining the established geometry model.
- A new small token metadata source: public object path, CSS name, category and owner; **no duplicated default values**.
- Generated TypeScript projections: finite public config types/mapping and inspectable default/color palettes, derived from the above.

Add a focused generator/check command using PostCSS, already a library dev dependency. It must distinguish the shared/default/dark source sections structurally, resolve effective dark color defaults from default colors plus authored dark color deltas, and never fill dark non-colors from a light object.

The registry must cover canonical variables used by shipped components and supported compatibility utilities. Unknown/unclassified tokens fail generation with the specific property and consumer; they must not disappear silently. Metadata must distinguish colors from color-containing composites, and supported overrides from private implementation properties.

Replace the large duplicated literal default trees in `theme-runtime.ts` with generated projections. Derive legacy build-only tables from canonical values while migrating their remaining consumers; do not introduce a new hand-maintained copy. Keep `defaultGeometryTokens`/`defaultGeometryBases` as inspection exports. Migrate `defaultLightThemeTokens` and `defaultDarkThemeTokens` to the new grouping: shared values belong in the default inspection object; the dark projection contains effective color groups, not shared geometry. Document that explicitly supplying a complete defaults object pins those values and is usually unnecessary.

Do not emit derived geometry defaults as part of normal serialization or static root declarations. Keep patterns such as:

```css
.__button--size-default {
    min-block-size: var(--var-button-height, calc(var(--var-spacing-base) * 2.5));
}
```

An inherited explicit `--var-button-height: 40px` wins everywhere below that declaration. With no explicit height, a nested `--var-spacing-base` change recomputes the default at the button. These are different behaviors and both are required.

Use current shipped CSS as the baseline when reconciling accidental runtime drift (tooltip layer, DatePicker selected colors, Card/Table coverage), not stale legacy literal defaults. Do not perform a visual redesign. Legacy `--var-radius` and unprefixed compatibility paths that are superseded by this cutover must have all consumers migrated and their fallback aliases removed; do not keep a second rounding input that can silently defeat `rounding: 0`.

## 7. Implementation phases and file targets

### Phase A — Inventory and canonical projection

- Inventory declarations plus consuming `var()` references across `src/styles`, component CSS and `preset.tailwind.ts`.
- Classify global/component colors, shared non-colors, geometry fallbacks and mixed shadows. Produce the metadata mapping, not a second defaults file.
- Reconcile the documented default discrepancies using shipped CSS as baseline.
- Generate complete effective default/dark color projections and strict config keys; keep shared defaults separate.
- Wire generation before JS/types/preset/CSS build consumers and provide a non-writing drift check. Keep `vite.css.config.mts` a bundler and sourcemap generation separate.

Acceptance: every public override maps to a consumed canonical CSS name; no metadata/default duplication or accidental theme-specific geometry.

### Phase B — CSS ownership and override precedence

- Restructure `src/styles/tokens.css` and theme selectors in `base.css`; introduce `var.theme` in token-layer ordering.
- Split theme-varying shadow colors and shared shapes in actual consuming CSS.
- Preserve use-site geometry fallbacks, explicit component values and full-circle exceptions.
- Remove superseded radius/token fallback aliases only after updating their consumers, including Stats and DatePicker's cross-component paths. Preserve intentional DatePicker-to-Card behavior using canonical names where it is still a live contract.
- Ensure foundation-first/per-component imports and `index.css` produce the same token behavior.

Acceptance: plain CSS works without any JavaScript, dark switches only built-in colors, and both root and nested geometry continue to work.

### Phase C — Unified runtime API

- Implement the config types/mapping, sparse normalization, pure CSS/property generation and `configureTheme` lifecycle in `src/styles/theme-runtime.ts` with small supporting modules only where needed.
- Replace rather than alias `registerTheme`; retire `applyTheme` as an app-wide theme API. Use sparse `createThemeProperties` for intentional local inline styling.
- Remove the old `mergeThemeTokens`/`options.base` path from the public theme setup contract. Native CSS inheritance replaces implicit object-default merging.
- Migrate/remove obsolete theme serializers (`createTheme`, `createTokenStyles`, `createCssProperties`, theme-specific `createStyles`) after references are migrated. Preserve parser/transformation utilities still used by color parsing or build integrations; do not retain deprecated theme wrappers.
- Update `src/index.ts`, `styles/tokens.ts`, package entry points, Vite entries and declaration builds together. Keep `/theme` for framework-independent server/client access. Remove superseded `/styles`/`/themes` theme entry points once their callers are migrated; do not leave compatibility re-exports.
- Before changing exported symbols, run language-server references and use that inventory to verify the migration boundary.

Acceptance: root and `/theme` imports work, default emits `:root`, named emits `html.<name>`, zero survives, repeated configuration replaces, SSR is pure, and errors do not corrupt prior registration.

### Phase D — Provider, preset and application migration

- Move provider token typing/injection to canonical component keys and the sparse property serializer. Remove obsolete key-alias conversion after migrating consumers.
- Preserve provider context-only versus opt-in injection behavior. Preserve existing dependent size-variant behavior where promised, using canonical names; an explicit related variant, zero, or literal size must still win. Do not make `configureTheme` require a provider.
- Update Tailwind compatibility utility mappings to read the same canonical component variables and use-site defaults. A component override must affect its equivalent semantic utility, rather than an embedded old formula.
- Retain unrelated `parsers` and color parser behavior with actual callers. Remove stale full-theme dependencies once the preset consumes the canonical registry.
- Migrate docs root, toggle, setup editor/snippet downloads, bundled fixture and Tailwind-v4 SSR layout. Remove raw-channel remaps from modern theming examples.
- Setup UX: edit shared tokens once; provide per-theme color editing and optional non-color overrides; resetting a theme override must restore inheritance instead of copying a default value. Preview and exported JS/CSS must agree.
- Server output sets the correct initial root class. Switchers remove the previously active theme class, preserve unrelated classes, and use no redundant theme data attribute.

Acceptance: actual docs customization changes rendered components; exported snippets reproduce the preview; toggles change colors without resetting shared geometry; provider and Tailwind paths have no competing token namespace.

### Phase E — Documentation and release migration

- Update `README.md`, `skills/csscomponents/SKILL.md`, and canonical references in `packages/lib/ai/docs/`, including `geometry-tokens.md`, the catalog/index for export changes, and affected component token tables.
- Add canonical theme-customization guidance under `packages/lib/ai/docs/`: CSS-only setup, JS configuration, sparse inheritance, precedence, numeric units, custom themes, replacement/reset, SSR/CSP, provider/portal boundary and migration examples.
- Document old-to-new object paths and import/selector changes, not only helper-name replacements. State `rounding → --var-radius-base`, not legacy `--var-radius`.
- Include the shared shadow-shape normalization and any removed legacy radius behavior in release notes.
- Preserve the legacy **skill-name** alias required by repository tooling; that is separate from removing obsolete runtime API aliases.
- Run skill sync/check from canonical sources. Never edit derived skill copies directly or recreate `docs/components/`.
- Release as a breaking theme-contract change. Do not publish removed signatures under an additive patch release.

## 8. Acceptance and verification matrix

| Scenario | Required observable result |
| --- | --- |
| CSS-only default | Foundation plus Button/Card/Input CSS works with no provider or theme JS. |
| JS/CSS equivalence | Identical inputs yield equal computed colors, spacing and ordinary radii under `:root` and `html.dark`. |
| Shared geometry | Default spacing/rounding persist through default → dark → custom → default unless a named theme explicitly overrides them. |
| Direction of inheritance | A dark-only value does not affect default; a custom theme does not inherit from dark merely because dark was previously active. |
| Sparse dark override | Changing only dark spacing does not reset dark colors, tooltip layer or DatePicker colors to runtime light values. |
| Numeric zero | `spacing: 16`, `rounding: 0` serialize to `16px`, `0px`; explicitly squared ordinary surfaces remain square. |
| Circle exceptions | Circle buttons, full-round primitives and intended circular thumbnails stay circular under zero rounding. |
| Nested density | Nested spacing/radius bases recompute fallback geometry; explicit inherited component sizes still win. |
| Explicit defaults | A supplied formula/literal equal to a default is preserved, not mistaken for an implicit value. |
| Per-component control | Default and dark component geometry/colors can be overridden independently; unrelated tokens do not change. |
| Palette coverage | Default/dark/custom palette projections cover Card/Table and component states, including DatePicker/Stats aliases at root. |
| Mixed CSS/JS | Unlayered CSS wins whether loaded before or after configuration; later runtime replacement cannot defeat it. |
| Call-order independence | Registering default after dark does not defeat a supplied dark override in the same layer. |
| Replacement/reset | Reconfiguration removes omitted keys, preserves other themes, keeps one owned style, and clears cleanly with an empty config. |
| DOM ownership/errors | Invalid names/values or a conflicting non-owned node leave previously registered CSS intact. |
| SSR/hydration/CSP | No document access at import/pure render; correct initial class/colors; stable style reuse and nonce; no cross-request state. |
| Activation boundary | Configuration changes no classes. Named root rules never match component `data-theme` attributes. Root themes reach body portals. |
| Provider | Context-only mode stays injection-free; injection honors explicit variants/zero and the documented descendant scope. |
| Tailwind | Equivalent semantic utilities consume the same overridden variables as components, including opacity colors. |
| Docs UX | Editing shared tokens updates all non-overridden themes; exported config/CSS matches preview; reset restores inheritance. |
| Build/package | Root and `/theme` JS/types plus foundation/index/per-component CSS agree; removed entry points have no in-repo consumers. |

### Verification tools and commands during implementation

Use existing suites, updating genuine behavioral contracts. Delete obsolete wording/source-copy assertions instead of re-pinning the new spelling. New permanent tests should cover observable precedence, replacement, units, invalid input boundaries and inheritance—not merely generated source text.

Focused existing suites:

```sh
pnpm --filter @g4rcez/components test tests/theme-runtime.test.ts tests/components-provider.test.tsx tests/geometry-tokens.test.ts tests/tailwind-preset.test.ts
pnpm --filter @g4rcez/components test tests/skills-sync.test.ts
```

Review affected `tests/styles/design-tokens.test.ts`, `component-css-cascade.test.ts` and `component-css-token-colors.test.ts`: obsolete legacy-generator tests may be removed with their APIs; source-text assertions do not prove cascade behavior. Do not treat the synthetic geometry resolver or JSDOM as browser layout evidence.

After implementation, obtain build approval because CSS contracts/dependencies change, then run:

```sh
pnpm --filter @g4rcez/components build
pnpm components:skills sync
pnpm components:skills check
```

Run a real-browser smoke against source and approved built CSS. Exercise Button, Card, Input/FreeText, Alert, DatePicker, Stats and a portaled overlay; verify custom theme switching and the setup editor. Compare computed dimensions/colors and inspect rendered surfaces. Disable transitions in measurement fixtures or await their completion before sampling colors. Cover both aggregate CSS and foundation plus selected chunks. Check server first paint and browser hydration through the actual docs/Tailwind-v4 flows, not only serializer tests.

No implementation is complete while migrated callers still emit legacy variables, generated defaults disagree with shipped CSS, or the API only compiles without changing rendered components.

## 9. Initial investigation record

These notes preserve the baseline evidence gathered before implementation. Subsequent changes and verification are recorded in §10.

### Executed source runtime probe (Bun)

Imported `src/styles/theme-runtime.ts` directly and observed:

- Partial `{ spacing: { base: "20px" } }` emits 309 properties.
- Implicit primary remains light `hsla(201, 49%, 36%)` and implicit card shadow is emitted.
- Implicit derived Button height is absent, preserving the existing geometry fallback design.
- Named dark selector is `[data-theme="dark"]`; named default selector is `[data-theme="default"]`.
- Existing `{ base: {} }` produces sparse CSS as an explicit escape hatch.
- `registerTheme` without a document returns a string.

Compared current root CSS declarations with runtime defaults. Confirmed the material DatePicker and tooltip-layer differences above. One additional raw-string difference was only multiline `calc()` formatting and was not classified as a behavioral defect.

### Executed Chromium probes

Loaded actual source `tokens.css` and `button.css` into an isolated browser document:

- With root spacing 20px and rounding 0px, Button computed minimum height was 50px, inline padding 20px and radius 0px.
- Nested spacing 8px produced minimum height 20px and padding 8px.
- Root explicit Button height 44px applied to both root and nested Buttons.
- After disabling transitions for measurement, `.dark` changed primary Button background from `rgb(47, 105, 137)` to `rgb(80, 155, 195)` while preserving 50px minimum height and 0px radius. An earlier immediate sample caught the transition start; it is not evidence of a dark-color defect.
- A separate proposed-cascade fixture verified that an unlayered `html.dark` value of 28px stayed 28px after appending a 32px declaration in `var.theme`.

These original probes validate the baseline geometry and proposed layer mechanism only; implementation-specific verification and limits are recorded in §10.

### Sources reviewed but not changed during initial investigation

At this stage, source, exports, README, canonical skill, and canonical references had not yet been changed. In particular, `packages/lib/ai/docs/geometry-tokens.md` informed this plan and was updated during implementation.

Build, suites, lint, formatting, and skill synchronization/check were not run during the investigation. Executed implementation verification is recorded in §10.

## 10. Implementation and verification result

Phases A–E are implemented: canonical token registry and projections, layered CSS ownership and geometry fallback migration, sparse runtime configuration/SSR registration, package and caller migrations, setup editor behavior, and canonical documentation/release guidance. The breaking change is represented by package version `7.0.0`; publishing was not performed.

### Automated verification

- Focused runtime, provider, geometry, and Tailwind suites passed: 44/44 tests.
- After adding the provider-free `Input` fallback regression coverage, the focused provider suite passed: 9/9 tests.
- The skills-sync suite passed: 14/14 tests after canonical documentation sync.
- Token-registry check, `pnpm components:skills sync`, and `pnpm components:skills check` passed.
- `pnpm --filter @g4rcez/components build` passed after the latest source change. One build run emitted PNPM missing-bin warnings but completed successfully.
- Lint, formatting, and a production Next.js docs build were not run. The legacy test paths named in the investigation were absent; current style-contract/component-style tests were reviewed instead.

### Browser verification

- Source docs were exercised in isolated Chromium using foundation plus selected component CSS. The setup editor's shared spacing/rounding and dark-only spacing edits changed the preview as expected; reset restored inheritance, toggles preserved unrelated root classes, and generated JS/CSS matched the preview. Button, Card, Input/FreeText, Alert, DatePicker, and Stats surfaces were inspected. The source DatePicker overlay rendered under `body` and followed root dark/light colors.
- The approved built fixture imported package JS and `dist/css/index.css` with no provider or theme configuration. Button remained 40px high, Card radius remained 4px, and Input remained 40px high with a 6px radius while switching `.dark`; dark/light colors changed as expected. This exercises aggregate built CSS, while the docs flow exercises foundation plus selected chunks.
- Tailwind v4 was checked through its actual Next.js app. With JavaScript disabled, the server response already had `html.dark`, the expected dark primary token, and a 40px/6px-radius Input, without a theme data attribute or injected provider node. After hydration the same values remained; the page returned 200 with no console warnings/errors.
- A DatePicker docs-route `useId` mismatch warning appeared once during earlier development-server exploration. A later direct navigation and hard reload both returned 200 without warnings/errors; the issue was not reproducible and no source change was made for it.

These browser checks used Chromium and local development servers, not a production Next.js server or a cross-browser matrix. No separately enforced browser CSP policy or package publish was exercised.
