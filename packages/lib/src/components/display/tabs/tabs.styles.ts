import { defineComponentStyles } from "../../../lib/component-styles";

export const tabsStyles = defineComponentStyles({
    name: "tabs",
    variants: {},
    defaults: {},
    slots: ["tab"],
    dependencies: ["card", "polymorph"],
});
