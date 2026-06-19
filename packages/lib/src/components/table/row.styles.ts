import { defineComponentStyles } from "../../lib/component-styles";

export const tableRowStyles = defineComponentStyles({
    name: "table-row",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["aside", "cell", "cell-content"],
    dependencies: [],
});
