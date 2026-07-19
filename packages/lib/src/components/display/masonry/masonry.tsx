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

type MasonryItemOwnProps = {
    width?: CSSProperties["width"];
};

export type MasonryItemProps<T extends React.ElementType = "li"> = PropsWithChildren<PolymorphicProps<MasonryItemOwnProps, T>>;

const MasonryItemInner = <T extends React.ElementType = "li">(
    { as, children, style, width, ...props }: MasonryItemProps<T>,
    ref: React.ForwardedRef<Element>
) => (
    <Polymorph
        {...props}
        ref={ref}
        as={as ?? "li"}
        data-component="masonry-item"
        style={{ ...style, width: width ?? style?.width }}
        className={css(masonryStyles.slots.item, props.className)}
    >
        {children}
    </Polymorph>
);

export const MasonryItem = forwardRef(MasonryItemInner) as unknown as <T extends React.ElementType = "li">(
    props: MasonryItemProps<T>
) => React.ReactElement | null;

const isMasonryItem = (child: React.ReactNode): child is React.ReactElement<MasonryItemProps> =>
    React.isValidElement(child) && child.type === MasonryItem;

const assignRef = <T,>(ref: React.Ref<T> | undefined, value: T | null) => {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
};

const clampColumns = (columns: number) => Math.max(1, Math.floor(columns));

const createLayout = (heights: number[], widths: Array<number | undefined>, columnCount: number, gutter: number, width: number): MasonryLayout => {
    const columns = clampColumns(columnCount);
    const safeGutter = Math.max(0, gutter);
    const availableWidth = Math.max(0, width);
    const itemWidth = columns === 1 ? availableWidth : Math.max(0, (availableWidth - safeGutter * (columns - 1)) / columns);
    const slotWidth = itemWidth + safeGutter;
    const columnHeights = Array.from({ length: columns }, () => 0);
    const items = heights.map<MasonryLayoutItem>((height, index) => {
        const customWidth = widths[index];
        const resolvedWidth = customWidth === undefined ? itemWidth : Math.max(0, customWidth);
        const columnSpan =
            customWidth === undefined || slotWidth <= 0 ? 1 : Math.min(columns, Math.max(1, Math.ceil((resolvedWidth + safeGutter) / slotWidth)));
        let column = 0;
        let top = Math.max(...columnHeights.slice(0, columnSpan));

        for (let current = 1; current <= columns - columnSpan; current += 1) {
            const candidateTop = Math.max(...columnHeights.slice(current, current + columnSpan));
            if (candidateTop < top) {
                column = current;
                top = candidateTop;
            }
        }

        const left = column * slotWidth;
        const bottom = top + height + safeGutter;
        columnHeights.fill(bottom, column, column + columnSpan);

        return {
            top,
            left,
            index,
            column,
            height,
            width: resolvedWidth,
        };
    });

    return {
        items,
        columns,
        gutter: safeGutter,
        height: Math.max(0, ...columnHeights) - (items.length > 0 ? safeGutter : 0),
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
    const [layout, setLayout] = useState<MasonryLayout>(() => createLayout([], [], columns, gutter, 0));
    const layoutRef = useRef(layout);

    useImperativeHandle(ref, () => rootRef.current as Element, []);

    const measure = useCallback(() => {
        const root = rootRef.current;
        if (!root) return;
        const width = root.getBoundingClientRect().width;
        const measurements = childrenArray.map((_, index) => itemRefs.current[index]?.getBoundingClientRect());
        const heights = measurements.map((rect) => rect?.height ?? 0);
        const widths = measurements.map((rect, index) => (isMasonryItem(childrenArray[index]) ? (rect?.width ?? 0) : undefined));
        const nextLayout = createLayout(heights, widths, columns, gutter, width);
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
        position: "relative",
        height: layout.height,
        boxSizing: "border-box",
        margin: style?.margin ?? 0,
        padding: style?.padding ?? 0,
        width: style?.width ?? "100%",
        listStyleType: style?.listStyleType ?? "none",
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
                const masonryItem = isMasonryItem(child) ? child : undefined;
                const requestedWidth = masonryItem?.props.width ?? masonryItem?.props.style?.width;
                const item = layout.items[index];
                const itemStyle: CSSProperties = {
                    ...masonryItem?.props.style,
                    top: item?.top ?? 0,
                    left: item?.left ?? 0,
                    width:
                        requestedWidth ??
                        item?.width ??
                        (layout.columns > 1 ? `calc((100% - ${Math.max(0, gutter) * (layout.columns - 1)}px) / ${layout.columns})` : "100%"),
                    display: "block",
                    position: "absolute",
                    boxSizing: "border-box",
                };
                const ItemComponent = masonryItem?.props.as ?? Item;
                const itemContent = masonryItem?.props.children ?? child;
                const itemProps = masonryItem
                    ? (({ as: _as, children: _children, style: _style, width: _width, ...rest }) => rest)(masonryItem.props)
                    : {};
                const itemRef = masonryItem?.props.ref as React.Ref<HTMLElement> | undefined;

                return (
                    <ItemComponent
                        {...itemProps}
                        style={itemStyle}
                        data-component="masonry-item"
                        className={css(masonryStyles.slots.item, itemClassName, masonryItem?.props.className)}
                        key={typeof child === "object" && "key" in child ? child.key : index}
                        ref={(node: HTMLElement | null) => {
                            itemRefs.current[index] = node;
                            assignRef(itemRef, node);
                        }}
                    >
                        {itemContent}
                    </ItemComponent>
                );
            })}
        </Polymorph>
    );
};

export const Masonry = forwardRef(MasonryInner) as unknown as <T extends React.ElementType = "ul">(
    props: MasonryProps<T>
) => React.ReactElement | null;
