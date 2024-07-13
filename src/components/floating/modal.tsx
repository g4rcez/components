"use client";
import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useId,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import React, { Fragment, PropsWithChildren } from "react";
import { Label } from "../../types";

const variants = cva("ring-0 outline-0 appearance-none container flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background", {
    variants: {
        type: {
            drawer: "max-h-screen h-screen min-h-0",
            dialog: "max-h-[calc(100lvh-5%)] rounded-lg py-8",
        },
        position: {
            none: "",
            right: "py-4 absolute right-0 top-0 rounded-l-lg",
            left: "py-4 absolute left-0 top-0 rounded-r-lg",
        },
    },
    defaultVariants: { position: "right", type: "dialog" },
});

export type DrawerProps = {
    title?: Label;
    footer?: Label;
    open: boolean;
    asChild?: boolean;
    trigger: Label | React.FC<any>;
    onChange: (nextState: boolean) => void;
    type?: "dialog" | "drawer";
    position?: "left" | "right";
};

export const Modal = (props: PropsWithChildren<DrawerProps>) => {
    const type = props.type || "dialog";
    const position = type === "dialog" ? "none" : props.position || "left";
    const headingId = useId();
    const descriptionId = useId();

    const { refs, context } = useFloating({
        open: props.open,
        onOpenChange: props.onChange,
    });
    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, { escapeKey: true, referencePress: true, outsidePress: false });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
    const Trigger = props.trigger as any;

    return (
        <Fragment>
            {props.asChild ? (
                <Slot ref={refs.setReference} {...getReferenceProps()} children={Trigger} />
            ) : (
                <button ref={refs.setReference} {...getReferenceProps()}>
                    {Trigger}
                </button>
            )}
            <FloatingPortal>
                {props.open && (
                    <FloatingOverlay className={`relative bg-floating-overlay/70 ${type === "drawer" ? "" : "grid items-baseline p-8"}`} lockScroll>
                        <FloatingFocusManager closeOnFocusOut context={context}>
                            <div
                                ref={refs.setFloating}
                                aria-labelledby={headingId}
                                aria-describedby={descriptionId}
                                className={variants({ position, type })}
                                {...getFloatingProps()}
                            >
                                <span className="w-5 h-2" />
                                {props.title ? (
                                    <header className="w-full">
                                        <h2 className="px-8 pb-4 border-b text-3xl font-medium leading-relaxed">{props.title}</h2>
                                    </header>
                                ) : null}
                                <div className="flex-1 px-8 overflow-scroll">{props.children}</div>
                                {props.footer ? <footer className="px-8 border-t pt-4 w-full">{props.footer}</footer> : null}
                            </div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                )}
            </FloatingPortal>
        </Fragment>
    );
};
