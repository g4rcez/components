import { defineComponentStyles } from "../../lib/component-styles";

export const multiSelectStyles = defineComponentStyles({
    name: "multi-select",
    variants: {},
    defaults: {},
    slots: ["tag-remove-icon", "caret-icon", "sr-label"],
    dependencies: ["input-field", "select", "tag"],
});
