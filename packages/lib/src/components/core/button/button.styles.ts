import { defineComponentStyles } from "../../../lib/component-styles";

export const buttonStyles = defineComponentStyles({
    name: "button",
    slots: ["icon"],
    dependencies: [],
    defaults: {
        size: "default",
        theme: "primary",
        rounded: "default",
    },
    variants: {
        size: ["icon", "big", "default", "min", "tiny", "small"],
        rounded: ["rough", "squared", "default", "circle"],
        theme: [
            "raw",
            "disabled",
            "loading",
            "main",
            "info",
            "warn",
            "muted",
            "danger",
            "neutral",
            "outlined",
            "primary",
            "success",
            "secondary",
            "ghost-info",
            "ghost-warn",
            "ghost-danger",
            "ghost-primary",
            "ghost-success",
            "ghost-secondary",
            "ghost-muted",
            "ghost-neutral",
        ],
    },
});
