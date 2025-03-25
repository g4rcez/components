"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingFocusManager,
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
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Polymorph, PolymorphicProps } from "../../components/core/polymorph";
import { FLOATING_DELAY } from "../../constants";
import { noop } from "../../lib/fns";
import { ComponentLike, Label } from "../../types";

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

export const Tooltip = <T extends ComponentLike = "span">({
    as,
    title,
    children,
    placement,
    open,
    focus = true,
    hover = true,
    enabled = true,
    popover = true,
    followCursor = false,
    onChange = noop,
    ...props
}: TooltipProps<T>) => {
    const [innerOpen, setInnerOpen] = useState<boolean>(open ?? false);
    const arrowRef = useRef(null);
    const Component: any = as || "span";
    const toggleBoth = (b: boolean) => {
        setInnerOpen(b);
        onChange?.(b);
    };
    const { refs, floatingStyles, context } = useFloating({
        open: innerOpen,
        placement,
        transform: true,
        strategy: "absolute",
        whileElementsMounted: autoUpdate,
        onOpenChange: open ? undefined : toggleBoth,
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

    useEffect(() => {
        if (open === undefined) return setInnerOpen(false);
        return setInnerOpen(open);
    }, [open]);

    return (
        <Fragment>
            <Component ref={refs.setReference} {...getReferenceProps(props)}>
                {title}
            </Component>
            {innerOpen && (
                <FloatingPortal preserveTabOrder>
                    <Polymorph
                        {...getFloatingProps()}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="isolate z-tooltip rounded-lg border border-tooltip-border bg-tooltip-background p-3 text-tooltip-foreground shadow-lg"
                    >
                        <FloatingArrow ref={arrowRef} context={context} strokeWidth={0.1} className="fill-tooltip-background stroke-tooltip-border" />
                        {children}
                    </Polymorph>
                </FloatingPortal>
            )}
        </Fragment>
    );
};
