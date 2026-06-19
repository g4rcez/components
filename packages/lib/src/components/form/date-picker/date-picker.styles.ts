import { defineComponentStyles } from "../../../lib/component-styles";

export const datePickerStyles = defineComponentStyles({
    name: "date-picker",
    variants: {},
    defaults: {},
    slots: ["calendar-icon"],
    dependencies: ["calendar", "dropdown", "input"],
});
