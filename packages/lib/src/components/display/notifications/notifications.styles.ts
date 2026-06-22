import { defineComponentStyles } from "../../../lib/component-styles";

export const notificationsStyles = defineComponentStyles({
    name: "notifications",
    variants: {
        theme: ["default", "info", "warn", "muted", "danger", "success", "secondary"],
    },
    defaults: {
        theme: "default",
    },
    slots: ["item", "content", "icon", "text", "title", "description", "close", "close-icon", "viewport", "badge"],
    dependencies: [],
});
