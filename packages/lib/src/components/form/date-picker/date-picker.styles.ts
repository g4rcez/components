import { defineComponentStyles } from "../../../lib/component-styles";

export const datePickerStyles = defineComponentStyles({
    name: "date-picker",
    css: "@g4rcez/components/date-picker.css",
    variants: {},
    defaults: {},
    slots: ["calendar-icon", "sr-label"],
    dependencies: ["calendar", "dropdown", "input"],
});
