import { defineComponentStyles } from "../../lib/component-styles";

export const tableGroupStyles = defineComponentStyles({
    name: "table-group",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: ["drag-icon", "trigger-icon", "delete-icon"],
    dependencies: ["button", "dropdown", "select"],
});
