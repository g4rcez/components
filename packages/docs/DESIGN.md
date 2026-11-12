---
name: Components Website
description: Neutral-first documentation and landing for the React component library, with an Ultramarine accent, in light and dark.
colors:
  light-background: "hsl(0 0% 100%)"
  light-surface: "hsl(240 20% 98.5%)"
  light-muted: "hsl(240 10% 96%)"
  light-border: "hsl(240 6% 88%)"
  light-input: "hsl(240 5% 52%)"
  light-muted-foreground: "hsl(240 5% 38%)"
  light-foreground: "hsl(240 10% 10%)"
  light-primary: "hsl(232 72% 50%)"
  light-primary-hover: "hsl(232 72% 43%)"
  dark-background: "hsl(240 6% 7%)"
  dark-surface: "hsl(240 6% 9%)"
  dark-muted: "hsl(240 5% 12%)"
  dark-border: "hsl(240 5% 21%)"
  dark-input: "hsl(240 4% 52%)"
  dark-muted-foreground: "hsl(240 5% 70%)"
  dark-foreground: "hsl(240 6% 94%)"
  dark-primary: "hsl(232 85% 70%)"
  dark-primary-hover: "hsl(232 85% 76%)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  section:
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    lineHeight: 1.7
  navigation:
    fontSize: "0.875rem"
    lineHeight: 1.4
  label:
    fontSize: "0.8125rem"
    lineHeight: 1.4
  code:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    lineHeight: 1.65
rounded:
  control: "8px"
  frame: "10px"
  tile: "12px"
spacing:
  small: "8px"
  base: "16px"
  group: "24px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.light-primary}"
    textColor: "{colors.light-background}"
    rounded: "{rounded.control}"
  search-trigger:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-muted-foreground}"
    rounded: "{rounded.control}"
---

# Design System: Components Website

## Overview

The site is modelled on the Radix documentation experience: a quiet, neutral frame in which the library's own components are the colour. A stable header, a grouped sidebar, one long scrolling page per component (examples, usage, a generated API reference, tokens, accessibility) and a right-hand outline. The landing page is a short hero followed by a dense grid of real, working compositions.

This is the website's own system and does not change the library's design system. It follows the system colour preference (light or dark) until a visitor chooses, and remembers the choice.

## One palette

The shell uses the library's tokens (`--var-*`), not a palette of its own. `src/app/styles/brand.css` is the only file allowed to contain colour literals: it sets the neutral steps and the accent as library tokens for `:root` and `html.dark`. It is unlayered, so it wins over the library's `@layer var.tokens`.

The library hard-codes its old accent in about 54 component tokens (checkbox, radiobox, switch, menu and autocomplete active rows, calendar, tag, ghost-primary, table placeholder) rather than deriving them from `--var-color-primary`. `brand.css` re-derives every one of them. When the library adds a token with a hard-coded accent, add its override there too, or the demo shows the old colour.

Shell CSS may reference `--var-*` and the layout measures `--docs-layout-*` (header, sidebar, article, outline, radius). The few surfaces the library has no token for (`--docs-surface`, `--docs-surface-raised`, `--docs-primary-soft`, `--docs-success-soft`, `--docs-danger-soft`) are defined in `brand.css` as plain `hsl()` so that computed colours stay `rgb`-parsable for the contrast tests. Check with: `rg -nP "hsla?\(|rgba?\(|#[0-9a-fA-F]{3,8}\b" src/app/styles/{base,shell,content,reference}.css src/app/landing.css` (must print nothing).

## Colors

Neutrals use hue 240, in Radix-style steps. The accent is Ultramarine, hue 232. Measured contrast (WCAG):

- Light: white on primary 7.64:1, white on hover 9.23:1, soft accent text 8.71:1, muted text 6.61:1, input border 3.98:1.
- Dark: background ink on primary 5.62:1, on hover 7.38:1, soft accent text 7.93:1, muted text 8.64:1, input border 4.81:1.
- Active menu row: white on L36 is 11.1:1 (light); dark ink on L78 is 7.56:1 (dark).

