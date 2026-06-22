import { defineComponentStyles } from "../../../lib/component-styles";

export const skeletonStyles = defineComponentStyles({
    name: "skeleton",
    variants: {},
    defaults: {},
    slots: ["cell", "block", "list"],
    dependencies: ["polymorph"],
});
