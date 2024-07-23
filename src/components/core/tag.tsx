import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";
import { Polymorph, PolymorphicProps } from "./polymorph";

const tagVariants = cva(
    "inline-flex rounded-pill gap-1.5 text-main-foreground border-2 border-transparent items-center justify-center align-middle whitespace-nowrap",
    {
        variants: {
            size: {
                icon: "p-1",
                big: "h-12 px-6 py-4",
                default: "h-8 px-4 py-2",
                small: "h-6 p-2 px-3 text-sm",
            },
            theme: {
                raw: "",
                main: "bg-primary-subtle text-primary-hover",
                warn: "bg-warn-subtle text-warn-hover",
                danger: "bg-danger-subtle text-danger-hover",
                secondary: "bg-secondary-subtle text-secondary-hover",
                success: "bg-success-subtle text-success-hover",
                info: "bg-info-subtle text-info-hover",
                loading: "animate-pulse bg-disabled duration-700 opacity-70",
                disabled: "bg-disabled duration-700 opacity-70",
            },
        },
        defaultVariants: { theme: "main", size: "default" },
    }
);

export type TagProps<T extends React.ElementType = "span"> = PolymorphicProps<
    VariantProps<typeof tagVariants> & Partial<{ icon: Label; loading: boolean }>,
    T
>;

export const Tag: <T extends React.ElementType = "span">(props: TagProps<T>) => any = forwardRef(function Tag(
    { className, icon, loading, theme, size, ...props }: TagProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
    return (
        <Polymorph
            {...props}
            ref={ref}
            data-theme={theme}
            as={props.as ?? "span"}
            className={css(tagVariants({ size, theme }), className)}
        >
            {props.children}
            {icon}
        </Polymorph>
    );
}) as never;
