"use client";
import { FloatingFocusManager, FloatingPortal, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { type PropsWithChildren, useEffect, useId, useRef, useState } from "react";
import type { Label, Override } from "../../../types";
import { Button, type ButtonProps } from "../../core/button/button";
import { expandStyles } from "./expand.styles";

export type ExpandProps = Override<
    ButtonProps<typeof motion.button>,
    {
        trigger: Label;
        open?: boolean;
        disabled?: boolean;
    }
>;

const expandTransition = { type: "spring", duration: 0.28, bounce: 0.08 } as const;

export const Expand = ({ trigger, open: controlledOpen, disabled = false, children, ...buttonProps }: PropsWithChildren<ExpandProps>) => {
    const root = useRef<HTMLDivElement | null>(null);
    const id = useId();
    const titleId = `${id}:title`;
    const wrapperId = `${id}:wrapper`;
    const [open, setOpen] = useState(controlledOpen ?? false);

    useEffect(() => {
        setOpen(controlledOpen ?? false);
    }, [controlledOpen]);

    const { context, refs } = useFloating({
        open,
        nodeId: id,
        onOpenChange: setOpen,
    });
    const click = useClick(context, { enabled: !disabled });
    const role = useRole(context, { role: "dialog" });
    const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
    const { getFloatingProps, getReferenceProps } = useInteractions([click, role, dismiss]);

    return (
        <LayoutGroup id={id}>
            <div className={expandStyles.className({})} ref={root}>
                <Button
                    size="small"
                    as={motion.button}
                    disabled={disabled}
                    aria-expanded={open}
                    layoutId={wrapperId}
                    aria-haspopup="dialog"
                    ref={refs.setReference}
                    transition={expandTransition}
                    {...getReferenceProps(buttonProps as never)}
                >
                    <motion.span layoutId={titleId}>{trigger}</motion.span>
                </Button>
                <AnimatePresence>
                    {open ? (
                        <FloatingPortal preserveTabOrder root={root} id={`${id}-portal`}>
                            <FloatingFocusManager guards restoreFocus returnFocus visuallyHiddenDismiss context={context} modal>
                                <motion.div
                                    {...getFloatingProps()}
                                    ref={refs.setFloating}
                                    layoutId={wrapperId}
                                    transition={expandTransition}
                                    className={expandStyles.slots.content}
                                >
                                    {children}
                                </motion.div>
                            </FloatingFocusManager>
                        </FloatingPortal>
                    ) : null}
                </AnimatePresence>
            </div>
        </LayoutGroup>
    );
};
