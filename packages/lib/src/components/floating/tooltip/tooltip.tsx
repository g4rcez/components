"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingPortal,
    offset,
    type OpenChangeReason,
    type Placement,
    safePolygon,
    shift,
    useClick,
    useClientPoint,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import type React from "react";
import { forwardRef, Fragment, isValidElement, useRef, useState } from "react";
import { Polymorph, type PolymorphicProps } from "../../../components/core/polymorph/polymorph";
import { FLOATING_DELAY, VIEWPORT_PADDING } from "../../../constants";
import { Slot } from "../../core/slot/slot";
import { mergeRefs } from "../../../lib/dom";
import { floatingVariants } from "../../../lib/motion";
import { noop } from "../../../lib/fns";
import { tooltipStyles } from "./tooltip.styles";
import type { ComponentLike, Label } from "../../../types";

const tooltipVariants = floatingVariants();

export type TooltipProps<T extends React.ElementType = "span"> = PolymorphicProps<
    {
        /** The trigger. With `asChild` it must be one element that accepts a ref and event handlers. */
        title: Label;
        /** Use `title` itself as the trigger, with no wrapper element. Same contract as `Dropdown.asChild`. */
        asChild?: boolean;
        /** Draw the arrow that points at the trigger. A plain tooltip has none, a `popover` has one. @default popover */
        arrow?: boolean;
        /** A click on the trigger closes the tooltip. It opens again only after the pointer leaves and enters again. @default false */
        closeOnClick?: boolean;
        /** Open delay in ms for hover. Focus opens at once. @default 200 */
        delay?: number;
        /** With `false`, a touch pointer never opens the tooltip. @default true */
        touch?: boolean;
        open?: boolean;
        focus?: boolean;
        hover?: boolean;
        enabled?: boolean;
        popover?: boolean;
        placement?: Placement;
        followCursor?: boolean;
        onChange?: (b: boolean) => void;
    },
    T
>;

