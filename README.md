# @g4rcez/components

A comprehensive React component library built with TypeScript, plain CSS, semantic design tokens, and modern web technologies. This library provides customizable, accessible, and performant UI components for building modern web applications.

## AI Agents + Skills

This package includes the `csscomponents` agent skill. It gives AI coding
agents guidance for installation, CSS setup, theming, design tokens, and the
component API.

### Install from GitHub

Use the [Vercel Skills CLI](https://github.com/vercel-labs/skills) to install
the skill in your agent's skill directory:

```bash
npx skills add g4rcez/components --skill csscomponents
```

The CLI supports Claude Code, Cursor, GitHub Copilot, and other compatible
agents.

### Install from `node_modules`

Install the package, then sync its bundled skill:

```bash
npm install @g4rcez/components
npx skills experimental_sync --yes
```

`experimental_sync` discovers the package's root `SKILL.md` and installs it
for detected agents. Add `--agent claude-code` to target a specific agent.

### Manual fallback

Agents that do not discover package skills automatically should read
`@g4rcez/components/ai/SKILL.md` before writing or modifying UI in a project
that uses this package.

## 📋 Table of Contents

- [AI Agents + Skills](#ai-agents--skills)
- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Component Categories](#component-categories)
- [Theming & Customization](#theming--customization)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

This is a monorepo containing:

- **`packages/lib/`** - The main component library (`@g4rcez/components`)
- **`packages/docs/`** - Documentation and examples site built with Next.js

### Key Features

- 🎨 **Fully Customizable** - Theme system with light/dark mode support
- ♿ **Accessible** - Built with accessibility best practices
- 🔧 **TypeScript First** - Complete type safety and IntelliSense support
- 🎯 **Tree Shakeable** - Import only what you need
- 📱 **Responsive** - Mobile-first design approach
- 🚀 **Modern Stack** - React 19, TypeScript, plain CSS, and optional Tailwind compatibility

## 🏗️ Architecture

### Project Structure

```
packages/
├── lib/                          # Main component library
│   ├── src/
│   │   ├── components/           # All UI components
│   │   │   ├── core/            # Basic components (Button, Tag, etc.)
│   │   │   ├── form/            # Form components (Input, Select, etc.)
│   │   │   ├── display/         # Display components (Alert, Card, etc.)
│   │   │   ├── floating/        # Floating components (Modal, Tooltip, etc.)
│   │   │   └── table/           # Table components and utilities
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── styles/              # Theme system and design tokens
│   │   └── config/              # Configuration and context
│   └── dist/                    # Built library files
└── docs/                        # Documentation site
    ├── src/app/docs/            # Component documentation pages
    └── src/components/examples/ # Live component examples
```

### Component Organization

Components are organized into logical categories:

- **Core**: Basic building blocks (`Button`, `Tag`, `Polymorph`)
- **Form**: Input and form-related components (`Input`, `Select`, `Checkbox`, etc.)
- **Display**: Information display components (`Alert`, `Card`, `Timeline`, etc.)
- **Floating**: Overlay components (`Modal`, `Tooltip`, `Dropdown`, etc.)
- **Table**: Data table components with advanced features

## 📦 Installation

```bash
npm install @g4rcez/components
# or
yarn add @g4rcez/components
# or
pnpm add @g4rcez/components
```

### CSS Import

The v6 styling model is plain CSS first. Import CSS from an app stylesheet, not from component JS modules.

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
```

`foundation.css` is required before component CSS. For convenience, `@g4rcez/components/index.css` bundles the foundation plus every public component stylesheet.

Migration status: every public component now has a stable CSS chunk, style contract sidecar, and manifest entry. Button is fully ported to handwritten v6 CSS; other components keep their generated CSS chunks and legacy utility class names until their visual rules are hand-ported.

### Auto-import used component CSS

Run the packaged CLI to scan your source files and keep a managed CSS import block in your app stylesheet:

```bash
pnpm exec g4rcez-components styles --css src/app.css
```

Use `--check` in CI to fail when the stylesheet is out of date.

### Oxlint design-system rules

The design-system rules are published with `@g4rcez/components`. Install the
library as a development dependency:

```bash
npm install --save-dev @g4rcez/components
# or
pnpm add --save-dev @g4rcez/components
```

Register the bundled plugin in `oxlint.config.ts` or `.oxlintrc.json`:

```json
{
    "jsPlugins": ["@g4rcez/components/lint"],
    "rules": {
        "shadcn/no-restyle": "error",
        "shadcn/no-raw-colors": "error"
    }
}
```

Available rules include `no-restyle`, `no-raw-colors`, `no-arbitrary-values`,
`no-inline-styles`, `no-unknown-classes`, and `require-static-classes`.

## 🚀 Quick Start

### Basic Usage

```tsx
import { Button, Input, Modal } from "@g4rcez/components";

function App() {
    return (
        <div>
            <Button theme="primary">Click me</Button>
            <Input placeholder="Enter text..." />
        </div>
    );
}
```

### With Provider (Optional)

`ComponentsProvider` configures behavior such as translations, locale-aware masks, icon defaults, and modal helpers. It is not required for styling.

```tsx
import { ComponentsProvider } from "@g4rcez/components";

function App() {
    return (
        <ComponentsProvider>
            <YourApp />
        </ComponentsProvider>
    );
}
```

## 🧩 Component Categories

### Core Components

| Component   | Description                       | Import                                               |
| ----------- | --------------------------------- | ---------------------------------------------------- |
| `Button`    | Customizable button with variants | `import { Button } from "@g4rcez/components/button"` |
| `Tag`       | Label/badge component             | `import { Tag } from "@g4rcez/components/tag"`       |
| `Polymorph` | Polymorphic component base        | `import { Polymorph } from "@g4rcez/components"`     |

### Form Components

| Component      | Description                        | Import                                                           |
| -------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `Input`        | Text input with mask support       | `import { Input } from "@g4rcez/components/input"`               |
| `Select`       | Native select with styling         | `import { Select } from "@g4rcez/components/select"`             |
| `Autocomplete` | Searchable select with floating UI | `import { Autocomplete } from "@g4rcez/components/autocomplete"` |
| `Checkbox`     | Checkbox input                     | `import { Checkbox } from "@g4rcez/components/checkbox"`         |
| `Switch`       | Toggle switch                      | `import { Switch } from "@g4rcez/components/switch"`             |
| `DatePicker`   | Date selection component           | `import { DatePicker } from "@g4rcez/components/date-picker"`    |
| `FileUpload`   | File upload with drag & drop       | `import { FileUpload } from "@g4rcez/components/file-upload"`    |
| `Form`         | Minimal form wrapper               | `import { Form } from "@g4rcez/components/form"`                 |

### Display Components

| Component       | Description                 | Import                                                              |
| --------------- | --------------------------- | ------------------------------------------------------------------- |
| `Alert`         | Alert/notification messages | `import { Alert } from "@g4rcez/components/alert"`                  |
| `Card`          | Content container           | `import { Card } from "@g4rcez/components/card"`                    |
| `Calendar`      | Calendar display            | `import { Calendar } from "@g4rcez/components/calendar"`            |
| `Timeline`      | Vertical event timeline     | `import { Timeline } from "@g4rcez/components/timeline"`            |
| `Tabs`          | Tab navigation              | `import { Tabs } from "@g4rcez/components/tabs"`                    |
| `Stats`         | Statistics display          | `import { Stats } from "@g4rcez/components/stats"`                  |
| `Masonry`       | Measured masonry layout     | `import { Masonry } from "@g4rcez/components/masonry"`              |
| `SwipeableList` | Swipeable virtualized list  | `import { SwipeableList } from "@g4rcez/components/swipeable-list"` |

### Floating Components

| Component  | Description   | Import                                                   |
| ---------- | ------------- | -------------------------------------------------------- |
| `Modal`    | Modal dialog  | `import { Modal } from "@g4rcez/components/modal"`       |
| `Tooltip`  | Hover tooltip | `import { Tooltip } from "@g4rcez/components/tooltip"`   |
| `Dropdown` | Dropdown menu | `import { Dropdown } from "@g4rcez/components/dropdown"` |
| `Menu`     | Context menu  | `import { Menu } from "@g4rcez/components/menu"`         |

### Table Components

| Component | Description         | Import                                             |
| --------- | ------------------- | -------------------------------------------------- |
| `Table`   | Advanced data table | `import { Table } from "@g4rcez/components/table"` |

For the complete, source-aligned component props and examples, see [`packages/lib/ai/docs/index.md`](packages/lib/ai/docs/index.md) and the per-component references in [`packages/lib/ai/docs`](packages/lib/ai/docs).

## 🎨 Theming & Customization

### Theme System

Foundation CSS supplies light colors on `:root` and dark colors on `html.dark`. The application activates dark mode with `<html class="dark">`; configuring a theme never changes classes. CSS-only setup needs no JavaScript or provider:

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

The equivalent sparse JavaScript API uses the same canonical properties:

```ts
import { configureTheme } from "@g4rcez/components";

configureTheme({ name: "default", tokens: { spacing: 16, rounding: 0 } });
configureTheme({
    name: "dark",
    colors: { primary: "hsla(201, 49%, 60%, 1)" },
    components: { button: { rounded: "0.75rem" } },
});
```

`default` targets `:root`; named themes target `html.<name>`. Only `tokens.spacing` and `tokens.rounding` accept numbers, interpreted as pixels (including zero). Other values are CSS strings, and colors retain their full CSS syntax.

Each call replaces that name's entire override set: omitted previous values are removed. `configureTheme({ name: "dark" })` clears managed dark overrides without removing built-in dark colors or changing activation. Default configuration can supply shared geometry while dark overrides only colors.

Normal declarations cascade from library defaults (`var.tokens`) to configuration (`var.theme`) to unlayered application CSS, then consumer inline styles. Layer priority precedes specificity: unlayered `:root` overrides even configured `html.dark`. Configured default colors also override built-in dark colors unless explicitly configured for dark.

Use `createThemeCss(config)` for pure SSR/static CSS, with owned style ID `g4rcez-theme-<name>`, `data-g4rcez-theme-owner="theme-runtime"`, and `data-g4rcez-theme-name="<name>"`. Pass a CSP nonce on server styles and initial client registration as needed. Matching styles are updated in place during hydration; later calls preserve an omitted nonce. Emit the active root class before first paint.

Use `createThemeProperties({ tokens?, colors?, components? })` for sparse wrapper inline properties. Root themes reach body portals; wrappers reach only DOM descendants. Custom theme names do not inherit dark automatically: explicitly copy the color-only `defaultDarkThemeTokens` groups when needed. `defaultLightThemeTokens` and the geometry exports are inspection data, not required full-default injection.

**Breaking release (v7):** Replace retired theme registration and full-object serializers with the sparse APIs; move theme imports from `/styles` or `/themes` to the package root or `/theme`; migrate root theme attributes to classes; and replace the retired `--var-radius` input with `tokens.rounding` or `--var-radius-base`. Remove unprefixed legacy theme aliases. The built-in dark Card shadow is normalized to the shared transparent `0px 1px 2px 1px` shape; this intentionally removes its former dark-only geometry. Keep `--var-shadow-card` as a full-shadow override. Notification and Table shadow geometry is shared while its color varies by built-in theme; retain full overrides on `--var-shadow-notification` / `--var-shadow-table`, or customize `--var-shadow-notification-shape` / `--var-shadow-table-shape` and `--var-color-shadow-notification` / `--var-color-shadow-table`. Provider component overrides and optional Tailwind preset utilities use canonical properties; neither is required for CSS styling.

See [Theme customization](packages/lib/ai/docs/theme-customization.md) for complete reset, custom theme, SSR ownership/nonce, provider/preset, shadow shape/color, and migration examples, and [Geometry tokens](packages/lib/ai/docs/geometry-tokens.md) for reactive density and rounding.

### Public CSS Contract

Components expose semver-protected selectors:

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

Use semantic `--var-*` tokens for durable customization; use selectors for advanced overrides.

Published CSS chunks include source maps with embedded source content. Enable CSS
source maps in browser developer tools to trace minified component rules and
inlined foundation rules back to their original stylesheets.

### Why plain CSS is the default

Earlier versions used Tailwind as both the authoring API and token distribution mechanism. That made component styling depend on consumer Tailwind configuration, made theme maintenance harder, and polluted component internals with long utility strings.

The v6 model makes plain CSS, stable selectors, and runtime CSS variables the default. Legacy Tailwind preset and plugin entrypoints remain exported for projects that still use the v3/v4 integration; new apps should prefer the CSS chunks.

### Style Manifest

The package publishes a machine-readable style manifest for CLIs and AI agents:

```ts
import { componentStyleManifest } from "@g4rcez/components/style-manifest";
```

The same data is available as JSON at `@g4rcez/components/style-manifest.json` and in `ai/component-style-manifest.json`.

## 🛠️ Development

### Prerequisites

- Node.js >= 20.14.0
- pnpm (recommended package manager)

### Setup

```bash
# Clone the repository
git clone https://github.com/g4rcez/components.git
cd components

# Install dependencies
pnpm install

# Start development server (docs site)
pnpm dev

# Build the library
pnpm build
```

### Scripts

- `pnpm dev` - Start docs development server
- `pnpm build` - Build both library and docs
- `pnpm test` - Run tests
- `pnpm format` - Format code with oxfmt
- `pnpm knip` - Check for unused files, exports, and dependencies
- `pnpm knip:production` - Run Knip in production mode

### Testing

```bash
# Run tests
cd packages/lib
pnpm test

# Watch mode
pnpm test:watch
```

### Package maintenance

- Build the library before running `tests/package-types.test.ts` or
  `tests/css-sourcemaps.test.ts`; these tests exercise the published `dist` files.
- The library TypeScript pass emits declarations only, preserving the `src`
  directory layout under `dist`. Point new `types` exports at those original
  declaration paths, not at JavaScript bundle paths. Keep existing `components/*`
  aliases working with explicit type targets when a bundle has a flattened name.
  The separate Tailwind compiler emits only the CommonJS preset/plugin entries
  and their dependencies under `dist/preset`.
- Public path constraints are owned by the package's private `lib/path-types`
  module. Keep runtime utility dependencies out of emitted type signatures when
  local types already express the contract. The published consumer test checks
  the full declaration graph with `skipLibCheck: false`, including accepted and
  rejected table/form paths and FileUpload's Dropzone prop overrides.
- The CSS Vite configuration owns entry discovery, Vite/PostCSS import bundling,
  and Lightning CSS minification with composed source maps. Do not copy
  declarations or synthesize maps in post-build scripts.
- Knip models public library/CLI entries, the copied lint bundle, test setup and
  Next-discovered routes. See [CONTRIBUTING.md](CONTRIBUTING.md) for the installed
  analyzer commands and build prerequisites. Keep docs components reachable from
  routes and each workspace's dependencies tied to its actual imports.
- Internal cleanup removed disconnected docs components and unused docs
  dependencies, MultiSelect's unread label history, unused document-scroll-lock
  machinery, and Wizard's redundant window-dimension subscription. Popup wheel
  containment and Wizard's direct resize/scroll geometry tracking remain in place.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `pnpm test`
6. Format code: `pnpm format`
7. Commit changes: `git commit -m 'Add amazing feature'`
8. Push to branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Component Development Guidelines

1. **TypeScript First** - All components must be fully typed
2. **Accessibility** - Follow WCAG guidelines
3. **Testing** - Include unit tests for new components
4. **Documentation** - Add examples to the docs site
5. **Consistency** - Follow existing patterns and conventions

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/g4rcez/components)
- [NPM Package](https://www.npmjs.com/package/@g4rcez/components)
- [Author](https://garcez.dev)

---

Built with ❤️ by [Allan Garcez](https://garcez.dev)
