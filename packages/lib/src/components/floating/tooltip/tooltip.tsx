"use client";
import {
    arrow,
    autoPlacement,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingPortal,
    offset,
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
import type React from "react";
import { forwardRef, Fragment, useRef, useState } from "react";
import { Polymorph, type PolymorphicProps } from "../../../components/core/polymorph/polymorph";
import { FLOATING_DELAY } from "../../../constants";
import { mergeRefs } from "../../../lib/dom";
import { noop } from "../../../lib/fns";
import { tooltipStyles } from "./tooltip.styles";
import type { ComponentLike, Label } from "../../../types";

export type TooltipProps<T extends React.ElementType = "span"> = PolymorphicProps<
    {
        title: Label;
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
        const isControlled = open !== undefined;
        const [innerOpen, setInnerOpen] = useState(false);
        const currentOpen = isControlled ? open : innerOpen;
        const arrowRef = useRef(null);
        const Component: React.ElementType = as || "span";
        const handleOpenChange = (nextOpen: boolean) => {
            if (!isControlled) setInnerOpen(nextOpen);
            onChange?.(nextOpen);
        };
        const { refs, floatingStyles, context } = useFloating({
            placement,
            open: currentOpen,
            whileElementsMounted: autoUpdate,
            onOpenChange: handleOpenChange,
            middleware: [shift(), offset(5), autoPlacement(), arrow({ padding: 5, element: arrowRef }), flip({ fallbackAxisSideDirection: "start" })],
        });
        const dismiss = useDismiss(context, { enabled });
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
            delay: { open: FLOATING_DELAY },
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

        return (
            <Fragment>
                <Component {...getReferenceProps(props)} ref={mergeRefs(refs.setReference, outerRef)}>
                    {title}
                </Component>
                {currentOpen && (
                    <FloatingPortal>
                        <Polymorph
                            {...getFloatingProps()}
                            style={floatingStyles}
                            ref={refs.setFloating as React.Ref<React.ElementType<any, keyof React.JSX.IntrinsicElements>>}
                            className={tooltipStyles.className({})}
                        >
                            <FloatingArrow ref={arrowRef} context={context} strokeWidth={0.1} className={tooltipStyles.slots.arrow} />
                            {children}
                        </Polymorph>
                    </FloatingPortal>
                )}
            </Fragment>
        );
    }
) as unknown as <T extends ComponentLike = "span">(_: TooltipProps<T>) => React.ReactElement;
