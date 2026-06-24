import { defineComponentStyles } from "../../../lib/component-styles";

export const radioboxStyles = defineComponentStyles({
    name: "radiobox",
    css: "@g4rcez/components/radiobox.css",
    variants: { size: ["medium", "large"] },
    defaults: { size: "medium" },
    slots: ["label", "control", "control-state"],
    dependencies: [],
});
