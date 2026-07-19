import { defineComponentStyles } from "../../lib/component-styles";

export const tableInnerTableStyles = defineComponentStyles({
    name: "table-inner-table",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["body", "table", "head", "row", "footer", "footer-row", "loading-cell", "loading-bar", "empty", "viewport", "sentinel"],
    dependencies: ["empty", "table-head", "table-pagination", "table-row"],
});
