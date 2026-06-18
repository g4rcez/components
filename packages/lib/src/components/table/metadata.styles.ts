import { defineComponentStyles } from "../../lib/component-styles";

export const tableMetadataStyles = defineComponentStyles({
    name: "table-metadata",
    variants: {},
    defaults: {},
    slots: [],
    dependencies: ["table-filter", "table-group", "table-sort"],
});
