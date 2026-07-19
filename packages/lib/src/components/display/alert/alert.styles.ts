import { defineComponentStyles } from "../../../lib/component-styles";

export const alertStyles = defineComponentStyles({
    name: "alert",
    variants: {},
    defaults: {},
    slots: ["container", "collapse", "content", "close-button", "close-icon", "header", "icon", "title", "body"],
    dependencies: ["polymorph"],
});
