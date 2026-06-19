import { defineComponentStyles } from "../../lib/component-styles";

export const pageCalendarHeaderStyles = defineComponentStyles({
    name: "page-calendar-header",
    variants: {},
    css: "@g4rcez/components/page-calendar.css",
    defaults: {},
    slots: ["nav-icon", "add-icon", "filter-icon"],
    dependencies: ["button", "tag"],
});
