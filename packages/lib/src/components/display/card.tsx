import React, { PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { Label, Override } from "../../types";
import { Polymorph, PolymorphicProps } from "../core/polymorph";

export type CardProps = PolymorphicProps<
    Override<
        React.ComponentProps<"div">,
        {
            titleClassName?: string;
            title?: Label;
            container?: string;
            header?: React.ReactElement | null;
        }
    >,
    "div"
>;

export const Card = ({
    children,
    title,
    titleClassName = "",
    as = "div",
    container = "",
    header = null,
    className = "",
    ...props
}: PropsWithChildren<CardProps>) => (
    <Polymorph
        {...props}
        as={as}
        data-componen="card"
        className={css("flex flex-col gap-4 rounded-card border border-card-border bg-card-background py-4 pb-8 shadow", container)}
    >
        {title ? (
            <header className={css("mb-2 w-full border-b border-card-border px-4 pb-4 text-xl font-medium lg:px-8", titleClassName)}>{title}</header>
        ) : (
            header
        )}
        <div className={css("min-w-full px-4 lg:px-8", className)}>{children}</div>
    </Polymorph>
);

export type CardHeaderTitleProps<T extends React.ElementType = "div"> = PolymorphicProps<
    {
        navTag?: React.ElementType;
        titleTag?: React.ElementType;
        title: React.ReactElement | string;
    },
    T
>;

Card.Title = ({ as, titleTag, navTag, children, ...props }: PropsWithChildren<CardHeaderTitleProps>) => {
    const Component = (as || "div") as any;
    const Title = (titleTag || "h2") as any;
    const Nav = (navTag || "nav") as any;
    return (
        <Component
            {...props}
            className={css("flex w-full flex-col flex-wrap items-start justify-between gap-base sm:flex-row sm:items-center", props.className)}
        >
            <Title className="font-semibold">{props.title}</Title>
            {children ? (
                <Nav className="gap-kilo flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-end">{children}</Nav>
            ) : null}
        </Component>
    );
};
