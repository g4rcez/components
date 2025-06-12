"use client";
import {
    type ElementProps,
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { Slot as RadixSlot } from "radix-ui";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { AnimatePresence, HTMLMotionProps, motion, MotionValue, PanInfo, TargetAndTransition, useMotionValue } from "motion/react";
import React, { ForwardedRef, forwardRef, Fragment, PropsWithChildren, useId, useImperativeHandle, useEffect, RefObject } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { useRemoveScroll } from "../../hooks/use-remove-scroll";
import { css, mergeRefs } from "../../lib/dom";
import { Label, Nil, Override } from "../../types";

const Slot = RadixSlot.Slot

type AnimationLabels = "initial" | "enter" | "exit";

export type ModalType = "dialog" | "drawer" | "sheet";

export type DrawerPosition = "left" | "right";

type Animations = {
    sheet: Record<AnimationLabels, TargetAndTransition>;
    dialog: Record<AnimationLabels, TargetAndTransition>;
    drawer: (type: DrawerPosition) => Record<AnimationLabels, TargetAndTransition>;
};

const animationDuration = "500ms";

const drawerLeft = {
    exit: { translateX: ["0%", "-30%"], opacity: 0, animationDuration },
    enter: { translateX: ["-30%", "0%"], opacity: 1, animationDuration },
    initial: { translateX: ["-30%", "0%"], opacity: 0.8, animationDuration },
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
        exit: { opacity: 0, scale: 0.95, animationDuration },
        initial: { opacity: 0.5, scale: 0.95, animationDuration, type: "spring" },
        enter: { opacity: 1, scale: [1.05, 1], animationDuration },
    },
};

