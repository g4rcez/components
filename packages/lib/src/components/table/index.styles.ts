import { defineComponentStyles } from "../../lib/component-styles";

export const tableRootStyles = defineComponentStyles({
    name: "table-root",
    variants: {},
    defaults: {},
    slots: [],
    dependencies: ["table-filter", "table-group", "table-inner-table", "table-metadata"],
});
