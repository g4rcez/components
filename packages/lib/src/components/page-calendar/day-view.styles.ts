import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarDayViewStyles = defineComponentStyles({
    name: "page-calendar-day-view",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: [],
    dependencies: ["page-calendar-event-pill", "tag"],
});
