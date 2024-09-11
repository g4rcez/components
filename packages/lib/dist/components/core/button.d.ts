import { type VariantProps } from "class-variance-authority";
import React from "react";
import { Label } from "../../types";
import { PolymorphicProps } from "./polymorph";
declare const buttonVariants: (props?: ({
    size?: "big" | "small" | "default" | "icon" | null | undefined;
    rounded?: "circle" | "default" | "rough" | "squared" | null | undefined;
    theme?: "main" | "raw" | "warn" | "danger" | "secondary" | "success" | "info" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export type ButtonProps<T extends React.ElementType = "button"> = PolymorphicProps<VariantProps<typeof buttonVariants> & Partial<{
    icon: Label;
    loading: boolean;
}>, T>;
export declare const Button: <T extends React.ElementType = "button">(props: ButtonProps<T>) => any;
type Props = {
    active: string;
    buttons: ButtonProps[];
};
export declare const ButtonGroup: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=button.d.ts.map