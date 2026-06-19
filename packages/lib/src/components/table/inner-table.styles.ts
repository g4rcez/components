import { defineComponentStyles } from "../../lib/component-styles";

export const tableInnerTableStyles = defineComponentStyles({
    name: "table-inner-table",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["body", "row"],
    dependencies: ["empty", "table-head", "table-pagination", "table-row"],
});
