---
name: Components Documentation
description: A precise, accessible reading system for the Components React library.
colors:
  canvas: "#121216"
  surface: "#1B1B21"
  surface-raised: "#27272A"
  border: "#35353B"
  primary: "#509BC3"
  primary-soft: "#1D3440"
  text: "#F4F4F5"
  text-muted: "#A1A1AA"
  success: "#46B98D"
  danger: "#E36B73"
  success-soft: "#142A23"
  danger-soft: "#321D21"
typography:
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 750
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 450
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
---

# Design System: Components Documentation

## Overview

**Creative North Star: “The Precision Field Guide”**

The documentation is a reading tool, not a marketing page. It should help a developer understand a component, choose the correct variant, copy a valid example, and verify accessibility without losing their place. The visual system is dark, technical, and restrained. Cyan identifies navigation, focus, and primary actions; green and red are reserved for semantic guidance.

The whole documentation layout may change to improve comprehension. Preserve route URLs, factual content, component behavior, and code examples. Replace the current long-page presentation with a stable reading shell and a predictable page anatomy.

**Key characteristics:**

- Dense enough for expert users, but never cramped.
- One stable reading column with persistent local navigation.
- Examples before exhaustive API detail.
- Semantic color, visible focus, and keyboard parity.
- Tonal depth instead of decorative shadows.
- Consistent structure across all component routes.

## Colors

The palette uses near-black neutral layers with one cool primary accent. Surfaces must remain visibly distinct without turning every section into a floating card.

### Primary

- **Precision Cyan** (`#509BC3`): active navigation, links, focus treatment, primary actions, selected controls, and key annotations.
- **Cyan Wash** (`#1D3440`): selected navigation backgrounds, example framing, and low-emphasis informational surfaces.

### Semantic

- **Verified Green** (`#46B98D`): success, valid states, and “Do” guidance.
- **Recovery Red** (`#E36B73`): errors, destructive actions, and “Don’t” guidance.
- Use a text label or icon with every semantic color. Color must not carry meaning alone.

### Neutral

- **Canvas Ink** (`#121216`): application and documentation background.
- **Reading Surface** (`#1B1B21`): cards, sidebars, and grouped examples.
- **Raised Surface** (`#27272A`): interactive secondary controls and nested surfaces.
- **Structural Border** (`#35353B`): dividers, field outlines, and bounded regions.
- **Primary Text** (`#F4F4F5`): headings and essential content.
- **Muted Text** (`#A1A1AA`): descriptions, metadata, and secondary labels.

**The One Accent Rule.** Precision Cyan is the only non-semantic accent. Do not introduce decorative purple, orange, or gradient accents.

## Typography

**Display and body font:** Inter with the system sans-serif stack.

**Label and code-adjacent font:** IBM Plex Mono with the system monospace stack.

The sans-serif voice is compact and direct. Monospace is an annotation layer for route names, categories, metadata, keyboard shortcuts, and code—not a substitute for body text.

### Hierarchy

- **Page title:** 32–48px, weight 800, line-height 1.08. One per page.
- **Section heading:** 24–30px, weight 750, line-height 1.2. Starts a major topic.
- **Subsection heading:** 18–20px, weight 700, line-height 1.3. Introduces examples or API groups.
- **Body:** 16px, line-height 1.65. Keep prose between 60 and 75 characters per line.
- **Description:** 14px, line-height 1.55, muted text.
- **Label:** 11px monospace, weight 700, uppercase, 0.1em tracking. Use sparingly.
- **Code:** 13–14px monospace, line-height 1.6. Preserve indentation and horizontal scrolling.

**The Semantic Outline Rule.** Heading levels describe document structure. Never choose a heading level only to obtain a visual size.

## Layout

### Documentation shell

Use a three-region desktop shell inside a centered `1440px` maximum width:

1. **Primary navigation:** sticky top bar, 64px high.
2. **Documentation navigation:** 272px left sidebar, fixed below the top bar, independently scrollable.
3. **Reading area:** fluid main region containing a 720–760px article and an optional 224px on-page table of contents.

The article is the visual center. Sidebars support it and must not compete with it.

### Responsive behavior

- **≥ 1280px:** left navigation + article + right table of contents.
- **960–1279px:** left navigation + article; move the table of contents below the page introduction.
- **< 960px:** replace the left navigation with a drawer opened from the header.
- **< 640px:** stack page actions, examples, and comparison panels. Keep horizontal scrolling only for code and data tables.

### Page anatomy

Every documentation route follows this order:

1. Breadcrumb or category label.
2. Page title and one-sentence purpose.
3. Metadata row when useful: package export, stability, version, or accessibility status.
4. “When to use” and “When not to use” summary.
5. Primary interactive example.
6. Common variants and states.
7. Accessibility and keyboard behavior.
8. API or implementation details.
9. Related components and previous/next navigation.

