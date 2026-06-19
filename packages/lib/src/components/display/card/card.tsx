import { InfoIcon, type Icon } from "@phosphor-icons/react";
import type React from "react";
import type { PropsWithChildren } from "react";
import { Is } from "sidekicker";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { Polymorph, type PolymorphicProps } from "../../core/polymorph/polymorph";
import { Skeleton } from "../skeleton/skeleton";

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
        className={css("__display-card__border __display-card__slot-1 __display-card__slot-extra-1", container)}
    >
        {title ? (
            <header data-component="card-title" className={css("__display-card__slot-2", titleClassName)}>
                {title}
            </header>
        ) : (
            header
        )}
        <div data-component="card-body" className={css("__display-card__slot-3", props.className)}>
            {loading ? (
                <div className="__display-card__slot-4 __display-card__slot-extra-1">
                    <Skeleton className="__display-card__slot-5" />
                    <Skeleton className="__display-card__slot-6" />
                    <Skeleton className="__display-card__slot-7" />
                    <Skeleton className="__display-card__slot-8" />
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
            className={css("__display-card__slot-9 __display-card__slot-extra-2", props.className)}
        >
            <Title className="__display-card__slot-10">{props.title}</Title>
            {children ? <Nav className="__display-card__slot-11 __display-card__slot-extra-3">{children}</Nav> : null}
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
        <Card {...props} title={null} loading={undefined} container="__display-card__stats-container" className="__display-card__slot-12">
            <div className={`__display-card__slot-13 ${interactive ? "__display-card__slot-14" : ""}`}>
                <div className={css("__display-card__slot-15", props.mark)}>{<Icon aria-hidden />}</div>
                <div className="__display-card__slot-16 __display-card__slot-extra-1">
                    <p className="__display-card__slot-17">{props.title}</p>
                    {props.loading ? <Skeleton className="__display-card__slot-18" /> : <p className="__display-card__slot-19">{props.value}</p>}
                </div>
            </div>
        </Card>
    );
};
