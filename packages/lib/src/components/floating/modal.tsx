"use client";
import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion, MotionValue, PanInfo, TargetAndTransition, useMotionValue } from "framer-motion";
import { XIcon } from "lucide-react";
import React, { Fragment, PropsWithChildren, useId } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { css } from "../../lib/dom";
import { Label } from "../../types";

type DrawerSides = "left" | "right";

type AnimationLabels = "initial" | "enter" | "exit";

type Animations = {
    drawer: (type: DrawerSides) => Record<AnimationLabels, TargetAndTransition>;
    dialog: Record<AnimationLabels, TargetAndTransition>;
    sheet: Record<AnimationLabels, TargetAndTransition>;
};

const animationDuration = "600ms";

const drawerLeft = {
    initial: { translateX: ["-30%", "0%"], opacity: 0.8, animationDuration },
    enter: { translateX: ["-30%", "0%"], opacity: 1, animationDuration },
    exit: { translateX: ["0%", "-30%"], opacity: 0, animationDuration },
};

const drawerRight = {
    initial: { translateX: ["30%", "0%"], opacity: 0.8 },
    enter: { translateX: "0%", opacity: 1, animationDuration },
    exit: { translateX: ["0%", "30%"], opacity: 0, animationDuration },
} satisfies Record<string, TargetAndTransition>;

const animations: Animations = {
    drawer: (type) => (type === "left" ? drawerLeft : drawerRight),
    sheet: {
        initial: { opacity: 0.5, translateY: "25%", animationDuration, originY: "bottom" },
        enter: { opacity: 1, translateY: "0%", animationDuration, originY: "bottom" },
        exit: { opacity: 0.1, translateY: "50%", animationDuration, originY: "bottom" },
    },
    dialog: {
        initial: { opacity: 0, scale: 0.95, animationDuration },
        enter: { opacity: 1, scale: [1.05, 1], animationDuration },
        exit: { opacity: 0, scale: 0.97, animationDuration },
    },
};

const variants = cva(
    "isolate z-floating border border-card-border ring-0 outline-0 appearance-none flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background",
    {
        variants: {
            type: {
                drawer: "max-h-screen max-w-[90%] absolute w-fit h-screen min-h-0",
                dialog: "max-h-[calc(100lvh-10%)] relative container h-min rounded-lg py-4",
                sheet: "w-screen absolute bottom-0 h-[85vh] max-h-[85vh] max-h-[85svh] pt-6 pb-4 rounded-t-lg",
            },
            position: {
                none: "",
                right: "py-4 absolute right-0 top-0 rounded-l-lg",
                left: "py-4 absolute left-0 top-0 rounded-r-lg",
            },
        },
        defaultVariants: { position: "right", type: "dialog" },
    }
);

export type ModalProps = {
    layoutId?: string;
    title?: Label;
    open: boolean;
    footer?: Label;
    resizer?: boolean;
    asChild?: boolean;
    closable?: boolean;
    overlayClickClose?: boolean;
    position?: "left" | "right";
    trigger?: Label | React.FC<any>;
    forceType?: boolean;
    type?: "dialog" | "drawer" | "sheet";
    onChange: (nextState: boolean) => void;
};

type DraggableProps = {
    sheet: boolean;
    position: DrawerSides;
    parent: React.RefObject<HTMLElement>;
    onChange: (nextState: boolean) => void;
    value: MotionValue<number | undefined>;
};

const dragConstraints = { top: 0, left: 0, right: 0, bottom: -1 };

const calculateClose = (n: number) => n * 0.62;

const Draggable = (props: DraggableProps) => {
    const onDrag = (_: any, info: PanInfo) => {
        if (props.parent.current) {
            if (!props.sheet) {
                const div = props.parent.current as HTMLElement;
                const v = props.value.get() || div.getBoundingClientRect().width;
                const delta = props.position === "right" ? -info.delta.x : info.delta.x;
                return props.value.set(Math.abs(v + delta));
            }
            const div = props.parent.current as HTMLElement;
            const rect = div.getBoundingClientRect();
            const v = props.value.get() || rect.height;
            const result = Math.abs(v - info.delta.y);
            const screenHeightToClose = calculateClose(window.outerHeight);
            if (result < screenHeightToClose) {
                props.onChange(false);
                return setTimeout(() => props.value.set(window.outerHeight), 350);
            }
            return props.value.set(result);
        }
    };

    return (
        <motion.div
            draggable
            dragMomentum
            dragListener
            dragPropagation
            onDrag={onDrag}
            animate={false}
            initial={false}
            dragElastic={0}
            dragDirectionLock
            dragSnapToOrigin
            drag={props.sheet ? "y" : "x"}
            dragConstraints={dragConstraints}
            whileDrag={{ cursor: "grabbing" }}
            className={css(
                "absolute rounded-lg",
                props.sheet ? "cursor-row-resize" : "cursor-col-resize bg-floating-border",
                props.sheet
                    ? "top-1 flex h-3 w-full justify-center py-2"
                    : props.position === "left"
                      ? "right-5 top-1/2 h-10 w-2"
                      : "left-2 top-1/2 h-10 w-2"
            )}
        >
            {props.sheet ? <div className="h-2 w-1/4 rounded-lg bg-floating-border" /> : null}
        </motion.div>
    );
};

