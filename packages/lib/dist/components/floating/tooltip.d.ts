import React from "react";
import { PolymorphicProps } from "../../components/core/polymorph";
import { Label, Override } from "../../types";
type TooltipProps = Override<PolymorphicProps<React.ComponentProps<"button">, "span">, {
    title: Label;
}>;
export declare const Tooltip: ({ children, as, title, ...props }: TooltipProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=tooltip.d.ts.map