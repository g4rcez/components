import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { type Label } from "../../types";
import { Polymorph, PolymorphicProps } from "./polymorph";

const buttonVariants = cva(
    "inline-flex duration-500 enabled:hover:bg-opacity-70 data-[loading=true]:opacity-30 data-[loading=true]:animate-pulse gap-1.5 border-2 border-transparent items-center justify-center align-middle cursor-pointer whitespace-nowrap font-medium transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-40 disabled:text-opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ease-normal",
    {
        variants: {
            size: {
                default: "h-10 px-4 py-2",
                big: "h-12 px-6 py-4",
                small: "h-8 p-2 text-sm",
                min: "h-7 px-2 py-1 text-sm",
                icon: "p-1",
            },
            rounded: {
                rough: "rounded-sm",
                default: "rounded-button",
                squared: "rounded-none",
                circle: "rounded-full aspect-square",
            },
            theme: {
                raw: "",
                danger: "bg-button-danger-bg text-button-danger-text",
                disabled: "bg-disabled duration-700 opacity-70",
                info: "bg-button-info-bg text-button-info-text",
                loading: "animate-pulse bg-disabled duration-700 opacity-70",
                main: "bg-primary text-primary-foreground",
                neutral: "bg-transparent border border-card-border",
                primary: "bg-button-primary-bg text-button-primary-text",
                secondary: "bg-button-secondary-bg text-button-secondary-text",
                success: "bg-button-success-bg text-button-success-text",
                warn: "bg-button-warn-bg text-button-warn-text",
            },
        },
        defaultVariants: { theme: "main", size: "default", rounded: "default" },
    }
);

export type ButtonProps<T extends React.ElementType = "button"> = PolymorphicProps<
    VariantProps<typeof buttonVariants> & Partial<{ icon: Label; loading: boolean }>,
    T
>;

export const Button: <T extends React.ElementType = "button">(props: ButtonProps<T>) => any = forwardRef(function Button(
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
            data-loading={loading}
            disabled={disabled}
            aria-busy={disabled || loading}
            as={props.as ?? "button"}
            onClick={disabled ? undefined : props.onClick}
            className={css(buttonVariants({ size, rounded, theme }), className)}
        >
            {icon}
            {props.children}
        </Polymorph>
    );
}) as never;

type Props = {
    active: string;
    buttons: ButtonProps[];
};

