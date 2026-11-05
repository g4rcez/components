---
title: MultiSelect
description: Dropdown that lets users select multiple options with fuzzy search and tag display.
package: "@g4rcez/components"
export: "{ MultiSelect }"
import: "import { MultiSelect } from '@g4rcez/components'"
category: form
---

# MultiSelect

Dropdown that selects multiple options, with fuzzy search and tag display.

## Import

```tsx
import { MultiSelect } from "@g4rcez/components";
```

## Props

`MultiSelect` inherits all `InputField` props, plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `MultiSelectItemProps[]` | — | Option objects `{ value, label, Render? }`. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Inherited from `InputField`. |
| `value` | `string[]` | — | Controlled selected values. |
| `defaultValue` | `string[]` | `[]` | Initial values, uncontrolled. |
| `onChangeOptions` | `(options: string[]) => void` | — | Called on selection change. |
| `renderTag` | `(option) => ReactNode` | — | Replaces each selected tag's content. |
| `dynamicOption` | `boolean` | `false` | Lets users select the search query as a new option. |
| `emptyMessage` | `Label` | — | Shown when no option matches the search. |
| `selectedLabel` | `string` | — | Unused. The overflow counter uses `translations.multiSelectSelectedLabel`. |

### MultiSelectItemProps

Extends `OptionProps`:

| Field | Type | Description |
| --- | --- | --- |
| `value` | `string` | Option value. |
| `label` | `string` | Option display text. |
| `Render` | `React.FC<OptionProps>` | Custom dropdown row component. |
| `hidden` | `boolean` | Hides the option from the list. |

## Design Tokens

Geometry defaults are scoped `calc` fallbacks of `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set; the table shows examples.

| Override | Library default |
| --- | --- |
| `--var-multi-select-field-min-inline-size` | `calc(var(--var-spacing-base) * 12)` |
| `--var-multi-select-tag-remove-icon-size` | `calc(var(--var-spacing-base) * 0.875)` |
| `--var-input-field-icon-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-input-field-small-icon-size` | `calc(var(--var-spacing-base) * 0.875)` |

Popup maximum height and initial estimates scale with density. Measured list content keeps its physical size. Virtualizer pixel estimates are not fixed CSS dimensions.

The component reads these tokens. Override them in your theme.

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| CSS override | `--var-multi-select-field-min-inline-size` | Minimum field width |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground` | Placeholder text color |
| `placeholder-input-mask-error` | `--var-free-text-error-placeholder-foreground` | Error placeholder color |
| `border-input-border` | `--var-color-border` | Search input bottom border |
| `bg-floating-background` | `--var-dropdown-surface-background` | Dropdown panel background |
| `border-floating-border` | `--var-dropdown-surface-border` | Dropdown panel border |
| CSS override | `--var-multi-select-option-background-hover` | Option hover and focus background |
| CSS override | `--var-multi-select-option-selected-background` | Selected option background |
| CSS override | `--var-multi-select-option-selected-foreground` | Selected option text |
| `text-floating-foreground` | `--var-dropdown-surface-foreground` | Default option text |
| `text-input-placeholder` | `--var-free-text-placeholder-foreground` | Placeholder `li` color |
| `text-disabled` | `--var-color-disabled` | Empty-state text |
| `focus:ring-ring` | `--var-color-ring` | Field focus ring color |
| `h-input-height` | `--var-free-text-control-height` | Default trigger height |
| `px-input-padding-x` | `--var-free-text-surface-padding-inline` | Horizontal padding |
| `py-input-padding-y` | `--var-free-text-surface-padding-block` | Vertical padding |

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

With `renderTag`, the component keeps its tag container and remove button. The callback replaces only the tag content.

### Dynamic option creation

```tsx
import { MultiSelect } from "@g4rcez/components";
export default function TagInput() {
    return <MultiSelect title="Tags" dynamicOption options={existingTags} onChangeOptions={(tags) => console.log(tags)} />;
}
```

## Do

- Set a descriptive `title` to label the trigger.
- Use `dynamicOption` when users must add items that are not in the predefined list.
- Use design-token classes on wrapper elements (`bg-background`, `border-border`, `text-foreground`).
- Use `theme="<value>"` on nested elements. Never hardcode colors in `className`.

## Don't

- Don't use `MultiSelect` for a single selection. Use `Select` or `Autocomplete`.
- Don't pass raw utility color classes (`bg-blue-500`, `text-white`). Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use `color-mix` in `className` or `style` props for theming.

## Interaction design and acceptance criteria

Adapted from Select (Combo). This is a **multi-selection adaptation**, not a native select contract. The criteria are design targets, not executed accessibility tests.

- Use this control to select several independent values.
- Use a visible [Checkbox](Checkbox.md) group when choices need comparison or reliable native disabled behavior.
- Use [Select](Select.md) or [Autocomplete](Autocomplete.md) for one value.
- Focus, click, or tap on the display opens the popup and moves focus into search.
- Selecting an option toggles it and keeps the popup open. Tags and the overflow count summarize the selection.
- Keep the title persistent. Keep custom option and tag content noninteractive.
- Verify Tab/Shift+Tab, dismissal, and a usable focus destination.
- Consumers own: committed-array validation (`required` on the hidden input gives no native constraint validation), controlled updates through `onChangeOptions`, and persistence of dynamic options in `options`.
- Controlled tags come from the options found by value.
- Verify selection announcements, error descriptions, touch target size, and tag-removal names (currently English `Remove …`).

**Current limits:**

- The listbox does not set `aria-multiselectable`.
- No live region announces result count or selection.
- Pointer selection guards disabled options. Keyboard selection does not.
- A disabled fieldset does not disable the `div` trigger or the portalled popup. Their handlers have no disabled guard.
- Do not rely on `disabled` or disabled options to block choices.

## Accessibility

- The closed display has `role="combobox"`. While open, it becomes presentational and the popup search input is the combobox.
- Both reference the field label and the listbox, with expanded and active-descendant state.
- Options are non-tab-stop elements with `role="option"`, `aria-selected`, and `aria-disabled`.
- Visual checkboxes in options are inert and hidden from assistive technology.
- `FloatingFocusManager` is modal, starts focus in the search input, and uses `returnFocus={false}`. Focus does not return to the trigger automatically.
- Search input: Arrow Up/Down moves the active option, Enter or Space toggles it (Space does not insert a space in the query), and Escape closes the popup.

## Data Attributes

| Attribute | Element | Value | Description |
| --- | --- | --- | --- |
| `data-component` | fieldset | `"multi-select"` | Identifies the component type. |
| `data-shadow` | visible trigger | `"true"` | Marks the visual shadow trigger. |
| `data-value` | visible trigger | comma-separated values | Currently selected values. |
| `data-floating` | dropdown root | `"true"` | Marks the floating panel. |
| `data-dynamic` | option | `"true"` | Marks `dynamicOption` options. |
| `data-error` | visible trigger | boolean string | Reflects the error state. |
| `data-origin` | hidden input | field id | Links the form value to the field. |

## Notes

- `react-virtuoso` virtualizes the option list.
- The overflow control collapses selected tags into a counter badge when they exceed the trigger width.
- The hidden `<input type="hidden">` stores the comma-separated selected values for native form submission.
- `@floating-ui/react` positions the popup and updates while open (`autoUpdate`).
- The dropdown search uses `fzf` (fuzzy matching) on both the `value` and `label` fields.

## Verification

Acceptance criteria for tests and reviews: [verify/MultiSelect.md](verify/MultiSelect.md).
