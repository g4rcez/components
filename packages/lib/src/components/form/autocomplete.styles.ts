import { defineComponentStyles } from "../../lib/component-styles";

export const autocompleteStyles = defineComponentStyles({
    name: "autocomplete",
    variants: {},
    defaults: {},
    slots: ["caret-icon"],
    dependencies: ["input-field", "select"],
});
