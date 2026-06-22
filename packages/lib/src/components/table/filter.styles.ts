import { defineComponentStyles } from "../../lib/component-styles";

export const tableFilterStyles = defineComponentStyles({
    name: "table-filter",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: [
        "trigger-icon",
        "add-icon",
        "delete-icon",
        "trigger-label",
        "count-label",
        "list",
        "row",
        "delete-control",
        "danger-icon",
        "add-button",
        "inline-row",
        "inline-delete-button",
    ],
    dependencies: ["dropdown", "input", "select"],
});
