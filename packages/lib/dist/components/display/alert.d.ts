import { type VariantProps } from "class-variance-authority";
import { HTMLMotionProps } from "framer-motion";
import React, { PropsWithChildren } from "react";
import { PolymorphicProps } from "../core/polymorph";
type CollapseProps = {
    open: boolean;
} & HTMLMotionProps<"section">;
export declare const Collapse: (props: PropsWithChildren<CollapseProps>) => import("react/jsx-runtime").JSX.Element;
declare const alertVariants: (props?: ({
    theme?: "danger" | "success" | "neutral" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export type AlertProps<T extends React.ElementType = "div"> = PolymorphicProps<VariantProps<typeof alertVariants> & Partial<{
    container: string;
    open?: boolean;
    onClose: (nextState: boolean) => void;
}>, T>;
export declare const Alert: <T extends React.ElementType = "div">(props: AlertProps<T>) => any;
export {};
//# sourceMappingURL=alert.d.ts.map