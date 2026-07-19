import { defineComponentStyles } from "../../../lib/component-styles";

export const masonryStyles = defineComponentStyles({
    name: "masonry",
    variants: {},
    defaults: {},
    slots: ["item"],
    dependencies: ["polymorph"],
});
