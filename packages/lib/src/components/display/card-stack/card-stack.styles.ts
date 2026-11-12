import { defineComponentStyles } from "../../../lib/component-styles";

export const cardStackStyles = defineComponentStyles({
    name: "card-stack",
    variants: {},
    defaults: {},
    slots: ["body", "stage", "card", "stamp", "stamp-left", "stamp-right", "controls", "undo-label", "empty", "hint", "status"],
    dependencies: ["button"],
});
