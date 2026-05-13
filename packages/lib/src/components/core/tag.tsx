import { cva } from "class-variance-authority";
import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { CvaVariants, Label } from "../../types";
import { Polymorph, PolymorphicProps } from "./polymorph";

const variants = {
    size: {
        icon: "p-tag-padding-icon",
        big: "h-tag-height-big px-tag-padding-x-big py-tag-padding-y-big",
        default: "h-tag-height px-tag-padding-x py-tag-padding-y",
        tiny: "h-tag-height-tiny px-tag-padding-x-tiny py-tag-padding-y-tiny text-typography-xs",
        small: "h-tag-height-small px-tag-padding-x-small py-tag-padding-y-small text-typography-sm",
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

const indicatorVariant = cva("aspect-square size-tag-indicator-size rounded-full border-0", {
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

const tagVariants = cva(
    "inline-flex items-center justify-center gap-tag-gap whitespace-nowrap rounded-tag-radius border-0 align-middle transition-all duration-300 ease-linear",
    {
        variants,
        defaultVariants: { theme: "primary", size: "default" },
    }
);

export type TagProps<T extends React.ElementType = "span"> = PolymorphicProps<
    CvaVariants<typeof variants> & Partial<{ icon: Label; loading: boolean; indicator: Themes | true }>,
    T
>;

export const Tag: <T extends React.ElementType = "span">(_: TagProps<T>) => React.ReactNode = forwardRef(function Tag<
    T extends React.ElementType = "span",
>({ className, indicator = undefined, icon, loading, theme, size, ...props }: TagProps<T>, ref: React.Ref<HTMLElement>) {
    return (
        <Polymorph
            {...props}
            ref={ref}
            data-theme={theme}
            data-component="tag"
            as={props.as ?? "span"}
            className={css(tagVariants({ size, theme: loading ? "loading" : theme }), className)}
        >
            {indicator ? (
                <span
                    aria-hidden="true"
                    className={indicatorVariant({
                        theme: indicator === true ? theme : indicator,
                    })}
                />
            ) : null}
            {icon}
            {props.children}
        </Polymorph>
    );
}) as unknown as <T extends React.ElementType = "span">(_: TagProps<T>) => React.ReactNode;
