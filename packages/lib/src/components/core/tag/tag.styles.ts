import { defineComponentStyles } from "../../../lib/component-styles";

export const tagStyles = defineComponentStyles({
    name: "tag",
    variants: {
        size: ["icon", "big", "default", "tiny", "small"],
        theme: ["custom", "info", "warn", "muted", "danger", "disabled", "primary", "success", "neutral", "secondary", "loading"],
    },
    defaults: { theme: "primary", size: "default" },
    slots: ["indicator"],
    dependencies: ["polymorph"],
});
