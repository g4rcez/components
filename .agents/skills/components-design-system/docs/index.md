---
title: "@g4rcez/components — Component Index"
description: Full component catalog for @g4rcez/components React design system
package: "@g4rcez/components"
---

# @g4rcez/components — Component Index

A React design system built on plain CSS, stable component selectors, and semantic design tokens.

**Installation:**

```bash

npm install @g4rcez/components
```

**Setup:**

```css
/* In an application stylesheet; alternatively import index.css for all components. */
@import "@g4rcez/components/foundation.css";
@import "@g4rcez/components/button.css";
```

## Theme and geometry customization

Read [Theme customization](theme-customization.md) for CSS-only setup, sparse overrides and reset/replacement, custom themes, root activation, cascade precedence, SSR hydration/nonce ownership, provider/preset integration, shadow controls, and breaking-release migration. Read [Geometry tokens](geometry-tokens.md) for spacing/rounding bases, reactive geometry fallbacks, and wrapper/portal boundaries. Import the theme API from `@g4rcez/components` or `@g4rcez/components/theme`:

| Export                                                                 | Purpose                                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `configureTheme`                                                       | Register/replace sparse named root overrides; return CSS without activating the theme |
| `createThemeCss`                                                       | Pure CSS serialization for SSR/static output                                          |
| `createThemeProperties`                                                | Pure sparse `{ tokens?, colors?, components? }` to custom-property object conversion  |
| `defaultLightThemeTokens`                                              | Generated shared defaults and light palette for inspection                            |
| `defaultDarkThemeTokens`                                               | Generated effective global/component dark colors, without shared geometry             |
| `themeTokenRegistry`                                                   | Supported shared, color, and component key inventory                                  |
| `defaultGeometryTokens`, `defaultGeometryBases`                        | Geometry inspection data, not automatic root declarations                             |
| `ThemeConfiguration`, `ThemeTokenOverrides`, `ThemeComponentOverrides` | Typed configuration and sparse override groups |

Defaults are supplied by foundation CSS, not mandatory JavaScript initialization. Activate dark with `.dark` on `<html>`; the API does not toggle it.

## Interaction design reference

The component references describe interaction behavior and acceptance criteria, not a visual theme or a React implementation. Use this library's existing components, themes, and semantic tokens for appearance.

Apply these principles before choosing variants:

- **Semantics follow the outcome.** Buttons perform actions; links navigate. Same-page tabs and destination navigation are different patterns. Choose heading levels from the document outline, not the desired font size.
- **Design idle, active, unavailable, and error states.** Explain what a control does before interaction, expose selected/expanded/invalid state, and give understandable feedback afterward. Do not rely on color or an icon alone.
- **Provide equivalent input paths.** Preserve visible keyboard focus and native activation keys. Touch, keyboard, and assistive-technology users must not depend on hover, swiping, or dragging alone.
- **Keep focus and reading order predictable.** Hidden content must not remain unexpectedly focusable. Opening, closing, removing, and replacing content need an explicit focus strategy appropriate to the pattern.
- **Match feedback to urgency.** Use persistent field errors and alerts for information that must remain available. Toasts must not be the only record of a critical outcome. Avoid excessive announcements and unexpected focus changes.
- **Verify the composed product.** Check names, roles, state, keyboard behavior, desktop/mobile screen readers, touch, enlargement, contrast, and reduced motion. The Given/When/Then criteria in component references are verification targets, not evidence of WCAG conformance.

### Component coverage

The interaction patterns are mapped below. **Existing** means a public API covers the pattern, not that every criterion has been tested. **Partial** means coverage is limited to a variant, internal feature, or consumer composition. **Missing** means there is no complete reusable API for that pattern. Proposed additions and their acceptance criteria live in the repository-root `MISSING_COMPONENTS.md`; that backlog is not a list of current package exports.

