# Documentation Design Migration

This plan applies the rules in [`DESIGN.md`](./DESIGN.md) to the existing documentation site. It permits a full shell and page-layout change while preserving public documentation contracts.

## Goal

Move all documentation routes to the Precision Field Guide layout:

- stable three-region desktop shell;
- focused 720–760px reading column;
- predictable component-page anatomy;
- examples before exhaustive implementation detail;
- route-specific usage and accessibility guidance;
- responsive navigation that remains keyboard accessible.

## Non-negotiable contracts

Preserve these throughout the migration:

- every existing `/docs/*` URL;
- heading anchors and external deep links where practical;
- factual component behavior and public APIs;
- runnable examples and their source code;
- page titles and SEO metadata;
- keyboard behavior, focus management, and screen-reader semantics;
- dark and light theme support if both are currently public;
- previous/next route relationships.

A visual migration must not become a component API migration.

## Target information architecture

### Global shell

```text
┌───────────────────────────────────────────────────────────────────┐
│  Header: brand · docs search · theme · repository · version      │
├───────────────┬──────────────────────────────┬────────────────────┤
│ Docs nav      │ Article                      │ On this page       │
│ 272px         │ 720–760px                    │ 224px              │
│ sticky        │ fluid                         │ sticky             │
│ own scroll    │                               │                    │
└───────────────┴──────────────────────────────┴────────────────────┘
```

- Center the shell in a `1440px` maximum-width container.
- Keep the header at `64px`.
- Keep both desktop sidebars sticky below the header.
- Let the article own visual priority.
- Remove decorative landing-page spacing from documentation routes.

### Navigation groups

Use this route grouping and order:

1. **Getting Started**
   - `/docs/get-started`
   - `/docs/setup`
2. **Primitives**
   - `/docs/heading`
   - `/docs/polymorph`
   - `/docs/resizable`
   - `/docs/slot`
   - `/docs/typography`
3. **Display Components**
   - `/docs/alert`
   - `/docs/buttons`
   - `/docs/button-group`
   - `/docs/calendar`
   - `/docs/cards`
   - `/docs/empty`
   - `/docs/list`
   - `/docs/swippeable-list`
   - `/docs/masonry`
   - `/docs/notification`
   - `/docs/progress`
   - `/docs/shortcut`
   - `/docs/skeleton`
   - `/docs/spinner`
   - `/docs/stats`
   - `/docs/tags`
   - `/docs/tabs`
   - `/docs/timeline`
   - `/docs/table`
   - `/docs/page-calendar`
4. **Floating Elements**
   - `/docs/tooltip`
   - `/docs/dropdown`
   - `/docs/expand`
   - `/docs/menu`
   - `/docs/modal`
   - `/docs/toolbar`
   - `/docs/commander`
   - `/docs/wizard`
5. **Form Controls**
   - `/docs/autocomplete`
   - `/docs/checkbox`
   - `/docs/date-picker`
   - `/docs/file-upload`
   - `/docs/filter-bar`
   - `/docs/form-reset`
   - `/docs/input`
   - `/docs/input-button-form`
   - `/docs/input-field`
   - `/docs/multiselect`
   - `/docs/radiobox`
   - `/docs/select`
   - `/docs/slider`
   - `/docs/step`
   - `/docs/switch`
   - `/docs/task-list`
   - `/docs/textarea`
   - `/docs/form`
6. **Utilities**
   - `/docs/render-on-view`

Correct the visible label “Swippeable List” to “Swipeable List” without changing its current route unless a separately approved redirect is added.

## Standard page template

Every route should render the same document landmarks:

```text
<main>
  <article>
    Category / breadcrumb
    H1 + summary
    Metadata and page actions
    When to use / When not to use
    Primary example
    Variants and states
    Accessibility and keyboard behavior
    API or implementation details
    Related components
    Previous / Next
  </article>
  <aside aria-label="On this page">...</aside>
</main>
```

### Required page sections

1. **Introduction**
   - One `h1`.
   - One concise purpose sentence.
   - Optional package export, version, or stability metadata.
2. **Usage summary**
   - “Use when” and “Avoid when” content.
   - Route-specific Do/Don’t guidance from the completed component analysis.
3. **Primary example**
   - Rendered component first.
   - Source code second.
   - Reset behavior for stateful demonstrations.
4. **Variants and states**
   - Include only variants that change a real decision.
   - Cover loading, empty, disabled, error, and responsive states when supported.
5. **Accessibility**
   - Keyboard interaction.
   - Focus behavior.
   - Required labeling and ARIA relationships.
   - Screen-reader announcements for asynchronous states.
6. **API or implementation details**
   - Group related properties.
   - Keep long tables horizontally scrollable.
7. **Route navigation**
   - Related components.
   - Previous and next links.

## Shared building blocks

Create or update these documentation-only components before migrating routes:

- `DocsShell`
- `DocsHeader`
- `DocsSidebar`
- `DocsMobileNavigation`
- `DocsSearch`
- `DocsArticle`
- `DocsTableOfContents`
- `DocsPageHeader`
- `UsageSummary`
- `ExamplePanel`
- `ExamplePreview`
- `CodeBlock`
- `CopyButton`
- `AccessibilityNotes`
- `DoDontPair`
- `ApiTable`
- `RelatedComponents`
- `DocsPager`

Names may follow the repository convention. Responsibilities must remain equivalent.

## Example panel contract

Every example panel uses this order:

1. title;
2. one-sentence explanation;
3. live preview;
4. optional demo controls;
5. code toolbar;
6. source code.

Required behavior:

- Copy announces success without changing layout width.
- Stateful demos expose Reset.
- Preview and code show the same state and props.
- Code can scroll horizontally.
- Examples longer than 24 lines can collapse with an explicit line count.
- Keyboard focus cannot become trapped in previews.

