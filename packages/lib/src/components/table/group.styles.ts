import { defineComponentStyles } from "../../lib/component-styles";

export const tableGroupStyles = defineComponentStyles({
    name: "table-group",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: [
        "drag-icon",
        "trigger-icon",
        "delete-icon",
        "draggable-item",
        "drag-handle",
        "trigger-label",
        "controls",
        "clear-button",
        "danger-icon",
        "order-section",
        "order-title",
        "order-list",
    ],
    dependencies: ["button", "dropdown", "select"],
});
