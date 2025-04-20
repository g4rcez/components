import { cva } from "class-variance-authority";
import React, { forwardRef, PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { CvaVariants, type Label } from "../../types";
import { Polymorph, PolymorphicProps } from "./polymorph";

const variants = {
    size: {
        icon: "p-1",
        big: "h-12 px-6 py-4",
        default: "h-10 px-4 py-2",
        min: "h-7 px-3 py-1 text-sm",
        small: "h-8 px-4 py-2 text-sm",
    },
    rounded: {
        rough: "rounded-sm",
        squared: "rounded-none",
        default: "rounded-button",
        circle: "rounded-full aspect-square",
    },
    theme: {
        raw: "",
        disabled: "bg-disabled opacity-70",
        loading: "animate-pulse bg-disabled",
        main: "bg-primary text-primary-foreground",
        info: "bg-button-info-bg text-button-info-text",
        warn: "bg-button-warn-bg text-button-warn-text",
        muted: "bg-button-muted-bg text-button-muted-text",
        danger: "bg-button-danger-bg text-button-danger-text",
        neutral: "bg-transparent border-2 border-card-border",
        primary: "bg-button-primary-bg text-button-primary-text",
        success: "bg-button-success-bg text-button-success-text",
        secondary: "bg-button-secondary-bg text-button-secondary-text",

        "ghost-info": "bg-transparent hover:bg-info/20 border border-info text-info",
        "ghost-warn": "bg-transparent hover:bg-warn/20 border border-warn text-warn",
        "ghost-danger": "bg-transparent hover:bg-danger/20 border border-danger text-danger",
        "ghost-primary": "bg-transparent hover:bg-primary/20 border border-primary text-primary",
        "ghost-success": "bg-transparent hover:bg-success/20 border border-success text-success",
        "ghost-secondary": "bg-transparent hover:bg-secondary/20 border border-secondary text-secondary",
    },
};

const buttonVariants = cva(
    "relative overflow-hidden inline-flex duration-500 enabled:hover:bg-opacity-70 enabled:focus:bg-opacity-70 data-[loading=true]:opacity-30 data-[loading=true]:animate-pulse gap-1.5 items-center justify-center align-middle cursor-pointer whitespace-nowrap font-medium transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-40 disabled:text-opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
    {
        variants,
        defaultVariants: { theme: "main", size: "default", rounded: "default" },
    }
);

type Variants = CvaVariants<typeof variants>;

export type ButtonProps<T extends React.ElementType = "button"> = PropsWithChildren<
    PolymorphicProps<Variants & Partial<{ icon: Label; loading: boolean }>, T>
>;

export const Button: <T extends React.ElementType = "button">(props: ButtonProps<T>) => React.ReactNode = forwardRef(function Button(
    { className, icon, loading, theme, type = "button", size, rounded, ...props }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
    const disabled = loading || props.disabled;
    return (
        <Polymorph
            {...props}
            ref={ref}
            type={type}
            data-theme={theme}
            disabled={disabled}
            data-loading={loading}
            data-component="button"
            aria-disabled={disabled}
            as={props.as ?? "button"}
            aria-busy={disabled || loading}
            onClick={disabled ? undefined : props.onClick}
            className={css(buttonVariants({ size, rounded, theme }), className)}
        >
            {icon}
            {props.children}
        </Polymorph>
    );
});
