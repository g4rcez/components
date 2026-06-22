import { defineComponentStyles } from "../../../lib/component-styles";

export const expandStyles = defineComponentStyles({
    defaults: {},
    variants: {},
    name: "expand",
    slots: ["content"],
    dependencies: ["button"],
    css: "@g4rcez/components/expand.css",
});
