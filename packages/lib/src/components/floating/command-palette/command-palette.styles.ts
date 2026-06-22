import { defineComponentStyles } from "../../../lib/component-styles";

export const commandPaletteStyles = defineComponentStyles({
    name: "command-palette",
    variants: {},
    css: "@g4rcez/components/command-palette.css",
    defaults: {},
    slots: [
        "body",
        "group-label",
        "group-row",
        "item",
        "item-content",
        "loading-row",
        "header",
        "search-icon-frame",
        "search-icon",
        "input",
        "loading-list",
        "content",
        "list",
        "empty",
        "footer",
    ],
    dependencies: ["modal"],
});
