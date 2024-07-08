import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingFocusManager,
    offset,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useId,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import React, { Fragment, PropsWithChildren, useMemo, useRef, useState } from "react";

type DropdownProps = {
    open?: boolean;
    arrow?: boolean;
    trigger: React.ReactElement | React.ReactNode;
    onChange?: (nextValue: boolean) => void;
};

export const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
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
        transform: true,
        whileElementsMounted: autoUpdate,
        middleware,
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

    const headingId = useId();

    return (
        <Fragment>
            <button ref={refs.setReference} {...getReferenceProps()}>
                {props.trigger}
            </button>
            {open && (
                <FloatingFocusManager returnFocus visuallyHiddenDismiss restoreFocus context={context} modal={false}>
                    <div
                        className="bg-floating-background isolate z-floating border shadow-2xl p-6 border-floating-border rounded-lg"
                        ref={refs.setFloating}
                        style={floatingStyles}
                        aria-labelledby={headingId}
                        {...getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={arrowRef}
                            context={context}
                            strokeWidth={1}
                            className="fill-floating-background stroke-1 stroke-floating-border"
                        />
                        {props.children}
                    </div>
                </FloatingFocusManager>
            )}
        </Fragment>
    );
};