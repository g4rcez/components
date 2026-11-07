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

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | - | Field label |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | `"normal"` | Control size inherited from `InputField` |
| `value` | `string` | - | Controlled selected value |
| `options` | `AutocompleteItemProps[]` | - | Selectable options |
| `emptyMessage` | `Label` | - | Message shown when no options match |
| `dynamicOption` | `boolean` | `false` | Accept typed values on selection or blur, not restricted to `options` |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| `error` | `string` | - | Error message below the field |
| `feedback` | `Label` | - | Success or neutral text below the field |
| `left` | `Label` | - | Content inside the field border, left side |
| `right` | `Label` | - | Content inside the field border, right side |
| `required` | `boolean` | `false` | Marks field as required; hides "Optional" text |
| `disabled` | `boolean` | `false` | Disables the field |
| `loading` | `boolean` | `false` | Accepted, but adds no loading indicator or lock. Set `disabled` instead. |
| `container` | `string` | - | Extra CSS classes for the outer `fieldset` |
| `labelClassName` | `string` | - | Extra CSS classes for the label/border wrapper |

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

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

| Override | Library default |
|---|---|
| `--var-autocomplete-list-max-block-size` | `calc(var(--var-spacing-base) * 24)` |
| `--var-autocomplete-panel-radius` | `calc(var(--var-radius-base) / 2)` |
| `--var-autocomplete-option-min-block-size` | `calc(var(--var-spacing-base) * 2.5)` |
| `--var-autocomplete-option-padding` | `calc(var(--var-spacing-base) * 0.625)` |

- Popup maximum height and initial estimates scale with density.
- Measured list content keeps its physical size.
- Virtualizer pixel estimates are not fixed CSS dimensions.

Tailwind utility mappings and component tokens follow. When a utility targets a different surface, the Purpose column names the component token.

| Token | CSS Variable | Purpose |
|---|---|---|
| `h-input-height` | `--var-free-text-control-height` | Input height |
| `px-input-padding-x` | `--var-free-text-surface-padding-inline` | Horizontal input padding |
| `py-input-padding-y` | `--var-free-text-surface-padding-block` | Vertical input padding |
| `border-input-border` | `--var-color-input` | Default field border color |
| `placeholder-input-placeholder` | `--var-free-text-placeholder-foreground` | Placeholder text color |
| `placeholder-input-mask-error` | `--var-free-text-error-placeholder-foreground` | Placeholder color in error state |
| `text-foreground` | `--var-color-foreground` | Input text color |
| `text-danger` | `--var-color-danger` | Text color in error state |
| `text-primary` | `--var-color-primary` | Focus/hover border and ring color |
| `bg-floating-background` | `--var-dropdown-surface-background` | Dropdown utility; the panel uses `--var-autocomplete-panel-background` |
| `border-floating-border` | `--var-dropdown-surface-border` | Dropdown border utility; the panel uses `--var-autocomplete-panel-border` |
| `bg-floating-hover` | `--var-color-muted` | Hover utility; options use `--var-autocomplete-option-background-hover` and `--var-autocomplete-option-active-background` |
| `text-disabled` | `--var-color-disabled` | Disabled text utility; the empty message uses `--var-autocomplete-empty-foreground` |
| `border-tooltip-border` | `--var-tooltip-surface-border` | Tooltip border utility; the empty-state separator uses `--var-autocomplete-empty-border` |
| `z-floating` | `--var-layer-floating` | Z-index for the floating panel |
| `shadow-floating` | `--var-shadow-floating` | Drop shadow for the floating panel |

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

- Set `emptyMessage` so users know why no results appear.
- Use `dynamicOption` when users add values outside the list.
- With `dynamicOption`, Enter or a click on an option commits it. Leaving the field commits typed text.
- With `dynamicOption`, an exact label/value match uses the existing option value. No duplicate is added.
- Persist new values in `options` in your `onChange` handler to suggest them later. The component does not mutate `options`.
- Deliver new values through `onChange` and the hidden form input.
- Supply a custom `Render` component when an option shows more than its label (for example avatars or secondary text).
- Prefer `Autocomplete` over `Select` for lists of more than ~15 items.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use theme props or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't use `Autocomplete` for small lists. Use `Select`.
- Handle the unselected case when `dynamicOption` is off and the user types but never picks an option.

