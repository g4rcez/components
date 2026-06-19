import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarWeekViewStyles = defineComponentStyles({
    name: "page-calendar-week-view",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: [],
    dependencies: ["page-calendar-event-pill"],
});