export const Tooltip: <T extends ComponentLike = "span">(_: TooltipProps<T>) => React.ReactElement = forwardRef<HTMLSpanElement, TooltipProps>(
    function Tooltip<T extends ComponentLike = "span">(
        {
            as,
            open,
            title,
            children,
            placement,
            asChild = false,
            arrow: arrowProp,
            closeOnClick = false,
            delay = FLOATING_DELAY,
            touch = true,
            focus = true,
            hover = true,
            enabled = true,
            popover = false,
            onChange = noop,
            followCursor = false,
            ...props
        }: TooltipProps<T>,
        outerRef: React.ForwardedRef<HTMLSpanElement>
    ) {
        const showArrow = arrowProp ?? popover;
        const isControlled = open !== undefined;
        const [innerOpen, setInnerOpen] = useState(false);
        const currentOpen = isControlled ? open : innerOpen;
        const arrowRef = useRef(null);
        const Component: React.ElementType = as || "span";
        const closedByClick = useRef(false);
        const pointerType = useRef<string | undefined>(undefined);
        const handleOpenChange = (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
            if (!nextOpen && reason === "escape-key" && event) {
                // APG combobox: the first Escape closes the open list. Let it reach the field and keep this layer open.
                if ((event.target as Element | null)?.matches?.('[role="combobox"][aria-expanded="true"]')) return;
                // Floating UI no longer stops it (see `bubbles` below), so a parent Modal keeps its own Escape for the next press.
                event.stopPropagation();
            }
            if (nextOpen && closedByClick.current) return;
            if (nextOpen && !touch && pointerType.current === "touch") return;
            if (!isControlled) setInnerOpen(nextOpen);
            onChange?.(nextOpen);
        };
        const arrowMiddleware = showArrow ? [arrow({ padding: 10, element: arrowRef })] : [];
        const {
            refs,
            floatingStyles,
            context,
            isPositioned,
            placement: currentPlacement,
        } = useFloating({
            placement: placement ?? "top",
            open: currentOpen,
            // Motion owns `transform` for the enter and exit animation, so Floating UI positions with top and left.
            transform: false,
            whileElementsMounted: autoUpdate,
            onOpenChange: handleOpenChange,
            // `autoPlacement` and `flip` cannot be combined (Floating UI resets the placement on every pass, which put the
            // tooltip far from its trigger), so a tooltip is placed on top by default and flips to the side with room.
            middleware: [
                offset(9),
                flip({ fallbackAxisSideDirection: "start", padding: VIEWPORT_PADDING }),
                shift({ padding: VIEWPORT_PADDING }),
                ...arrowMiddleware,
            ],
        });
        const dismiss = useDismiss(context, { enabled, bubbles: { escapeKey: true }, capture: { escapeKey: true } });
        const role = useRole(context, {
            role: popover ? "dialog" : "tooltip",
            enabled,
        });
        const focusController = useFocus(context, {
            enabled: enabled ? focus : false,
        });
        const clickController = useClick(context, {
            enabled: enabled ? popover : false,
        });
        const clientPoint = useClientPoint(context, {
            enabled: !!enabled && !!followCursor,
        });
        const hoverController = useHover(context, {
            move: true,
            mouseOnly: !touch,
            delay: { open: delay },
            enabled: enabled ? hover : false,
            handleClose: popover ? safePolygon() : null,
        });
        const { getReferenceProps, getFloatingProps } = useInteractions([
            role,
            dismiss,
            clientPoint,
            focus ? focusController : undefined,
            hover ? hoverController : undefined,
            popover ? clickController : undefined,
        ]);

        const referenceProps = getReferenceProps({
            ...props,
            onClick: (event: React.MouseEvent<HTMLElement>) => {
                props.onClick?.(event);
                if (!closeOnClick) return;
                closedByClick.current = true;
                handleOpenChange(false);
            },
            onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
                props.onPointerDown?.(event);
                pointerType.current = event.pointerType;
            },
            // A mouse that enters after a tap must not inherit the touch type of that tap.
            onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
                props.onPointerEnter?.(event);
                pointerType.current = event.pointerType;
            },
            onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
                props.onMouseLeave?.(event);
                closedByClick.current = false;
            },
            onBlur: (event: React.FocusEvent<HTMLElement>) => {
                props.onBlur?.(event);
                closedByClick.current = false;
                pointerType.current = undefined;
            },
        });
        const reference = mergeRefs(refs.setReference, outerRef);

        return (
            <Fragment>
                {asChild && isValidElement(title) ? (
                    <Slot {...referenceProps} ref={reference}>
                        {title}
                    </Slot>
                ) : (
                    <Component {...referenceProps} ref={reference}>
                        {title}
                    </Component>
                )}
                <AnimatePresence>
                    {currentOpen && (
                        <FloatingPortal key="tooltip">
                            <MotionConfig reducedMotion="user">
                                <Polymorph
                                    {...getFloatingProps()}
                                    as={motion.div}
                                    data-placement={currentPlacement}
                                    style={floatingStyles}
                                    custom={currentPlacement}
                                    variants={tooltipVariants}
                                    initial="initial"
                                    animate={isPositioned ? "open" : "initial"}
                                    exit="exit"
                                    ref={refs.setFloating as React.Ref<React.ElementType<any, keyof React.JSX.IntrinsicElements>>}
                                    className={tooltipStyles.className({})}
                                >
                                    {showArrow && (
                                        <FloatingArrow
                                            ref={arrowRef}
                                            context={context}
                                            width={14}
                                            height={7}
                                            tipRadius={2}
                                            strokeWidth={1}
                                            className={tooltipStyles.slots.arrow}
                                        />
                                    )}
                                    {children}
                                </Polymorph>
                            </MotionConfig>
                        </FloatingPortal>
                    )}
                </AnimatePresence>
            </Fragment>
        );
    }
) as unknown as <T extends ComponentLike = "span">(_: TooltipProps<T>) => React.ReactElement;
