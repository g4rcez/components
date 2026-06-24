import { defineComponentStyles } from "../../../lib/component-styles";

export const autocompleteStyles = defineComponentStyles({
    name: "autocomplete",
    variants: {
        size: ["normal", "small"],
    },
    css: "@g4rcez/components/autocomplete.css",
    defaults: {
        size: "normal",
    },
    slots: [
        "list",
        "item",
        "option",
        "field-state",
        "disabled-border",
        "actions",
        "action",
        "input-icon",
        "sr-label",
        "input",
        "control-state",
        "panel",
        "empty",
        "empty-text",
        "scroll",
    ],
    dependencies: ["free-text", "select"],
});
