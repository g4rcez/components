---
title: PageCalendar
description: Full-page calendar with month, week, and day views, event filtering, and custom event rendering.
package: "@g4rcez/components"
export: "{ PageCalendar }"
import: "import { PageCalendar } from '@g4rcez/components'"
category: calendar
---

# PageCalendar

Full-page calendar with month, week, and day views, event filtering, and custom event rendering.

## Import

```tsx
import { PageCalendar } from "@g4rcez/components";
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `CalendarEvent<T>[]` | — | Events to show in all views. |
| `filters` | `CalendarFilter[]` | `[]` | Filter tags. Toggling a filter hides or shows matching events. |
| `defaultView` | `"month" \| "week" \| "day"` | `"month"` | Initial view on mount. |
| `weekStartsOn` | `WeekStart` | `1` | First weekday in week view and month grid. `0` is Sunday, `1` is Monday. |
| `defaultDate` | `Date` | `new Date()` | Initial date in focus. |
| `loading` | `boolean` | `false` | Shows a centered spinner instead of the active view. |
| `onEventClick` | `(event: CalendarEvent) => void` | — | Called when the user clicks an event pill. |
| `onSlotClick` | `(date: Date) => void` | — | Called when the user clicks an empty time slot (week and day views). |
| `onAddEvent` | `() => void` | — | Called when the user clicks the "Add event" header button. Omit it to hide the button. |
| `onChangeFilters` | `(filters: CalendarFilter[]) => void` | — | Called on each filter toggle with the updated filter array. |
| `renderEvent` | `(event: CalendarEvent<T>) => ReactNode` | — | Custom renderer for the selected event detail panel in day view. |
| `filterArea` | `ReactNode` | — | Replaces the default filter tag row in the header. |
| `getFilterId` | `(event: CalendarEvent<T>) => string \| undefined` | — | Accessor for the filter id of an event. Defaults to `event.filterId`. |

## Type Definitions

### CalendarEventBase

```ts
type CalendarEventBase = { id: string; date: Date };
```

### CalendarEvent

```ts
type CalendarEvent<T extends CalendarEventBase = CalendarEventBase> = T & { title: string; filterId?: string; className?: string };
```

`className` applies to the event pill element in all views.

### CalendarFilter

```ts
type CalendarFilter = {
    id: string;
    label: string;
    enabled: boolean;
    theme: TagProps["theme"]; // "primary" | "success" | "warn" | "danger" | "info" | "neutral" | "secondary" | "muted"
};
```

### ViewMode

```ts
type ViewMode = "month" | "week" | "day";
```

### WeekStart

```ts
type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday
```

## Design Tokens

Geometry defaults use scoped `calc` fallbacks from `--var-spacing-base` and the independent `--var-radius-base`. Explicit semantic overrides stay unchanged. See [Geometry tokens](geometry-tokens.md) for default lookup, radius migration, theme emission, and exceptions. The exported `defaultGeometryTokens` map has the full set. Current plain-CSS geometry examples:

| Override | Library default |
| --- | --- |
| `--var-page-calendar-hour-block-size` | `calc(var(--var-spacing-base) * 3)` |
| `--var-page-calendar-gap` | `calc(var(--var-spacing-base) * 1)` |
| `--var-page-calendar-header-nav-icon-size` | `calc(var(--var-spacing-base) * 1)` |
| `--var-page-calendar-header-icon-size` | `calc(var(--var-spacing-base) * 0.875)` |

Day and week hour rows and event offsets share `--var-page-calendar-hour-block-size`. Changing it keeps event and time-grid alignment. Gutters also scale with density.

The component reads these tokens. Override these CSS variables in your theme to customize them.

| Token | CSS Variable | Purpose |
| --- | --- | --- |
| `bg-primary` | `--var-color-primary` | Today and selected day background |
| `text-primary-foreground` | `--var-color-primary-foreground` | Text on today / selected day |
| `bg-background` | `--var-color-background` | Non-today header date badge background |
| `text-foreground` | `--var-color-foreground` | Default day and header text |
| `text-muted-foreground` | `--var-color-muted-foreground` | Hour labels and secondary text |
| `border-border` | `--var-color-border` | Day header and time-grid column borders |
| CSS override | `--var-page-calendar-slot-border` | Day/week hour-slot dividers |
| CSS override | `--var-page-calendar-slot-background-hover` | Time-slot hover background |

## Views

### Month view

- A 6-row grid of all days in the selected month.
- Each day cell shows event pills.
- Click a day to open that day in day view.

### Week view

- Shows the 7 days of the current week with an hourly time grid. The selected day is highlighted.
- Events sit at their time position.
- Click an empty slot to call `onSlotClick`.

### Day view

- Shows one day with an hourly grid, a mini calendar, and a detail panel.
- Week and day views have a header date picker to jump to another day.
- When the user clicks an event, the detail panel shows a default summary or your `renderEvent` output.

## Examples

### Minimal calendar

```tsx
import { PageCalendar } from "@g4rcez/components";
type MyEvent = { id: string; date: Date; title: string };
const events: MyEvent[] = [{ id: "1", date: new Date(), title: "Team standup" }];
export function MyCalendar() {
    return <PageCalendar events={events} onEventClick={(event) => console.log(event)} />;
}
```

### With filters

```tsx
import { PageCalendar } from "@g4rcez/components";
import type { CalendarFilter } from "@g4rcez/components";
const filters: CalendarFilter[] = [
    { id: "work", label: "Work", enabled: true, theme: "primary" },
    { id: "personal", label: "Personal", enabled: true, theme: "success" },
];
const events = [
    { id: "1", date: new Date(), title: "Sprint planning", filterId: "work" },
    { id: "2", date: new Date(), title: "Gym", filterId: "personal" },
];
export function FilteredCalendar() {
    return <PageCalendar events={events} filters={filters} onChangeFilters={(updated) => console.log(updated)} />;
}
```

### Custom event detail in day view

```tsx
import { PageCalendar } from "@g4rcez/components";
import { MapPinIcon } from "@phosphor-icons/react";
export function DetailCalendar() {
    return (
        <PageCalendar
            events={events}
            defaultView="day"
            renderEvent={(event) => (
                <div className="flex flex-col gap-1 p-2 bg-muted rounded-card-radius">
                    {" "}
                    <span className="font-semibold text-foreground">{event.title}</span>{" "}
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        {" "}
                        <MapPinIcon size={12} /> {event.location}{" "}
                    </span>{" "}
                </div>
            )}
        />
    );
}
```

### Controlled add-event flow

```tsx
import { useState } from "react";
import { PageCalendar } from "@g4rcez/components";
export function EditableCalendar() {
    const [showForm, setShowForm] = useState(false);
    const [slotDate, setSlotDate] = useState<Date | null>(null);
    return (
        <>
            {" "}
            <PageCalendar
                events={events}
                onAddEvent={() => setShowForm(true)}
                onSlotClick={(date) => {
                    setSlotDate(date);
                    setShowForm(true);
                }}
            />{" "}
            {showForm && <EventForm defaultDate={slotDate} onClose={() => setShowForm(false)} />}{" "}
        </>
    );
}
```

### Custom filter area

```tsx
import { PageCalendar } from "@g4rcez/components";
import { Button } from "@g4rcez/components/button";
export function CustomFilterCalendar() {
    return (
        <PageCalendar
            events={events}
            filterArea={
                <div className="flex items-center gap-2 rounded-card-radius bg-muted px-3 py-1.5">
                    {" "}
                    <Button theme="ghost-muted" size="small">
                        {" "}
                        All{" "}
                    </Button>{" "}
                    <Button theme="primary" size="small">
                        {" "}
                        Mine{" "}
                    </Button>{" "}
                </div>
            }
        />
    );
}
```

## Do

- Give every event and filter a unique `id`. This gives stable React keys and correct filter matching.
- Set `theme` on filters to give users a visual legend for event categories.
- Implement both `onAddEvent` and `onSlotClick`. They give users two entry points to create events.
- Use design-token classes in `renderEvent` output (`bg-muted`, `text-foreground`, `border-border`).
- Keep event `title` values short. Month and week event pills truncate them.

## Don't

- Don't pass raw utility color classes (`bg-blue-500`, `text-white`, `border-gray-300`). Use `theme` on filters or events, or design tokens.
- Don't use arbitrary utility values (`bg-[#abc]`, `bg-[--my-var]`). Override CSS variables in your `@theme` block.
- Don't pack more than a few events per day in month view. The grid overflows. Guide users to week or day view for dense schedules.
- Don't use extremely long event titles. The event pill truncates them.
- Don't supply both `filterArea` and `filters` expecting both to render. `filterArea` fully replaces the default filter tag row.

## Accessibility

- The root container has `role="application"`. Its `aria-label` comes from the i18n translation key `pageCalendarLabel`.
- The header month/year title uses `aria-live="polite"` and `aria-atomic="true"`. Screen readers announce date changes after navigation.
- Navigation buttons (`Previous`, `Today`, `Next`) have `aria-label` attributes.
- View toggle buttons use `aria-pressed` for the active view.
- Filter tags are `<button>` elements with `aria-pressed` and an `aria-label` that includes the enabled or disabled state.
- Day view hour slots have `role="button"`, `tabIndex={0}`, and `aria-label` for keyboard slot selection.
- The day column header has an `aria-label` with the full formatted date string.

## Data Attributes

- `data-component="day-view-scroller"`: the scrolling container inside day view. Use it for CSS height overrides:

```css
[data-component="day-view-scroller"] {
    height: calc(100dvh - 200px);
}
```

## Notes

- `date-fns` does all date arithmetic and locale-aware formatting. The `useLocale` hook gives the locale. Set it at the app root through the component provider.
- The i18n translation system drives all labels (button text, ARIA strings, week number format). Override them with the `translations` prop on the root provider.
- The component manages event filtering internally. Use `onChangeFilters` to mirror the filter state to an external store without controlling it.
- The day view mini calendar shows dots beneath days that have events. The dots match the `bg-primary` token.
- The component grows to fill its container (`h-full flex-grow`). Place it in a flex or grid container with an explicit height and `min-height: 0`. Apply the height to the container of the calendar, not to surrounding documentation or sibling sections.
- Month view scrolls within the available height. Week and day time grids scroll within their view.
- The day grid shrinks beside its detail panel. The toolbar wraps when horizontal space is limited.
- On narrow screens, day view stacks the time grid above the mini calendar and scrolls the combined view. The time grid keeps a usable viewport.
