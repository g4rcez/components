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

`Calendar` also accepts the standard props of its internal controls. The component-specific props are:

|Prop|Type|Default|Description|
|---|---|---|---|
|`type`|`"date" \| "datetime" \| "range"`|`"date"`|Selects date-only, date-time, or range mode.|
|`date`|`Date`|current date|Month and selected date in date and datetime modes.|
|`range`|`{ from?: Date; to?: Date } \| null`|—|Initial or controlled range value.|
|`rangeMode`|`boolean`|`false`|Enables two-step `from`/`to` selection. Set it for range selection.|
|`markRange`|`boolean`|`true`|Highlights days between the range endpoints.|
|`markToday`|`boolean`|`true`|Highlights the current day.|
|`changeOnlyOnClick`|`boolean`|`false`|Date mode only: no `onChange` on month or year moves. Ignored in range mode.|
|`locale`|`Locales \| undefined`|active locale|Locale for month labels and date formatting.|
|`disabledDate`|`(date: Date) => boolean`|—|Disables matching dates.|
|`onChange`|`(date: Date \| undefined) => void` or `(range: { from?: Date; to?: Date } \| undefined) => void`|—|Called when the selected date or range changes.|
|`onChangeMonth`|`(date: Date) => void`|—|Called after the visible month changes.|
|`onChangeYear`|`(date: Date) => void`|—|Called after the visible year changes.|
|`RenderOnDay`|`React.FC<{ date: Date }>`|—|Renders extra content for a day.|
|`labelRange`|`{ from: string; to: string }`|—|Accessible labels for the range endpoints.|
|`datetimeTitle`|`string`|—|Label for the time control in datetime mode.|
|`styles`|`CalendarStyles`|—|Class names or class-name callbacks for calendar regions.|

- `type="range"` does not set `rangeMode`. Pass both when you use `Calendar` directly. `DatePicker` sets range mode for you.
- In range mode, `onChange` always receives `{ from, to }`. It runs when a day is clicked or chosen with the keyboard.
- It also runs when **Today** is clicked. **Today** picks today as the next endpoint.
- It also runs when the time input changes. The range does not change in that case.
- `changeOnlyOnClick={false}` is ignored with `type="range"`.
- The initial date is not a change. `onChange` does not run when `Calendar` mounts, including when a `DatePicker` opens.

## Design Tokens and CSS

- Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`.
- Explicit semantic overrides remain unchanged.
- See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions.
- The exported `defaultGeometryTokens` map holds the full set. Current plain-CSS geometry examples:

|Override|Library default|
|---|---|
|`--var-calendar-day-cell-padding`|`calc(var(--var-spacing-base) / 4)`|
|`--var-calendar-day-button-size`|`calc(var(--var-spacing-base) * 2.25)`|
|`--var-calendar-focus-ring-width`|`calc(var(--var-spacing-base) / 4)`|
|`--var-calendar-selected-ring-width`|`calc(var(--var-spacing-base) / 4)`|

- The plain CSS chunk is `@g4rcez/components/calendar.css`.
- The stable root selector is `.__calendar`. Use the component style manifest for slots and dependencies.
- The library token sheet defines Calendar token values. Override them with semantic `--var-*` variables.

## Examples

### Single date

```tsx
const [date, setDate] = useState<Date>;
<Calendar date={date} onChange={setDate} />;
```

### Date range

```tsx
type DateRange = { from?: Date; to?: Date };
const [range, setRange] = useState<DateRange | undefined>;
<Calendar type="range" rangeMode range={range} onChange={setRange} labelRange={{ from: "Start date", to: "End date" }} />;
```

### Disable past dates

```tsx
<Calendar disabledDate={(date) => date < startOfDay(new Date())} />
```

### Add content to days

```tsx
<Calendar RenderOnDay={({ date }) => (hasEvent(date) ? <span aria-label="Has event">•</span> : null)} />
```

## Do

- Use `disabledDate` for business rules such as unavailable or past dates.
- Supply `labelRange` when endpoint labels must be more specific than the defaults.
- In date mode, use `changeOnlyOnClick` when month or year navigation must not update application state.
- Set the locale through `ComponentsProvider` or the `locale` prop when month labels need localization.

## Don't

- Don't treat a partial range as a complete date interval.
- Don't use color alone to show the selected range.
- Don't use `Calendar` when a native date input fits a simple form.

## Accessibility

- Day cells are buttons. Arrow keys move between them.
- Previous/next month controls and month/year selectors are keyboard accessible.
- Control attributes expose the selected, disabled, today, and range states.
- Supply meaningful `labelRange` values for range forms.
- Keep `RenderOnDay` content decorative or labelled.

## Data Attributes

- `data-component="calendar"`: calendar root.
- `data-date`: ISO date on each day button.
- `data-samemonth`: whether the day belongs to the visible month.
- `data-range`: whether range mode is active.
- `data-today`: present for the current day.
- `data-focustrap`: navigation focus targets.

## Notes

- The grid uses 42 days to keep its height stable when the month changes.
- Month transitions use `motion/react`. Reduced-motion behavior follows the library motion configuration.
- `type="datetime"` adds a masked time input below the calendar grid.
