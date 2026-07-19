import { defineComponentStyles } from "../../../lib/component-styles";

export const cardStyles = defineComponentStyles({
    slots: [
        "body",
        "title",
        "content",
        "skeleton",
        "skeleton-line",
        "header",
        "heading",
        "actions",
        "stats-container",
        "stats-body",
        "stats-panel",
        "stats-icon",
        "stats-content",
        "stats-title",
        "stats-loading",
        "stats-value",
        "border",
    ],
    name: "card",
    variants: {},
    defaults: {},
    dependencies: ["polymorph"],
});