const positions = { drawer: "right", sheet: "none", dialog: "none" } as const;

export const Modal = ({
    type: _type = "dialog",
    resizer = true,
    overlayClickClose = false,
    forceType = false,
    closable = true,
    ...props
}: PropsWithChildren<ModalProps>) => {
    const headingId = useId();
    const descriptionId = useId();
    const isDesktop = useMediaQuery("(min-width: 64rem)");
    const useResizer = _type !== "dialog";
    const position = isDesktop ? (_type === "drawer" ? props.position : positions[_type]) : forceType ? positions[_type] : positions.sheet;
    const func = isDesktop ? animations[_type] : forceType ? animations[_type] : animations.sheet;
    const animation = typeof func === "function" ? func(position as DrawerSides) : func;
    const type = isDesktop ? _type : forceType ? _type : "sheet";

    const { refs, context } = useFloating({ open: props.open, onOpenChange: props.onChange });
    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, { escapeKey: true, referencePress: true, outsidePress: overlayClickClose });
    const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
    const Trigger = props.trigger as any;

    const value = useMotionValue<number | undefined>(undefined);

    const onClose = () => props.onChange(false);

    return (
        <Fragment>
            {props.trigger ? (
                <Fragment>
                    {props.asChild ? (
                        <Slot
                            ref={refs.setReference}
                            {...getReferenceProps({
                                layoutId: props.layoutId,
                            } as any)}
                            children={Trigger}
                        />
                    ) : (
                        <motion.button ref={refs.setReference} {...getReferenceProps()} layoutId={props.layoutId} type="button">
                            {Trigger}
                        </motion.button>
                    )}
                </Fragment>
            ) : null}
            <FloatingPortal>
                <AnimatePresence presenceAffectsLayout>
                    {props.open ? (
                        <FloatingOverlay
                            lockScroll
                            className={`inset-0 isolate z-overlay h-[100dvh] !overflow-clip bg-floating-overlay/70 ${type === "drawer" ? "" : "grid items-end justify-center lg:items-center"}`}
                        >
                            <FloatingFocusManager visuallyHiddenDismiss modal closeOnFocusOut context={context}>
                                <motion.div
                                    animate="enter"
                                    aria-describedby={descriptionId}
                                    aria-labelledby={headingId}
                                    className={variants({ position, type })}
                                    exit="exit"
                                    layoutId={props.layoutId}
                                    initial="initial"
                                    ref={refs.setFloating}
                                    style={type === "drawer" ? { width: value } : { height: value }}
                                    variants={animation}
                                    {...getFloatingProps()}
                                >
                                    {props.title ? (
                                        <header className="relative w-full">
                                            {props.title ? (
                                                <h2 className="border-b border-floating-border px-8 pb-2 text-3xl font-medium leading-relaxed">
                                                    {props.title}
                                                </h2>
                                            ) : null}
                                        </header>
                                    ) : null}
                                    <section className="flex-1 overflow-y-auto px-8 py-1">{props.children}</section>
                                    {props.footer ? (
                                        <footer className="w-full border-t border-floating-border px-8 pt-4">{props.footer}</footer>
                                    ) : null}
                                    {closable ? (
                                        <nav className="absolute right-4 top-1 z-floating">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="p-1 opacity-70 transition-colors hover:text-danger hover:opacity-100 focus:text-danger"
                                            >
                                                <XIcon />
                                            </button>
                                        </nav>
                                    ) : null}
                                    {useResizer && resizer ? (
                                        <Draggable
                                            onChange={props.onChange}
                                            parent={refs.floating}
                                            position={position as DrawerSides}
                                            sheet={type === "sheet"}
                                            value={value}
                                        />
                                    ) : null}
                                </motion.div>
                            </FloatingFocusManager>
                        </FloatingOverlay>
                    ) : null}
                </AnimatePresence>
            </FloatingPortal>
        </Fragment>
    );
};