The accent marks the primary action, the current outline entry, links, focus and selection. Active navigation is a neutral raised row, not accent text. The library's semantic colours (info, success, warn, danger) are untouched.

## Typography

Geist Sans and Geist Mono come from the `geist` package (`next/font/local`: self-hosted, preloaded, metric-adjusted fallback, no network at build or run time). Headings are semibold with negative tracking; prose stays within about 70 characters; monospace is for source, package names, prop names and metadata.

## Layout

The header is 56px in a centered 1440px frame: wordmark, Docs and Components links, a search button (also Cmd/Ctrl+K and `/`), version tag, GitHub, colour mode. Below 40rem the GitHub icon leaves the header (the footer carries it).

Documentation is a 248px sidebar (grouped headings, plain links, current page on a neutral fill), an article up to 760px and a 200px "On this page" outline from 80rem. Below 80rem the outline is a collapsed disclosure; below 60rem the sidebar becomes a left drawer that starts on a Search button. Wide tables scroll inside their own focusable region so the page never scrolls sideways.

The landing page is a left-aligned hero (count and version tag, headline, lede, two actions, install command with pnpm/npm/yarn tabs) followed by a showcase: `repeat(auto-fill, minmax(min(100%, 300px), 1fr))` with dense packing. Tiles span two columns or two rows only from 64rem, because on one column a span would create an implicit second column.

## Elevation & Depth

Static surfaces use a hairline border and tonal contrast. The only gradient is the fade at the bottom of a clamped token table, and the only texture is the dot grid behind demos. Floating library components keep their own elevation.

## Shapes

Controls 8px, panels 10px, showcase tiles 12px. The wordmark's accent tile has a larger radius than the other three, echoing a trigger that grows into a list.

## Components

- **Page template:** one scroll, in this order: header (breadcrumb, title, summary, package, section, import with copy, link to the reference markdown), Examples, "When to use X", API reference, Design tokens, Accessibility, related links, pager. Guide pages (Getting Started) show only the header and their content. Old `?tab=usage|accessibility` links land on the matching section.
- **Generated reference:** `scripts/generate-reference.mjs` parses `packages/lib/ai/docs/*.md` into `src/generated/reference/<slug>.json` (committed) plus a search index. Run `pnpm reference` after editing those docs; `pnpm reference:check` fails when the output is stale. Slugs map to files by PascalCase, with explicit overrides in the script. Never edit generated files by hand.
- **Demos:** a labelled section (`id` from the title), a dotted preview panel with 24px inset, and a Show code / Hide code toggle. The source is only rendered and highlighted once opened. A Card that wraps the whole subject renders frameless inside the panel.
- **Search:** the library `CommandPalette`, opened by the header button, Cmd/Ctrl+K and `/`. It matches page titles, descriptions and prop names, and jumps straight to an example.
- **Navigation:** small group headings, 14px links, no list icons; scroll position is remembered for the session.
- **Showcase tiles:** a labelled region with a heading and a link to the docs of the main component; ids start with `showcase-`. Heavy tiles mount when scrolled into view.

## Do's and Don'ts

- Do keep one palette: change `brand.css`, not the shell CSS.
- Do keep accent for action, link, focus and selection only.
- Do preserve the test hooks: `#main-content`, `.docs-shell`, `#docs-page-title`, labelled demo sections, the colour-mode button names, the skip link.
- Do respect reduced motion; components that vary motion by preference must not render differently on the server and the first client render (`useMotionPreference`).
- Don't add colour literals outside `brand.css`.
- Don't use `<details>` for anything but the mobile outline (a spec relies on it).
- Don't hand-edit `src/generated`, the PNG brand assets (`pnpm exec node scripts/capture-brand.mjs`) or the library docs' tables as page copy.
