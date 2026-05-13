import { InfoIcon, type Icon } from "@phosphor-icons/react";
import React, { type PropsWithChildren } from "react";
import { Is } from "sidekicker";
import { css } from "../../lib/dom";
import { Label } from "../../types";
import { Polymorph, PolymorphicProps } from "../core/polymorph";
import { Skeleton } from "./skeleton";

export type CardProps<T extends React.ElementType = "div"> = PolymorphicProps<
    {
        title?: Label;
        loading?: boolean;
        container?: string;
        titleClassName?: string;
        header?: React.ReactElement | null;
    },
    T
>;

export const Card = <T extends React.ElementType = "div">({
    title,
    loading,
    children,
    as,
    header = null,
    container = "",
    titleClassName = "",
    ...props
}: PropsWithChildren<CardProps<T>>) => (
    <Polymorph
        {...props}
        as={as || "div"}
        data-component="card"
        className={css(
            "flex w-full flex-col gap-card-gap rounded-card-radius border border-card-border bg-card-background py-card-padding-y shadow-shadow-card",
            container
        )}
    >
        {title ? (
            <header
                data-component="card-title"
                className={css(
                    "mb-card-title-mb w-full border-b border-card-border px-card-padding-x pb-card-title-pb text-typography-xl font-medium",
                    titleClassName
                )}
            >
                {title}
            </header>
        ) : (
            header
        )}
        <div data-component="card-body" className={css("min-w-full px-card-padding-x", props.className)}>
            {loading ? (
                <div className="flex flex-col gap-card-gap">
                    <Skeleton className="w-full" />
                    <Skeleton className="w-8/12" />
                    <Skeleton className="w-10/12" />
                    <Skeleton className="w-1/2" />
                </div>
            ) : (
                children
            )}
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
    const Component = (as || "div") as React.ElementType;
    const Title = (titleTag || "h2") as React.ElementType;
    const Nav = (navTag || "nav") as React.ElementType;
    return (
        <Component
            {...props}
            title={Is.string(props.title) ? props.title : undefined}
            className={css("flex w-full flex-col flex-wrap items-start justify-between gap-base sm:flex-row sm:items-center", props.className)}
        >
            <Title className="font-semibold">{props.title}</Title>
            {children ? (
                <Nav className="gap-kilo flex flex-col items-start justify-start sm:flex-row sm:items-center sm:justify-end">{children}</Nav>
            ) : null}
        </Component>
    );
};

export type StatsCardProps = CardProps<React.ElementType> & {
    Icon?: Icon;
    title: string;
    value: Label;
    mark?: string;
    interactive?: boolean;
};

export const StatsCard = (props: StatsCardProps) => {
    const interactive = props.interactive ?? true;
    const Icon = props.Icon ?? InfoIcon;
    return (
        <Card {...props} title={null} loading={undefined} container="px-0 py-0" className="flex items-center gap-card-gap px-0">
            <div
                className={`flex w-full items-center gap-card-gap rounded-card-radius px-0 lg:px-0 ${interactive ? "transition-colors duration-300 ease-linear hover:bg-primary-hover/10" : ""}`}
            >
                <div
                    className={css(
                        "flex h-[stretch] w-card-stats-icon-col-w items-center justify-center rounded-l-card-radius bg-primary p-card-stats-icon-col-p text-primary-foreground",
                        props.mark
                    )}
                >
                    {<Icon size={48} />}
                </div>
                <div className="flex flex-col justify-center gap-card-stats-content-gap py-card-stats-content-py">
                    <p className="text-typography-lg">{props.title}</p>
                    {props.loading ? <Skeleton className="h-10" /> : <p className="text-4xl font-bold tracking-wide">{props.value}</p>}
                </div>
            </div>
        </Card>
    );
};
