import { defineComponentStyles } from "../../../lib/component-styles";

export const swipeableListStyles = defineComponentStyles({
    name: "swipeable-list",
    variants: {
        tone: ["neutral", "primary", "success", "warning", "danger"],
    },
    defaults: { tone: "neutral" },
    slots: [
        "list",
        "item",
        "rail",
        "action-group",
        "action",
        "action-icon",
        "screen-reader-label",
        "surface",
        "item-content",
        "leading",
        "content",
        "title",
        "description",
        "meta",
    ],
    dependencies: [],
});
