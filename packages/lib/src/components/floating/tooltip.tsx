"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingPortal,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import React, { Fragment, useRef, useState } from "react";
import { Polymorph, PolymorphicProps } from "../../components/core/polymorph";
import { Label, Override } from "../../types";

type TooltipProps = Override<PolymorphicProps<React.ComponentProps<"button">, "span">, { title: Label }>;

export const Tooltip = ({ children, as, title, ...props }: TooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = useRef(null);
    const Component = as || "span";
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        transform: true,
        middleware: [
            offset(5),
            flip({ fallbackAxisSideDirection: "start" }),
            shift(),
            arrow({
                element: arrowRef,
                padding: 5,
            }),
        ],
    });
    const hover = useHover(context, { move: true });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

    return (
        <Fragment>
            <Component ref={refs.setReference} {...getReferenceProps(props)}>
                {title}
            </Component>
            <FloatingPortal>
                {isOpen && (
                    <Polymorph
                        {...getFloatingProps()}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="bg-tooltip-background z-tooltip text-tooltip-foreground border border-tooltip-border p-3 rounded-lg"
                    >
                        <FloatingArrow ref={arrowRef} context={context} strokeWidth={0.1} className="fill-tooltip-background stroke-tooltip-border" />
                        {children}
                    </Polymorph>
                )}
            </FloatingPortal>
        </Fragment>
    );
};
