import type { CSSProperties, ElementType } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import { Polymorph } from "../../core/polymorph/polymorph";
import { skeletonStyles } from "./skeleton.styles";

export const SkeletonCell = <div aria-hidden="true" className={css(skeletonStyles.className({}), skeletonStyles.slots.cell)} />;

type SkeletonProps = {
    className?: string;
    as?: ElementType;
    style?: CSSProperties;
    decorative?: boolean;
};

export const Skeleton = ({ className, as, style, decorative = false }: SkeletonProps) => {
    const t = useTranslations();
    return (
        <Polymorph
            style={style}
            role={decorative ? undefined : "status"}
            aria-busy={decorative ? undefined : "true"}
            aria-hidden={decorative ? true : undefined}
            as={as || "span"}
            aria-label={decorative ? undefined : t.skeletonLoading}
            className={css(skeletonStyles.className({}), skeletonStyles.slots.block, className)}
        />
    );
};

const getSkeletonWidth = (index: number) => 60 + ((index * 17) % 41);

export const SkeletonList = (props: { className?: string; rows: number }) => {
    const t = useTranslations();
    const rowCount = Math.max(0, Math.floor(props.rows));
    const items = Array.from({ length: rowCount }, (_, index) => (
        <Skeleton key={`skeleton-${index}`} decorative style={{ width: `${getSkeletonWidth(index)}%` }} as="li" />
    ));
    return (
        <ul role="status" aria-busy="true" aria-label={t.skeletonLoading} className={css(skeletonStyles.slots.list, props.className)}>
            {items}
        </ul>
    );
};
