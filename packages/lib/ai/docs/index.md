---
title: "@g4rcez/components — Component Index"
description: Full component catalog for @g4rcez/components React design system
package: "@g4rcez/components"
---

# @g4rcez/components — Component Index

A React design system. It uses plain CSS, stable component selectors, and semantic design tokens.

## Setup

```bash
npm install @g4rcez/components
```

Import CSS in an application stylesheet. Import `foundation.css` first. Then import the CSS of each component you use. Resolve component dependencies in [style-dependencies.md](style-dependencies.md).

```css
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
```

`@g4rcez/components/index.css` bundles the foundation and all components.

## Theme and geometry

Read [theme-customization.md](theme-customization.md) for CSS setup, overrides, custom themes, root activation, cascade order, SSR, provider and preset integration, shadows, and migration. Read [geometry-tokens.md](geometry-tokens.md) for the spacing and rounding bases.

Import these from `@g4rcez/components` or `@g4rcez/components/theme`:

| Export | Purpose |
|---|---|
| `configureTheme` | Register or replace sparse named root overrides. Returns CSS. Does not activate the theme. |
| `createThemeCss` | Pure CSS output for SSR and static builds. |
| `createThemeProperties` | Convert sparse `{ tokens?, colors?, components? }` to a custom-property object. |
| `defaultLightThemeTokens` | Shared defaults and the light palette, for inspection. |
| `defaultDarkThemeTokens` | Effective global and component dark colors, without shared geometry. |
| `themeTokenRegistry` | Inventory of supported shared, color, and component keys. |
| `defaultGeometryTokens`, `defaultGeometryBases` | Geometry data for inspection. They are not root declarations. |
| `ThemeConfiguration`, `ThemeTokenOverrides`, `ThemeComponentOverrides` | Types for configuration and override groups. |

Foundation CSS supplies the defaults. No JavaScript initialization is required. Activate dark mode with `.dark` on `<html>`. The API never toggles it.

Use canonical `--var-*` properties in plain CSS, or `configureTheme` for sparse root overrides. The default scope is `:root`. Each component doc lists its tokens.

## Interaction principles

Component docs describe interaction behavior and acceptance criteria. They do not define visual style. Use this library's themes and tokens for appearance.

- **Semantics follow the outcome.** Buttons perform actions. Links navigate. Same-page tabs and destination navigation are different patterns. Choose heading levels from the document outline, not from font size.
- **Design every state.** Cover idle, active, unavailable, and error. Expose selected, expanded, and invalid state. Do not use color or an icon as the only signal.
- **Give equivalent input paths.** Keep visible keyboard focus and native activation keys. Never require hover, swipe, or drag alone.
- **Keep focus and reading order predictable.** Hidden content MUST NOT stay focusable. Opening, closing, removing, and replacing content each need a focus plan.
- **Match feedback to urgency.** Use persistent field errors and alerts for information that must stay available. A toast MUST NOT be the only record of a critical outcome. Avoid extra announcements and unexpected focus moves.
- **Verify the composed product.** Check names, roles, state, keyboard use, screen readers, touch, zoom, contrast, and reduced motion. Each `verify/<Name>.md` lists Given/When/Then criteria. They are test targets, not proof of WCAG conformance.

### Pattern coverage

**Existing**: a public API covers the pattern. It does not mean every criterion is tested. **Partial**: coverage is limited to a variant, an internal feature, or consumer composition. **Missing**: no reusable API exists. Proposals live in the repository file `MISSING_COMPONENTS.md`. That file is not a list of exports.

