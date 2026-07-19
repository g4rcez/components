import { defineComponentStyles } from "../../../lib/component-styles";

export const emptyStyles = defineComponentStyles({
    name: "empty",
    variants: {},
    defaults: {},
    slots: ["icon", "message"],
    dependencies: [],
});
