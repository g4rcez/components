import { defineComponentStyles } from "../../../lib/component-styles";

export const reactionsStyles = defineComponentStyles({
    name: "reactions",
    variants: {},
    defaults: {},
    slots: ["bar", "pill", "icon", "count", "add", "panel", "picker", "option", "highlight", "status"],
    dependencies: ["dropdown", "rolling-text"],
});
