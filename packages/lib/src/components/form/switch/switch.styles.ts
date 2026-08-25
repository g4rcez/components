import { defineComponentStyles } from "../../../lib/component-styles";

export const switchStyles = defineComponentStyles({
    name: "switch",
    variants: {
        size: ["big", "default", "min", "normal", "small", "tiny"],
    },
    defaults: {
        size: "default",
    },
    slots: ["row", "track", "thumb", "label", "label-text", "error"],
    dependencies: [],
});
