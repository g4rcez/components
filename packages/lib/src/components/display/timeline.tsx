import { MessagesSquareIcon } from "lucide-react";
import React, { Fragment } from "react";

const typeMap = {
    tag: () => null,
    custom: () => null,
    record: ({ item }) => (
        <Fragment>
            <div className="relative">
                <img
                    src={item.avatar?.img}
                    alt={item.avatar?.name}
                    className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary-hover"
                />
                <span className="absolute -bottom-0.5 -right-1 rounded-full rounded-tl bg-card-background px-0.5 py-px">
                    <MessagesSquareIcon aria-hidden="true" className="aspect-square size-5" />
                </span>
            </div>
            <div className="min-w-0 flex-1 text-foreground">
                <div>
                    <a href={item.avatar?.profile} className="text-base font-medium text-primary">
                        {item.avatar?.name}
                    </a>
                    <p className="mt-0.5 text-sm">Commented {item.date.toISOString()}</p>
                </div>
                <div className="mt-2 text-wrap text-sm">
                    <p>{item.text}</p>
                </div>
            </div>
        </Fragment>
    ),
} satisfies Record<string, React.FC<{ item: TimelineItemProps }>>;

export type TimelineItemType = keyof typeof typeMap;

export type TimelineItemProps = {
    id: string | number;
    date: Date;
    type: TimelineItemType;
    avatar?: { img?: string; name: string; profile?: string };
    text?: string;
    custom?: React.FC<{ item: TimelineItemProps }>;
};

export type TimelineProps = { items: TimelineItemProps[]; Custom?: React.FC<{ item: TimelineItemProps }> };

export const Timeline = (props: TimelineProps) => {
    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {props.items.map((item, index) => {
                    const Render = typeMap[item.type] ?? null;
                    if (Render === null && props.Custom) {
                        return <props.Custom item={item} />;
                    }
                    return (
                        <li key={item.id}>
                            <div className="relative pb-8">
                                {index !== props.items.length - 1 ? (
                                    <span aria-hidden="true" className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-card-border" />
                                ) : null}
                                <div className="relative flex items-start space-x-3">
                                    <Render item={item} />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
