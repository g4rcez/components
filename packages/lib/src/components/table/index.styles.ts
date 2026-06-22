import { defineComponentStyles } from "../../lib/component-styles";

export const tableRootStyles = defineComponentStyles({
    name: "table-root",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["groups", "group"],
    dependencies: ["table-filter", "table-group", "table-inner-table", "table-metadata"],
});
