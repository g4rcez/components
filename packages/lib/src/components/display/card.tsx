import React, { PropsWithChildren } from "react";
import { Is } from "sidekicker";
import { css } from "../../lib/dom";
import { Label, Override } from "../../types";
import { Polymorph, PolymorphicProps } from "../core/polymorph";
import { InfoIcon, LucideIcon } from "lucide-react";
import { Skeleton } from "./skeleton";

export type CardProps = PolymorphicProps<
    Override<
        React.ComponentProps<"div">,
        Partial<{
            title: Label;
            loading: boolean;
            container: string;
            titleClassName: string;
            header: React.ReactElement | null;
        }>
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
    loading,
    ...props
}: PropsWithChildren<CardProps>) => (
    <Polymorph
        {...props}
        as={as}
        data-component="card"
        className={css("flex shadow-shadow-card flex-col gap-4 rounded-card border border-card-border bg-card-background py-4 pb-5", container)}
    >
        {title ? (
            <header
                data-component="card-title"
                className={css("mb-2 w-full border-b border-card-border px-4 pb-4 text-xl font-medium lg:px-8", titleClassName)}
            >
                {title}
            </header>
        ) : (
            header
        )}
        <div data-component="card-body" className={css("min-w-full px-4 lg:px-8", className)}>
            {loading ? (
                <div className="flex flex-col gap-4">
                    <Skeleton className="w-full" />
                    <Skeleton className="w-8/12" />
                    <Skeleton className="w-10/12" />
                    <Skeleton className="w-1/2" />
                </div>
            ) : children}
        </div>
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
            title={Is.string(props.title) ? props.title : undefined}
            className={css("flex w-full flex-col flex-wrap items-start justify-between gap-base sm:flex-row sm:items-center", props.className)}
        >
            <Title className="font-semibold">{props.title}</Title>
            {children ? (
                <Nav className="flex flex-col justify-start items-start sm:flex-row sm:justify-end sm:items-center gap-kilo">{children}</Nav>
            ) : null}
        </Component>
    );
};

export const StatsCard = (props: PolymorphicProps<{ Icon: LucideIcon; title: string; value: Label; href?: string; mark?: string; interactive?: boolean }, "div">) => {
    const interactive = props.interactive ?? true;
    const Icon = props.Icon ?? InfoIcon
    return (
        <Card {...props} title={null} container="px-0 py-0" className="flex gap-4 items-center px-0 lg:px-0">
            <div
                className={`flex w-full items-center gap-4 rounded-card px-0 lg:px-0 ${interactive ? "transition-colors duration-300 ease-linear hover:bg-primary-hover/10" : ""}`}
            >
                <div
                    className={css(
                        "flex aspect-square h-[stretch] w-20 items-center justify-center rounded-l-card bg-primary p-4 text-primary-foreground",
                        props.mark
                    )}
                >
                    {<Icon size={48} />}
                </div>
                <div className="flex flex-col gap-2 justify-center py-2">
                    <p className="text-lg">{props.title}</p>
                    <p className="text-4xl font-bold tracking-wide">{props.value}</p>
                </div>
            </div>
        </Card>
    );
};
