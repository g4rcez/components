import { defineComponentStyles } from "../../lib/component-styles";

export const tableHeadStyles = defineComponentStyles({
    name: "table-head",
    variants: {},
    css: "@g4rcez/components/table.css",
    defaults: {},
    slots: [
        "filter-icon",
        "add-icon",
        "cell",
        "cell-content",
        "actions",
        "sr-label",
        "dropdown-title",
        "title-strong",
        "filter-list",
        "filter-item",
        "add-filter-button",
        "label",
        "resizer",
    ],
    dependencies: ["dropdown", "table-filter", "table-sort"],
});
