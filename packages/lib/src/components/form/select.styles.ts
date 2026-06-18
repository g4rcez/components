import { defineComponentStyles } from "../../lib/component-styles";

export const selectStyles = defineComponentStyles({
    name: "select",
    variants: {},
    defaults: {},
    slots: ["field", "trigger", "trigger-icon", "trigger-label", "control"],
    dependencies: ["input-field"],
});