| Component pattern           | Library reference / coverage                                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Títulos (Cabeçalhos)        | Existing: [Heading](Heading.md); [Typography](Typography.md) documents fixed-level page titles                                          |
| Tabelas                     | Existing: [Table](Table.md), with consumer-owned captions and interaction checks                                                        |
| Listas                      | Existing/adapted: [List](List.md), [AnimatedList](AnimatedList.md); use native list semantics where appropriate                         |
| Tabbar                      | Partial: [Tabs](Tabs.md) for same-page panels; destination navigation bar missing                                                       |
| Alertas                     | Existing: [Alert](Alert.md); urgency and announcement strategy depend on context                                                        |
| Dialogs                     | Existing: [Modal](Modal.md), including confirmation behavior                                                                            |
| Validação de formulários    | Partial: [Form](Form.md), [InputField](InputField.md), [Input](Input.md), [Textarea](Textarea.md); reusable error summary missing       |
| Toasts                      | Existing: [Notifications](Notifications.md), with documented announcement/timing limits                                                 |
| Breadcrumb                  | Missing: ordered hierarchical navigation component                                                                                      |
| Menu                        | Existing: [Menu](Menu.md); [Dropdown](Dropdown.md) is a dialog-style surface, not a menu keyboard model                                 |
| Links                       | Partial: [Button](Button.md) rendered as an anchor for action-shaped navigation; dedicated inline Link missing                          |
| Paginação                   | Partial: internal [Table](Table.md) footer; reusable public Pagination missing                                                          |
| Carrossel                   | Missing: controlled slide navigation and rotation management                                                                            |
| Drag'n'Drop                 | Partial: [Table](Table.md) reordering and [FileUpload](FileUpload.md) file dropping; generic accessible reordering missing              |
| Accordion                   | Missing: inline grouped disclosures; [Expand](Expand.md) is a floating dialog                                                           |
| Detalhes e Mais informações | Missing: reusable inline Disclosure/Details; native `details`/`summary` is a consumer option                                            |
| Abas                        | Existing: [Tabs](Tabs.md) for associated same-page panels                                                                               |
| Tooltip e Popover           | Partial: [Tooltip](Tooltip.md) and [Dropdown](Dropdown.md); dedicated interactive Popover contract missing                              |
| Modal                       | Existing: [Modal](Modal.md), with context-dependent focus and dismissal decisions                                                       |
| Botão                       | Existing: [Button](Button.md), using native action semantics                                                                            |
| Checkbox                    | Existing: [Checkbox](Checkbox.md); [TaskList](TaskList.md) is a checklist adaptation                                                    |
| Radio Button                | Existing: [Radiobox](Radiobox.md), with native grouping                                                                                 |
| Input text                  | Existing: [Input](Input.md), [InputField](InputField.md); [Textarea](Textarea.md) adapts text-field guidance                            |
| Input email                 | Existing: [Input](Input.md) with `type="email"`                                                                                         |
| Input search                | Existing: [Input](Input.md) with `type="search"`; application owns results and feedback                                                 |
| Input password              | Existing: [Input](Input.md) with `type="password"`; see visibility-control limitations                                                  |
| Select (Combo)              | Existing/adapted: [Select](Select.md), [MultiSelect](MultiSelect.md), [Autocomplete](Autocomplete.md); custom behavior must be verified |
| Slider                      | Existing: [Slider](Slider.md), with an accessible name and understandable value                                                         |
| Switch                      | Existing: [Switch](Switch.md); distinguish immediate settings from submitted checkbox choices                                          

## All Components

