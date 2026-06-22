"use client";
import React, {
    type CSSProperties,
    forwardRef,
    type PropsWithChildren,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { css } from "../../../lib/dom";
import { Polymorph, type PolymorphicProps } from "../../core/polymorph/polymorph";
import { masonryStyles } from "./masonry.styles";

export type MasonryLayoutItem = {
    index: number;
    column: number;
    top: number;
    left: number;
    width: number;
    height: number;
};

export type MasonryLayout = {
    columns: number;
    gutter: number;
    height: number;
    items: MasonryLayoutItem[];
};

type MasonryOwnProps = {
    columns?: number;
    gutter?: number;
    fresh?: React.Key;
    itemAs?: React.ElementType;
    itemClassName?: string;
    onLayoutChange?: (layout: MasonryLayout) => void;
};

export type MasonryProps<T extends React.ElementType = "ul"> = PropsWithChildren<PolymorphicProps<MasonryOwnProps, T>>;

const clampColumns = (columns: number) => Math.max(1, Math.floor(columns));

const createLayout = (heights: number[], columnCount: number, gutter: number, width: number): MasonryLayout => {
    const columns = clampColumns(columnCount);
    const safeGutter = Math.max(0, gutter);
    const availableWidth = Math.max(0, width);
    const itemWidth = columns === 1 ? availableWidth : Math.max(0, (availableWidth - safeGutter * (columns - 1)) / columns);
    const columnHeights = Array.from({ length: columns }, () => 0);
    const items = heights.map<MasonryLayoutItem>((height, index) => {
        let column = 0;

        for (let current = 1; current < columnHeights.length; current += 1) {
            if (columnHeights[current] < columnHeights[column]) {
                column = current;
            }
        }

        const top = columnHeights[column];
        const left = column * (itemWidth + safeGutter);
        columnHeights[column] += height + safeGutter;

        return {
            column,
            height,
            index,
            left,
            top,
            width: itemWidth,
        };
    });

    return {
        columns,
        gutter: safeGutter,
        height: Math.max(0, ...columnHeights) - (items.length > 0 ? safeGutter : 0),
        items,
    };
};

const layoutsEqual = (left: MasonryLayout, right: MasonryLayout) =>
    left.columns === right.columns &&
    left.gutter === right.gutter &&
    left.height === right.height &&
    left.items.length === right.items.length &&
    left.items.every((item, index) => {
        const compare = right.items[index];

        return (
            item.column === compare.column &&
            item.height === compare.height &&
            item.index === compare.index &&
            item.left === compare.left &&
            item.top === compare.top &&
            item.width === compare.width
        );
    });

const MasonryInner = <T extends React.ElementType = "ul">(
    {
        as,
        children,
        className,
        columns = 3,
        fresh,
        gutter = 16,
        itemAs: Item = "li",
        itemClassName,
        onLayoutChange,
        style,
        ...props
    }: MasonryProps<T>,
    ref: React.ForwardedRef<Element>
) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);
    const frameRef = useRef<number | null>(null);
    const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
    const [layout, setLayout] = useState<MasonryLayout>(() => createLayout([], columns, gutter, 0));
    const layoutRef = useRef(layout);

    useImperativeHandle(ref, () => rootRef.current as Element, []);

    const measure = useCallback(() => {
        const root = rootRef.current;
        if (!root) return;
        const width = root.getBoundingClientRect().width;
        const heights = childrenArray.map((_, index) => itemRefs.current[index]?.getBoundingClientRect().height ?? 0);
        const nextLayout = createLayout(heights, columns, gutter, width);
        if (layoutsEqual(layoutRef.current, nextLayout)) return;
        layoutRef.current = nextLayout;
        setLayout(nextLayout);
        onLayoutChange?.(nextLayout);
    }, [childrenArray, columns, gutter, onLayoutChange]);

    const scheduleMeasure = useCallback(() => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
        }
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = null;
            measure();
        });
    }, [measure]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        scheduleMeasure();

        const cleanupFrame = () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };

        if (typeof ResizeObserver === "undefined") return cleanupFrame;

        const observer = new ResizeObserver(scheduleMeasure);
        observer.observe(root);
        itemRefs.current.slice(0, childrenArray.length).forEach((item) => {
            if (item) observer.observe(item);
        });

        return () => {
            observer.disconnect();
            cleanupFrame();
        };
    }, [childrenArray.length, scheduleMeasure]);

    useEffect(() => {
        scheduleMeasure();
    }, [fresh, scheduleMeasure]);

    const rootStyle: CSSProperties = {
        ...style,
        boxSizing: "border-box",
        height: layout.height,
        listStyleType: style?.listStyleType ?? "none",
        margin: style?.margin ?? 0,
        padding: style?.padding ?? 0,
        position: "relative",
        width: style?.width ?? "100%",
    };

    return (
        <Polymorph
            {...props}
            ref={rootRef}
            as={as ?? "ul"}
            data-component="masonry"
            onLoadCapture={scheduleMeasure}
            onErrorCapture={scheduleMeasure}
            style={rootStyle}
            className={css(masonryStyles.className({}), className)}
        >
            {childrenArray.map((child, index) => {
                const item = layout.items[index];
                const itemStyle: CSSProperties = item
                    ? {
                          boxSizing: "border-box" as const,
                          display: "block" as const,
                          left: item.left,
                          position: "absolute" as const,
                          top: item.top,
                          width: item.width,
                      }
                    : {
                          boxSizing: "border-box" as const,
                          display: "block" as const,
                          left: 0,
                          position: "absolute" as const,
                          top: 0,
                          width: layout.columns > 1 ? `calc((100% - ${Math.max(0, gutter) * (layout.columns - 1)}px) / ${layout.columns})` : "100%",
                      };

                return (
                    <Item
                        style={itemStyle}
                        data-component="masonry-item"
                        className={css(masonryStyles.slots.item, itemClassName)}
                        key={typeof child === "object" && "key" in child ? child.key : index}
                        ref={(node: HTMLElement | null) => {
                            itemRefs.current[index] = node;
                        }}
                    >
                        {child}
                    </Item>
                );
            })}
        </Polymorph>
    );
};

export const Masonry = forwardRef(MasonryInner) as unknown as <T extends React.ElementType = "ul">(
    props: MasonryProps<T>
) => React.ReactElement | null;
