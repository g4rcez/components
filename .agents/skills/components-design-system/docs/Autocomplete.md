---
title: Autocomplete
description: Searchable select with fuzzy matching, virtualized options, keyboard navigation, and dynamic option creation.
package: "@g4rcez/components"
export: "{ Autocomplete }"
import: "import { Autocomplete } from '@g4rcez/components/autocomplete'"
category: form
---

# Autocomplete

Searchable select with fuzzy matching, virtualized options, keyboard navigation, and dynamic option creation.

## Import

```tsx
import { Autocomplete } from "@g4rcez/components/autocomplete";
```

## Props

| Prop             | Type                                                           | Default    | Description                                                                                       |
| ---------------- | -------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `title`          | `string`                                                       | -          | Field label                                                                                       |
| `size`           | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Shared control size inherited from `InputField`                                                   |
| `value`          | `string`                                                       | -          | Controlled selected value                                                                         |
| `options`        | `AutocompleteItemProps[]`                                      | -          | List of selectable options                                                                        |
| `emptyMessage`   | `Label`                                                        | -          | Message displayed when no options match                                                           |
| `dynamicOption`  | `boolean`                                                      | `false`    | Accept typed values on selection or blur, without restricting them to `options`                   |
| `onChange`       | `(e: React.ChangeEvent<HTMLInputElement>) => void`             | -          | Change handler                                                                                    |
| `error`          | `string`                                                       | -          | Error message displayed below the field                                                           |
| `feedback`       | `Label`                                                        | -          | Success/neutral feedback text below the field                                                     |
| `left`           | `Label`                                                        | -          | Content rendered on the left inside the field border                                              |
| `right`          | `Label`                                                        | -          | Content rendered on the right inside the field border                                             |
| `required`       | `boolean`                                                      | `false`    | Marks field as required; hides "Optional" text                                                    |
| `disabled`       | `boolean`                                                      | `false`    | Disables the field                                                                                |
| `loading`        | `boolean`                                                      | `false`    | Accepted, but currently adds no loading indicator or interaction lock; set `disabled` explicitly. |
| `container`      | `string`                                                       | -          | Extra CSS classes for the outer `fieldset`                                                        |
| `labelClassName` | `string`                                                       | -          | Extra CSS classes for the label/border wrapper                                                    |

### AutocompleteItemProps

```tsx
type AutocompleteItemProps = {
    value: string;
    label?: string;
    hidden?: boolean;
    disabled?: boolean;
    "data-dynamic"?: string;
    Render?: React.FC<OptionProps>;
} & Record<`data-${string}`, string>;
```

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides remain unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. Current plain-CSS geometry examples (the exported `defaultGeometryTokens` map contains the full set):

| Override                                   | Library default                         |
| ------------------------------------------ | --------------------------------------- |
| `--var-autocomplete-list-max-block-size`   | `calc(var(--var-spacing-base) * 24)`    |
| `--var-autocomplete-panel-radius`          | `calc(var(--var-radius-base) / 2)`      |
| `--var-autocomplete-option-min-block-size` | `calc(var(--var-spacing-base) * 2.5)`   |
| `--var-autocomplete-option-padding` | `calc(var(--var-spacing-base) * 0.625)` |

Popup maximum height and initial estimates scale with density; measured list content keeps its physical size. Virtualizer pixel estimates are not fixed CSS dimensions. Tailwind utility mappings and component tokens. Where a historical utility targets a different surface, the component's actual token is noted.