## Interaction design and acceptance criteria

Adapted from: Select (Combo). This is a **searchable combobox adaptation**. It differs from native selects. The checks are source-informed design targets, not executed accessibility tests.

- Use search to narrow a long list of known values.
- Use [Select](Select.md) for a short list. Use [MultiSelect](MultiSelect.md) for several values.
- Enable `dynamicOption` only when the domain accepts text outside `options`. Tell users that leaving the field commits eligible text.
- A persistent `title` names the field.
- Focus, a click or tap on the input, or the caret opens suggestions. Typing filters them.
- Enter or a click on an enabled option commits its value and shows its label. The popup closes and the input regains focus.
- Hidden options are omitted. Arrow navigation skips disabled options. Pointer and Enter selection reject them.
- Keep DOM focus on the combobox. Arrows change the active descendant. Selection state differs from the highlighted result.
- In fixed-option mode, typed text alone does not commit a choice on blur. Validate the committed value. Displayed search text is not a submitted selection.
- `loading` supplies no lock or announcement.
- Consumer duties: provide loading and result feedback, and set `disabled` explicitly.
- Consumer duties: verify focus exit, mounted active-descendant targets, and actual announcements with supported assistive technologies.
- Consumer duties: persist created options, and validate the committed value and `required` (the hidden input has no native validation).
- Consumer duties: ensure touch target size and focus visibility in the chosen theme.
- Keep custom renderers noninteractive. Test coarse-pointer behavior. Native selection applies only without dynamic text or custom renderers.

## Verification

Acceptance criteria for tests and reviews: [verify/Autocomplete.md](verify/Autocomplete.md).

## Accessibility

- The dropdown has `role="listbox"` and is managed by `@floating-ui/react`.
- The visible search input has `role="combobox"` and `aria-autocomplete="list"`. It has expanded/listbox relations and `aria-activedescendant` for the active option.
- Options have `role="option"`, `aria-selected` for the committed value, and `aria-disabled`. Keyboard-active styling is separate from the selected value.
- Options are not Tab stops.
- Arrow Up/Down wraps through enabled, nonhidden options.
- There is no result-count or empty-result live region.
- Dynamic mode permits Tab/Shift+Tab departure and commits on blur.
- Enter commits an active option, a sole enabled result, or eligible dynamic text.
- Escape clears the pending query and closes the popup.
- There are no custom Home/End/Page Up/Page Down handlers.
- The caret button has an `sr-only` label from the translation system.
- Dynamic-mode blur commits eligible text, does not restore focus, and uses nonmodal focus management. Fixed-option mode uses modal focus management.

## Data Attributes

- `data-value`: on the hidden `<input>`. Holds the committed option value.
- `data-shadow="true"`: on the visible text input. Distinguishes it from the real field.
- `data-dynamic="true"`: on options injected by `dynamicOption`.
- `data-initialized`: set internally. `formReset` uses it to track interaction state.
- `data-floating="true"`: on the floating panel element.
- `data-placement`: `bottom-start` by default. `top-start` when space below the field is insufficient.

## Notes

- The component renders two `<input>` elements. The visible shadow input handles display and search. The hidden input has `name` and joins form submission.
- Filtering uses a fuzzy-search (`fzf`) algorithm. It matches partial text, abbreviations, and out-of-order characters against `value` and `label`.
- `react-virtuoso` virtualizes large option lists, so thousands of options keep rendering performance.
- When `(any-pointer: coarse)` matches, fixed-option mode without a custom `Render` uses a native `Select`. Hybrid devices can also match.
- Dynamic mode and options with a custom `Render` keep the searchable control on coarse-pointer devices.
- Dynamic values stay visible with `options={[]}`.
- In dynamic mode the predefined-option validation pattern is omitted. `required` still applies.
- Clearing or deleting the text emits an empty value through `onChange`.
- The dropdown width equals the width of the triggering fieldset.
