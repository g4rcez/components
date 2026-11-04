---
title: MultiSelect
description: Dropdown that lets users select multiple options with fuzzy search and tag display.
package: "@g4rcez/components"
export: "{ MultiSelect }"
import: "import { MultiSelect } from '@g4rcez/components'"
category: form
---

# MultiSelect

Dropdown that lets users select multiple options with fuzzy search and tag display.

## Import

```tsx
import { MultiSelect } from "@g4rcez/components";
```

## Props

The `MultiSelect` component inherits all props from `InputField`, plus:

| Prop              | Type                                                           | Default    | Description                                                                                        |
| ----------------- | -------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `options`         | `MultiSelectItemProps[]`                                       | —          | Array of `{ value, label, Render? }` option objects.                                               |
| `size`            | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared control size inherited from `InputField`.                                                   |
| `value`           | `string[]`                                                     | —          | Controlled selected values.                                                                        |
| `defaultValue`    | `string[]`                                                     | `[]`       | Initial selected values for uncontrolled usage.                                                    |
| `onChangeOptions` | `(options: string[]) => void`                                  | —          | Called when the selection changes.                                                                 |
| `renderTag`       | `(option) => ReactNode`                                        | —          | Customizes the content shown inside each selected tag.                                             |
| `dynamicOption`   | `boolean`                                                      | `false`    | Allows users to select their search query as a new option.                                         |
| `emptyMessage`    | `Label`                                                        | —          | Message shown when no options match the search.                                                    |
| `selectedLabel`   | `string`                                                       | —          | Accepted, but the overflow counter currently uses `translations.multiSelectSelectedLabel` instead. |

### MultiSelectItemProps

Extends `OptionProps` with an optional custom renderer:

| Field    | Type                    | Description                                  |
| -------- | ----------------------- | -------------------------------------------- |
| `value`                                                 | `string`                | Option value.                                 |
| `label`                                                 | `string`                | Option display text.                          |
| `Render`                                                | `React.FC<OptionProps>` | Custom render component for the dropdown row. |
| `hidden`                                                | `boolean`               | Hides the option from the list.               |

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                   | Library default                         |
| ------------------------------------------ | --------------------------------------- |
| `--var-multi-select-field-min-inline-size` | `calc(var(--var-spacing-base) * 12)`    |
| `--var-multi-select-tag-remove-icon-size`  | `calc(var(--var-spacing-base) * 0.875)` |
| `--var-input-field-icon-size`              | `calc(var(--var-spacing-base) * 1)`     |
| `--var-input-field-small-icon-size` | `calc(var(--var-spacing-base) * 0.875)` |

Popup maximum height and initial estimates scale with density; measured list content keeps its physical size. Virtualizer pixel estimates are not fixed CSS dimensions. The component reads these tokens. Customize by overriding these CSS variables in your theme.

