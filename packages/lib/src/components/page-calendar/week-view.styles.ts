import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarWeekViewStyles = defineComponentStyles({
    name: "page-calendar-week-view",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: [
        "root",
        "header",
        "gutter",
        "weekday",
        "weekday-name",
        "day-badge",
        "scroll-body",
        "hour-row",
        "hour-label",
        "day-column",
        "time-slot",
        "event",
    ],
    dependencies: ["page-calendar-event-pill"],
});
