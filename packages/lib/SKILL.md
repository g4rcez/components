---
name: g4rcez-components
description: >
    How to build React UI with @g4rcez/components, a plain-CSS design system with semantic
    `--var-*` tokens and ~60 documented components. Use this skill whenever a project depends on
    @g4rcez/components or imports from it, or when the user wants to set it up, add or style a
    component (Button, Input, Select, Modal, Table, Calendar, Notifications, Tabs, forms, toasts,
    command palette, VideoPlayer, PdfViewer, RichTextEditor, DrawingEditor, and others), change
    colors, spacing, radius or dark mode, configure themes, or replace native HTML controls and
    hand-rolled UI with library components. Read it before writing any UI in such a project, even
    if the user does not name the library.
license: MIT
---

# @g4rcez/components

A React design system built on three ideas:

- **Stable class contracts.** Components emit `__button`, `__button--theme-primary`, `__button__icon`.
  Plain CSS files target those selectors.
- **Semantic tokens.** Every visual decision is a CSS variable (`--var-color-primary`,
  `--var-button-height`, `--var-spacing-base`). Override the variable and the component follows.
- **Per-component docs.** Each component has a reference with props, defaults, a11y behavior, tokens
  and CSS dependencies. Those references are the source of truth, not your memory of similar libraries.

## How to work with this skill

The references sit in `docs/` next to this file. If you read this file from
`node_modules/@g4rcez/components/SKILL.md`, they are in `ai/docs/` instead.

1. List every component the task needs. A composed UI needs one doc per component, not only the parent.
2. **Read `docs/<Name>.md` before writing code.** Props, state control, keyboard behavior, and CSS dependencies differ from what you would guess. Wrong guesses compile, then fail at runtime.
3. Read `docs/verify/<Name>.md` only when you test the component or review its accessibility. It holds Given/When/Then criteria. Not every component has one.
4. Read `docs/index.md` for the catalog, import paths, and pattern coverage.
5. Read `docs/style-dependencies.md` before you add CSS imports.
6. If a doc is silent, read the types in `node_modules/@g4rcez/components/dist/`. Do not guess.
7. Reuse before you build. Use a library component's `theme`, `size`, and props instead of native markup plus custom CSS. Write custom styles only when no component fits. Build them from tokens.

## Setup

```bash
pnpm add @g4rcez/components   # peer deps: react >=18, react-dom >=18
```

Import the foundation first, then the CSS chunk of each component you use. Do this in a stylesheet, not in JS/TS:

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
@import "@g4rcez/components/input.css";
```

- `@g4rcez/components/index.css` bundles foundation plus every component. It is fine for prototypes.
  Prefer per-component imports in production to keep CSS small.
- Components depend on each other's CSS (Modal needs Button, DatePicker needs Calendar, Dropdown and
  Input). Resolve those in `docs/style-dependencies.md`, or let the CLI do it:

```bash
npx csscomponents --css src/index.css      # scan source, write the import block (idempotent)
npx csscomponents --check                  # exit 1 when imports are stale (CI)
npx csscomponents --dry-run                # print the plan only
```

- Dark mode: put `class="dark"` on `<html>`. The application owns the class; the library never toggles it.
- `ComponentsProvider` is optional for styling. Add it for locale-aware masks, i18n strings, table `tweaks`
  and `Modal` confirm support:

```tsx
import { ComponentsProvider } from "@g4rcez/components";

export const Root = ({ children }: { children: React.ReactNode }) => (
    <ComponentsProvider locale="en-US">{children}</ComponentsProvider>
);
```

Components with built-in text also take a partial `translations` prop (`<Empty translations={{ emptyDataMessage: "No records" }} />`).
Instance values beat provider values, which beat built-in defaults.

## Writing UI

Import from the package root or from a sub-path. Sub-paths help tree-shaking. Each doc states the correct import:

```tsx
import { Button } from "@g4rcez/components/button";
import { Input } from "@g4rcez/components/input";
import { Form } from "@g4rcez/components/form";

