import { defineComponentStyles } from "../../lib/component-styles";

export const tableMetadataStyles = defineComponentStyles({
    name: "table-metadata",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: [],
    dependencies: ["table-filter", "table-group", "table-sort"],
});
