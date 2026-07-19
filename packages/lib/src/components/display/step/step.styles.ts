import { defineComponentStyles } from "../../../lib/component-styles";

export const stepStyles = defineComponentStyles({
    name: "step",
    variants: {},
    defaults: {},
    slots: ["connector", "item", "halo", "marker", "marker-content", "status-icon", "label", "title"],
    dependencies: [],
});