const variants = cva(
    "z-floating border border-card-border ring-0 outline-0 appearance-none flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background",
    {
        variants: {
            type: {
                drawer: "max-h-screen max-w-[90%] absolute w-fit h-screen min-h-0",
                dialog: "max-h-[calc(100lvh-10%)] relative container h-min rounded-lg py-4",
                sheet: "w-screen absolute bottom-0 max-h-[calc(100vh-15%)] max-h-[calc(100svh-5%)] h-screen pt-6 pb-4 rounded-t-lg",
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

export type ModalProps = Override<
    HTMLMotionProps<"div">,
    ({ title: Label; ariaTitle?: string } | { ariaTitle: string; title?: Label }) & {
        open: boolean;
        onChange: (nextState: boolean) => void;
    } & Partial<{
            footer: Label;
            type: ModalType;
            animated: boolean;
            asChild: boolean;
            layoutId: string;
            resizer: boolean;
            className: string;
            closable: boolean;
            forceType: boolean;
            bodyClassName: string;
            overlayClassName: string;
            position: DrawerPosition;
            overlayClickClose: boolean;
            role: "dialog" | "listbox";
            interactions: ElementProps[];
            trigger: Label | React.FC<any>;
        }>
>;

type DraggableProps = {
    sheet: boolean;
    position: DrawerPosition;
    parent: React.RefObject<HTMLElement>;
    onChange: (nextState: boolean) => void;
    value: MotionValue<number | undefined>;
};

const dragConstraints = { top: 0, left: 0, right: 0, bottom: 0 };

const calculateClose = (n: number) => n * 0.65;

const Draggable = (props: DraggableProps) => {
    const onDrag = (_: any, info: PanInfo) => {
        if (props.parent.current) {
            if (!props.sheet) {
                const div = props.parent.current as HTMLElement;
                const v = props.value.get() || div.getBoundingClientRect().width;
                const delta = props.position === "right" ? -info.delta.x : info.delta.x;
                const value = Math.abs(v + delta);
                return props.value.set(value);
            }
            const div = props.parent.current as HTMLElement;
            const rect = div.getBoundingClientRect();
            const v = props.value.get() || rect.height;
            const result = Math.abs(v - info.delta.y);
            const screenHeightToClose = calculateClose(window.outerHeight);
            if (result >= screenHeightToClose) return props.value.set(result);
            props.onChange(false);
            return setTimeout(() => props.value.set(window.outerHeight), 350);
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

const fetchPosition = (isDesktop: Nil<boolean>, forceType: Nil<boolean>, propsType: Nil<ModalType>, propsPosition: Nil<DrawerPosition>) => {
    const type = propsType || "dialog";
    if (isDesktop) return propsType === "drawer" ? (propsPosition ?? positions.drawer) : positions[type];
    return forceType ? positions[type] : positions.sheet;
};

type ModalRef = { context: any; floating: HTMLElement | null };

const noop: any[] = [];

export const Modal = forwardRef<ModalRef, PropsWithChildren<ModalProps>>(
    (
        {
            open,
            title,
            footer,
            asChild,
            trigger,
            children,
            onChange,
            ariaTitle,
            className,
            bodyClassName,
            resizer = true,
            animated = true,
            closable = true,
            forceType = false,
            layoutId = undefined,
            overlayClassName = "",
            type: _type = "dialog",
            position: propsPosition,
            overlayClickClose = false,
            role: roleName = "dialog",
            interactions: outInteractions = noop,
            ...props
        }: PropsWithChildren<ModalProps>,
        externalRef: ForwardedRef<ModalRef>
    ) => {
        const removeScrollRef = useRemoveScroll(open, "block-only");
        const headingId = useId();
        const descriptionId = useId();
        const isDesktop = useMediaQuery("(min-width: 64rem)");
        const useResizer = _type !== "dialog";
        const position = fetchPosition(isDesktop, forceType, _type, propsPosition);
        const func = isDesktop ? animations[_type] : forceType ? animations[_type] : animations.sheet;
        const animation = typeof func === "function" ? func(position as DrawerPosition) : func;
        const type = isDesktop ? _type : forceType ? _type : "sheet";

        const floating = useFloating({ open: open, onOpenChange: onChange, transform: true, strategy: "absolute" });
        const click = useClick(floating.context);
        const role = useRole(floating.context, { role: roleName });
        const dismiss = useDismiss(floating.context, {
            escapeKey: true,
            referencePress: true,
            outsidePress: overlayClickClose,
        });

        const interactions = useInteractions([click, role, dismiss].concat(outInteractions));

        const Trigger = trigger as any;

        const floatingSize = useMotionValue<number | undefined>(undefined);

        useEffect(() => {
            floatingSize.set(undefined);
        }, [floatingSize, type]);

        const onClose = () => onChange(false);

        useImperativeHandle(externalRef, () => {
            return { context: floating.context, floating: removeScrollRef.current };
        }, [floating.context, removeScrollRef]);

        const onDrag = (_: any, info: PanInfo) => {
            const parent = floating.refs.floating as RefObject<HTMLElement | null>;
            if (parent.current && type === "sheet") {
                const div = parent.current as HTMLElement;
                const rect = div.getBoundingClientRect();
                const v = floatingSize.get() || rect.height;
                const result = Math.abs(v - info.delta.y);
                const screenHeightToClose = calculateClose(window.outerHeight);
                if (result < screenHeightToClose) {
                    onClose();
                    return setTimeout(() => floatingSize.set(window.outerHeight), 350);
                }
                return floatingSize.set(result);
            }
        };

        const commonAnimated = {
            layoutId,
            layout: true,
            exit: "exit",
            animate: "enter",
            initial: "initial",
            variants: animation,
        } as const;

        const animationProps =
            animated && type === "sheet"
                ? ({
                      dragElastic: 0,
                      onDrag: onDrag,
                      dragConstraints,
                      ...commonAnimated,
                      dragListener: true,
                      dragMomentum: true,
                      dragPropagation: true,
                      dragSnapToOrigin: true,
                      dragDirectionLock: true,
                      draggable: type === "sheet",
                      drag: type === "sheet" ? "y" : "x",
                  } as const)
                : commonAnimated;

        return (
            <Fragment>
                {trigger ? (
                    <Fragment>
                        {asChild ? (
                            <Slot ref={floating.refs.setReference} {...interactions.getReferenceProps({ layoutId: layoutId } as any)}>
                                {Trigger}
                            </Slot>
                        ) : (
                            <motion.button ref={floating.refs.setReference} {...interactions.getReferenceProps()} layoutId={layoutId} type="button">
                                {Trigger}
                            </motion.button>
                        )}
                    </Fragment>
                ) : null}
                <FloatingPortal preserveTabOrder>
                    <AnimatePresence key={headingId} mode="wait" propagate presenceAffectsLayout initial={false}>
                        {open ? (
                            <FloatingOverlay
                                lockScroll
                                className={css(
                                    `inset-0 isolate z-overlay h-[100dvh] !overflow-clip bg-floating-overlay/70 ${type === "drawer" ? "" : "flex items-start justify-center p-10"}`,
                                    overlayClassName
                                )}
                            >
                                <FloatingFocusManager guards visuallyHiddenDismiss modal closeOnFocusOut context={floating.context}>
                                    <motion.div
                                        {...props}
                                        {...animationProps}
                                        {...(title
                                            ? {
                                                  "aria-labelledby": headingId,
                                                  "aria-describedby": descriptionId,
                                              }
                                            : { "aria-label": ariaTitle })}
                                        {...interactions.getFloatingProps({
                                            "aria-modal": open,
                                            ref: mergeRefs(floating.refs.setFloating, removeScrollRef),
                                            className: css(
                                                variants({
                                                    position,
                                                    type,
                                                }),
                                                className,
                                                "overscroll-contain"
                                            ),
                                        })}
                                        data-component="modal"
                                        style={type === "drawer" ? { width: floatingSize } : { height: floatingSize }}
                                    >
                                        {title ? (
                                            <header className="relative w-full">
                                                {title ? (
                                                    <h2
                                                        id={headingId}
                                                        className="select-text border-b border-floating-border px-8 pb-2 text-3xl font-medium leading-relaxed"
                                                    >
                                                        {title}
                                                    </h2>
                                                ) : null}
                                            </header>
                                        ) : null}
                                        <section data-component="modal-body" className={css("flex-1 select-text overflow-y-auto px-8 py-1", bodyClassName)}>{children}</section>
                                        {footer ? (
                                            <footer className="w-full select-text border-t border-floating-border px-8 pt-4">{footer}</footer>
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
                                                onChange={onChange}
                                                value={floatingSize}
                                                sheet={type === "sheet"}
                                                position={position as DrawerPosition}
                                                parent={floating.refs.floating as any}
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
    }
);
