"use client";
import {
    arrow,
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
import React, { Fragment, useRef, useState } from "react";
import { Polymorph, PolymorphicProps } from "../../components/core/polymorph";
import { FLOATING_DELAY } from "../../constants";
import { ComponentLike, Label, Override } from "../../types";

export type TooltipProps<T extends ComponentLike = "span"> = Override<
    PolymorphicProps<React.ComponentProps<T>, T>,
    {
        title: Label;
        hover?: boolean;
        focus?: boolean;
        enabled?: boolean;
        popover?: boolean;
        placement?: Placement;
        followCursor?: boolean;
    }
>;

export const Tooltip = <T extends ComponentLike = "span">({
    as,
    title,
    children,
    placement,
    focus = true,
    hover = true,
    enabled = true,
    popover = true,
    followCursor = false,
    ...props
}: TooltipProps<T>) => {
    const [open, setOpen] = useState(false);
    const arrowRef = useRef(null);
    const Component: any = as || "span";
    const { refs, floatingStyles, context } = useFloating({
        open,
        placement,
        transform: true,
        strategy: "absolute",
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            shift(),
            offset(5),
            flip({ fallbackAxisSideDirection: "start" }),
            arrow({
                padding: 5,
                element: arrowRef,
            }),
        ],
    });
    const hoverController = useHover(context, {
        move: true,
        delay: { open: FLOATING_DELAY },
        enabled: enabled ? hover : false,
        handleClose: popover ? safePolygon() : null,
    });
    const focusController = useFocus(context, { enabled: enabled ? focus : false });
    const clickController = useClick(context, { enabled: enabled ? popover : false });
    const dismiss = useDismiss(context, { enabled });
    const role = useRole(context, { role: "tooltip", enabled });
    const clientPoint = useClientPoint(context, { enabled: !!enabled && !!followCursor });
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
            <Component ref={refs.setReference} {...getReferenceProps(props)}>
                {title}
            </Component>
            <FloatingPortal preserveTabOrder>
                {open && (
                    <Polymorph
                        {...getFloatingProps()}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="z-tooltip rounded-lg border border-tooltip-border bg-tooltip-background p-3 text-tooltip-foreground shadow-lg"
                    >
                        <FloatingArrow ref={arrowRef} context={context} strokeWidth={0.1} className="fill-tooltip-background stroke-tooltip-border" />
                        {children}
                    </Polymorph>
                )}
            </FloatingPortal>
        </Fragment>
    );
};
