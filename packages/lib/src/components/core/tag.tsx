import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";
import { Polymorph, PolymorphicProps } from "./polymorph";

const indicatorVariant = cva("size-2.5 aspect-square rounded-full border-0", {
    variants: {
        theme: {
            warn: "bg-warn",
            info: "bg-info",
            main: "bg-primary",
            danger: "bg-danger",
            success: "bg-success",
            secondary: "bg-secondary",
        },
    },
});

const tagVariants = cva("inline-flex rounded-pill gap-1.5 border-2 border-transparent items-center justify-center align-middle whitespace-nowrap", {
    variants: {
        size: {
            icon: "p-1",
            big: "h-12 px-6 py-4",
            default: "h-8 px-4 py-2",
            small: "h-6 p-2 px-3 text-sm",
        },
        theme: {
            primary: "bg-tag-primary-bg text-tag-primary-text",
            danger: "bg-tag-danger-bg text-tag-danger-text",
            info: "bg-tag-info-bg text-tag-info-text",
            success: "bg-tag-success-bg text-tag-success-text",
            secondary: "bg-tag-secondary-bg text-tag-secondary-text",
            warn: "bg-tag-warn-bg text-tag-warn-text",
            neutral: "bg-transparent border border-card-border",
            disabled: "bg-disabled duration-700 opacity-70",
            loading: "animate-pulse bg-disabled duration-700 opacity-70",
        },
    },
    defaultVariants: { theme: "primary", size: "default" },
});

export type TagProps<T extends React.ElementType = "span"> = PolymorphicProps<
    VariantProps<typeof tagVariants> &
        Partial<{
            icon: Label;
            loading: boolean;
            indicator: VariantProps<typeof indicatorVariant>["theme"];
        }>,
    T
>;

export const Tag: <T extends React.ElementType = "span">(props: TagProps<T>) => any = forwardRef(function Tag(
    { className, indicator = undefined, icon, loading, theme, size, ...props }: TagProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
    return (
        <Polymorph {...props} ref={ref} data-theme={theme} as={props.as ?? "span"} className={css(tagVariants({ size, theme }), className)}>
            {indicator ? <span className={indicatorVariant({ theme: indicator })} /> : null}
            {icon}
            {props.children}
        </Polymorph>
    );
}) as never;
