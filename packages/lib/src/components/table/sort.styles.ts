import { defineComponentStyles } from "../../lib/component-styles";

export const tableSortStyles = defineComponentStyles({
    name: "table-sort",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["trigger-icon", "delete-icon", "add-icon", "head-icon"],
    dependencies: ["dropdown", "select"],
});
