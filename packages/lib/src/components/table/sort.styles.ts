import { defineComponentStyles } from "../../lib/component-styles";

export const tableSortStyles = defineComponentStyles({
    name: "table-sort",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: [
        "trigger-icon",
        "delete-icon",
        "add-icon",
        "head-icon",
        "trigger-label",
        "list",
        "row",
        "delete-button",
        "danger-icon",
        "add-button",
        "head-button",
        "sr-label",
    ],
    dependencies: ["dropdown", "select"],
});
