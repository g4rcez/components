---
title: DatePicker
description: Locale-aware date input with a masked field and an optional calendar or range picker.
package: "@g4rcez/components"
export: "{ DatePicker }"
import: "import { DatePicker } from '@g4rcez/components/date-picker'"
category: form
---

# DatePicker

`DatePicker` combines the masked `Input` field with `Calendar`. It supports date, date-time, and staged range selection while keeping a native hidden field for form submission.

## Import

```tsx
import { DatePicker } from "@g4rcez/components/date-picker";
```

## Props

`DatePicker` inherits the field props from `Input` and the calendar props that apply to its selected mode.

### Date and datetime mode

| Prop           | Type                                | Default  | Description                                                            |
| -------------- | ----------------------------------- | -------- | ---------------------------------------------------------------------- |
| `date`         | `Date`                              | —        | Controlled selected date.                                              |
| `type`         | `"date" \| "datetime"`              | `"date"` | Date-only or date-and-time input.                                      |
| `onChange`     | `(date: Date \| undefined) => void` | —        | Called with a valid date or `undefined` when cleared.                  |
| `floating`     | `boolean`                           | `true`   | Render the calendar in a floating dropdown; `false` renders it inline. |
| `clickToClose` | `boolean`                           | `false`  | Close the calendar after selecting a date.                             |

### Range mode

| Prop           | Type                                                  | Default          | Description                                                                     |
| -------------- | ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------- |
| `type`         | `"range"`                                             | —                | Enables the range-specific prop union.                                          |
| `range`        | `{ from?: Date; to?: Date } \| null`                  | —                | Controlled or initial range. Passing it also enables range behavior at runtime. |
| `rangeMode`    | `true`                                                | —                | Explicitly enables range mode when needed.                                      |
| `onChange`     | `(range: { from?: Date; to?: Date } \| null) => void` | —                | Called when the range draft is applied or changed.                              |
| `rangePresets` | `DatePickerPreset[]`                                  | built-in presets | Preset ranges shown in the range picker.                                        |
| `rangeLabels`  | `DatePickerRangeLabels`                               | locale defaults  | Labels for the preset search, Today, Cancel, and Apply controls.                |
| `labelRange`   | `{ from: string; to: string }`                        | locale defaults  | Accessible labels for the two range inputs.                                     |

### Shared props

| Prop           | Type                                                           | Default              | Description                                            |
| -------------- | -------------------------------------------------------------- | -------------------- | ------------------------------------------------------ |
| `locale`       | `Locales`                                                      | active locale        | Locale used to build the mask and format the calendar. |
| `markToday`    | `boolean`                                                      | `true`               | Highlights today in the calendar.                      |
| `disabledDate` | `(date: Date) => boolean`                                      | —                    | Prevents matching dates from being selected.           |
| `size`         | `"big" \| "default" \| "min" \| "normal" \| "small" \| "tiny"` | —                    | Field size inherited from `InputField`.                |
| `title`        | `string`                                                       | —                    | Visible field label.                                   |
| `error`        | `string`                                                       | —                    | Validation message.                                    |
| `required`     | `boolean`                                                      | `true` in range mode | Required state for the visible field(s).               |
| `name`         | `string`                                                       | —                    | Name of the hidden native form field.                  |

## Design Tokens and CSS

The component uses the CSS contracts from `date-picker`, `input`, `input-field`, `calendar`, and `dropdown`. Import `foundation.css` before the relevant chunks, or use `index.css`. Customize the semantic `--var-*` variables instead of relying on generated utility selectors.

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
const [date, setDate] = useState<Date>();

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

- Provide a clear `title` and `name` when the picker is part of a form.
- Use `disabledDate` for unavailable dates rather than validating only after submission.
- Use `labelRange` to give range endpoints meaningful accessible names.
- Use `rangeLabels` to localize range action controls when the provider locale is not enough.

## Don't

- Don't assume the displayed mask is always `MM/DD/YYYY`; it follows the active locale.
- Don't use range props with date mode; use `type="range"` for the range-specific TypeScript contract.
- Don't rely on color alone to communicate invalid or selected dates.

## Accessibility

- The visible field is labelled through `InputField`.
- The calendar controls support keyboard navigation and expose selected and disabled states.
- Range mode renders two labelled masked inputs and a hidden native field for form submission.
- The calendar trigger includes a translated accessible label.

## Data Attributes

- `data-component="date-picker"` — visible field or range fieldset.
- `data-value` — formatted selected value on the field or range fieldset.
- `data-target` — the associated `name` value.
- `data-origin` — the hidden native input's original field name.

## Notes

- Date mode renders a visible masked text input plus a hidden `input type="date"`.
- Range mode renders two visible masked inputs plus a hidden `input type="hidden"` containing the native value.
- `floating` only changes where the calendar is rendered; it does not change the selection model.
