import { defineComponentStyles } from "../../../lib/component-styles";

export const sliderStyles = defineComponentStyles({
    name: "slider",
    variants: {},
    defaults: {},
    slots: ["control", "track", "indicator", "thumb"],
    dependencies: ["tooltip"],
});
