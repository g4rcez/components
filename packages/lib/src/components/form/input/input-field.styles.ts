import { defineComponentStyles } from "../../../lib/component-styles";

export const inputFieldStyles = defineComponentStyles({
    name: "input-field",
    variants: {},
    css: "@g4rcez/components/input.css",
    defaults: {},
    slots: ["feedback-icon", "status-icon", "tooltip-content", "optional-text", "error"],
    dependencies: ["polymorph", "tooltip"],
});
