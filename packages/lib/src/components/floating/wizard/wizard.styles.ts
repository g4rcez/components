import { defineComponentStyles } from "../../../lib/component-styles";

export const wizardStyles = defineComponentStyles({
    name: "wizard",
    variants: {},
    css: "@g4rcez/components/wizard.css",
    defaults: {},
    slots: ["overlay", "spotlight", "floating", "surface", "arrow", "footer", "skip-button", "actions", "counter"],
    dependencies: ["button"],
});
