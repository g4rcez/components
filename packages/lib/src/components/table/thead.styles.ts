import { defineComponentStyles } from "../../lib/component-styles";

export const tableHeadStyles = defineComponentStyles({
    name: "table-head",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["filter-icon", "add-icon"],
    dependencies: ["dropdown", "table-filter", "table-sort"],
});
