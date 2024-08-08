"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import React, { Fragment, PropsWithChildren, useId, useMemo, useRef, useState } from "react";

type DropdownProps = {
    open?: boolean;
    arrow?: boolean;
    restoreFocus?: boolean;
    returnFocus?: boolean;
    onChange?: (nextValue: boolean) => void;
    trigger: React.ReactElement | React.ReactNode;
    title?: React.ReactNode | React.ReactElement | string;
};

export const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
    const headingId = useId();
    const [open, setOpen] = useState(props.open);
    const arrowRef = useRef(null);
    const middleware = useMemo(
        () => [
            offset(10),
            flip({ fallbackAxisSideDirection: "end" }),
            shift(),
            arrow({
                padding: 5,
                element: arrowRef,
            }),
        ],
        [props.arrow]
    );
    const { refs, floatingStyles, context } = useFloating({
        open,
        middleware,
        transform: true,
        whileElementsMounted: autoUpdate,
        onOpenChange: (nextValue, event) => {
            const element = (event as any)?.relatedTarget as HTMLElement;
            if (element) {
                if (element.dataset.floating === "true" && !nextValue) return;
            }
            setOpen(nextValue);
            props.onChange?.(nextValue);
        },
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

    return (
        <Fragment>
            <button ref={refs.setReference} {...getReferenceProps()} type="button">
                {props.trigger}
            </button>
            {open && (
                <FloatingPortal id={`${headingId}-portal`}>
                    <FloatingFocusManager
                        restoreFocus={props.restoreFocus ?? true}
                        returnFocus={props.restoreFocus ?? true}
                        visuallyHiddenDismiss
                        context={context}
                        modal={false}
                    >
                        <div
                            className="bg-floating-background relative min-w-96 isolate z-floating border shadow-2xl p-6 border-floating-border rounded-lg"
                            ref={refs.setFloating}
                            style={floatingStyles}
                            aria-labelledby={headingId}
                            {...getFloatingProps()}
                        >
                            <FloatingArrow
                                ref={arrowRef}
                                context={context}
                                strokeWidth={0.1}
                                className="fill-floating-background stroke-floating-border"
                            />
                            <header className="mb-2">
                                <h3 className="leading-snug font-medium text-2xl tracking-wide text-left">{props.title}</h3>
                            </header>
                            {props.children}
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </Fragment>
    );
};
