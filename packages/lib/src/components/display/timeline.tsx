import React, { ComponentProps, ElementType, PropsWithChildren } from "react";
import { css } from "../../lib/dom";
import { Polymorph, PolymorphicProps } from "../core/polymorph";

export const TimelineItem = (props: PropsWithChildren) => (
    <li data-component="timeline-item" className="relative pb-12" role="listitem">
        <span aria-hidden="true" className="absolute left-6 top-8 -ml-px h-full w-0.5 bg-card-border" />
        <div className="relative flex items-stretch justify-start space-x-3">{props.children}</div>
    </li>
);

TimelineItem.Icon = function TimelineIcon(props: PropsWithChildren<ComponentProps<"header">>) {
    return (
        <header
            {...props}
            className={css("flex size-12 items-center justify-center rounded-full bg-primary p-2 text-primary-foreground", props.className)}
        >
            {props.children}
        </header>
    );
};

TimelineItem.Body = function TimelineItemBody<T extends ElementType = "section">(props: PropsWithChildren<PolymorphicProps<object, T>>) {
    return (
        <Polymorph {...props} className={css("min-w-0 flex-1", props.className)}>
            {props.children}
        </Polymorph>
    );
};

TimelineItem.Right = function TimelineItemRight<T extends ElementType = "button">(props: PolymorphicProps<object, T>) {
    return (
        <footer className="flex gap-6 self-stretch px-4 align-baseline">
            <Polymorph {...props} type="button" />
        </footer>
    );
};

export const Timeline = (props: PropsWithChildren) => (
    <ul data-component="timeline" role="list" className="flow-root [&>li:last-child>span[aria-hidden=true]]:hidden">
        {props.children}
    </ul>
);
