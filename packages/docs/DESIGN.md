---
name: Components Website
description: Cyan-accented landing and documentation layouts for the React component library.
colors:
  canvas: "hsla(220, 16%, 6%, 1)"
  surface: "hsla(220, 13%, 9%, 1)"
  surface-raised: "hsla(220, 10%, 14%, 1)"
  border: "hsla(220, 9%, 19%, 1)"
  primary: "hsla(188, 86%, 57%, 1)"
  primary-soft: "hsla(190, 48%, 12%, 1)"
  text: "hsla(210, 12%, 96%, 1)"
  text-muted: "hsla(215, 10%, 64%, 1)"
  light-canvas: "hsla(0, 0%, 100%, 1)"
  light-surface: "hsla(210, 20%, 98%, 1)"
  light-border: "hsla(215, 15%, 88%, 1)"
  light-primary: "hsla(192, 100%, 29%, 1)"
  light-text: "hsla(220, 20%, 12%, 1)"
  light-text-muted: "hsla(215, 12%, 40%, 1)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5vw, 4.5rem)"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.5rem)"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  description:
    fontSize: "0.875rem"
    lineHeight: 1.55
  navigation:
    fontSize: "0.8125rem"
    lineHeight: 1.35
  label:
    fontSize: "0.75rem"
    lineHeight: 1.4
  code:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    lineHeight: 1.6
rounded:
  control: "8px"
  frame: "12px"
spacing:
  small: "8px"
  base: "16px"
  group: "24px"
  panel: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "44px"
  button-secondary:
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "44px"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
---

# Design System: Components Website

## Overview

The website uses the developer-documentation structure requested from Tailwind CSS and Next.js: a stable header, fine borders, clear type, and examples that demonstrate the library. Cyan connects navigation and actions across the landing page and documentation.

This app-specific system replaces the inherited website guidance without changing the library design system. Dark mode remains the initial state; the light theme supports brighter reading conditions. No new fonts or image assets are loaded.

## Colors

Cyan marks actions, links, current navigation, and focus. Dark and light modes use different cyan values to keep text readable. Neutral surfaces separate preview, source, and reading regions without decorative shadows.

Library examples retain their own theme tokens and semantic colors. Website styles must not override component variants to make every demo cyan.

## Typography

Use the existing sans-serif stack for headings, navigation, and prose. Inter is a preferred local face, not a downloaded dependency. Monospace is reserved for source, package names, and compact metadata.

Landing titles are larger than documentation titles. Keep article prose within about 70 characters per line. Group demo titles with their descriptions; do not inherit large article-heading margins into example headers.

## Layout

The shared header is 56px high in a centered 1440px frame; its section links carry a 2px underline for the current section, not cyan text. The landing page has a 1376px bordered frame and flows top to bottom: a centered hero (documented-components pill, headline, copy, two actions, install command); one Preview/Code window built on the library Tabs, with the live demo beside a live component composition (stacked below 1024px); a four-cell foundations grid; the hub grid under a two-column section header; and a closing call to action. The hero eyebrow shows the number of documented components, computed from the navigation config. The catalog is one hub grid: a single bordered frame whose cells share hairlines (Helios hub structure), not separate feature cards. The landing page has no floating overlay; the footer carries the same links.

Documentation has a 240px recessed navigation rail on the surface tone (Linear-style: group labels and inactive links are muted, the current route is a raised neutral row), an article up to 760px wide, and a 192px page outline at 1280px and above. Below 1280px the outline becomes a collapsed native disclosure. Below 960px the navigation moves into a left drawer. Below 1024px the landing preview and source stack so the code keeps a readable width. At 640px, guide links and page actions stack.

New spacing derives from the library's base spacing token. Keep horizontal scrolling inside code panels instead of widening the document.

## Elevation & Depth

Static surfaces use a fine border and tonal contrast. The website adds no decorative shadows, gradients, or entrance animations. Floating library components retain their own elevation rules.

## Shapes

Controls have small rounded corners; bounded examples have larger corners. Structural regions remain square. New geometry derives from the library's radius and spacing bases. The active navigation indicator is one pixel wide.

## Components

- **Navigation:** group labels are muted sentence-case, links are rounded rows, and the current route has full-contrast text on a raised neutral background plus an accessible current-page state. Cyan is reserved for actions, links, and focus.
- **Search:** the header and keyboard shortcuts focus desktop navigation or open the drawer. The drawer traps focus through the library Modal and starts in the search input.
- **Page outline:** sticky and independently scrollable on large screens; a keyboard-operable disclosure on smaller screens.
- **Examples:** rendered preview above source. Keep copying, reset controls, and component behavior intact. A Card that wraps the whole subject renders as a titled section inside the example panel, without its own border or background, and the panel keeps its padding so floating panels have room; Card demos that show several Cards keep their frames.
- **Page header:** breadcrumb, title, summary, then a bordered key/value strip (Package, Section) in the style of Helios component headers.
- **Page tabs:** component pages use the library Tabs, frameless, below the page header: Examples, Usage, Accessibility (Helios-style). Only the active panel renders, so the outline lists that panel's headings. The tab is stored in `?tab=` (omitted for Examples); `?tab=` and anchors inside another tab (`#usage-guidance`, `#accessibility-notes`) open that tab on load. Guide pages have no tabs. The Examples and Accessibility h2 headings stay for the outline and screen readers but are visually hidden because the tab names them.
- **Usage guidance:** "Use when" and "Avoid when" share one bordered frame split by a hairline, each with a 2px semantic top edge.
- **Guide pages:** display guide content directly, without generic component usage warnings. Component pages put examples before usage guidance and accessibility notes.
- **Actions:** cyan primary links, neutral outlined secondary links, visible focus, and restrained color transitions. Navigation links remain links rather than nested buttons.

## Do's and Don'ts

- Do preserve routes, examples, theme switching, and keyboard navigation.
- Do use cyan for the website's primary actions and navigation.
- Do keep the landing preview interactive and code horizontally scrollable.
- Do respect reduced-motion preferences.
- Don't introduce gradients, promotional statistics, or unsupported product claims.
- Don't change library component tokens as part of website styling.
- Don't use a full expanded page outline to push mobile content below the fold.
