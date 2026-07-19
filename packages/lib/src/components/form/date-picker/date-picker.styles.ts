import { defineComponentStyles } from "../../../lib/component-styles";

export const datePickerStyles = defineComponentStyles({
    name: "date-picker",
    css: "@g4rcez/components/date-picker.css",
    variants: {},
    defaults: {},
    slots: [
        "calendar-icon",
        "sr-label",
        "range-field",
        "range-control",
        "range-input",
        "range-separator",
        "panel",
        "presets",
        "preset-search",
        "preset-list",
        "preset-button",
        "preset-check",
        "actions",
        "actions-confirm",
        "today-action",
        "cancel-action",
        "apply-action",
    ],
    dependencies: ["calendar", "dropdown", "input"],
});
