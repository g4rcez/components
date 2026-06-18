import { defineComponentStyles } from "../../lib/component-styles";

export const tableGroupStyles = defineComponentStyles({
    name: "table-group",
    variants: {},
    defaults: {},
    slots: ["drag-icon", "trigger-icon", "delete-icon"],
    dependencies: ["button", "dropdown", "select"],
});
