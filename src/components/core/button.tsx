import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { Polymorph, PolymorphicProps } from "~/components/core/polymorph";
import { css } from "~/lib/dom";
import { Label } from "~/types";

const buttonVariants = cva(
    "inline-flex gap-1.5 text-main-foreground border-2 border-transparent items-center justify-center align-middle cursor-pointer whitespace-nowrap font-medium transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
    {
        variants: {
            size: {
                default: "h-10 px-4 py-2",
                big: "h-12 px-6 py-4",
                small: "h-10 p-2 text-sm",
                icon: "p-1",
            },
            rounded: {
                rough: "rounded-sm",
                default: "rounded-md",
                squared: "rounded-none",
                circle: "rounded-full aspect-square",
            },
            theme: {
                raw: "",
                main: "bg-primary hover:bg-primary-hover text-primary-foreground",
                loading: "animate-pulse bg-disabled duration-700 opacity-70",
                disabled: "bg-disabled duration-700 opacity-70",
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
            disabled={disabled}
            as={props.as ?? "button"}
            onClick={disabled ? undefined : props.onClick}
            className={css(
                buttonVariants({
                    size,
                    rounded,
                    theme: loading ? "loading" : disabled ? "disabled" : theme,
                }),
                className
            )}
        >
            {props.children}
            {icon}
        </Polymorph>
    );
}) as never;

type Props = {
    active: string;
    buttons: ButtonProps[];
};

export const ButtonGroup = (props: Props) => (
    <ul className="border-main-bg text-main-foreground flex w-full flex-row rounded-md border-2">
        {props.buttons.map((button) => (
            <li key={`button-group-${button.name}`} className="flex flex-1">
                <button
                    {...button}
                    type={button.type || "button"}
                    data-active={props.active === button.name ? "true" : "false"}
                    className={css(
                        "border-main-bg flex flex-1 items-center gap-1.5 rounded-sm border-r-2 px-4 py-2 last:border-r-0",
                        "hover:text-main cursor-pointer justify-center whitespace-nowrap align-middle font-medium",
                        "focus-visible:ring-ring shadow-sm focus-visible:outline-none focus-visible:ring-2 disabled:text-opacity-80",
                        "data-[active=true]:bg-main-bg text-body data-[active=true]:text-main transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-50"
                    )}
                />
            </li>
        ))}
    </ul>
);
