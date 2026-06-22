import { InfoIcon, type Icon } from "@phosphor-icons/react";
import type React from "react";
import type { PropsWithChildren } from "react";
import { Is } from "sidekicker";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { Polymorph, type PolymorphicProps } from "../../core/polymorph/polymorph";
import { Skeleton } from "../skeleton/skeleton";
import { cardStyles } from "./card.styles";

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
    as,
    title,
    loading,
    children,
    header = null,
    container = "",
    titleClassName = "",
    ...props
}: PropsWithChildren<CardProps<T>>) => {
    const bodyColumnClassName = `${cardStyles.slots.body}--column`;
    const skeletonLineClassName = cardStyles.slots["skeleton-line"];

    return (
        <Polymorph
            {...props}
            as={as || "div"}
            data-component="card"
            className={css(cardStyles.className({}), cardStyles.slots.border, cardStyles.slots.body, bodyColumnClassName, container)}
        >
            {title ? (
                <header data-component="card-title" className={css(cardStyles.slots.title, titleClassName)}>
                    {title}
                </header>
            ) : (
                header
            )}
            <div data-component="card-body" className={css(cardStyles.slots.content, props.className)}>
                {loading ? (
                    <div className={cardStyles.slots.skeleton}>
                        <Skeleton className={skeletonLineClassName} />
                        <Skeleton className={css(skeletonLineClassName, `${skeletonLineClassName}--medium`)} />
                        <Skeleton className={css(skeletonLineClassName, `${skeletonLineClassName}--long`)} />
                        <Skeleton className={css(skeletonLineClassName, `${skeletonLineClassName}--short`)} />
                    </div>
                ) : (
                    children
                )}
            </div>
        </Polymorph>
    );
};

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
        <Component {...props} title={Is.string(props.title) ? props.title : undefined} className={css(cardStyles.slots.header, props.className)}>
            <Title className={cardStyles.slots.heading}>{props.title}</Title>
            {children ? <Nav className={cardStyles.slots.actions}>{children}</Nav> : null}
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
    const statsPanelClassName = cardStyles.slots["stats-panel"];

    return (
        <Card {...props} title={null} loading={undefined} container={cardStyles.slots["stats-container"]} className={cardStyles.slots["stats-body"]}>
            <div className={css(statsPanelClassName, interactive ? `${statsPanelClassName}--interactive` : undefined)}>
                <div className={css(cardStyles.slots["stats-icon"], props.mark)}>{<Icon aria-hidden />}</div>
                <div className={cardStyles.slots["stats-content"]}>
                    <p className={cardStyles.slots["stats-title"]}>{props.title}</p>
                    {props.loading ? (
                        <Skeleton className={cardStyles.slots["stats-loading"]} />
                    ) : (
                        <p className={cardStyles.slots["stats-value"]}>{props.value}</p>
                    )}
                </div>
            </div>
        </Card>
    );
};
