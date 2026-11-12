# @g4rcez/components

React components you can restyle without fighting them.

`@g4rcez/components` is a TypeScript design system with about 60 components: forms, tables, calendars, modals, a command palette, and more. It uses plain CSS, stable class names, and CSS variables for every visual decision. You do not need Tailwind, a CSS-in-JS runtime, or a provider to make it look right.

[Documentation and live examples](https://components.garcez.dev/) · [npm](https://www.npmjs.com/package/@g4rcez/components) · [Releases](https://github.com/g4rcez/components/releases)

## Why this library

- **Styling you can predict.** Components emit class names such as `__button` and `__button--theme-primary`. Those names are a public contract and follow semver, so your own CSS keeps working between releases.
- **Theming with variables.** Colors, spacing, radius, and shadows are `--var-*` custom properties. Change `--var-color-primary` and every component follows. Light and dark mode work with one class on `<html>`.
- **Load only the CSS you use.** Every component has its own CSS file, and a small CLI can add the right imports for the components your code uses.
- **Accessible by default.** Keyboard support, focus handling, and ARIA attributes are part of each component, not an add-on.
- **Typed end to end.** Props, form paths, and table columns are checked by TypeScript.
- **Ready for AI agents.** The package ships a skill and per-component reference docs, so coding agents use the real API instead of guessing.

## Install

```bash
npm install @g4rcez/components
# or
pnpm add @g4rcez/components
yarn add @g4rcez/components
```

It needs React 18 or newer. Node.js 20.14 or newer is needed for the CLI and the build tools.

## Quick start

**1. Import the CSS** in your app stylesheet. `foundation.css` comes first. It holds the tokens and the base styles.

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
@import "@g4rcez/components/input.css";
```

Prefer one import? `@g4rcez/components/index.css` bundles the foundation and every component stylesheet.

**2. Use the components.**

```tsx
import { Button, Input } from "@g4rcez/components";

export const App = () => (
    <form>
        <Input placeholder="Your name" />
        <Button theme="primary">Save</Button>
    </form>
);
```

**3. Turn on dark mode** by adding `class="dark"` to `<html>`. The library never changes that class for you.

`ComponentsProvider` is optional. Use it only for behavior such as translations, locale-aware masks, icon defaults, and modal helpers. It is not needed for styling.

### Add only the CSS you use

The package includes a CLI. It scans your source files and keeps a managed block of CSS imports up to date in your stylesheet:

```bash
npx csscomponents --css src/app.css
```

Use `--check` in CI to fail when the stylesheet is out of date, and `--dry-run` to preview the changes. Run `npx csscomponents --help` for all options.

## What is inside

Every component can be imported from the package root or from its own path, for example `@g4rcez/components/button`.

| Group        | Components                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**     | `Button`, `ActionSwap`, `HoldToConfirm`, `Tag`, `Heading`, `Typography`, `Polymorph`, `Slot`, `Resizable`, `RenderOnView`, `RollingText`                                                                                   |
| **Form**     | `Form`, `Input`, `InputField`, `Select`, `MorphSelect`, `MultiSelect`, `Autocomplete`, `Checkbox`, `Radiobox`, `Switch`, `Slider`, `DatePicker`, `FileUpload`, `TaskList`, `DrawingEditor`                             |
| **Display**  | `Alert`, `Card`, `CardStack`, `Calendar`, `PageCalendar`, `Collapse`, `Empty`, `List`, `Masonry`, `Notifications`, `PdfViewer`, `Progress`, `Reactions`, `Skeleton`, `Spinner`, `Stats`, `Step`, `SwipeableList`, `Tabs`, `Timeline`, `VideoPlayer` |
| **Floating** | `Modal`, `Tooltip`, `Dropdown`, `Menu`, `CommandPalette`, `Expand`, `Toolbar`, `Wizard`                                                                                                                                   |
| **Table**    | `Table` with sorting, filtering, grouping, pagination, and virtualized rows                                                                                                                                               |

The library also exports hooks such as `useForm`, `useSwipe`, `usePrevious`, `useReactive`, `useLocale`, and `useTranslations`.

Props, defaults, accessibility notes, tokens, and examples for each component are in [`packages/lib/ai/docs`](packages/lib/ai/docs). Start with the [index](packages/lib/ai/docs/index.md). These files are written from the source code and are the best reference for exact APIs.

## Theming

Foundation CSS defines light colors on `:root` and dark colors on `html.dark`. For a CSS-only setup you need no JavaScript:

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";

:root {
    --var-spacing-base: 16px;
    --var-radius-base: 0px;
}

html.dark {
    --var-color-primary: hsla(201, 49%, 60%, 1);
}
```

The same settings are available from JavaScript:

```ts
import { configureTheme } from "@g4rcez/components";

configureTheme({ name: "default", tokens: { spacing: 16, rounding: 0 } });
configureTheme({
    name: "dark",
    colors: { primary: "hsla(201, 49%, 60%, 1)" },
    components: { button: { rounded: "0.75rem" } },
});
```

How it works:

- `default` targets `:root`. A named theme targets `html.<name>`.
- Only `tokens.spacing` and `tokens.rounding` accept numbers, read as pixels. Every other value is a CSS string.
- Each call replaces the whole override set for that name. Values you leave out are removed.
- Order of priority, lowest to highest: library defaults (`var.tokens`), your configuration (`var.theme`), your unlayered CSS, then inline styles. Layer order wins over specificity, so an unlayered `:root` rule overrides even a configured `html.dark`.
- For server rendering, `createThemeCss(config)` returns the CSS as a string. It supports a CSP nonce. `createThemeProperties(...)` returns sparse inline properties for a wrapper element.

For reset behavior, custom themes, SSR ownership, shadows, and migration examples, read [Theme customization](packages/lib/ai/docs/theme-customization.md) and [Geometry tokens](packages/lib/ai/docs/geometry-tokens.md).

### The public CSS contract

Components expose selectors that follow semver:

```css
.__button {
}
.__button--theme-primary {
}
.__button--size-small {
}
.__button__icon {
}
```

Use `--var-*` tokens for lasting customization and selectors for advanced overrides. Published CSS includes source maps with the original source embedded, so browser developer tools can trace a minified rule back to its source.

### Upgrading to v7

v7 is a breaking release for theming:

- Replace the retired theme registration and full-object serializers with the sparse APIs above.
- Import theme code from the package root or `@g4rcez/components/theme`, not from `/styles` or `/themes`.
- Switch root theme attributes to classes.
- Replace the retired `--var-radius` input with `tokens.rounding` or `--var-radius-base`.
- Remove the unprefixed legacy theme aliases.
- The built-in dark Card shadow now uses the shared transparent `0px 1px 2px 1px` shape. Set `--var-shadow-card` to keep a full custom shadow.
- Notification and Table shadows share one geometry, and only the color changes per theme. Override `--var-shadow-notification` or `--var-shadow-table` in full, or tune `--var-shadow-notification-shape`, `--var-shadow-table-shape`, `--var-color-shadow-notification`, and `--var-color-shadow-table`.

### Why plain CSS

Earlier versions used Tailwind both to write styles and to ship tokens. That tied component styling to each consumer's Tailwind setup, made themes hard to maintain, and filled component code with long utility strings. The current model uses plain CSS, stable selectors, and runtime CSS variables. The Tailwind preset and plugin (`@g4rcez/components/preset.tailwind` and `@g4rcez/components/plugin.tailwind`) are still exported for projects that use them, but new apps should use the CSS files.

## Tools for your project

### Style manifest

A machine-readable list of every component and its CSS dependencies, for CLIs and agents:

```ts
import { componentStyleManifest } from "@g4rcez/components/style-manifest";
```

The same data is available as JSON at `@g4rcez/components/style-manifest.json`.

### Oxlint design-system rules

The package includes an Oxlint plugin that keeps your code on the design system. Register it in `oxlint.config.ts` or `.oxlintrc.json`:

```json
{
    "jsPlugins": ["@g4rcez/components/lint"],
    "rules": {
        "shadcn/no-restyle": "error",
        "shadcn/no-raw-colors": "error"
    }
}
```

Available rules: `no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`, `no-unknown-classes`, and `require-static-classes`.

### AI agents and skills

This repository ships one skill for library users: `g4rcez-components`. It teaches coding agents how to install the library, set up CSS, theme it, and use each component API. It works with Claude Code, Cursor, GitHub Copilot, and other agents that support skills. Pick one of the three ways below.

**1. From GitHub.** Use the [Vercel Skills CLI](https://github.com/vercel-labs/skills). This works in any project, even before you install the library:

```bash
npx skills@latest add g4rcez/components
```

The CLI offers only `g4rcez-components`. The other skills in this repository are for people who work on the library itself, and they are marked `metadata.internal: true` so the CLI hides them. Add `--agent claude-code` to target one agent, or `--global` to install for all your projects. The skill includes the per-component references, so it works without the package in `node_modules`. Run the same command again to update it.

**2. From `node_modules`.** Install the package, then sync the skill it bundles. The version of the skill then matches the version of the library:

```bash
npm install @g4rcez/components
npx skills experimental_sync --yes
```

**3. By hand.** If your agent does not find skills on its own, tell it to read `node_modules/@g4rcez/components/ai/SKILL.md` before it edits UI. The per-component references are in `node_modules/@g4rcez/components/ai/docs`.

## Contributing

This repository is a pnpm monorepo:

- [`packages/lib`](packages/lib) is the published library, `@g4rcez/components`.
- [`packages/docs`](packages/docs) is the documentation site (Next.js).
- [`packages/lint`](packages/lint) is the Oxlint plugin that is bundled into the library.

### Set up

```bash
git clone https://github.com/g4rcez/components.git
cd components
pnpm install
pnpm dev        # docs site
pnpm build      # build the packages
```

### Common commands

| Command                                      | What it does                                 |
| -------------------------------------------- | -------------------------------------------- |
| `pnpm dev`                                   | Start the docs site                          |
| `pnpm build`                                 | Build every package                          |
| `pnpm lint`                                  | Run Oxlint                                   |
| `pnpm format`                                | Format with oxfmt                            |
| `pnpm knip`                                  | Find unused files, exports, and dependencies |
| `pnpm --filter @g4rcez/components test`      | Run the library tests (Vitest)               |
| `pnpm --filter @g4rcez/components typecheck` | Type-check the library and its tests         |

Some tests, `tests/package-types.test.ts` and `tests/css-sourcemaps.test.ts`, read the built `dist` files. Run the library build before them.

### Guidelines

1. Type every component fully.
2. Follow WCAG for accessibility.
3. Add tests for new behavior, and examples to the docs site.
4. Keep the agent skill in step with the code. Edit `skills/g4rcez-components/SKILL.md` and the references in `packages/lib/ai/docs`, then run `pnpm components:skills sync` and `pnpm components:skills check`. Do not edit the copies by hand. They are generated.
5. Follow the patterns already in the code. See [CONTRIBUTING.md](CONTRIBUTING.md), [ARCHITECTURE.md](ARCHITECTURE.md), and [AGENTS.md](AGENTS.md).

Fork the repository, work on a branch, and open a pull request.

### Releases

Every commit on `main`, including a merged pull request, publishes a new patch version of `@g4rcez/components` to npm through GitHub Actions, with provenance. Other packages are not published. For a minor or major release, raise the version in `packages/lib/package.json` in your pull request. The pipeline publishes that version as it is, and the following releases continue from it.

## License

MIT. See [LICENSE](LICENSE).

---

Built by [Allan Garcez](https://garcez.dev).
