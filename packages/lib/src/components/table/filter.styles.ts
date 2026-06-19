import { defineComponentStyles } from "../../lib/component-styles";

export const tableFilterStyles = defineComponentStyles({
    name: "table-filter",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["trigger-icon", "add-icon", "delete-icon"],
    dependencies: ["dropdown", "input", "select"],
});
