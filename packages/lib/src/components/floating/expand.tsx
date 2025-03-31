"use client";
import { FloatingFocusManager, FloatingPortal, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { PropsWithChildren, useId, useRef, useState } from "react";
import { Label, Override } from "../../types";
import { Button, ButtonProps } from "../core/button";

export type ExpandProps = Override<ButtonProps<typeof motion.button>, { trigger: Label }>;

export const Expand = (props: PropsWithChildren<ExpandProps>) => {
    const root = useRef<HTMLDivElement | null>(null);
    const id = useId();
    const wrapperId = `${id}:wrapper`;
    const titleId = `${id}:title`;

    const [open, setOpen] = useState(false);
    const { context, refs } = useFloating({
        transform: true,
        open: open !== null,
        nodeId: id,
        onOpenChange: setOpen,
        strategy: "absolute",
    });
    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, { escapeKey: true, referencePress: true, outsidePress: true });
    const { getFloatingProps, getReferenceProps } = useInteractions([click, role, dismiss]);

    return (
        <div className="relative inline-flex items-center justify-center" ref={root}>
            <Button
                {...getReferenceProps(props as never)}
                as={motion.button}
                layoutId={wrapperId}
                ref={refs.setReference}
                size="small"
                onClick={() => setOpen(true)}
            >
                <motion.span layoutId={titleId}>{props.trigger}</motion.span>
            </Button>
            <AnimatePresence>
                {open ? (
                    <FloatingPortal root={root}>
                        <FloatingFocusManager visuallyHiddenDismiss modal closeOnFocusOut context={context}>
                            <motion.div {...getFloatingProps()} ref={refs.setFloating} layoutId={wrapperId} className="absolute -left-1/4 -top-3/4">
                                {props.children}
                            </motion.div>
                        </FloatingFocusManager>
                    </FloatingPortal>
                ) : null}
            </AnimatePresence>
        </div>
    );
};
