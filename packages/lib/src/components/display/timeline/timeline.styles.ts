import { defineComponentStyles } from "../../../lib/component-styles";

export const timelineStyles = defineComponentStyles({
    name: "timeline",
    variants: {},
    defaults: {},
    slots: ["item", "connector", "content", "icon", "body", "actions"],
    dependencies: ["polymorph"],
});
