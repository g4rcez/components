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
import { Label } from "../../types";
import { useMediaQuery } from "../../hooks/use-media-query";
import { css } from "../../lib/dom";

type DrawerSides = "left" | "right";

type AnimationLabels = "initial" | "enter" | "exit";

type Animations = {
    drawer: (type: DrawerSides) => Record<AnimationLabels, TargetAndTransition>;
    dialog: Record<AnimationLabels, TargetAndTransition>;
    sheet: Record<AnimationLabels, TargetAndTransition>;
};

const animationDuration = "600ms";

const createDrawerAnimation = (side: DrawerSides) => ({
    initial: { [side]: "-60%", opacity: 0.8, animationDuration },
    enter: { [side]: 0, opacity: 1, animationDuration },
    exit: { [side]: ["-50%", "-90%"], opacity: 0, animationDuration },
});

const drawerLeft = createDrawerAnimation("left");

const drawerRight = createDrawerAnimation("right");

const animations: Animations = {
    drawer: (type) => (type === "left" ? drawerLeft : drawerRight),
    sheet: {
        initial: { opacity: 0, scaleY: 0.95, animationDuration, originY: "bottom" },
        enter: { opacity: 1, scaleY: 1, animationDuration, originY: "bottom" },
        exit: { opacity: 0, scaleY: 0.8, animationDuration, originY: "bottom" },
    },
    dialog: {
        initial: { opacity: 0, scale: 0.95, animationDuration },
        enter: { opacity: 1, scale: [1.05, 1], animationDuration },
        exit: { opacity: 0, scale: 0.97, animationDuration },
    },
};

const variants = cva("isolate ring-0 outline-0 appearance-none flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background", {
    variants: {
        type: {
            drawer: "max-h-screen max-w-[90%] w-auto h-screen min-h-0",
            dialog: "max-h-[calc(100lvh-10%)] container h-[inherit] rounded-lg py-8",
            sheet: "w-full absolute bottom-0 max-h-[calc(100lvh-10%)] pt-8 pb-4 rounded-t-lg"
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
    open: boolean;
    footer?: Label;
    resizer?: boolean;
    asChild?: boolean;
    closable?: boolean;
    type?: "dialog" | "drawer";
    position?: "left" | "right";
    trigger?: Label | React.FC<any>;
    onChange: (nextState: boolean) => void;
};

type DraggableProps = {
    sheet: boolean;
    type: DrawerSides;
    parent: React.RefObject<HTMLElement>;
    onChange: (nextState: boolean) => void;
    value: MotionValue<number | undefined>;
};

const dragConstraints = { top: 0, left: 0, right: 0, bottom: 0 };

const Draggable = (props: DraggableProps) => {
    const handleDrag = (_: any, info: PanInfo) => {
        if (props.parent.current) {
            if (!props.sheet) {
                const div = props.parent.current as HTMLElement;
                const v = props.value.get() || div.getBoundingClientRect().width;
                const delta = props.type === "right" ? -info.delta.x : info.delta.x;
                props.value.set(Math.abs(v + delta));
            }
            const div = props.parent.current as HTMLElement;
            const rect = div.getBoundingClientRect();
            const v = props.value.get() || rect.height;
            const result = Math.abs(v - info.delta.y)
            const twentyPercentScreen = window.outerHeight * 0.68
            if (result < twentyPercentScreen) {
                props.onChange(false)
                return setTimeout(() =>
                    props.value.set(window.outerHeight * 0.9), 350
                )
            }
            return props.value.set(result);
        }
    };

    return (
        <motion.div
            drag="x"
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
            dragConstraints={dragConstraints}
            whileDrag={{ cursor: "grabbing" }}
            className={css(
                "absolute rounded-lg cursor-grab bg-floating-border",
                props.sheet ? "left-1/2 top-2 w-12 h-3" : (props.type === "left" ? "top-1/2 right-5 h-10 w-2" : "top-1/2 left-2 h-10 w-2")
            )}
        />
    );
};

const positions = { "drawer": "right", "sheet": "none", "dialog": "none" } as const;

export const Modal = ({ type: _type = "dialog", resizer = true, ...props }: PropsWithChildren<DrawerProps>) => {
    const headingId = useId();
    const descriptionId = useId();
    const isDesktop = useMediaQuery("(min-width: 48rem)")
    const useResizer = _type === "drawer" || !isDesktop;
    const position = isDesktop ? positions[_type] : positions.sheet;
    const func = isDesktop ? animations[_type] : animations.sheet;
    const animation = typeof func === "function" ? func(position as DrawerSides) : func;
    const type = isDesktop ? _type : "sheet"

    const { refs, context } = useFloating({ open: props.open, onOpenChange: props.onChange });
    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, { escapeKey: true, referencePress: true, outsidePress: false });
    const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
    const Trigger = props.trigger as any;

    const value = useMotionValue<undefined | number>(undefined);

    return (
        <Fragment>
            {props.trigger ? (
                <Fragment>
                    {props.asChild ? (
                        <Slot ref={refs.setReference} {...getReferenceProps()} children={Trigger} />
                    ) : (
                        <button ref={refs.setReference} {...getReferenceProps()} type="button">
                            {Trigger}
                        </button>
                    )}
                </Fragment>
            ) : null}
            <FloatingPortal>
                <AnimatePresence presenceAffectsLayout>
                    {props.open && (
                        <FloatingOverlay
                            lockScroll
                            className={`relative !overflow-clip h-[100dvh] z-floating bg-floating-overlay/70 ${type === "drawer" ? "" : "grid justify-center p-8"}`}
                        >
                            <FloatingFocusManager modal closeOnFocusOut context={context}>
                                <motion.div
                                    animate="enter"
                                    aria-describedby={descriptionId}
                                    aria-labelledby={headingId}
                                    className={variants({ position, type })}
                                    exit="exit"
                                    initial="initial"
                                    ref={refs.setFloating}
                                    variants={animation}
                                    style={isDesktop ? { width: value } : { height: value }}
                                    {...getFloatingProps()}
                                >
                                    {useResizer && resizer ? <Draggable onChange={props.onChange} sheet={!isDesktop} value={value} parent={refs.floating} type={position as DrawerSides} /> : null}
                                    {props.title || props.closable ? (
                                        <header className="w-full relative">
                                            {props.title ? (
                                                <h2 className="px-8 pb-4 border-b border-floating-border text-3xl font-medium leading-relaxed">
                                                    {props.title}
                                                </h2>
                                            ) : null}
                                            {props.closable !== false ? (
                                                <nav className="absolute -top-1 right-8">
                                                    <button
                                                        type="button"
                                                        onClick={() => props.onChange(false)}
                                                        className="p-1 transition-colors hover:text-danger focus:text-danger"
                                                    >
                                                        <XIcon />
                                                    </button>
                                                </nav>
                                            ) : null}
                                        </header>
                                    ) : null}
                                    <div className="flex-1 px-8 overflow-y-auto">{props.children}</div>
                                    {props.footer ? (
                                        <footer className="px-8 border-t border-floating-border pt-4 w-full">{props.footer}</footer>
                                    ) : null}
                                </motion.div>
                            </FloatingFocusManager>
                        </FloatingOverlay>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </Fragment>
    );
};