| Pattern | Coverage |
|---|---|
| Títulos (headings) | Existing: [Heading](Heading.md). [Typography](Typography.md) covers fixed-level page titles. |
| Tabelas (tables) | Existing: [Table](Table.md). The consumer owns captions and interaction checks. |
| Listas (lists) | Existing: [List](List.md), [AnimatedList](AnimatedList.md). Use native list semantics where they fit. |
| Tabbar | Partial: [Tabs](Tabs.md) for same-page panels. A destination navigation bar is missing. |
| Alertas (alerts) | Existing: [Alert](Alert.md). Urgency and announcement strategy depend on context. |
| Dialogs, Modal | Existing: [Modal](Modal.md), including confirmation. Focus and dismissal decisions depend on context. |
| Validação de formulários (form validation) | Partial: [Form](Form.md), [InputField](InputField.md), [Input](Input.md), [Textarea](Textarea.md). A reusable error summary is missing. |
| Toasts | Existing: [Notifications](Notifications.md). Announcement and timing limits are documented. |
| Breadcrumb | Missing: ordered hierarchical navigation. |
| Menu | Existing: [Menu](Menu.md). [Dropdown](Dropdown.md) is a dialog-style surface, not a menu keyboard model. |
| Links | Partial: [Button](Button.md) rendered as an anchor for action-shaped navigation. A dedicated inline Link is missing. |
| Paginação (pagination) | Partial: the internal [Table](Table.md) footer. A reusable public Pagination is missing. |
| Carrossel (carousel) | Missing: controlled slide navigation and rotation management. |
| Drag'n'Drop | Partial: [Table](Table.md) reordering and [FileUpload](FileUpload.md) file drop. Generic accessible reordering is missing. |
| Accordion | Missing: inline grouped disclosures. [Expand](Expand.md) is a floating dialog. |
| Detalhes e Mais informações (details) | Missing: reusable inline Disclosure. Native `details`/`summary` is an option. |
| Abas (tabs) | Existing: [Tabs](Tabs.md) for associated same-page panels. |
| Tooltip e Popover | Partial: [Tooltip](Tooltip.md), [Dropdown](Dropdown.md). A dedicated interactive Popover contract is missing. |
| Botão (button) | Existing: [Button](Button.md), with native action semantics. |
| Checkbox | Existing: [Checkbox](Checkbox.md). [TaskList](TaskList.md) is a checklist adaptation. |
| Radio Button | Existing: [Radiobox](Radiobox.md), with native grouping. |
| Input text | Existing: [Input](Input.md), [InputField](InputField.md). [Textarea](Textarea.md) adapts the text-field guidance. |
| Input email | Existing: [Input](Input.md) with `type="email"`. |
| Input search | Existing: [Input](Input.md) with `type="search"`. The application owns results and feedback. |
| Input password | Existing: [Input](Input.md) with `type="password"`. See the visibility-control limits. |
| Select (Combo) | Existing/adapted: [Select](Select.md), [MultiSelect](MultiSelect.md), [Autocomplete](Autocomplete.md). Verify custom behavior. |
| Slider | Existing: [Slider](Slider.md), with an accessible name and a readable value. |
| Switch | Existing: [Switch](Switch.md). Separate immediate settings from submitted checkbox choices. |

## Catalog

Read the component doc before using a component. Each row links the doc and shows the import.

### Core

| Component | Import | Use |
|---|---|---|
| [Button](Button.md) | `import { Button } from "@g4rcez/components/button"` | A versatile button component with multiple variants, sizes, and states. |
| [Heading](Heading.md) | `import { Heading } from "@g4rcez/components"` | Semantic heading wrapper that renders h2 by default and accepts a polymorphic element type. |
| [Polymorph](Polymorph.md) | `import { Polymorph } from "@g4rcez/components"` | A polymorphic component that renders as any HTML element while maintaining full TypeScript type safety. |
| [RenderOnView](RenderOnView.md) | `import { RenderOnView } from "@g4rcez/components"` | A performance wrapper that defers rendering children until the container enters the viewport. |
| [Resizable](Resizable.md) | `import { Resizable } from "@g4rcez/components"` | Motion wrapper that animates its height when content changes or when it opens and closes. |
| [Slot](Slot.md) | `import { Slot, Slottable } from "@g4rcez/components"` | A composition primitive that merges its props into a single child element, enabling the asChild pattern. |
| [Tag](Tag.md) | `import { Tag } from "@g4rcez/components/tag"` | A label/badge component for displaying metadata, status, or categorization information. |
| [Typography](Typography.md) | `import { Paragraph, Description, Info, PageTitle, PageHeader } from "@g4rcez/components"` | A set of text and page-structure components for consistent typographic styling. |

### Form

