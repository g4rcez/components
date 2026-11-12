import { defineComponentStyles, type ComponentStyleProps } from "../../../lib/component-styles";

export const actionSwapStyles = defineComponentStyles({
    name: "action-swap",
    variants: { size: ["sm", "md", "lg"] },
    defaults: { size: "md" },
    slots: ["content", "icon", "spinner", "label", "status"],
    dependencies: ["spinner", "rolling-text"],
});

export type ActionSwapStyleProps = ComponentStyleProps<typeof actionSwapStyles>;
