import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarMonthViewStyles = defineComponentStyles({
    name: "page-calendar-month-view",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: [],
    dependencies: ["page-calendar-event-pill"],
});
