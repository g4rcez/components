import { cva } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";
import { css } from "../../../lib/dom";
import type { CvaVariants, Label } from "../../../types";
import { Polymorph, type PolymorphicProps } from "../polymorph/polymorph";

const variants = {
    size: {
        icon: "__tag--size-icon",
        big: "__tag--size-big",
        default: "__tag--size-default",
        tiny: "__tag--size-tiny",
        small: "__tag--size-small",
    },
    theme: {
        custom: "__tag--theme-custom",
        info: "__tag--theme-info",
        warn: "__tag--theme-warn",
        muted: "__tag--theme-muted",
        danger: "__tag--theme-danger",
        disabled: "__tag--theme-disabled",
        primary: "__tag--theme-primary",
        success: "__tag--theme-success",
        neutral: "__tag--theme-neutral",
        secondary: "__tag--theme-secondary",
        loading: "__tag--theme-loading",
    },
};

type Variants = CvaVariants<typeof variants>;

type Themes = NonNullable<Variants["theme"]>;

const indicatorVariant = cva("__tag__indicator", {
    variants: {
        theme: {
            custom: "",
            info: "__tag__indicator--theme-info",
            warn: "__tag__indicator--theme-warn",
            muted: "__tag__indicator--theme-muted",
            danger: "__tag__indicator--theme-danger",
            disabled: "__tag__indicator--theme-muted",
            neutral: "__tag__indicator--theme-neutral",
            primary: "__tag__indicator--theme-primary",
            success: "__tag__indicator--theme-success",
            secondary: "__tag__indicator--theme-secondary",
            loading: "__tag__indicator--theme-muted",
        } as Record<Themes, string>,
    },
});

const tagVariants = cva("__tag", {
    variants,
    defaultVariants: { theme: "primary", size: "default" },
});

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
            data-loading={loading ? true : undefined}
            data-component="tag"
            as={props.as ?? "span"}
            className={css(tagVariants({ size, theme: loading ? "loading" : theme }), className)}
        >
            {indicator ? (
                <span
                    aria-hidden="true"
                    className={indicatorVariant({
                        theme: indicator === true ? (theme ?? "primary") : indicator,
                    })}
                />
            ) : null}
            {icon}
            {props.children}
        </Polymorph>
    );
}) as unknown as <T extends React.ElementType = "span">(_: TagProps<T>) => React.ReactNode;
