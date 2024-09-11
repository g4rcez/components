import { type VariantProps } from "class-variance-authority";
import React from "react";
import { Label } from "../../types";
import { PolymorphicProps } from "./polymorph";
declare const tagVariants: (props?: ({
    size?: "big" | "small" | "default" | "icon" | null | undefined;
    theme?: "main" | "disabled" | "loading" | "raw" | "warn" | "danger" | "secondary" | "success" | "info" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export type TagProps<T extends React.ElementType = "span"> = PolymorphicProps<VariantProps<typeof tagVariants> & Partial<{
    icon: Label;
    loading: boolean;
}>, T>;
export declare const Tag: <T extends React.ElementType = "span">(props: TagProps<T>) => any;
export {};
//# sourceMappingURL=tag.d.ts.map