import type { ComponentProps, ElementType, PropsWithChildren } from "react";
import { css } from "../../../lib/dom";
import { Polymorph, type PolymorphicProps } from "../../core/polymorph/polymorph";
import { timelineStyles } from "./timeline.styles";

export const TimelineItem = (props: PropsWithChildren) => (
    <li data-component="timeline-item" className={timelineStyles.slots.item} role="listitem">
        <span aria-hidden="true" className={timelineStyles.slots.connector} />
        <div className={timelineStyles.slots.content}>{props.children}</div>
    </li>
);

TimelineItem.Icon = function TimelineIcon(props: PropsWithChildren<ComponentProps<"header">>) {
    return (
        <header {...props} className={css(timelineStyles.slots.icon, props.className)}>
            {props.children}
        </header>
    );
};

TimelineItem.Body = function TimelineItemBody<T extends ElementType = "section">(props: PropsWithChildren<PolymorphicProps<object, T>>) {
    return (
        <Polymorph {...props} className={css(timelineStyles.slots.body, props.className)}>
            {props.children}
        </Polymorph>
    );
};

TimelineItem.Right = function TimelineItemRight<T extends ElementType = "button">(props: PolymorphicProps<object, T>) {
    return (
        <footer className={timelineStyles.slots.actions}>
            <Polymorph {...props} type="button" />
        </footer>
    );
};

export const Timeline = (props: PropsWithChildren) => (
    <ul data-component="timeline" role="list" className={css(timelineStyles.className({}), `${timelineStyles.base}--hide-last-connector`)}>
        {props.children}
    </ul>
);
