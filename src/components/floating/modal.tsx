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
import React, { Fragment, PropsWithChildren, useId } from "react";
import { Label } from "../../types";

type DrawerSides = "left" | "right";

type AnimationLabels = "initial" | "enter" | "exit";

type Animations = {
    drawer: (type: DrawerSides) => Record<AnimationLabels, TargetAndTransition>;
    dialog: Record<AnimationLabels, TargetAndTransition>;
};

const createDrawerAnimation = (side: DrawerSides) => ({
    initial: { [side]: "-60%", opacity: 0.8 },
    enter: { [side]: 0, opacity: 1 },
    exit: { [side]: "-60%", opacity: 0.8 },
})

const drawerLeft = createDrawerAnimation("left");

const drawerRight = createDrawerAnimation("right");

const animations: Animations = {
    drawer: (type) => (type === "left" ? drawerLeft : drawerRight),
    dialog: {
        initial: { opacity: 0, scale: 0.9 },
        enter: { opacity: 1, scale: [1.125, 1] },
        exit: { opacity: 0, scale: 0.9 },
    },
};

const variants = cva("isolate ring-0 outline-0 appearance-none container flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background", {
    variants: {
        type: {
            drawer: "max-h-screen h-screen min-h-0",
            dialog: "max-h-[calc(100lvh-10%)] h-[inherit] relative rounded-lg py-8",
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
    type?: "dialog" | "drawer";
    position?: "left" | "right";
    trigger: Label | React.FC<any>;
    onChange: (nextState: boolean) => void;
};

type DraggableProps = {
    type: DrawerSides;
    parent: React.RefObject<HTMLElement>;
    value: MotionValue<number | undefined>;
};

const dragConstraints = { top: 0, left: 0, right: 0, bottom: 0 };

const Draggable = (props: DraggableProps) => {
    const handleDrag = (_: any, info: PanInfo) => {
        if (props.parent.current) {
            const div = props.parent.current as HTMLElement;
            const v = props.value.get() || div.getBoundingClientRect().width;
            const delta = props.type === "right" ? -info.delta.x : info.delta.x;
            props.value.set(Math.abs(v + delta));
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
            className={`absolute top-1/2 ${props.type === "left" ? "right-5" : "left-2"} rounded-lg cursor-grab h-10 w-2 bg-floating-border`}
        />
    );
};

export const Modal = ({ type = "dialog", resizer = true, ...props }: PropsWithChildren<DrawerProps>) => {
    const isDialog = type === "dialog";
    const position = isDialog ? "none" : props.position || "left";
    const animation = isDialog ? animations.dialog : animations.drawer(position as DrawerSides);
    const headingId = useId();
    const descriptionId = useId();
    const { refs, context } = useFloating({ open: props.open, onOpenChange: props.onChange });
    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, { escapeKey: true, referencePress: true, outsidePress: false });
    const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
    const Trigger = props.trigger as any;
    const value = useMotionValue<undefined | number>(undefined);

    return (
        <Fragment>
            {props.asChild ? (
                <Slot ref={refs.setReference} {...getReferenceProps()} children={Trigger} />
            ) : (
                <button ref={refs.setReference} {...getReferenceProps()} type="button">
                    {Trigger}
                </button>
            )}
            <FloatingPortal>
                <AnimatePresence presenceAffectsLayout>
                    {props.open && (
                        <FloatingOverlay
                            lockScroll
                            className={`relative !overflow-clip h-[100dvh] z-floating bg-floating-overlay/70 ${type === "drawer" ? "" : "grid items-baseline p-8"}`}
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
                                    style={{ width: value }}
                                    {...getFloatingProps()}
                                >
                                    {!isDialog && resizer ? <Draggable value={value} parent={refs.floating} type={position as DrawerSides} /> : null}
                                    {props.title ? (
                                        <header className="w-full">
                                            <h2 className="px-8 pb-4 border-b border-floating-border text-3xl font-medium leading-relaxed">
                                                {props.title}
                                            </h2>
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
