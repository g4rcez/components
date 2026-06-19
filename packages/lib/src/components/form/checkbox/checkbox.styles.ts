import { defineComponentStyles } from "../../../lib/component-styles";

export const checkboxStyles = defineComponentStyles({
    name: "checkbox",
    variants: { task: ["true", "false"] },
    defaults: { task: "false" },
    slots: [],
    dependencies: [],
});