| Component | Import | Use |
|---|---|---|
| [Autocomplete](Autocomplete.md) | `import { Autocomplete } from "@g4rcez/components/autocomplete"` | Searchable select with fuzzy matching, virtualized options, keyboard navigation, and dynamic option creation. |
| [Checkbox](Checkbox.md) | `import { Checkbox } from "@g4rcez/components/checkbox"` | Styled checkbox with label support, task mode, error display, loading state, and size variants. |
| [DatePicker](DatePicker.md) | `import { DatePicker } from "@g4rcez/components/date-picker"` | Locale-aware date input with a masked field and an optional calendar or range picker. |
| [FileUpload](FileUpload.md) | `import { FileUpload } from "@g4rcez/components/file-upload"` | Drag-and-drop file upload area with file preview, modal viewer, and per-file deletion. |
| [Form](Form.md) | `import { Form } from "@g4rcez/components/form"` | Thin wrapper around the HTML form element that calls preventDefault automatically before invoking onSubmit. |
| [formReset](FormReset.md) | `import { formReset } from "@g4rcez/components"` | Utility function that resets all inputs and selects in a form to their default values and clears their initialization state. |
| [Input](Input.md) | `import { Input } from "@g4rcez/components/input"` | Text input with optional masking for currencies, percentages, phone numbers, dates, and custom regex patterns. |
| [InputField](InputField.md) | `import { InputField } from "@g4rcez/components"` | Low-level field wrapper that provides a label, tooltip, error message, feedback text, and left/right slots for any form control. |
| [MultiSelect](MultiSelect.md) | `import { MultiSelect } from "@g4rcez/components"` | Dropdown that lets users select multiple options with fuzzy search and tag display. |
| [Radiobox](Radiobox.md) | `import { Radiobox } from "@g4rcez/components/radiobox"` | Styled radio button for selecting one option from a mutually exclusive set. |
| [Select](Select.md) | `import { Select } from "@g4rcez/components/select"` | Styled native select component with validation, loading state, and form integration. |
| [Slider](Slider.md) | `import { Slider } from "@g4rcez/components"` | Range control for selecting one or more numeric values along a scale. |
| [Switch](Switch.md) | `import { Switch } from "@g4rcez/components/switch"` | Toggle switch for switching between two mutually exclusive states such as On/Off. |
| [TaskList](TaskList.md) | `import { TaskList } from "@g4rcez/components/task-list"` | Fieldset container with a reduced-motion-aware celebration when all child tasks are checked. |
| [Textarea](Textarea.md) | `import { Textarea } from "@g4rcez/components"` | Auto-growing multi-line text input built on the InputField foundation. |
| [DrawingEditor](drawing-editor.md) | `import { DrawingEditor, createDrawingScene } from "@g4rcez/components/drawing-editor"` | Controlled layered raster/vector drawing with bounded JSON scenes and flattened PNG export. |
| [RichTextEditor](rich-text-editor.md) | `import { RichTextEditor } from "@g4rcez/components/rich-text-editor"` | Controlled GFM Markdown editing with a safe rich view and an exact source view. |

### Display

