import { defineComponentStyles } from "../../../lib/component-styles";

export const listStyles = defineComponentStyles({
    name: "list",
    variants: {},
    defaults: {},
    slots: [
        "overlay",
        "floating-layer",
        "detail-card",
        "close-nav",
        "close-button",
        "header",
        "title",
        "description",
        "item",
        "item-shell",
        "item-row",
        "avatar-frame",
        "avatar-button",
        "item-body",
        "item-content",
        "item-action",
    ],
    dependencies: ["modal"],
});
