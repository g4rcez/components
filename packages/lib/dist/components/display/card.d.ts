import React, { PropsWithChildren } from "react";
import { Label, Override } from "../../types";
import { PolymorphicProps } from "../core/polymorph";
export type CardProps = PolymorphicProps<Override<React.ComponentProps<"div">, {
    title?: Label;
    container?: string;
    header?: React.ReactElement | null;
}>, "div">;
export declare const Card: ({ children, title, as, container, header, className, ...props }: PropsWithChildren<CardProps>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=card.d.ts.map