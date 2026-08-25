import { defineComponentStyles } from "../../../lib/component-styles";

export const selectStyles = defineComponentStyles({
    name: "select",
    css: "@g4rcez/components/select.css",
    variants: {
        size: ["big", "default", "min", "normal", "small", "tiny"],
    },
    defaults: {
        size: "normal",
    },
    slots: ["field", "trigger", "trigger-icon", "trigger-label", "control"],
    dependencies: ["free-text"],
});
