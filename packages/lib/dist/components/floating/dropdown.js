"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { arrow, autoUpdate, flip, FloatingArrow, FloatingFocusManager, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions, useRole, } from "@floating-ui/react";
import { Fragment, useId, useMemo, useRef, useState } from "react";
export const Dropdown = (props) => {
    var _a, _b;
    const headingId = useId();
    const [open, setOpen] = useState(props.open);
    const arrowRef = useRef(null);
    const middleware = useMemo(() => [
        offset(10),
        flip({ fallbackAxisSideDirection: "end" }),
        shift(),
        arrow({
            padding: 5,
            element: arrowRef,
        }),
    ], [props.arrow]);
    const { refs, floatingStyles, context } = useFloating({
        open,
        middleware,
        transform: true,
        whileElementsMounted: autoUpdate,
        onOpenChange: (nextValue, event) => {
            var _a;
            const element = event === null || event === void 0 ? void 0 : event.relatedTarget;
            if (element) {
                if (element.dataset.floating === "true" && !nextValue)
                    return;
            }
            setOpen(nextValue);
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, nextValue);
        },
    });
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
    return (_jsxs(Fragment, { children: [_jsx("button", Object.assign({ ref: refs.setReference }, getReferenceProps(props.buttonProps), { type: "button", children: props.trigger })), open && (_jsx(FloatingPortal, { id: `${headingId}-portal`, children: _jsx(FloatingFocusManager, { restoreFocus: (_a = props.restoreFocus) !== null && _a !== void 0 ? _a : true, returnFocus: (_b = props.restoreFocus) !== null && _b !== void 0 ? _b : true, visuallyHiddenDismiss: true, context: context, modal: false, children: _jsxs("div", Object.assign({ className: "bg-floating-background relative min-w-96 isolate z-floating border shadow-2xl p-6 border-floating-border rounded-lg", ref: refs.setFloating, style: floatingStyles, "aria-labelledby": headingId }, getFloatingProps(), { children: [_jsx(FloatingArrow, { ref: arrowRef, context: context, strokeWidth: 0.1, className: "fill-floating-background stroke-floating-border" }), _jsx("header", { className: "mb-2", children: _jsx("h3", { className: "leading-snug font-medium text-2xl tracking-wide text-left", children: props.title }) }), props.children] })) }) }))] }));
};