| Component | Import | Use |
|---|---|---|
| [Alert](Alert.md) | `import { Alert } from "@g4rcez/components/alert"` | Collapsible, themed alert banner for displaying important messages and status updates. |
| [AnimatedList](AnimatedList.md) | `import { AnimatedList, AnimatedListItem } from "@g4rcez/components"` | Animated list that expands each item into a floating detail overlay on click. |
| [Calendar](Calendar.md) | `import { Calendar } from "@g4rcez/components/calendar"` | Interactive month calendar with single-date, date-time, and range selection modes. |
| [Card](Card.md) | `import { Card, StatsCard } from "@g4rcez/components/card"` | Polymorphic container for grouping related content with optional title header, loading state, and composable sub-components. |
| [Empty](Empty.md) | `import { Empty } from "@g4rcez/components"` | Empty state placeholder displayed when a collection or data set contains no items. |
| [List](List.md) | `import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list"` | Animated list that expands each item into a focused floating detail overlay when clicked. |
| [Masonry](Masonry.md) | `import { Masonry, MasonryItem } from "@g4rcez/components/masonry"` | Measured masonry layout that preserves source order while placing items in columns of uneven height. |
| [Notifications](Notifications.md) | `import { Notifications, useNotification } from "@g4rcez/components/notifications"` | Toast notification system with themes, stacking, swipe-to-dismiss, and programmatic control. |
| [Progress](Progress.md) | `import { Progress } from "@g4rcez/components"` | Accessible determinate progress bar with an optional label overlay. |
| [Shortcut](Shortcut.md) | `import { Shortcut } from "@g4rcez/components"` | Inline keyboard shortcut display with automatic OS-specific key symbol mapping. |
| [Skeleton](Skeleton.md) | `import { Skeleton, SkeletonCell, SkeletonList } from "@g4rcez/components"` | Accessible animated loading placeholders for blocks, cells, and lists. |
| [Spinner](Spinner.md) | `import { Spinner, Loading } from "@g4rcez/components"` | Accessible loading indicator for indeterminate work with a reduced-motion static state, plus an optional full-container wrapper. |
| [Stats](Stats.md) | `import { Stats } from "@g4rcez/components/stats"` | Metric display card with a prominent icon, value, and optional footer for trend or contextual data. |
| [Step](Step.md) | `import { Steps, Step } from "@g4rcez/components"` | Animated multi-step progress indicator with status tracking for checkout flows, onboarding, and wizards. |
| [SwipeableList](SwipeableList.md) | `import { SwipeableList } from "@g4rcez/components/swipeable-list"` | Virtualized list with draggable rows and configurable actions revealed from the left or right. |
| [Tabs](Tabs.md) | `import { Tabs, Tab } from "@g4rcez/components/tabs"` | Keyboard-accessible tab container for organizing content into switchable panels. |
| [Timeline](Timeline.md) | `import { Timeline, TimelineItem } from "@g4rcez/components/timeline"` | Vertical chronological event list with icon markers, body content, and optional right-side metadata. |
| [PdfViewer](pdf-viewer.md) | `import { PdfViewer } from "@g4rcez/components/pdf-viewer"` | Raster PDF page viewer with page navigation and zoom. The host app decodes the PDF. |
| [VideoPlayer](video-player.md) | `import { VideoPlayer } from "@g4rcez/components/video-player"` | Responsive video playback with accessible browser-owned controls and caption tracks. |

### Floating

| Component | Import | Use |
|---|---|---|
| [CommandPalette](CommandPalette.md) | `import { CommandPalette } from "@g4rcez/components"` | Searchable command palette with fuzzy search, keyboard shortcuts, and grouped commands. |
| [Dropdown](Dropdown.md) | `import { Dropdown } from "@g4rcez/components/dropdown"` | Floating dropdown panel with an optional title, arrow pointer, and automatic collision-aware positioning. |
| [Expand](Expand.md) | `import { Expand } from "@g4rcez/components/expand"` | A button that expands in-place into a floating container using shared-element layout animations. |
| [Menu](Menu.md) | `import { Menu, MenuItem } from "@g4rcez/components/menu"` | Floating application-action menu with nested submenus, keyboard navigation, hover support, and typeahead. |
| [Modal](Modal.md) | `import { Modal } from "@g4rcez/components/modal"` | Animated modal with dialog, drawer, and sheet variants; includes drag-to-resize and a programmatic confirm utility. |
| [Toolbar](Toolbar.md) | `import { Toolbar } from "@g4rcez/components"` | Sticky floating toolbar for surfacing persistent actions at the bottom of a scrollable area. |
| [Tooltip](Tooltip.md) | `import { Tooltip } from "@g4rcez/components/tooltip"` | Polymorphic tooltip for noninteractive descriptions, with hover/focus triggers, optional click mode, and cursor-following. |
| [Wizard](Wizard.md) | `import { Wizard } from "@g4rcez/components"` | Guided tour overlay that highlights page elements step-by-step with animated SVG masking and floating tooltips. |

### Table

| Component | Import | Use |
|---|---|---|
| [Table](Table.md) | `import { Table, createColumns, useTablePreferences, ColType } from "@g4rcez/components"` | Virtualized, sortable, filterable data table with column reordering, grouping, and pagination. |

### Calendar

| Component | Import | Use |
|---|---|---|
| [PageCalendar](PageCalendar.md) | `import { PageCalendar } from "@g4rcez/components"` | Full-page calendar with month, week, and day views, event filtering, and custom event rendering. |