export function Login({ onLogin }: { onLogin: (data: FormData) => void }) {
    return (
        <Form onSubmit={(e) => onLogin(new FormData(e.currentTarget))}>
            <Input title="Email" name="email" type="email" required />
            <Input title="Password" name="password" type="password" required />
            <Button theme="primary" type="submit">Sign in</Button>
        </Form>
    );
}
```

Conventions that keep output consistent:

- **Variants through props, never colors through classes.** `<Button theme="danger">`, not `className="bg-red-600"`.
  Components expose `theme`, `size`, `rounded` and similar props; their values are in each doc.
- **Token-based colors only** (`var(--var-color-primary)` in CSS; `bg-primary` only if the project uses the optional
  Tailwind preset). Raw palette classes like `bg-blue-500` bypass theming and break dark mode.
- **Never depend on generated selectors** such as `__button__tw-17` or `__x__tw-state-1`. They are private
  migration artifacts and change between releases. Public selectors follow `__component`, `__component--variant-value`, `__component__slot`.
- **Labels and errors belong to the field.** `Input`, `Select`, `Textarea` and friends take `title`, `error`,
  `feedback` and `info` through `InputField`. Do not add a separate `<label>` and error `<p>`.
- **Do not invent components.** If a pattern is not in the catalog (see the gaps below), compose native HTML or
  existing components. Do not import a name that is not documented.

## Theming

Prefer plain CSS; use `configureTheme` for sparse root overrides from JS.

```css
:root { --var-spacing-base: 16px; --var-radius-base: 0px; }
html.dark { --var-color-primary: hsla(201, 49%, 60%, 1); }
```

```ts
import { configureTheme } from "@g4rcez/components";

