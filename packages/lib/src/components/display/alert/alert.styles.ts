import { defineComponentStyles } from "../../../lib/component-styles";

export const alertStyles = defineComponentStyles({
    name: "alert",
    variants: {},
    defaults: {},
    slots: ["icon", "close-icon"],
    dependencies: ["polymorph"],
});
