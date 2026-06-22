import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarMonthViewStyles = defineComponentStyles({
    name: "page-calendar-month-view",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: ["root", "grid", "weekday-row", "weekday", "week-row", "day-cell", "day-button", "day-badge", "add-indicator", "events", "event-list"],
    dependencies: ["page-calendar-event-pill"],
});
