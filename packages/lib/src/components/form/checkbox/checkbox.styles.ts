import { defineComponentStyles } from "../../../lib/component-styles";

export const checkboxStyles = defineComponentStyles({
    dependencies: [],
    name: "checkbox",
    defaults: { task: "false", size: "normal" },
    variants: {
        size: ["big", "default", "min", "normal", "small", "tiny", "medium", "large"],
        task: ["true", "false"],
    },
    css: "@g4rcez/components/checkbox.css",
    slots: ["label", "control", "control-state", "error"],
});