| Token | CSS Variable                    | Purpose                                        |
| ------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `h-input-height`                | `--var-free-text-control-height`               | Input height                                                                                                              |
| `px-input-padding-x`            | `--var-free-text-surface-padding-inline`       | Horizontal input padding                                                                                                  |
| `py-input-padding-y`            | `--var-free-text-surface-padding-block`        | Vertical input padding                                                                                                    |
| `border-input-border`           | `--var-color-border`                           | Default field border color                                                                                                |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground`       | Placeholder text color                                                                                                    |
| `placeholder-input-mask-error`  | `--var-free-text-error-placeholder-foreground` | Placeholder color in error state                                                                                          |
| `text-foreground`               | `--var-color-foreground`                       | Input text color                                                                                                          |
| `text-danger`                   | `--var-color-danger`                           | Text color in error state                                                                                                 |
| `text-primary`                  | `--var-color-primary`                          | Focus/hover border and ring color                                                                                         |
| `bg-floating-background`        | `--var-dropdown-surface-background`            | Dropdown utility; Autocomplete's panel uses `--var-autocomplete-panel-background`                                         |
| `border-floating-border`        | `--var-dropdown-surface-border`                | Dropdown border utility; the panel uses `--var-autocomplete-panel-border`                                                 |
| `bg-floating-hover`             | `--var-color-muted`                            | Hover utility; options use `--var-autocomplete-option-background-hover` and `--var-autocomplete-option-active-background` |
| `text-disabled`                 | `--var-color-disabled`                         | Disabled text utility; the empty message uses `--var-autocomplete-empty-foreground`                                       |
| `border-tooltip-border`         | `--var-tooltip-surface-border`                 | Tooltip border utility; the empty-state separator uses `--var-autocomplete-empty-border`                                  |
| `z-floating`                    | `--var-layer-floating`                         | Z-index for the floating panel                                                                                            |
| `shadow-floating`               | `--var-shadow-floating`                        | Drop shadow for the floating panel                                                                                        |

## Examples

### Basic usage

```tsx
import { Autocomplete } from "@g4rcez/components/autocomplete";
const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
];
function FrameworkPicker() {
    const [value, setValue] = useState("");
    return (
        <Autocomplete
            title="Framework"
            placeholder="Search frameworks..."
            options={options}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
```

### Dynamic option creation

```tsx
function TagPicker() {
    const [value, setValue] = useState("");
    const [tags, setTags] = useState([
        { value: "typescript", label: "TypeScript" },
        { value: "javascript", label: "JavaScript" },
    ]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setValue(next);
        if (next && !tags.find((t) => t.value === next)) {
            setTags((prev) => [...prev, { value: next, label: next }]);
        }
    };
    return (
        <Autocomplete
            title="Tag"
            placeholder="Search or create a tag..."
            options={tags}
            value={value}
            onChange={handleChange}
            dynamicOption
            emptyMessage="Type to create a new tag"
        />
    );
}
```

### Custom option renderer

```tsx
type UserOption = AutocompleteItemProps & { email: string; role: string };
const UserRow = ({ value, label, ...props }: UserOption) => (
    <div className="flex flex-col gap-0.5 py-1">
        {" "}
        <span className="font-medium text-sm text-foreground">{label}</span> <span className="text-xs text-muted-foreground">{props.email}</span>{" "}
    </div>
);
const users: UserOption[] = [
    { value: "alice", label: "Alice", email: "alice@example.com", role: "admin", Render: UserRow },
    { value: "bob", label: "Bob", email: "bob@example.com", role: "member", Render: UserRow },
];
<Autocomplete title="Assign to" options={users} value="" onChange={() => {}} />;
```

### Form integration

```tsx
import { Form } from "@g4rcez/components/form";
import { Button } from "@g4rcez/components/button";
const countries = [
    { value: "br", label: "Brazil" },
    { value: "us", label: "United States" },
    { value: "de", label: "Germany" },
];
function ContactForm() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(e.currentTarget);
        console.log(Object.fromEntries(data));
    };
    return (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-base">
            {" "}
            <Autocomplete name="country" title="Country" options={countries} required emptyMessage="No countries found" />{" "}
            <Button theme="primary" type="submit">
                {" "}
                Submit{" "}
            </Button>{" "}
        </Form>
    );
}
```

## Do

- Provide a meaningful `emptyMessage` so users understand why no results appear.
- Use `dynamicOption` when users should be able to add values not in the list.
- With `dynamicOption`, Enter or clicking an option commits it; leaving the field commits typed text. Exact label/value matches use the existing option's value without adding a duplicate. Escape discards the pending edit.
- New values are delivered through `onChange` and the hidden form input. Persist them in `options` in your handler if they should appear in future suggestions; the component does not mutate `options`.
- Supply a custom `Render` component when each option needs to show more than its label (e.g., avatars, secondary text).
- Prefer `Autocomplete` over `Select` for lists of more than ~15 items.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`) — use theme props or design tokens instead.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`) — override CSS variables in your `@theme` block instead.
- Don't use `Autocomplete` for small lists where `Select` is simpler and faster.
- Don't forget to handle the unselected case when `dynamicOption` is off and the user types but never picks an option.

## Interaction design and acceptance criteria

Adapted from: Select (Combo). This is a **searchable combobox adaptation**: the page explicitly distinguishes custom autocomplete from native selects. These are source-informed integration checks and design targets, not executed accessibility tests. - Use search to narrow a long list of known values. Use [Select](Select.md) for a simpler compact list or [MultiSelect](MultiSelect.md) for several values. Enable `dynamicOption` only when the domain accepts text outside `options`; explain that leaving the field commits eligible text.

- A persistent `title` names the field. Focus, clicking/tapping the input, or the caret opens suggestions; typing filters them. Clicking an enabled option or confirming with Enter commits its value, shows its label, closes the popup, and restores input focus. Hidden options are omitted, and disabled options are skipped by arrow navigation and rejected by pointer/Enter selection.
- Keep DOM focus on the combobox while arrows change the active descendant; selection state is not the same as the highlighted result. Escape discards the pending edit. In fixed-option mode, typed text alone does not commit a choice on blur; validate the committed value rather than assuming displayed search text is a submitted selection.
- **Current limits:** there is no result-count/empty-result live region or custom Home/End/Page-key option navigation. Fixed-option mode uses modal focus management, while dynamic mode permits Tab/Shift+Tab departure and commits on blur. `loading` supplies no lock or announcement. Provide needed loading/result feedback, set `disabled` explicitly, and verify focus exit, mounted active-descendant targets, and actual announcements with supported assistive technologies.
- Keep custom renderers noninteractive and test coarse-pointer behavior: native selection is used only without dynamic text or custom renderers. Consumers own persistence of created options, committed-value/required validation (the hidden input is not natively validated), and touch target/focus visibility in the chosen theme.

## Acceptance criteria

1. **Current behavior:** Given the custom searchable mode, when the field is focused and Arrow Up/Down is used, then focus stays on the input, expanded/listbox relations are present, and the active descendant follows enabled visible options.
2. **Current behavior:** Given an enabled result, when it is clicked, tapped, or confirmed with Enter, then the stored value is committed through `onChange`, the label is displayed, the popup closes, and focus returns to the input; a controlled consumer must accept the value.
3. **Current behavior:** Given a pending query, when Escape is pressed, then the query is discarded and the popup closes without changing the previously committed value.
4. **Current behavior:** Given typed text and focus moving outside the control, when `dynamicOption` is enabled, then eligible text commits without stealing focus back and an exact label/value match uses the existing value; with dynamic mode off, typing alone does not commit a new choice.
5. **Integration target:** Given the supported pointer modes, theme, help/error text, and assistive technologies, when selection, dismissal, disabled state, and an empty search are exercised, then names, committed/active state, descriptions, visible focus, and a usable exit are understandable. Inspect the native Select branch separately from the custom branch; result announcements are not built in.

## Accessibility

- Renders a `role="listbox"` dropdown managed by `@floating-ui/react`.
- The visible search input is a `role="combobox"` with `aria-autocomplete="list"`, expanded/listbox relations, and `aria-activedescendant` for the active option.
- Options have `role="option"`, `aria-selected` for the committed value, and `aria-disabled`; keyboard-active styling is separate from the selected value. Options are not individual Tab stops.
- Arrow Up/Down wraps through enabled, nonhidden options; Enter commits an active option, a sole enabled result, or eligible dynamic text. Escape clears the pending query and closes the popup. There are no custom Home/End/Page Up/Page Down option-navigation handlers.
- The caret button includes an `sr-only` label from the translation system.
- Selection restores input focus. Dynamic-mode blur commits eligible text without restoring focus and uses nonmodal focus management; fixed-option mode uses modal focus management.

## Data Attributes

- `data-value` — on the hidden `<input>`: the committed option value.
- `data-shadow="true"` — on the visible text input to distinguish it from the real field.
- `data-dynamic="true"` — on options injected by `dynamicOption`.
- `data-initialized` — managed internally; used by `formReset` to track interaction state.
- `data-floating="true"` — on the floating panel element.
- `data-placement` — `bottom-start` by default, or `top-start` when there is not enough space below the field.

## Notes

- The component renders two `<input>` elements: a visible shadow input for display/search and a hidden input with `name` that participates in form submission.
- Option filtering uses a fuzzy-search (`fzf`) algorithm that matches partial text, abbreviations, and out-of-order characters against both `value` and `label`.
- Large option lists are virtualized via `react-virtuoso` — rendering performance is maintained even with thousands of options.
- When `(any-pointer: coarse)` matches, fixed-option mode without any custom `Render` uses a native `Select`; this detection can also match hybrid devices.
- Dynamic mode and options with a custom `Render` retain the searchable control on coarse-pointer devices.
- Dynamic values remain visible even with `options={[]}`. The predefined-option validation pattern is omitted in dynamic mode; `required` still applies. Clearing or deleting the text emits an empty value through `onChange`.
- The dropdown width always matches the width of the triggering fieldset.
