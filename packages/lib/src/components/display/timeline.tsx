import React, { type ComponentProps, type ElementType, type PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { Polymorph, type PolymorphicProps } from "../core/polymorph";

export const TimelineItem = (props: PropsWithChildren) => (
    <li data-component="timeline-item" className="__display-timeline__tw-1" role="listitem">
        <span aria-hidden="true" className="__display-timeline__tw-2" />
        <div className="__display-timeline__tw-3">{props.children}</div>
    </li>
);

TimelineItem.Icon = function TimelineIcon(props: PropsWithChildren<ComponentProps<"header">>) {
    return (
        <header {...props} className={css("__display-timeline__tw-4", props.className)}>
            {props.children}
        </header>
    );
};

TimelineItem.Body = function TimelineItemBody<T extends ElementType = "section">(props: PropsWithChildren<PolymorphicProps<object, T>>) {
    return (
        <Polymorph {...props} className={css("__display-timeline__tw-5", props.className)}>
            {props.children}
        </Polymorph>
    );
};

TimelineItem.Right = function TimelineItemRight<T extends ElementType = "button">(props: PolymorphicProps<object, T>) {
    return (
        <footer className="__display-timeline__tw-6">
            <Polymorph {...props} type="button" />
        </footer>
    );
};

export const Timeline = (props: PropsWithChildren) => (
    <ul data-component="timeline" role="list" className="__display-timeline__tw-final-1 __display-timeline__last-connector-hidden">
        {props.children}
    </ul>
);
