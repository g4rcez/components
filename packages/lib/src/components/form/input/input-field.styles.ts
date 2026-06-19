import { defineComponentStyles } from "../../../lib/component-styles";

export const inputFieldStyles = defineComponentStyles({
    name: "input-field",
    variants: {},
    defaults: {},
    slots: ["feedback-icon", "status-icon", "tooltip-content", "optional-text", "error"],
    dependencies: ["polymorph", "tooltip"],
});