### Rhythm

- Use an 8px base rhythm.
- Keep 64px between major article sections.
- Keep 24px between a section title and its first content block.
- Keep 16px between related controls or example rows.
- Use 24px internal padding for standard example panels and 16px on narrow screens.

Do not wrap every paragraph, heading, or code block in a card. Cards mark a real boundary: an interactive example, semantic callout, component comparison, or API group.

## Elevation & Depth

The system is flat by default. Depth comes from tonal layers, borders, and sticky positioning—not decorative shadows.

- Canvas uses `#121216`.
- Structural surfaces use `#1B1B21`.
- Nested or interactive surfaces use `#27272A`.
- A 1px `#35353B` border separates adjacent layers.
- Use shadows only for floating UI such as dialogs, menus, tooltips, and command palettes.

**The Flat-at-Rest Rule.** Static documentation content does not float. Shadows communicate temporary elevation or interaction state.

## Shapes

- Use 8px corners for controls and code-adjacent widgets.
- Use 10px corners for callouts and nested examples.
- Use 14–16px corners for large bounded sections.
- Pills are reserved for tags, statuses, and compact filters.
- Use 1px borders for structure. Avoid double borders when a tonal change already separates regions.
- Focus rings use Precision Cyan and must remain visible against every surface.

## Components

### Documentation navigation

- Group routes under Getting Started, Primitives, Display, Floating, Form Controls, and Utilities.
- Keep group labels visible and visually quieter than links.
- Mark the current route with Cyan Wash, Precision Cyan text, and a left indicator.
- Preserve scroll position when navigating between routes.
- Add search above route groups on desktop and inside the mobile drawer.

### Page header

- Keep the category label, title, summary, and metadata in one compact block.
- Limit the summary to two lines.
- Place page-level actions such as “Edit on GitHub” after the metadata, not beside the title on narrow screens.

### Example panel

Each example uses the same internal structure:

1. Example title and concise explanation.
2. Rendered preview on a distinct surface.
3. Optional controls for theme, size, state, or viewport.
4. Code panel with Copy action and visible language label.

The preview comes before code. Keep preview and source synchronized. Stateful demos must include reset behavior.

### Code block

- Use Canvas Ink with a Structural Border.
- Keep the language label and Copy action in a compact toolbar.
- Show a clear copied state without replacing the button width.
- Wrap only prose comments. Code scrolls horizontally.
- Long examples may collapse after 24 lines, but the expand control must state the hidden line count.

### Do and Don’t guidance

- Place route-specific guidance after the primary example or inside the “When to use” section.
- Use paired green and red surfaces only when both sides add meaningful information.
- Write one actionable rule per row.
- Include a visual or code example when misuse is not obvious.

### Buttons

- Use one primary action per bounded region.
- Primary: Precision Cyan on Canvas Ink, 8px radius, 12px × 18px padding.
- Secondary: Raised Surface with Structural Border.
- Ghost: transparent at rest; tonal background on hover.
- Icon-only buttons require an accessible name and a tooltip when the meaning is not universal.

### Cards and callouts

- Cards use Reading Surface, a Structural Border, and 14px corners.
- Standard padding is 24px.
- Do not nest cards more than one level.
- Alerts use semantic color softly; text remains high-contrast.

### Inputs and fields

- Keep labels persistent and above the field.
- Inputs use Canvas Ink, Structural Border, 8px corners, and a 42–46px target height.
- Focus changes the border to Precision Cyan and adds a visible focus ring.
- Error text sits below the field and is connected through ARIA attributes.
- Placeholder text never replaces the label.

### Tables

- Use sticky headers for long datasets.
- Keep text left-aligned and numeric values right-aligned.
- Provide horizontal scrolling at narrow widths without clipping the first column.
- Preserve semantic table markup even when virtualization is active.

## Do's and Don'ts

### Do

- **Do** optimize the shell for reading before adding decoration.
- **Do** keep route structure, anchors, component names, and examples stable during visual migration.
- **Do** put the working example before exhaustive API detail.
- **Do** document empty, disabled, loading, error, and keyboard states.
- **Do** use one page anatomy across all component routes.
- **Do** test the shell at 1440px, 1024px, 768px, and 390px widths.
- **Do** keep code, preview, and written guidance consistent.

### Don't

- **Don't** use a landing-page hero inside component documentation.
- **Don't** let sidebars reduce the article below a comfortable reading width.
- **Don't** wrap every section in a card or use shadows on static content.
- **Don't** hide essential instructions in tooltips, tabs, or collapsed examples.
- **Don't** rely on color alone for status, selection, or Do/Don’t meaning.
- **Don't** redesign documented component behavior as part of the documentation layout migration.
