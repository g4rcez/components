import { defineComponentStyles } from "../../../lib/component-styles";

export const commandPaletteStyles = defineComponentStyles({
    name: "command-palette",
    variants: {},
    defaults: {},
    slots: ["search-icon"],
    dependencies: ["modal"],
});
