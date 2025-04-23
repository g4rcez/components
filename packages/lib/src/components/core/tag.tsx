import { cva } from "class-variance-authority";
import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { CvaVariants, Label } from "../../types";
import { Polymorph, PolymorphicProps } from "./polymorph";

const variants = {
    size: {
        icon: "p-1",
        big: "h-12 px-6 py-4",
        default: "h-8 px-4 py-2",
        small: "h-6 p-2 px-3 text-sm",
    },
    theme: {
        custom: "",
        info: "bg-tag-info-bg text-tag-info-text",
        warn: "bg-tag-warn-bg text-tag-warn-text",
        muted: "bg-tag-muted-bg text-tag-muted-text",
        danger: "bg-tag-danger-bg text-tag-danger-text",
        disabled: "bg-disabled duration-700 opacity-70",
        primary: "bg-tag-primary-bg text-tag-primary-text",
        success: "bg-tag-success-bg text-tag-success-text",
        neutral: "bg-transparent border border-card-border",
        secondary: "bg-tag-secondary-bg text-tag-secondary-text",
        loading: "animate-pulse bg-disabled duration-700 opacity-70",
    },
};

type Variants = CvaVariants<typeof variants>;

type Themes = NonNullable<Variants["theme"]>;

const indicatorVariant = cva("size-2.5 aspect-square rounded-full border-0", {
    variants: {
        theme: {
            info: "bg-info",
            warn: "bg-warn",
            muted: "bg-muted",
            danger: "bg-danger",
            neutral: "bg-muted",
            primary: "bg-primary",
            success: "bg-success",
            secondary: "bg-secondary",
        } as Record<Themes, string>,
    },
});

const tagVariants = cva("inline-flex rounded-pill gap-1.5 border-2 border-transparent items-center justify-center align-middle whitespace-nowrap", {
    variants,
    defaultVariants: { theme: "primary", size: "default" },
});

export type TagProps<T extends React.ElementType = "span"> = PolymorphicProps<
    CvaVariants<typeof variants> & Partial<{ icon: Label; loading: boolean; indicator: Themes }>,
    T
>;

export const Tag: <T extends React.ElementType = "span">(props: TagProps<T>) => any = forwardRef(function Tag(
    { className, indicator = undefined, icon, loading, theme, size, ...props }: TagProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
    return (
        <Polymorph
            {...props}
            ref={ref}
            data-theme={theme}
            data-component="tag"
            as={props.as ?? "span"}
            className={css(tagVariants({ size, theme }), className)}
        >
            {indicator ? <span aria-hidden="true" className={indicatorVariant({ theme: indicator })} /> : null}
            {icon}
            {props.children}
        </Polymorph>
    );
});
