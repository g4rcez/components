"use client";
import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { arrow, autoUpdate, flip, FloatingArrow, FloatingPortal, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole, } from "@floating-ui/react";
import { Fragment, useRef, useState } from "react";
import { Polymorph } from "../../components/core/polymorph";
export const Tooltip = (_a) => {
    var { children, as, title } = _a, props = __rest(_a, ["children", "as", "title"]);
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
    return (_jsxs(Fragment, { children: [_jsx(Component, Object.assign({ ref: refs.setReference }, getReferenceProps(props), { children: title })), _jsx(FloatingPortal, { children: isOpen && (_jsxs(Polymorph, Object.assign({}, getFloatingProps(), { ref: refs.setFloating, style: floatingStyles, className: "bg-tooltip-background z-tooltip text-tooltip-foreground border border-tooltip-border p-3 rounded-lg", children: [_jsx(FloatingArrow, { ref: arrowRef, context: context, strokeWidth: 0.1, className: "fill-tooltip-background stroke-tooltip-border" }), children] }))) })] }));
};
