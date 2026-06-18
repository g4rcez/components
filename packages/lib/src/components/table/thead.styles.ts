import { defineComponentStyles } from "../../lib/component-styles";

export const tableHeadStyles = defineComponentStyles({
    name: "table-head",
    variants: {},
    defaults: {},
    slots: ["filter-icon", "add-icon"],
    dependencies: ["dropdown", "table-filter", "table-sort"],
});
