import { defineComponentStyles } from "../../../lib/component-styles";

export const menuStyles = defineComponentStyles({
    name: "menu",
    variants: {},
    css: "@g4rcez/components/menu.css",
    defaults: {},
    slots: ["item", "floating", "nested-indicator", "nested-icon", "item-icon", "sr-label"],
    dependencies: [],
});
