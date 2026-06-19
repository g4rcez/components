import { defineComponentStyles } from "../../../lib/component-styles";

export const modalStyles = defineComponentStyles({
    name: "modal",
    variants: {},
    defaults: {},
    slots: ["close-icon"],
    dependencies: ["button"],
});
