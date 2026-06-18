import { defineComponentStyles } from "../../lib/component-styles";

export const tableSortStyles = defineComponentStyles({
    name: "table-sort",
    variants: {},
    defaults: {},
    slots: ["trigger-icon", "delete-icon", "add-icon", "head-icon"],
    dependencies: ["dropdown", "select"],
});
