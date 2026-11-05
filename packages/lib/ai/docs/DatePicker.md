---
title: DatePicker
description: Locale-aware date input with a masked field and an optional calendar or range picker.
package: "@g4rcez/components"
export: "{ DatePicker }"
import: "import { DatePicker } from '@g4rcez/components/date-picker'"
category: form
---

# DatePicker

`DatePicker` combines the masked `Input` field with `Calendar`. It supports date, date-time, and staged range selection. A native hidden field carries the form value.

## Import

```tsx
import { DatePicker } from "@g4rcez/components/date-picker";
```

## Props

`DatePicker` inherits `Input` field props and the calendar props of its mode.

### Date and datetime mode

| Prop | Type | Default | Description |
|---|---|---|---|
| `date` | `Date` | — | Controlled selected date. |
| `type` | `"date" \| "datetime"` | `"date"` | Date only or date and time. |
| `onChange` | `(date: Date \| undefined) => void` | — | Called with a valid date, or `undefined` when cleared. |
| `floating` | `boolean` | `true` | `true`: calendar in a floating dropdown. `false`: inline. |
| `clickToClose` | `boolean` | `false` | Closes the calendar after a date is selected. |

### Range mode

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"range"` | — | Enables the range prop union. |
| `range` | `{ from?: Date; to?: Date } \| null` | — | Controlled or initial range. Also enables range behavior. |
| `rangeMode` | `true` | — | Enables range mode explicitly. |
| `onChange` | `(range: { from?: Date; to?: Date } \| null) => void` | — | Called when the range draft is applied or changed. |
| `rangePresets` | `DatePickerPreset[]` | built-in presets | Preset ranges in the range picker. |
| `rangeLabels` | `DatePickerRangeLabels` | locale defaults | Labels for preset search, Today, Cancel, Apply. Localizes beyond the provider locale. |
| `labelRange` | `{ from: string; to: string }` | locale defaults | Accessible labels for the two range inputs. |

### Shared props

| Prop | Type | Default | Description |
|---|---|---|---|
| `locale` | `Locales` | active locale | Locale for mask and calendar. |
| `markToday` | `boolean` | `true` | Highlights today in the calendar. |
| `disabledDate` | `(date: Date) => boolean` | — | Blocks selection of matching dates. |
| `size` | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | — | Field size from `InputField`. |
| `title` | `string` | — | Visible field label. |
| `error` | `string` | — | Validation message. |
| `required` | `boolean` | `true` in range mode | Required state of the visible field(s). |
| `name` | `string` | — | Name of the hidden native form field. |

## Design Tokens and CSS

Geometry defaults are scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides win. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The first table lists examples. `defaultGeometryTokens` holds the full set.

| Override | Library default |
|---|---|
| `--var-date-picker-calendar-icon-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-date-picker-range-nights-radius` | `var(--var-card-surface-radius, calc(var(--var-radius-base) / 4))` |
| `--var-card-surface-radius` | `calc(var(--var-radius-base) / 4)` |
| `--var-date-picker-panel-gap` | `calc(var(--var-spacing-base) * 1)` |

CSS contracts: `date-picker`, `input`, `input-field`, `calendar`, and `dropdown`. Import `foundation.css` before those chunks, or use `index.css`. Customize the semantic `--var-*` variables, not generated utility selectors.

## Examples

### Basic date

```tsx
<DatePicker name="birthdate" title="Date of birth" />
```

### Date and time

```tsx
<DatePicker name="appointment" title="Appointment time" type="datetime" clickToClose />
```

### Controlled date

```tsx
const [date, setDate] = useState<Date>;
<DatePicker name="due-date" title="Due date" date={date} onChange={setDate} />;
```

### Date range

```tsx
const [range, setRange] = useState<{ from?: Date; to?: Date } | null>(null);
<DatePicker
    name="trip"
    title="Trip dates"
    type="range"
    range={range}
    onChange={setRange}
    rangeLabels={{ apply: "Apply dates", cancel: "Cancel" }}
    labelRange={{ from: "Check-in", to: "Check-out" }}
/>;
```

### Disable past dates

```tsx
<DatePicker name="event-date" title="Event date" disabledDate={(date) => date < startOfDay(new Date())} />
```

### Inline calendar

```tsx
<DatePicker name="check-in" title="Check-in" floating={false} />
```

## Do

- Provide a clear `title` and `name` in a form.
- Use `disabledDate` for unavailable dates. Do not validate only after submission.
- Use `labelRange` to give range endpoints meaningful accessible names.

## Don't

- Don't assume the mask is always `MM/DD/YYYY`. It follows the active locale.
- Don't use range props in date mode. Use `type="range"` for the range-specific TypeScript contract.
- Don't rely on color alone to show invalid or selected dates.

## Accessibility

- `InputField` labels the visible field.
- Calendar controls support the keyboard and expose selected and disabled states.
- The calendar trigger has a translated accessible label.

## Data Attributes

- `data-component="date-picker"`: visible field or range fieldset.
- `data-value`: formatted selected value on the field or range fieldset.
- `data-target`: the associated `name` value.
- `data-origin`: the original field name of the hidden native input.

## Notes

- Date mode renders a visible masked text input and a hidden `input type="date"`.
- Range mode renders two labelled masked inputs and a hidden `input type="hidden"` with the native value.
- `floating` changes only where the calendar renders. It does not change the selection model.
