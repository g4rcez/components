import React, { CSSProperties, useRef, type ElementType } from "react";
import { css } from "../../lib/dom";
import { Polymorph } from "../core/polymorph";

export const SkeletonCell = <div className="h-6 w-10/12 animate-pulse rounded bg-muted" />;

export const Skeleton = (props: { className?: string; as?: ElementType; style?: CSSProperties }) => (
    <Polymorph {...props} as={props.as || "span"} className={css("block h-8 w-32 animate-pulse rounded bg-muted", props.className)} />
);

export const SkeletonList = (props: { className?: string; rows: number }) => {
    const items = useRef(
        Array.from({ length: props.rows }).map((_, i) => {
            const rand = Math.max(100, Math.random() * 99);
            return <Skeleton key={`skeleton-${rand}-${i}`} style={{ width: `${rand}%` }} as="li" />;
        })
    );
    return <ul className={css("flex flex-col gap-6", props.className)}>{items.current}</ul>;
};
