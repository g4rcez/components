import { defineComponentStyles } from "../../../lib/component-styles";

export const tabsStyles = defineComponentStyles({
    name: "tabs",
    variants: {},
    defaults: {},
    slots: ["container", "header", "divider", "nav", "list", "item", "tab", "indicator"],
    dependencies: ["card", "polymorph"],
});
