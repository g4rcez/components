import { defineComponentStyles } from "../../lib/component-styles";

export const tableMetadataStyles = defineComponentStyles({
    name: "table-metadata",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["root", "container", "operations", "active-filters", "pill", "dot", "value-frame", "ghost-value", "input"],
    dependencies: ["table-filter", "table-group", "table-sort"],
});
