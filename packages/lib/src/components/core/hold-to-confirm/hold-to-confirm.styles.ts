import { defineComponentStyles, type ComponentStyleProps } from "../../../lib/component-styles";

export const holdToConfirmStyles = defineComponentStyles({
    name: "hold-to-confirm",
    variants: { tone: ["danger", "neutral"] },
    defaults: { tone: "danger" },
    slots: ["fill", "content", "overlay", "icon", "label", "hint", "status"],
    dependencies: [],
});

export type HoldToConfirmStyleProps = ComponentStyleProps<typeof holdToConfirmStyles>;
