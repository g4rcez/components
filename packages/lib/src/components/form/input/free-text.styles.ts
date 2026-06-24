import { defineComponentStyles } from "../../../lib/component-styles";

export const freeTextStyles = defineComponentStyles({
    name: "free-text",
    variants: {
        size: ["normal", "small"],
    },
    css: "@g4rcez/components/input.css",
    defaults: {
        size: "normal",
    },
    slots: ["disabled-border", "field-state", "input", "input-state", "invalid", "placeholder", "resizable", "surface", "transition"],
    dependencies: ["input-field"],
});
