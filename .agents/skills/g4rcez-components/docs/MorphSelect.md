---
title: MorphSelect
description: Select whose trigger grows into the list, with a gliding highlight, type-ahead, groups and optional search.
package: "@g4rcez/components"
export: "{ MorphSelect }"
import: "import { MorphSelect } from '@g4rcez/components'"
category: form
---

# MorphSelect

A select whose trigger grows into the option list. A single highlight glides between options, the value rolls up or down depending on where the new option sits in the list, and the list supports groups, icons, trailing meta text, type-ahead and optional search. `Select` stays the native, form-field select; use `MorphSelect` for compact pickers such as a language, a runtime or a package manager.

## Import

```tsx
import { MorphSelect, type MorphSelectItem } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | required | Visible label. Also the accessible name. |
| `hideLabel` | `boolean` | `false` | Keeps the label for assistive technology only. |
| `items` | `MorphSelectItem[]` | required | Options or groups, in display order. |
| `value` | `string \| null` | — | Controlled value. `null` is a controlled empty selection. |
| `defaultValue` | `string \| null` | `null` | Uncontrolled starting value. |
| `onValueChange` | `(value, option) => void` | — | Called with the new value and its option. |
| `placeholder` | `string` | `"Select"` (translatable) | Trigger text when nothing is selected. |
| `searchable` | `boolean \| "auto"` | `"auto"` | Adds a search field while open. `"auto"` turns it on above eight options. |
| `searchPlaceholder` | `string` | selected label, then `"Search"` | Placeholder of the search field. |
| `panelWidth` | `number` | `272` | Width of the open surface in px. Never narrower than the trigger, and limited to the room on the side it grows toward. |
| `maxListHeight` | `number` | `296` | Tallest the list gets, in px, before it scrolls. |
| `align` | `"start" \| "end"` | `"start"` | Which trigger edge stays fixed while the surface grows. Use `"end"` near the right edge. |
| `name` | `string` | — | Adds a hidden input so the value submits with a native form. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` | `string` | — | Extra class on the root. |
| `translations` | `Partial<Translations>` | — | Overrides `morphSelectPlaceholder`, `morphSelectSearch`, `morphSelectNoMatches` and `morphSelectResults`. |

An item is an option `{ value, label, icon?, meta?, keywords?, disabled? }` or a group `{ label, options }`. `meta` is trailing text such as a release year or a count and is searchable; `keywords` are extra search terms such as synonyms.

## Design Tokens

It reuses the Button geometry for the trigger and the surface header.

| Token | Use |
| --- | --- |
| `--var-button-height`, `--var-button-px`, `--var-button-gap`, `--var-button-font-size` | Trigger and header size |
| `--var-button-rounded` | Closed corner radius. The open radius is half again as large and animates between the two. |
| `--var-color-background`, `--var-color-foreground`, `--var-color-border` | Surface, text and hairline |
| `--var-color-muted`, `--var-color-muted-foreground` | Highlight, group labels, meta text and placeholder |
| `--var-color-primary` | The check on the selected option |
| `--var-color-ring` | Focus ring |
| `--var-shadow-floating`, `--var-layer-floating` | Open surface elevation and layer |

## Examples

### Language picker

```tsx
import { FileRsIcon, FileTsIcon } from "@phosphor-icons/react";
import { MorphSelect, type MorphSelectItem } from "@g4rcez/components";

const items: MorphSelectItem[] = [
    { value: "rust", label: "Rust", icon: <FileRsIcon aria-hidden /> },
    { value: "coffeescript", label: "CoffeeScript", disabled: true, meta: "legacy" },
    { value: "typescript", label: "TypeScript", icon: <FileTsIcon aria-hidden /> },
];

export default function LanguagePicker() {
    const [value, setValue] = useState<string | null>("rust");
    return <MorphSelect label="Language" items={items} value={value} onValueChange={setValue} />;
}
```

### Groups, meta text and search

```tsx
const paradigms: MorphSelectItem[] = [
    { label: "Systems", options: [{ value: "rust", label: "Rust", meta: "2010", keywords: ["borrow checker", "cargo"] }] },
    { label: "Functional", options: [{ value: "elixir", label: "Elixir", meta: "2011", keywords: ["beam", "erlang"] }] },
];

<MorphSelect label="Language" items={paradigms} searchable placeholder="Choose a language" />;
```

### In a native form

```tsx
<form onSubmit={(event) => save(new FormData(event.currentTarget))}>
    <MorphSelect label="Runtime" name="runtime" items={runtimes} defaultValue="node" />
</form>
```

## Do

- Use it for compact pickers and form fields with up to a few hundred options.
- Add `keywords` so search matches synonyms, and `meta` for trailing facts such as counts.
- Use `align="end"` for triggers near the right edge so the surface grows leftward.
- Pass `name` to submit the value with a native form.

## Don't

- Don't use it for mostly free-text entry or very long remote lists. Use `Autocomplete`.
- Don't use it to choose several values. Use `MultiSelect`.
- Don't use it for actions rather than stored values. Use `Menu`.
- Don't use it inside an ancestor with `overflow: hidden` that is smaller than the list: the surface grows in place, not in a portal, so it would be clipped.

## Interaction design and acceptance criteria

- Closed: Enter, Space, ArrowDown or ArrowUp open the list on the selected option (or the first enabled one). Home and End open it on the first or last enabled option. A printable character opens it on the first match, or starts a search when search is on.
- Open, no search: ArrowDown and ArrowUp move the active option, skipping disabled ones and stopping at the ends. PageDown and PageUp move eight at a time. Home and End jump. Enter or Space picks. Alt+ArrowUp picks the active option and closes. Printable characters jump to the next option whose label starts with the typed text; the same letter repeated cycles; the buffer resets after 500ms and whenever the list opens or closes.
- Open, with search: the search input replaces the trigger as the combobox. Typing filters by label, meta and keywords, ignoring case and accents, and the first match becomes active. Space types a space, and Home, End and the caret keys belong to the input. Enter picks the active match.
- Escape closes without picking and returns focus to the trigger. Tab closes without picking and lets focus move on. A press outside, or focus leaving the component, closes it.
- Picking calls `onValueChange(value, option)`, closes the list and returns focus to the trigger. A disabled option cannot be picked.
- The open surface grows from the trigger's own box. It opens upward when there is not enough room below and more room above.

## Accessibility

- The trigger is a `role="combobox"` button with `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant` pointing at the active option. Its name is the label plus the current value.
- With search on, the input becomes the combobox (`aria-autocomplete="list"`, named by the label) and the covered trigger is `aria-hidden` and not tabbable.
- Options are `role="option"` with `aria-selected` and `aria-disabled`. Groups are `role="group"` labelled by their heading. Focus stays on the combobox, so options are not tab stops.
- A polite status announces the result count or "No matches" while searching.
- The label stays in the accessibility tree when `hideLabel` is set. Hover highlighting follows the mouse only; on touch a tap selects directly.

## Notes

- Reduced motion sets the surface size instantly and drops the roll and the glide.
- The trigger width springs to fit the value; the surface width, height and radius animate from the trigger's measured box, and the height follows the content as the search filters it.
- All options render: there is no virtualization, so keep lists to a few hundred.
- Composes [RollingText](RollingText.md).

## Verification

Acceptance criteria for tests and reviews: [verify/MorphSelect.md](verify/MorphSelect.md).