| Component       | Category | Import                                                                                     | Description                                                               |
| --------------- | -------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| VideoPlayer | Display | `import { VideoPlayer } from "@g4rcez/components/video-player"` | Browser-owned playback controls, captions and responsive video |
| RichTextEditor | Form | `import { RichTextEditor } from "@g4rcez/components/rich-text-editor"` | Controlled sanitized Markdown rich/source editing, formatting and selection |
| DrawingEditor | Form | `import { DrawingEditor } from "@g4rcez/components/drawing-editor"` | Retained drawing layers, transforms, selection masks and PNG export |
| Button          | Core     | `import { Button } from "@g4rcez/components/button"`                                       | Versatile button with multiple variants, sizes, and polymorphic rendering |
| Tag             | Core     | `import { Tag } from "@g4rcez/components/tag"`                                             | Label/badge for metadata, status, and categorization                      |
| Heading         | Core     | `import { Heading } from "@g4rcez/components"`                                             | Semantic heading with consistent typography tokens                        |
| Polymorph       | Core     | `import { Polymorph } from "@g4rcez/components"`                                           | Polymorphic base component for rendering as any HTML element              |
| RenderOnView    | Core     | `import { RenderOnView } from "@g4rcez/components"`                                        | Lazy-renders children when they scroll into the viewport                  |
| Resizable       | Core     | `import { Resizable } from "@g4rcez/components"`                                           | Drag-to-resize panel container                                            |
| Slot            | Core     | `import { Slot } from "@g4rcez/components"`                                                | Render-prop slot for component composition                                |
| Typography APIs | Core     | `import { Paragraph, Description, Info, PageTitle, PageHeader } from "@g4rcez/components"` | Text and fixed-level page-title compositions                              |
| Alert           | Display  | `import { Alert } from "@g4rcez/components/alert"`                                         | Dismissible alert for messages, warnings, and status updates              |
| AnimatedList    | Display  | `import { AnimatedList, AnimatedListItem } from "@g4rcez/components"`                      | Unordered summary-to-detail list with a modal panel                       |
| Calendar        | Display  | `import { Calendar } from "@g4rcez/components/calendar"`                                   | Inline date picker calendar                                               |
| Card            | Display  | `import { Card } from "@g4rcez/components/card"`                                           | Surface container with card tokens and elevation                          |
| Empty           | Display  | `import { Empty } from "@g4rcez/components"`                                               | Empty state placeholder with optional icon and action                     |
| List reference  | Display  | `import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list"`                 | Same AnimatedList API through the list subpath                            |
| Masonry         | Display  | `import { Masonry } from "@g4rcez/components/masonry"`                                     | Measured masonry layout that preserves source order                       |
| Notifications   | Display  | `import { Notifications } from "@g4rcez/components/notifications"`                         | Toast notification system with queue management                           |
| Progress        | Display  | `import { Progress } from "@g4rcez/components"`                                            | Progress bar with themed fill                                             |
| Shortcut        | Display  | `import { Shortcut } from "@g4rcez/components"`                                            | Keyboard shortcut badge display                                           |
| Skeleton        | Display  | `import { Skeleton } from "@g4rcez/components"`                                            | Accessible loading placeholder with pulse animation                       |
| Spinner         | Display  | `import { Spinner } from "@g4rcez/components"`                                             | Accessible indeterminate loading spinner                                  |
| SwipeableList   | Display  | `import { SwipeableList } from "@g4rcez/components/swipeable-list"`                        | Virtualized list with swipe-revealed actions                              |
| Stats           | Display  | `import { Stats } from "@g4rcez/components/stats"`                                         | Metric/statistics display with label and value                            |
| Step            | Display  | `import { Step } from "@g4rcez/components"`                                                | Multi-step wizard progress indicator                                      |
| Tabs            | Display  | `import { Tabs } from "@g4rcez/components/tabs"`                                           | Same-page tab panels with automatic keyboard selection                    |
| Timeline        | Display  | `import { Timeline } from "@g4rcez/components/timeline"`                                   | Vertical event timeline with themed markers                               |
| Autocomplete    | Form     | `import { Autocomplete } from "@g4rcez/components/autocomplete"`                           | Text input with dropdown suggestions                                      |
| Checkbox        | Form     | `import { Checkbox } from "@g4rcez/components/checkbox"`                                   | Checkbox with indeterminate support                                       |
| DatePicker      | Form     | `import { DatePicker } from "@g4rcez/components/date-picker"`                              | Date input with calendar popover                                          |
| FileUpload      | Form     | `import { FileUpload } from "@g4rcez/components/file-upload"`                              | Drag-and-drop file upload with preview                                    |
| Form            | Form     | `import { Form } from "@g4rcez/components/form"`                                           | Minimal form wrapper that prevents default submit behavior                |
| FormReset       | Form     | `import { FormReset } from "@g4rcez/components"`                                           | Reset button wired to the nearest Form context                            |
| Input           | Form     | `import { Input } from "@g4rcez/components/input"`                                         | Text input with mask, prefix/suffix, and error states                     |
| InputField      | Form     | `import { InputField } from "@g4rcez/components"`                                          | Input with label, helper text, and error message                          |
| MultiSelect     | Form     | `import { MultiSelect } from "@g4rcez/components"`                                         | Multi-value select with search and tag display                            |
| Radiobox        | Form     | `import { Radiobox } from "@g4rcez/components/radiobox"`                                   | Native radio input; consumers provide group name and legend               |
| Select          | Form     | `import { Select } from "@g4rcez/components/select"`                                       | Labeled native select; use Autocomplete for searchable choices            |
| Slider          | Form     | `import { Slider } from "@g4rcez/components"`                                              | Range slider input                                                        |
| Switch          | Form     | `import { Switch } from "@g4rcez/components/switch"`                                       | Toggle switch for boolean values                                          |
| TaskList        | Form     | `import { TaskList } from "@g4rcez/components/task-list"`                                  | Checklist with completion tracking                                        |
| Textarea        | Form     | `import { Textarea } from "@g4rcez/components"`                                            | Multi-line text input with auto-resize                                    |
| CommandPalette  | Floating | `import { CommandPalette } from "@g4rcez/components"`                                      | Spotlight-style command palette with keyboard navigation                  |
| Dropdown        | Floating | `import { Dropdown } from "@g4rcez/components/dropdown"`                                   | Named nonmodal dialog anchored to a built-in button                       |
| Expand          | Floating | `import { Expand } from "@g4rcez/components/expand"`                                       | Button-triggered floating dialog with managed focus                       |
| Menu            | Floating | `import { Menu } from "@g4rcez/components/menu"`                                           | Context menu or navigation menu                                           |
| Modal           | Floating | `import { Modal } from "@g4rcez/components/modal"`                                         | Dialog overlay with focus trap and scroll lock                            |
| Toolbar         | Floating | `import { Toolbar } from "@g4rcez/components"`                                             | Grouped action bar with button slots                                      |
| Tooltip         | Floating | `import { Tooltip } from "@g4rcez/components/tooltip"`                                     | Hover tooltip with floating positioning                                   |
| Wizard          | Floating | `import { Wizard } from "@g4rcez/components"`                                              | Multi-step guided flow overlay                                            |
| Table           | Table    | `import { Table } from "@g4rcez/components/table"`                                         | Feature-rich data table with sorting, filtering, and virtualization       |
| PageCalendar | Calendar | `import { PageCalendar } from "@g4rcez/components"` | Full-page calendar with month, week, and day views |

