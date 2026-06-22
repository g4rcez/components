import { defineComponentStyles } from "../../../lib/component-styles";

export const tooltipStyles = defineComponentStyles({
    name: "tooltip",
    variants: {},
    css: "@g4rcez/components/tooltip.css",
    defaults: {},
    slots: ["arrow"],
    dependencies: ["polymorph"],
});
