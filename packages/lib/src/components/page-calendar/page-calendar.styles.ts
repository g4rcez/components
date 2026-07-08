import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarStyles = defineComponentStyles({
    name: "page-calendar",
    variants: {},
    defaults: {},
    slots: [],
    dependencies: ["page-calendar-header", "page-calendar-day-view", "page-calendar-month-view", "page-calendar-week-view", "spinner"],
});
