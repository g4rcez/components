"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingPortal,
    offset,
    type Placement,
    shift,
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
        enabled?: boolean;
        placement?: Placement;
        followCursor?: boolean;
    }
>;

export const Tooltip = <T extends ComponentLike = "span">({ children, followCursor = false, placement, enabled, as, title, ...props }: TooltipProps<T>) => {
    const [open, setOpen] = useState(false);
    const arrowRef = useRef(null);
    const Component: any = as || "span";
    const { refs, floatingStyles, context } = useFloating({
        open,
        placement,
        transform: true,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [offset(5), flip({ fallbackAxisSideDirection: "start" }), shift(), arrow({ element: arrowRef, padding: 5 })],
    });
    const hover = useHover(context, { move: true, enabled, delay: { open: FLOATING_DELAY } });
    const focus = useFocus(context, { enabled });
    const dismiss = useDismiss(context, { enabled });
    const role = useRole(context, { role: "tooltip", enabled });
    const clientPoint = useClientPoint(context, { enabled: !!enabled && !!followCursor });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role, clientPoint]);

    return (
        <Fragment>
            <Component ref={refs.setReference} {...getReferenceProps(props)}>
                {title}
            </Component>
            <FloatingPortal>
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