configureTheme({ name: "default", tokens: { spacing: 16, rounding: 0 } });
configureTheme({ name: "dark", colors: { primary: "hsla(201, 49%, 60%, 1)" } });
```

Rules worth knowing before touching tokens:

- Use only canonical `--var-*` names. Retired aliases are not fallbacks. Check the component's doc or `themeTokenRegistry`.
- Colors are full CSS values (`hsla(...)`), never stripped channels.
- Geometry derives from `--var-spacing-base` and `--var-radius-base`. Numeric `spacing`/`rounding` in `configureTheme` mean pixels, zero included.
- `default` writes to `:root`; any other name writes to `html.<name>`. Calling `configureTheme` again for the same name **replaces** that
  name's overrides. It does not merge.
- Local scope: set variables on a wrapper element (`style={{ "--var-radiobox-control-size": "1.5rem" } as React.CSSProperties}`).
  Wrapper variables do **not** reach portals (Modal, Dropdown, Tooltip), so use a root theme for those.
- SSR: `createThemeCss(config)` is pure. Emit it in a `<head>` style tag and render the active root class before paint. Full example, precedence and CSP nonce rules are in `docs/theme-customization.md`.
- Spacing, rounding and wrapper-vs-portal behavior in detail: `docs/geometry-tokens.md`.

## Component map

Read the matching file before use. Each file's frontmatter states the import path.

**Core** — [Button](docs/Button.md), [Heading](docs/Heading.md), [Typography](docs/Typography.md) (Paragraph, Description, Info, PageTitle, PageHeader), [Tag](docs/Tag.md), [Polymorph](docs/Polymorph.md) (`as` rendering), [Slot](docs/Slot.md) (`asChild`), [Resizable](docs/Resizable.md) (animated height), [RenderOnView](docs/RenderOnView.md)

**Form** — [Form](docs/Form.md), [FormReset](docs/FormReset.md), [InputField](docs/InputField.md), [Input](docs/Input.md) (masks), [Textarea](docs/Textarea.md), [Select](docs/Select.md) (native), [Autocomplete](docs/Autocomplete.md) (searchable), [MultiSelect](docs/MultiSelect.md), [Checkbox](docs/Checkbox.md), [Radiobox](docs/Radiobox.md), [Switch](docs/Switch.md), [Slider](docs/Slider.md), [DatePicker](docs/DatePicker.md), [FileUpload](docs/FileUpload.md), [TaskList](docs/TaskList.md)

**Editors and media** — [RichTextEditor](docs/rich-text-editor.md) (Markdown), [DrawingEditor](docs/drawing-editor.md) (layered canvas, PNG export), [VideoPlayer](docs/video-player.md), [PdfViewer](docs/pdf-viewer.md)

**Display** — [Alert](docs/Alert.md), [Card](docs/Card.md) (+ StatsCard), [Stats](docs/Stats.md), [Empty](docs/Empty.md), [Skeleton](docs/Skeleton.md), [Spinner](docs/Spinner.md), [Progress](docs/Progress.md), [Step](docs/Step.md), [Tabs](docs/Tabs.md), [Timeline](docs/Timeline.md), [List](docs/List.md), [AnimatedList](docs/AnimatedList.md), [SwipeableList](docs/SwipeableList.md), [Masonry](docs/Masonry.md), [Calendar](docs/Calendar.md), [Shortcut](docs/Shortcut.md), [Notifications](docs/Notifications.md) (toasts)

**Floating** — [Modal](docs/Modal.md) (dialog, drawer, sheet, confirm), [Dropdown](docs/Dropdown.md), [Menu](docs/Menu.md), [Expand](docs/Expand.md), [Tooltip](docs/Tooltip.md), [Toolbar](docs/Toolbar.md), [CommandPalette](docs/CommandPalette.md), [Wizard](docs/Wizard.md) (guided tour)

**Data and scheduling** — [Table](docs/Table.md) (virtualized, sortable, filterable; also exports `createColumns`, `useTablePreferences`), [PageCalendar](docs/PageCalendar.md)

**Cross-cutting** — [index](docs/index.md) (catalog, a11y principles, pattern coverage), [theme-customization](docs/theme-customization.md), [geometry-tokens](docs/geometry-tokens.md), [style-dependencies](docs/style-dependencies.md) (CSS import order, variants, slots)

Root also exports hooks and helpers: `useForm`, `usePrevious`, `useReactive`, `useStableRef`, `useSwipe`, `useLocale`,
`useTranslations`, `useColorParser`, `useNotification` (from `/notifications`), and `useConfirm` (from `/modal`). Read their types in the package when you need them.

## Replacing native HTML

| Native / hand-rolled | Use |
| --- | --- |
| `<button>`, `<a>` styled as a button | `Button` (`as="a"` for action-shaped links) |
| `<input type="text\|email\|password\|search">` | `Input` (set `type`) |
| `<input type="date">` | `DatePicker` |
| `<input type="checkbox">`, `<input type="radio">` | `Checkbox`, `Radiobox` |
| `<select>` | `Select`; searchable → `Autocomplete`; multiple → `MultiSelect` |
| `<textarea>` | `Textarea` |
| `<input type="range">` | `Slider` |
| `<input type="file">` + drop zone | `FileUpload` |
| `<dialog>`, custom overlay, side panel | `Modal` (`type="dialog" \| "drawer" \| "sheet"`) |
| confirm/alert dialogs | `useConfirm` from `/modal` (needs `ModalConfirmProvider`; `ComponentsProvider` mounts one) |
| toasts | `Notifications` + `useNotification` |
| `<table>` with sorting/filtering | `Table` |
| spinners, loading blocks | `Spinner`, `Skeleton` |
| `<progress>` | `Progress` |
| tabs inside one page | `Tabs` |
| markdown textarea | `RichTextEditor` |
| `<video>` | `VideoPlayer` |

## Traps that cost time

- `Expand` is a floating dialog, **not** an accordion. `Dropdown` is a nonmodal dialog, **not** a menu (use `Menu` for action menus).
- `Tabs` switches same-page panels. It does not route.
- `Select` wraps a native `<select>`. Use `Autocomplete` when the user needs to search.
- `PdfViewer` does not bundle a PDF parser. Your app must supply rasterized pages (see its doc for size limits and the data-URL contract).
- `RichTextEditor` is for Markdown, not arbitrary HTML. Its content is sanitized.
- **Missing patterns:** Accordion, Breadcrumb, Pagination as a standalone, Carousel, inline Link and Disclosure have no
  library component. Compose native elements (`<details>`, `<nav>`, `<a>`) and library tokens. `MISSING_COMPONENTS.md` in the repo lists proposals, not exports.
- Heavy components (Table, Calendar, DrawingEditor) have many CSS dependencies. A missing import shows up as unstyled UI, not an error.

## Before you finish

- Every component used has its CSS imported after `foundation.css`. Run `npx csscomponents --check`.
- No raw color utility classes, no `__tw-` selectors, no invented imports.
- Interactive elements work with keyboard only, show visible focus, and do not rely on color alone for state.
  The interaction criteria in each doc are verification targets. Test them in the composed product.
- Dark mode (`.dark` on `<html>`) and a narrow viewport both render correctly.
