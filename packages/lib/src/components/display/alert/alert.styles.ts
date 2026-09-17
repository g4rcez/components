import { defineComponentStyles } from "../../../lib/component-styles";

export const alertStyles = defineComponentStyles({
    name: "alert",
    variants: {
        theme: ["primary", "danger", "info", "success", "secondary", "warn", "muted", "neutral"],
    },
    defaults: {
        theme: "neutral",
    },
    slots: ["container", "collapse", "content", "close-button", "close-icon", "header", "icon", "title", "body"],
    dependencies: ["polymorph"],
});
