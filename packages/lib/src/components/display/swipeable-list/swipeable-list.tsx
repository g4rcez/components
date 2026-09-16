"use client";
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "motion/react";
import { Virtuoso, type Components, type ContextProp, type ItemProps, type ListProps } from "react-virtuoso";
import { forwardRef, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { css } from "../../../lib/dom";
import { swipeableListStyles } from "./swipeable-list.styles";

export type SwipeSide = "left" | "right";

export type SwipeableListValue = {
    id: string;
    side: SwipeSide;
};

export type SwipeActionTone = "neutral" | "primary" | "success" | "warning" | "danger";

export type SwipeAction = {
    id: string;
    icon: ReactNode;
    label: ReactNode;
    disabled?: boolean;
    tone?: SwipeActionTone;
    onClick?: (item: SwipeableListItem) => void;
};

export type SwipeableListItem = {
    id: string;
    meta?: ReactNode;
    title?: ReactNode;
    disabled?: boolean;
    content?: ReactNode;
    leading?: ReactNode;
    description?: ReactNode;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
};

export type SwipeableListClassNames = {
    item?: string;
    meta?: string;
    rail?: string;
    root?: string;
    title?: string;
    action?: string;
    content?: string;
    leading?: string;
    surface?: string;
    description?: string;
};

export interface SwipeableListProps {
    items: SwipeableListItem[];
    value?: SwipeableListValue | null;
    defaultValue?: SwipeableListValue | null;
    onValueChange?: (value: SwipeableListValue | null) => void;
    onAction?: (payload: { item: SwipeableListItem; action: SwipeAction; side: SwipeSide }) => void;
    actionWidth?: number;
    revealThreshold?: number;
    closeOnAction?: boolean;
    className?: string;
    classNames?: SwipeableListClassNames;
    renderItem?: (item: SwipeableListItem) => ReactNode;
}

type SwipeableListVirtuosoContext = string;

type SwipeableListVirtualListProps = Omit<ListProps, "ref"> & ContextProp<SwipeableListVirtuosoContext>;

const SwipeableListVirtualList = forwardRef<HTMLUListElement, SwipeableListVirtualListProps>(
    ({ children, style, "data-testid": dataTestId, context }, ref) => (
        <ul ref={ref} data-testid={dataTestId} style={style} className={css(swipeableListStyles.slots.list, context)}>
            {children}
        </ul>
    )
);
SwipeableListVirtualList.displayName = "SwipeableListVirtualList";

type SwipeableListVirtualItemProps = Omit<ItemProps<SwipeableListItem>, "ref"> & ContextProp<SwipeableListVirtuosoContext>;

const SwipeableListVirtualItem = forwardRef<HTMLLIElement, SwipeableListVirtualItemProps>(
    (
        {
            children,
            style,
            item: _item,
            context: _context,
            "data-index": dataIndex,
            "data-item-index": dataItemIndex,
            "data-known-size": dataKnownSize,
            "data-item-group-index": dataItemGroupIndex,
        },
        ref
    ) => (
        <li
            ref={ref}
            data-index={dataIndex}
            data-item-index={dataItemIndex}
            data-known-size={dataKnownSize}
            data-item-group-index={dataItemGroupIndex}
            style={style}
        >
            {children}
        </li>
    )
);
SwipeableListVirtualItem.displayName = "SwipeableListVirtualItem";

type SwipeableListVirtuosoComponents = Components<SwipeableListItem, SwipeableListVirtuosoContext>;

const swipeableListVirtuosoComponents: SwipeableListVirtuosoComponents = {
    // react-virtuoso types these refs as HTMLDivElement, but semantic list elements expose the same measurement API.
    List: SwipeableListVirtualList as unknown as SwipeableListVirtuosoComponents["List"],
    Item: SwipeableListVirtualItem as unknown as SwipeableListVirtuosoComponents["Item"],
};

const ROW_SETTLE = {
    type: "spring",
    stiffness: 560,
    damping: 48,
    mass: 0.82,
    restDelta: 0.5,
    restSpeed: 8,
} as const;

const OPEN_DISTANCE_RATIO = 0.46;
const CLOSE_DISTANCE_RATIO = 0.72;
const OPEN_VELOCITY = 720;
const CLOSE_VELOCITY = 320;
const FLING_DISTANCE = 14;
const RELEASE_VELOCITY_LIMIT = 1500;

const useControllableSwipeValue = ({
    value,
    defaultValue,
    onValueChange,
}: {
    value?: SwipeableListValue | null;
    defaultValue?: SwipeableListValue | null;
    onValueChange?: (value: SwipeableListValue | null) => void;
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? null);
    const isControlled = value !== undefined;
    const currentValue = value ?? internalValue;

    const setValue = useCallback(
        (next: SwipeableListValue | null) => {
            if (!isControlled) {
                setInternalValue(next);
            }

            onValueChange?.(next);
        },
        [isControlled, onValueChange]
    );

    return [currentValue, setValue] as const;
};

const isActionableSide = (value: number, sideWidth: number) => {
    return sideWidth > 0 && Math.abs(value) > 0;
};

const clampReleaseVelocity = (velocity: number) => {
    return Math.max(-RELEASE_VELOCITY_LIMIT, Math.min(RELEASE_VELOCITY_LIMIT, velocity));
};

const SwipeActionButton = ({
    action,
    actionWidth,
    side,
    focusable,
    onAction,
    className,
}: {
    action: SwipeAction;
    actionWidth: number;
    side: SwipeSide;
    focusable: boolean;
    onAction: (action: SwipeAction, side: SwipeSide) => void;
    className?: string;
}) => {
    return (
        <button
            type="button"
            disabled={action.disabled}
            tabIndex={focusable ? 0 : -1}
            aria-label={typeof action.label === "string" ? action.label : undefined}
            onClick={() => onAction(action, side)}
            className={css(swipeableListStyles.slots.action, className)}
            style={{ width: actionWidth }}
        >
            <span className={css(swipeableListStyles.slots["action-icon"], swipeableListStyles.classes.variants.tone[action.tone ?? "neutral"])}>
                {action.icon}
            </span>
            <span className={swipeableListStyles.slots["screen-reader-label"]}>{action.label}</span>
        </button>
    );
};

const SwipeableListRow = ({
    item,
    actionWidth,
    revealThreshold,
    openValue,
    setOpenValue,
    closeOnAction,
    onAction,
    classNames,
    renderItem,
}: {
    item: SwipeableListItem;
    actionWidth: number;
    revealThreshold: number;
    openValue: SwipeableListValue | null;
    setOpenValue: (value: SwipeableListValue | null) => void;
    closeOnAction: boolean;
    onAction?: SwipeableListProps["onAction"];
    classNames?: SwipeableListClassNames;
    renderItem?: (item: SwipeableListItem) => ReactNode;
}) => {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const animationRef = useRef<{ stop: () => void } | null>(null);
    const commandedTargetRef = useRef(0);
    const leftActions = item.leftActions ?? [];
    const rightActions = item.rightActions ?? [];
    const leftWidth = leftActions.length * actionWidth;
    const rightWidth = rightActions.length * actionWidth;
    const openSide = openValue?.id === item.id ? openValue.side : null;
    const targetX = openSide === "left" ? leftWidth : openSide === "right" ? -rightWidth : 0;

    const settleX = useCallback(
        (nextX: number, velocity = 0) => {
            commandedTargetRef.current = nextX;
            animationRef.current?.stop();

            if (reduce) {
                x.set(nextX);
                return;
            }

            animationRef.current = animate(x, nextX, {
                ...ROW_SETTLE,
                velocity: clampReleaseVelocity(velocity),
                onComplete: () => x.set(nextX),
            });
        },
        [reduce, x]
    );

    useEffect(() => {
        return () => animationRef.current?.stop();
    }, []);

    useEffect(() => {
        if (commandedTargetRef.current === targetX) {
            return;
        }

        settleX(targetX);
    }, [settleX, targetX]);

    const getTargetX = useCallback(
        (side: SwipeSide | null) => (side === "left" ? leftWidth : side === "right" ? -rightWidth : 0),
        [leftWidth, rightWidth]
    );

    const snapTo = useCallback(
        (side: SwipeSide | null, velocity = 0) => {
            setOpenValue(side ? { id: item.id, side } : null);
            settleX(getTargetX(side), velocity);
        },
        [getTargetX, item.id, setOpenValue, settleX]
    );

    const onDragStart = useCallback(() => {
        animationRef.current?.stop();

        if (openValue && openValue.id !== item.id) {
            setOpenValue(null);
        }
    }, [item.id, openValue, setOpenValue]);

    const onDragEnd = useCallback(
        (_: PointerEvent, info: PanInfo) => {
            const velocity = info.velocity.x;
            const latest = x.get();
            const leftOpenThreshold = Math.max(revealThreshold, leftWidth * OPEN_DISTANCE_RATIO);
            const rightOpenThreshold = Math.max(revealThreshold, rightWidth * OPEN_DISTANCE_RATIO);

            if (openSide === "left") {
                if (latest < leftWidth * CLOSE_DISTANCE_RATIO || velocity < -CLOSE_VELOCITY) {
                    snapTo(null, velocity);
                    return;
                }

                snapTo("left", velocity);
                return;
            }

            if (openSide === "right") {
                if (Math.abs(latest) < rightWidth * CLOSE_DISTANCE_RATIO || velocity > CLOSE_VELOCITY) {
                    snapTo(null, velocity);
                    return;
                }

                snapTo("right", velocity);
                return;
            }

            if (isActionableSide(latest, leftWidth) && (latest > leftOpenThreshold || (velocity > OPEN_VELOCITY && latest > FLING_DISTANCE))) {
                snapTo("left", velocity);
                return;
            }

            if (isActionableSide(latest, rightWidth) && (latest < -rightOpenThreshold || (velocity < -OPEN_VELOCITY && latest < -FLING_DISTANCE))) {
                snapTo("right", velocity);
                return;
            }

            snapTo(null, velocity);
        },
        [leftWidth, openSide, revealThreshold, rightWidth, snapTo, x]
    );

    const handleAction = useCallback(
        (action: SwipeAction, side: SwipeSide) => {
            action.onClick?.(item);
            onAction?.({ item, action, side });

            if (closeOnAction) {
                snapTo(null);
            }
        },
        [closeOnAction, item, onAction, snapTo]
    );

    const actionGroupClassName = swipeableListStyles.slots["action-group"];
    const defaultContent = (
        <div className={swipeableListStyles.slots["item-content"]}>
            {item.leading ? <div className={css(swipeableListStyles.slots.leading, classNames?.leading)}>{item.leading}</div> : null}
            <div className={css(swipeableListStyles.slots.content, classNames?.content)}>
                {item.title ? <div className={css(swipeableListStyles.slots.title, classNames?.title)}>{item.title}</div> : null}
                {item.description ? (
                    <div className={css(swipeableListStyles.slots.description, classNames?.description)}>{item.description}</div>
                ) : null}
            </div>
            {item.meta ? <div className={css(swipeableListStyles.slots.meta, classNames?.meta)}>{item.meta}</div> : null}
        </div>
    );

    return (
        <div
            className={css(
                swipeableListStyles.slots.item,
                item.disabled ? `${swipeableListStyles.slots.item}--disabled` : undefined,
                classNames?.item
            )}
        >
            <div aria-hidden={!openSide} inert={!openSide} className={css(swipeableListStyles.slots.rail, classNames?.rail)}>
                <div className={css(actionGroupClassName, `${actionGroupClassName}--left`)}>
                    {leftActions.map((action) => (
                        <SwipeActionButton
                            key={action.id}
                            action={action}
                            actionWidth={actionWidth}
                            className={classNames?.action}
                            focusable={openSide === "left"}
                            onAction={handleAction}
                            side="left"
                        />
                    ))}
                </div>
                <div className={css(actionGroupClassName, `${actionGroupClassName}--right`)}>
                    {rightActions.map((action) => (
                        <SwipeActionButton
                            key={action.id}
                            action={action}
                            actionWidth={actionWidth}
                            className={classNames?.action}
                            focusable={openSide === "right"}
                            onAction={handleAction}
                            side="right"
                        />
                    ))}
                </div>
            </div>

            <motion.div
                drag={item.disabled ? false : "x"}
                dragConstraints={{ left: -rightWidth, right: leftWidth }}
                dragElastic={0.04}
                dragMomentum={false}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                style={{ x }}
                className={css(swipeableListStyles.slots.surface, classNames?.surface)}
            >
                {renderItem ? renderItem(item) : (item.content ?? defaultContent)}
            </motion.div>
        </div>
    );
};

export const SwipeableList = ({
    items,
    value,
    defaultValue = null,
    onValueChange,
    onAction,
    actionWidth = 56,
    revealThreshold = 34,
    closeOnAction = true,
    className,
    classNames,
    renderItem,
}: SwipeableListProps) => {
    const [openValue, setOpenValue] = useControllableSwipeValue({
        value,
        defaultValue,
        onValueChange,
    });
    const rootClassName = css(swipeableListStyles.className({ tone: null }), className, classNames?.root);

    return (
        <Virtuoso<SwipeableListItem, SwipeableListVirtuosoContext>
            data-component="swipeable-list"
            className={rootClassName}
            useWindowScroll
            data={items}
            context={className ?? ""}
            computeItemKey={(_, item) => item.id}
            components={swipeableListVirtuosoComponents}
            itemContent={(_, item) => (
                <SwipeableListRow
                    item={item}
                    actionWidth={actionWidth}
                    revealThreshold={revealThreshold}
                    openValue={openValue}
                    setOpenValue={setOpenValue}
                    closeOnAction={closeOnAction}
                    onAction={onAction}
                    classNames={classNames}
                    renderItem={renderItem}
                />
            )}
        />
    );
};