## Responsive migration

### Desktop: 1280px and wider

- Show left navigation, article, and right table of contents.
- Keep the article between 720px and 760px.
- Use sticky sidebars with independent overflow.

### Compact desktop and tablet: 960px to 1279px

- Keep the left navigation.
- Move “On this page” below the page introduction.
- Do not reduce the article below a readable width.

### Mobile: below 960px

- Move documentation navigation into a modal drawer.
- Preserve the current route and expanded navigation group.
- Stack page actions and example controls.
- Keep code and data tables horizontally scrollable.

### Small mobile: below 640px

- Use 16px page padding.
- Stack Do/Don’t comparisons.
- Keep touch targets at least 44px.
- Never clip example previews; provide contained scrolling when the component itself requires width.

## Migration phases

### Phase 0 — Baseline

- Capture desktop and mobile screenshots of representative routes.
- Record Lighthouse accessibility results and keyboard behavior.
- Inventory route titles, headings, anchors, examples, and previous/next links.
- Add a route manifest test for all documentation paths.

**Exit condition:** every public route and anchor is recorded before layout changes.

### Phase 1 — Tokens and global styles

- Map current theme variables to the tokens in `DESIGN.md`.
- Add the 8px spacing rhythm and radius scale.
- Apply Inter to reading text and IBM Plex Mono to annotations and code.
- Replace static-content shadows with tonal layering and borders.
- Add shared focus-ring and reduced-motion styles.

**Exit condition:** tokens render consistently in both supported themes without changing component APIs.

### Phase 2 — Documentation shell

- Implement the 64px header.
- Implement the 272px desktop sidebar and active-route treatment.
- Implement the 224px table of contents.
- Implement the responsive navigation drawer.
- Preserve navigation scroll position between route changes.

**Exit condition:** the shell works at 1440px, 1024px, 768px, and 390px with keyboard-only navigation.

### Phase 3 — Page primitives

- Implement the standard page header and metadata row.
- Implement `UsageSummary`, `ExamplePanel`, `CodeBlock`, and `AccessibilityNotes`.
- Implement related links and previous/next navigation.
- Add stable heading-anchor behavior with header offset.

**Exit condition:** one representative route can express all required page sections without route-specific layout code.

### Phase 4 — Pilot routes

Migrate these routes first because they cover the widest interaction range:

- `/docs/buttons`
- `/docs/input-field`
- `/docs/autocomplete`
- `/docs/modal`
- `/docs/table`
- `/docs/calendar`

For each pilot:

- add route-specific Do/Don’t guidance;
- put the primary example before variants;
- document keyboard and accessibility behavior;
- verify preview/source parity;
- compare against the baseline at all target widths.

**Exit condition:** the template supports actions, forms, floating UI, complex data, and date interaction without new shell exceptions.

### Phase 5 — Route batches

Migrate remaining routes by navigation group:

1. Getting Started and Primitives.
2. Display Components.
3. Floating Elements.
4. Form Controls.
5. Utilities.

Do not migrate by file size. Complete one navigation group at a time so users never see mixed structure inside a category.

**Exit condition:** all routes use the standard anatomy and no legacy example container remains.

### Phase 6 — Content normalization

- Use one component name and capitalization across title, navigation, and examples.
- Replace filler copy with task-based examples.
- Keep descriptions under two lines in page headers.
- Add explicit empty, loading, disabled, and error guidance where supported.
- Add keyboard instructions to Commander, Menu, Modal, Tabs, Toolbar, Tooltip, Wizard, and form controls.
- Add semantic caveats to Polymorph, Slot, Masonry, Table, and RenderOnView.

**Exit condition:** page structure and terminology are consistent without changing technical truth.

### Phase 7 — Verification and rollout

Run focused verification before release:

- all route URLs return successfully;
- heading anchors resolve after navigation and refresh;
- sidebar and drawer expose the same route tree;
- Tab order follows the visual order;
- focus is visible on all interactive controls;
- Escape closes only the top floating layer;
- no essential information depends on hover or color alone;
- code Copy and demo Reset announce results;
- desktop and mobile screenshots show no clipping or unintended horizontal page scroll;
- reduced-motion mode removes nonessential transitions;
- dark and light themes meet contrast requirements.

Roll out the shared shell first, then route groups behind one reversible feature flag if the repository supports flags.

## DESIGN.md rule-to-change matrix

| DESIGN.md rule | Migration change | Verification |
| --- | --- | --- |
| Precision Field Guide | Replace marketing-like docs spacing with the reading shell | Article remains primary at all widths |
| One Accent Rule | Remove decorative accent colors from docs chrome | Only cyan and semantic colors remain |
| Semantic Outline Rule | Normalize heading hierarchy and stable anchors | Automated outline check and deep-link test |
| Flat-at-Rest Rule | Remove shadows from static cards and sections | Shadows remain only on floating UI |
| Example before API | Reorder page sections | Primary example appears before API details |
| Persistent labels | Update form examples and docs controls | No field relies on placeholder-only labeling |
| Color plus meaning | Add labels or icons to semantic states | Grayscale review retains meaning |
| Stable reading width | Constrain article to 720–760px | 60–75 characters per prose line |

## Definition of done

The migration is complete when:

- all listed documentation routes use the shared shell and page template;
- all route URLs and required anchors remain valid;
- each component page contains route-specific usage guidance and a working example;
- desktop, tablet, and mobile navigation are keyboard accessible;
- layout checks show no clipping or unintended page-level horizontal scrolling;
- component behavior and public APIs are unchanged;
- the final implementation conforms to [`DESIGN.md`](./DESIGN.md).
