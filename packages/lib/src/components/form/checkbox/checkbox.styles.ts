import { defineComponentStyles } from "../../../lib/component-styles";

export const checkboxStyles = defineComponentStyles({
    dependencies: [],
    name: "checkbox",
    defaults: { task: "false" },
    variants: { task: ["true", "false"] },
    css: "@g4rcez/components/checkbox.css",
    slots: ["label", "control", "control-state", "error"],
});
