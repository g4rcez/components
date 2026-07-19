import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarEventPillStyles = defineComponentStyles({
    name: "page-calendar-event-pill",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: ["button", "title", "time"],
    dependencies: ["button"],
});