## Core

| Component       | Import                                                                                     | Description                                                               |
| --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Button          | `import { Button } from "@g4rcez/components/button"`                                       | Versatile button with multiple variants, sizes, and polymorphic rendering |
| Tag             | `import { Tag } from "@g4rcez/components/tag"`                                             | Label/badge for metadata, status, and categorization                      |
| Heading         | `import { Heading } from "@g4rcez/components"`                                             | Semantic heading with consistent typography tokens                        |
| Polymorph       | `import { Polymorph } from "@g4rcez/components"`                                           | Polymorphic base component for rendering as any HTML element              |
| RenderOnView    | `import { RenderOnView } from "@g4rcez/components"`                                        | Lazy-renders children when they scroll into the viewport                  |
| Resizable       | `import { Resizable } from "@g4rcez/components"`                                           | Drag-to-resize panel container                                            |
| Slot            | `import { Slot } from "@g4rcez/components"`                                                | Render-prop slot for component composition                                |
| Typography APIs | `import { Paragraph, Description, Info, PageTitle, PageHeader } from "@g4rcez/components"` | Text and fixed-level page-title compositions                              |

## Display

| Component      | Import                                                                     | Description                                                  |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Alert          | `import { Alert } from "@g4rcez/components/alert"`                         | Dismissible alert for messages, warnings, and status updates |
| AnimatedList   | `import { AnimatedList, AnimatedListItem } from "@g4rcez/components"`      | Unordered summary-to-detail list with a modal panel          |
| Calendar       | `import { Calendar } from "@g4rcez/components/calendar"`                   | Inline date picker calendar                                  |
| Card           | `import { Card } from "@g4rcez/components/card"`                           | Surface container with card tokens and elevation             |
| Empty          | `import { Empty } from "@g4rcez/components"`                               | Empty state placeholder with optional icon and action        |
| List reference | `import { AnimatedList, AnimatedListItem } from "@g4rcez/components/list"` | Same AnimatedList API through the list subpath               |
| Masonry        | `import { Masonry } from "@g4rcez/components/masonry"`                     | Measured masonry layout that preserves source order          |
| Notifications  | `import { Notifications } from "@g4rcez/components/notifications"`         | Toast notification system with queue management              |
| Progress       | `import { Progress } from "@g4rcez/components"`                            | Progress bar with themed fill                                |
| Shortcut       | `import { Shortcut } from "@g4rcez/components"`                            | Keyboard shortcut badge display                              |
| Skeleton       | `import { Skeleton } from "@g4rcez/components"`                            | Accessible loading placeholder with pulse animation          |
| Spinner        | `import { Spinner } from "@g4rcez/components"`                             | Accessible indeterminate loading spinner                     |
| SwipeableList  | `import { SwipeableList } from "@g4rcez/components/swipeable-list"`        | Virtualized list with swipe-revealed actions                 |
| Stats          | `import { Stats } from "@g4rcez/components/stats"`                         | Metric/statistics display with label and value               |
| Step           | `import { Step } from "@g4rcez/components"`                                | Multi-step wizard progress indicator                         |
| Tabs           | `import { Tabs } from "@g4rcez/components/tabs"`                           | Same-page tab panels with automatic keyboard selection       |
| Timeline       | `import { Timeline } from "@g4rcez/components/timeline"`                   | Vertical event timeline with themed markers                  |

