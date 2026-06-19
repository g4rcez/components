import { CSSProperties, useRef, type ElementType } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import { Polymorph } from "../../core/polymorph/polymorph";

export const SkeletonCell = <div role="status" aria-busy="true" aria-label="Loading content" className="__display-skeleton__slot-1" />;

export const Skeleton = (props: { className?: string; as?: ElementType; style?: CSSProperties }) => {
    const t = useTranslations();
    return (
        <Polymorph
            {...props}
            role="status"
            aria-busy="true"
            aria-label={t.skeletonLoading}
            as={props.as || "span"}
            className={css("__display-skeleton__slot-2", props.className)}
        />
    );
};

export const SkeletonList = (props: { className?: string; rows: number }) => {
    const t = useTranslations();
    const items = useRef(
        Array.from({ length: props.rows }).map((_, i) => {
            const rand = Math.max(100, Math.random() * 99);
            return <Skeleton key={`skeleton-${rand}-${i}`} style={{ width: `${rand}%` }} as="li" />;
        })
    );
    return (
        <ul
            role="status"
            aria-busy="true"
            aria-label={t.skeletonLoading}
            className={css("__display-skeleton__slot-3 __display-skeleton__slot-extra-1", props.className)}
        >
            {items.current}
        </ul>
    );
};
