import { defineComponentStyles } from "../../../lib/component-styles";

export const tagStyles = defineComponentStyles({
    name: "tag",
    variants: {
        size: ["icon", "big", "default", "tiny", "small"],
        appearance: ["solid", "soft"],
        theme: ["custom", "info", "warn", "muted", "danger", "disabled", "primary", "success", "neutral", "secondary", "loading"],
    },
    defaults: { theme: "primary", size: "default", appearance: "solid" },
    slots: ["indicator"],
    dependencies: ["polymorph"],
});