## Form

| Component    | Import                                                           | Description                                                    |
| ------------ | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Autocomplete | `import { Autocomplete } from "@g4rcez/components/autocomplete"` | Text input with dropdown suggestions                           |
| Checkbox     | `import { Checkbox } from "@g4rcez/components/checkbox"`         | Checkbox with indeterminate support                            |
| DatePicker   | `import { DatePicker } from "@g4rcez/components/date-picker"`    | Date input with calendar popover                               |
| FileUpload   | `import { FileUpload } from "@g4rcez/components/file-upload"`    | Drag-and-drop file upload with preview                         |
| Form         | `import { Form } from "@g4rcez/components/form"`                 | Prevents default submit behavior                               |
| FormReset    | `import { FormReset } from "@g4rcez/components"`                 | Reset button wired to the nearest Form context                 |
| Input        | `import { Input } from "@g4rcez/components/input"`               | Text input with mask, prefix/suffix, and error states          |
| InputField   | `import { InputField } from "@g4rcez/components"`                | Input with label, helper text, and error message               |
| MultiSelect  | `import { MultiSelect } from "@g4rcez/components"`               | Multi-value select with search and tag display                 |
| Radiobox     | `import { Radiobox } from "@g4rcez/components/radiobox"`         | Native radio input; consumers provide group name and legend    |
| Select       | `import { Select } from "@g4rcez/components/select"`             | Labeled native select; use Autocomplete for searchable choices |
| Slider       | `import { Slider } from "@g4rcez/components"`                    | Range slider input                                             |
| Switch       | `import { Switch } from "@g4rcez/components/switch"`             | Toggle switch for boolean values                               |
| TaskList     | `import { TaskList } from "@g4rcez/components/task-list"`        | Checklist with completion tracking                             |
| Textarea     | `import { Textarea } from "@g4rcez/components"`                  | Multi-line text input with auto-resize                         |

## Floating

| Component      | Import                                                   | Description                                              |
| -------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| CommandPalette | `import { CommandPalette } from "@g4rcez/components"`    | Spotlight-style command palette with keyboard navigation |
| Dropdown       | `import { Dropdown } from "@g4rcez/components/dropdown"` | Named nonmodal dialog anchored to a built-in button      |
| Expand         | `import { Expand } from "@g4rcez/components/expand"`     | Button-triggered floating dialog with managed focus      |
| Menu           | `import { Menu } from "@g4rcez/components/menu"`         | Context menu or navigation menu                          |
| Modal          | `import { Modal } from "@g4rcez/components/modal"`       | Dialog overlay with focus trap and scroll lock           |
| Toolbar        | `import { Toolbar } from "@g4rcez/components"`           | Grouped action bar with button slots                     |
| Tooltip        | `import { Tooltip } from "@g4rcez/components/tooltip"`   | Hover tooltip with floating positioning                  |
| Wizard         | `import { Wizard } from "@g4rcez/components"`            | Multi-step guided flow overlay                           |

## Table

| Component | Import                                             | Description                                                         |
| --------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| Table     | `import { Table } from "@g4rcez/components/table"` | Feature-rich data table with sorting, filtering, and virtualization |

## Calendar

| Component    | Import                                              | Description                                        |
| ------------ | --------------------------------------------------- | -------------------------------------------------- |
| PageCalendar | `import { PageCalendar } from "@g4rcez/components"` | Full-page calendar with month, week, and day views |

## Design Token Quick Reference

Use canonical `--var-*` properties in plain CSS, or use `configureTheme` for sparse root-level overrides. The default scope is `:root`; dark activation is `.dark` on `<html>`. See [Theme customization](theme-customization.md) for examples and precedence. See individual component docs for the full token list per component.

## Setup

```css
/* Import in an application stylesheet. */
@import "@g4rcez/components/index.css";
```
