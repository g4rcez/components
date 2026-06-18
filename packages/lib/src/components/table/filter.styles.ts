import { defineComponentStyles } from "../../lib/component-styles";

export const tableFilterStyles = defineComponentStyles({
    name: "table-filter",
    variants: {},
    defaults: {},
    slots: ["trigger-icon", "add-icon", "delete-icon"],
    dependencies: ["dropdown", "input", "select"],
});