| Token | CSS Variable                    | Purpose                                         |
| ------------------------------- | ----------------------------------------------- | ----------------------------- |
| CSS override                    | `--var-multi-select-field-min-inline-size`      | Minimum field width           |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground`        | Placeholder text color        |
| `placeholder-input-mask-error`  | `--var-free-text-error-placeholder-foreground`  | Error placeholder color       |
| `border-input-border`           | `--var-color-border`                            | Search input bottom border    |
| `bg-floating-background`        | `--var-dropdown-surface-background`             | Dropdown panel background     |
| `border-floating-border`        | `--var-dropdown-surface-border`                 | Dropdown panel border         |
| CSS override                    | `--var-multi-select-option-background-hover`    | Option hover/focus background |
| CSS override                    | `--var-multi-select-option-selected-background` | Selected option background    |
| CSS override                    | `--var-multi-select-option-selected-foreground` | Selected option text          |
| `text-floating-foreground`      | `--var-dropdown-surface-foreground`             | Default option text           |
| `text-input-placeholder`        | `--var-free-text-placeholder-foreground`        | Placeholder li color          |
| `text-disabled`                 | `--var-color-disabled`                          | Empty-state text              |
| `focus:ring-ring`               | `--var-color-ring`                              | Field focus ring color        |
| `h-input-height`                | `--var-free-text-control-height`                | Default trigger height        |
| `px-input-padding-x`            | `--var-free-text-surface-padding-inline`        | Horizontal padding            |
| `py-input-padding-y`            | `--var-free-text-surface-padding-block`         | Vertical padding              |

## Examples

### Basic usage

```tsx
import { MultiSelect } from "@g4rcez/components";
const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
];
export default function FrameworkPicker() {
    return <MultiSelect title="Frameworks" options={options} onChangeOptions={(values) => console.log(values)} />;
}
```

### Controlled selection

```tsx
import { useState } from "react";
import { MultiSelect } from "@g4rcez/components";
export default function ControlledMultiSelect() {
    const [selected, setSelected] = useState<string[]>(["react"]);
    return (
        <MultiSelect
            title="Frameworks"
            options={[
                { value: "react", label: "React" },
                { value: "vue", label: "Vue" },
                { value: "angular", label: "Angular" },
            ]}
            value={selected}
            onChangeOptions={setSelected}
        />
    );
}
```

### Custom option rendering

```tsx
import { ShieldIcon } from "@phosphor-icons/react";
import { MultiSelect } from "@g4rcez/components";
const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.name,
    Render: () => (
        <span className="flex items-center gap-base">
            {" "}
            <ShieldIcon size={14} className="text-primary" /> {r.name}{" "}
        </span>
    ),
}));
export default function RolePicker() {
    return <MultiSelect title="Roles" options={roleOptions} onChangeOptions={(ids) => console.log(ids)} />;
}
```

### Custom tag content

```tsx
import { MultiSelect } from "@g4rcez/components";
export default function TeamPicker() {
    return (
        <MultiSelect
            title="Team"
            options={teamMembers}
            renderTag={(member) => <span>{member.label} · active</span>}
            onChangeOptions={(members) => console.log(members)}
        />
    );
}
```

The component keeps its tag container and remove button when `renderTag` is used; the callback only replaces the tag content.

### Dynamic option creation

```tsx
import { MultiSelect } from "@g4rcez/components";
export default function TagInput() {
    return <MultiSelect title="Tags" dynamicOption options={existingTags} onChangeOptions={(tags) => console.log(tags)} />;
}
```

## Do

- Provide a descriptive `title` to label the trigger.
- Use `dynamicOption` when users may need to add items not in the predefined list.
- Use design-token classes for any wrapper elements (`bg-background`, `border-border`, `text-foreground`).
- Use `theme="<value>"` on nested elements — never hardcode colors in `className`.

## Don't

- Don't use `MultiSelect` when only a single selection is needed — use `Select` or `Autocomplete` instead.
- Don't pass raw utility color classes (`bg-blue-500`, `text-white`) — use theme props or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use `color-mix` in className or style props for theming.

## Interaction design and acceptance criteria

Adapted from: Select (Combo). This is a **multi-selection adaptation**, not a dedicated MultiSelect page or a native select contract. The criteria are integration checks and design targets, not executed accessibility tests. - Use this compact, searchable control when several independent values may be selected. Prefer a visible [Checkbox](Checkbox.md) group when choices need comparison or reliable native disabled behavior. Use [Select](Select.md) or [Autocomplete](Autocomplete.md) for a single value.

- Focus, clicking, or tapping the display opens the popup and moves focus into search. Selecting an option toggles membership without closing the popup; tags and the overflow count summarize the selection. Keep the title persistent and custom option/tag content noninteractive so it does not compete with selection or the provided remove buttons.
- Search Arrow Up/Down moves the active descendant, Enter/Space toggles it, and Escape closes. Space can select instead of inserting a space in the query. The popup uses modal focus management and does not request focus return on close: verify Tab/Shift+Tab, dismissal, and a usable focus destination instead of promising native-select navigation.
- **Current limits:** the listbox does not set `aria-multiselectable`; there is no result-count/selection live region. Pointer selection guards disabled options, but keyboard selection does not skip or reject them. The disabled fieldset does not itself disable the `div` trigger or portalled popup, and their handlers have no disabled guard. Do not rely on `disabled` or disabled options to enforce unavailable choices in this custom interaction path.
- Consumers own committed-array validation (`required` on the hidden input does not provide native constraint validation), controlled updates through `onChangeOptions`, and persistence of dynamically created options in `options`. Controlled tags are derived from options found by value. Verify selected-state announcements, error descriptions, tag-removal names (currently English `Remove …`), and touch target comfort in the chosen language/theme.

## Acceptance criteria

1. **Current behavior:** Given an enabled field, when its display is clicked, tapped, or focused, then the popup search receives focus and references the visible listbox and field label.
2. **Current behavior:** Given enabled matching options, when an option is clicked or selected with Arrow Up/Down and Enter/Space, then its membership toggles, `onChangeOptions` receives the proposed array, and the popup remains open; controlled tags change only after the parent accepts the array.
3. **Current behavior:** Given selected tags, when a provided `Remove …` button or the clear action is activated, then the callback receives the remaining values or `[]`; accepted state updates the tags and comma-separated hidden form value.
4. **Integration target:** Given an open popup, when Escape, Tab/Shift+Tab, or outside dismissal is used, then the person can leave the interaction with visible focus in a useful place. Verify this explicitly because modal focus management uses `returnFocus={false}`.
5. **Integration target — current gaps:** Given disabled choices or a required selection, when keyboard/pointer and assistive-technology flows are reviewed, then unavailable values must not be accepted, committed-array validation must run, and multiple selected values must be understandable. The current disabled-keyboard path and missing multiselectable state do not establish this target.

## Accessibility

- The closed display has `role="combobox"`; while open it becomes presentational and the popup search input is the combobox.
- Both reference the field label and listbox, with expanded/active-descendant state. Options are non-tab-stop elements with `role="option"`, `aria-selected`, and `aria-disabled`; their visual checkboxes are inert and hidden from assistive technology.
- `FloatingFocusManager` is modal, starts focus in the search input, and uses `returnFocus={false}`. Automatic return to the trigger is not promised.
- Search-input Arrow Up/Down updates the active option; Enter or Space toggles it, and Escape closes the popup. Disabled-option keyboard selection is not guarded.

## Data Attributes

| Attribute | Element

| Value            | Description     |
| ---------------- | --------------- |
| `data-component` | fieldset |
| `data-shadow` | visible trigger |
| `data-value` | visible trigger |
| `data-floating` | dropdown root |
| `data-dynamic` | option |
| `data-error` | visible trigger |
| `data-origin` | hidden input |

`"multi-select"`
Identifies the component type.
`"true"`
Marks the visual shadow trigger.
comma-separated values
Currently selected values.
`"true"`
Marks the floating panel.
`"true"`
Marks options injected via `dynamicOption`.
boolean string
Reflects the error state.
field id
Links the native form value to the field.

## Notes

- Uses `react-virtuoso` for virtualized rendering — large option lists perform well.
- The overflow control collapses selected tags into a counter badge when they exceed the trigger width.
- The hidden `<input type="hidden">` stores the comma-separated selected values for native form submission.
- Floating position is computed with `@floating-ui/react` and updates automatically while open (`autoUpdate`).
- The dropdown search uses `fzf` (fuzzy matching) across both `value` and `label` fields.
