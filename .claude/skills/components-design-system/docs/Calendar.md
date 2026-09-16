---
title: Calendar
description: Interactive month calendar with single-date, date-time, and range selection modes.
package: "@g4rcez/components"
export: "{ Calendar }"
import: "import { Calendar } from '@g4rcez/components/calendar'"
category: display
---

# Calendar

`Calendar` renders a keyboard-navigable month grid. It supports single-date selection, optional time input, and staged date-range selection.

## Import

```tsx
import { Calendar } from "@g4rcez/components/calendar";
```

## Props

`Calendar` also accepts the standard props used by its internal controls through the component implementation. The component-specific props are:

| Prop | Type | Default | Description |
| ------------------ | ---- | ------- | ----------- |
| `type` | `"date" \| "datetime" \| "range"` | `"date"` | Select date-only, date-time, or range mode. |
| `date` | `Date` | current date | Month and selected date used in date and datetime modes. |
| `range` | `{ from?: Date; to?: Date } \| null` | — | Initial or controlled range value. |
| `rangeMode` | `boolean` | `false` | Enables two-step `from`/`to` selection. Set this for range selection. |
| `markRange` | `boolean` | `true` | Highlights the days between the selected range endpoints. |
| `markToday` | `boolean` | `true` | Highlights the current day. |
| `changeOnlyOnClick` | `boolean` | `false` | In range mode, delay `onChange` until a complete range is selected by click. |
| `locale` | `Locales \| undefined` | active locale | Locale used for month labels and date formatting. |
| `disabledDate` | `(date: Date) => boolean` | — | Disables matching dates. |
| `onChange` | `(date: Date \| undefined) => void` or `(range: { from?: Date; to?: Date } \| undefined) => void` | — | Called when the selected date or range changes. |
| `onChangeMonth` | `(date: Date) => void` | — | Called after the visible month changes. |
| `onChangeYear` | `(date: Date) => void` | — | Called after the visible year changes. |
| `RenderOnDay` | `React.FC<{ date: Date }>` | — | Renders extra content for a day. |
| `labelRange` | `{ from: string; to: string }` | — | Accessible labels for the range endpoints. |
| `datetimeTitle` | `string` | — | Label for the time control in datetime mode. |
| `styles` | `CalendarStyles` | — | Class names or class-name callbacks for calendar regions. |

`rangeMode` is not inferred from `type="range"`; pass both when using `Calendar` directly. `DatePicker` configures range mode for you.

## Design Tokens and CSS

The component ships a plain CSS chunk at `@g4rcez/components/calendar.css`. Its stable root selector is `.__calendar`; use the component style manifest for its slots and dependencies. Calendar-specific token values are defined in the library token sheet and should be overridden with semantic `--var-*` variables.

## Examples

### Single date

```tsx
const [date, setDate] = useState<Date>();

<Calendar date={date} onChange={setDate} />
```

### Date range

```tsx
type DateRange = { from?: Date; to?: Date };
const [range, setRange] = useState<DateRange | undefined>();

<Calendar
    type="range"
    rangeMode
    range={range}
    onChange={setRange}
    labelRange={{ from: "Start date", to: "End date" }}
/>
```

### Disable past dates

```tsx
<Calendar disabledDate={(date) => date < startOfDay(new Date())} />
```

### Add content to days

```tsx
<Calendar
    RenderOnDay={({ date }) => (hasEvent(date) ? <span aria-label="Has event">•</span> : null)}
/>
```

## Do

- Use `disabledDate` for business rules such as unavailable or past dates.
- Supply `labelRange` when the endpoint labels need to be more specific than the defaults.
- Use `changeOnlyOnClick` when partial keyboard range changes should not update application state.
- Provide a locale through `ComponentsProvider` or the `locale` prop when month labels must be localized.

## Don't

- Don't treat a partial range as a complete date interval.
- Don't rely on color alone to communicate the selected range.
- Don't use `Calendar` when a native date input is the better fit for a simple form.

## Accessibility

- Day cells are buttons and support keyboard navigation with arrow keys.
- Previous/next month controls and month/year selectors are keyboard accessible.
- Selected, disabled, today, and range states are exposed through the rendered control attributes.
- Supply meaningful `labelRange` values for range forms and keep `RenderOnDay` content decorative or labelled.

## Data Attributes

- `data-component="calendar"` — calendar root.
- `data-date` — ISO date on each day button.
- `data-samemonth` — whether the day belongs to the visible month.
- `data-range` — whether range mode is active.
- `data-today` — present for the current day.
- `data-focustrap` — navigation focus targets.

## Notes

- The grid uses 42 days to keep its height stable while changing months.
- Month transitions use `motion/react`; reduced-motion behavior follows the library motion configuration.
- `type="datetime"` adds a masked time input below the calendar grid.
