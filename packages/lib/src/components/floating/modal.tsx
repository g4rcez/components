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
    type ElementProps,
    type FloatingContext,
} from "@floating-ui/react";
import { cva } from "class-variance-authority";
import { XIcon } from "@phosphor-icons/react";
import {
    AnimatePresence,
    type HTMLMotionProps,
    motion,
    MotionConfig,
    type MotionValue,
    type PanInfo,
    type TargetAndTransition,
    useMotionValue,
    animate,
} from "motion/react";
import { Slot } from "../core/slot";
import React, {
    type ForwardedRef,
    forwardRef,
    Fragment,
    type PropsWithChildren,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
    useCallback,
} from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { css } from "../../lib/dom";
import type { Label, Nil, Override } from "../../types";
import { useFloatingRef } from "../../hooks/use-floating-ref";
import { useTranslations } from "../../hooks/use-translations";
import { Button, type ButtonProps } from "../core/button";

type AnimationLabels = "initial" | "enter" | "exit";

const ConfirmContext = React.createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

export const useConfirm = () => React.useContext(ConfirmContext);

export type ModalType = "dialog" | "drawer" | "sheet";

export type DrawerPosition = "left" | "right";

type Animations = {
    sheet: Record<AnimationLabels, TargetAndTransition>;
    dialog: Record<AnimationLabels, TargetAndTransition>;
    drawer: (type: DrawerPosition) => Record<AnimationLabels, TargetAndTransition>;
};

const animationDuration = "500ms";

const drawerLeft: Record<string, TargetAndTransition> = {
    exit: { x: ["0%", "-30%"], opacity: 0, animationDuration },
    enter: { x: ["-30%", "0%"], opacity: 1, animationDuration },
    initial: { x: ["-30%", "0%"], opacity: 0.8, animationDuration },
};

const drawerRight: Record<string, TargetAndTransition> = {
    enter: { x: "0%", opacity: 1, animationDuration },
    exit: { x: ["0%", "30%"], opacity: 0, animationDuration },
    initial: { x: ["30%", "0%"], opacity: 0.8, animationDuration },
};

const animations: Animations = {
    drawer: (type) => (type === "left" ? drawerLeft : drawerRight),
    sheet: {
        enter: {
            opacity: 1,
            y: "0%",
            animationDuration,
            transformOrigin: "bottom",
        },
        exit: {
            opacity: 0.4,
            y: "10%",
            animationDuration,
            transformOrigin: "bottom",
        },
        initial: {
            opacity: 0.7,
            y: "10%",
            animationDuration,
            transformOrigin: "bottom",
        },
    },
    dialog: {
        exit: { opacity: 0, scale: 0.95, animationDuration },
        enter: { opacity: 1, scale: [1.05, 1], animationDuration },
        initial: {
            opacity: 0.5,
            scale: 0.95,
            animationDuration,
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    },
};

const variants = cva("__floating-modal__border __floating-modal__tw-1 __floating-modal__tw-extra-1", {
    variants: {
        type: {
            drawer: "__floating-modal__tw-2",
            dialog: "container __floating-modal__tw-3",
            sheet: "__floating-modal__tw-4",
        },
        position: {
            none: "",
            right: "__floating-modal__tw-5",
            left: "__floating-modal__tw-6",
        },
    },
    defaultVariants: { position: "right", type: "dialog" },
});

type ModalAccessibleNameProps = { title: Label; ariaTitle?: string } | { ariaTitle: string; title?: Label };

type ModalOptions = Partial<{
    footer: Label;
    role: "dialog" | "alertdialog";
    trigger: Label;
    ariaDescription: string;
    type: ModalType;
    asChild: boolean;
    layoutId: string;
    resizer: boolean;
    animated: boolean;
    className: string;
    closable: boolean;
    forceType: boolean;
    bodyClassName: string;
    closeOnFocusOut: boolean;
    overlayClassName: string;
    position: DrawerPosition;
    overlayClickClose: boolean;
    interactions: ElementProps[];
    initialFocus: React.ComponentProps<typeof FloatingFocusManager>["initialFocus"];
}>;

export type ModalProps = Override<
    HTMLMotionProps<"div">,
    {
        open: boolean;
        onChange: (nextState: boolean) => void;
    } & ModalAccessibleNameProps &
        ModalOptions
>;

type DraggableProps = {
    sheet: boolean;
    controlsId: string;
    instructionsId: string;
    position: DrawerPosition;
    onChange: (nextState: boolean) => void;
    value: MotionValue<number | undefined>;
    parent: React.RefObject<HTMLElement | null>;
};

const dragConstraints = { top: 0, left: 0, right: 0, bottom: 0 };

const keyboardResizeStep = 32;

const calculateClose = (n: number) => n * 0.6;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const Draggable = (props: DraggableProps) => {
    const translations = useTranslations();

    const getKeyboardResize = (delta: number) => {
        const element = props.parent.current;
        if (!element) return undefined;

        const rect = element.getBoundingClientRect();
        const current = props.value.get() || (props.sheet ? rect.height : rect.width);

        if (props.sheet) {
            const max = window.outerHeight || rect.height || current;
            return clamp(current + delta, calculateClose(max), max);
        }

        const max = window.outerWidth || rect.width || current;
        return clamp(current + delta, 0, max);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const delta = props.sheet
            ? event.key === "ArrowUp"
                ? keyboardResizeStep
                : event.key === "ArrowDown"
                  ? -keyboardResizeStep
                  : undefined
            : event.key === "ArrowRight" || event.key === "ArrowDown"
              ? keyboardResizeStep
              : event.key === "ArrowLeft" || event.key === "ArrowUp"
                ? -keyboardResizeStep
                : undefined;

        if (delta === undefined) return;
        event.preventDefault();
        event.stopPropagation();
        const nextValue = getKeyboardResize(delta);
        if (nextValue !== undefined) props.value.set(nextValue);
    };

    const onDrag = (e: Event, info: PanInfo) => {
        if (props.parent.current) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (props.sheet) {
                const div = props.parent.current as HTMLElement;
                const rect = div.getBoundingClientRect();
                const v = props.value.get() || rect.height;
                const result = Math.abs(v - info.delta.y);
                const max = window.outerHeight;
                const screenHeightToClose = calculateClose(max);
                if (result >= screenHeightToClose) return props.value.set(result);
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement?.blur();
                }
                props.onChange(false);
                return setTimeout(() => props.value.set(undefined), 350);
            }
            const div = props.parent.current as HTMLElement;
            const v = props.value.get() || div.getBoundingClientRect().width;
            const delta = props.position === "right" ? -info.delta.x : info.delta.x;
            const value = Math.abs(v + delta);
            return props.value.set(value);
        }
    };

    return (
        <motion.button
            draggable
            dragListener
            dragMomentum
            type="button"
            animate={false}
            dragElastic={0}
            dragPropagation
            initial={false}
            onDrag={onDrag}
            dragSnapToOrigin
            dragDirectionLock
            onKeyDown={onKeyDown}
            aria-label={translations.dialogResizeLabel}
            drag={props.sheet ? "y" : "x"}
            aria-controls={props.controlsId}
            dragConstraints={dragConstraints}
            whileDrag={{ cursor: "grabbing" }}
            aria-describedby={props.instructionsId}
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
            className={css(
                "__floating-modal__tw-7",
                props.sheet ? "__floating-modal__tw-8" : "__floating-modal__tw-9",
                props.sheet ? "__floating-modal__tw-10" : props.position === "left" ? "__floating-modal__tw-11" : "__floating-modal__tw-12"
            )}
        >
            {props.sheet ? <div className="__floating-modal__tw-13" /> : null}
        </motion.button>
    );
};

const positions = { drawer: "right", sheet: "none", dialog: "none" } as const;

const fetchPosition = (isDesktop: Nil<boolean>, forceType: Nil<boolean>, propsType: Nil<ModalType>, propsPosition: Nil<DrawerPosition>) => {
    const type = propsType || "dialog";
    if (isDesktop) return propsType === "drawer" ? (propsPosition ?? positions.drawer) : positions[type];
    return forceType ? positions[type] : positions.sheet;
};

export type ModalRef = {
    context: FloatingContext;
    floating: HTMLElement | null;
};

const noop: ElementProps[] = [];

type ModalComponent = React.FC<ModalProps> & {
    confirm: <T>(options: ConfirmOptions) => Promise<T>;
};

export const Modal: ModalComponent = forwardRef<ModalRef, PropsWithChildren<ModalProps>>(
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
            ariaDescription,
            resizer = true,
            animated = true,
            closable = true,
            forceType = false,
            layoutId = undefined,
            overlayClassName = "",
            type: _type = "dialog",
            position: propsPosition,
            overlayClickClose = false,
            closeOnFocusOut = false,
            initialFocus,
            role: modalRole = "dialog",
            interactions: outInteractions = noop,
            ...props
        },
        externalRef: ForwardedRef<ModalRef>
    ) => {
        const t = useTranslations();
        const root = useFloatingRef();
        const innerContent = useRef<HTMLDivElement>(null);
        const removeScrollRef = useRef<HTMLDivElement>(null);
        const modalId = useId();
        const headingId = useId();
        const descriptionId = useId();
        const resizeDescriptionId = useId();
        const modalType = _type as ModalType;
        const isDesktop = useMediaQuery("(min-width: 64rem)");
        const position = fetchPosition(isDesktop, forceType, modalType, propsPosition);
        const func = isDesktop ? animations[modalType] : forceType ? animations[modalType] : animations.sheet;
        const animation = typeof func === "function" ? func(position as DrawerPosition) : func;
        const type = isDesktop ? modalType : forceType ? modalType : "sheet";
        const useResizer = type !== "dialog";
        const floating = useFloating({ open, onOpenChange: onChange, strategy: "fixed" });
        const click = useClick(floating.context, {});
        const role = useRole(floating.context, { role: modalRole });
        const dismiss = useDismiss(floating.context, {
            bubbles: true,
            escapeKey: true,
            outsidePress: (event) => {
                const target = event.target as Node;
                return overlayClickClose && !!target?.isConnected;
            },
        });

        const interactions = useInteractions([click, dismiss, role].concat(outInteractions));

        const floatingSize = useMotionValue<number | undefined>(undefined);
        const sheetY = useMotionValue<number | undefined>(undefined);
        const isDragging = useRef(false);
        const dragStart = useRef(0);

        useEffect(() => {
            floatingSize.set(undefined);
            sheetY.set(undefined);
        }, [type, floatingSize, sheetY]);

        const onClose = () => onChange(false);

        const setModalRef = useCallback(
            (node: HTMLDivElement | null) => {
                floating.refs.setFloating(node);
                removeScrollRef.current = node;
            },
            [floating.refs]
        );

        useImperativeHandle(externalRef, () => ({ context: floating.context, floating: removeScrollRef.current }), [
            floating.context,
            removeScrollRef,
        ]);

        const onDragHeader = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const div = floating.refs.floating.current as HTMLElement;
            const rect = div.getBoundingClientRect();
            const v = floatingSize.get() || rect.height;
            const result = Math.abs(v - info.delta.y);
            const max = window.outerHeight;
            const screenHeightToClose = calculateClose(max);
            if (result >= screenHeightToClose) return floatingSize.set(result);
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement?.blur();
            }
            onChange?.(false);
            return setTimeout(() => floatingSize.set(undefined), 350);
        };

        const draggableMotionProps =
            type === "sheet"
                ? ({
                      drag: "y",
                      animate: false,
                      dragElastic: 0,
                      initial: false,
                      dragConstraints,
                      draggable: true,
                      dragListener: true,
                      dragMomentum: true,
                      onDrag: onDragHeader,
                      dragPropagation: true,
                      dragSnapToOrigin: true,
                      dragDirectionLock: true,
                      whileDrag: { cursor: "grabbing" },
                  } as const)
                : { animate: animated, initial: false };

        const scrollInitial = useMotionValue<number | undefined>(undefined);
        const scroll = useMotionValue<number | undefined>(undefined);

        return (
            <Fragment>
                {trigger ? (
                    asChild ? (
                        <Slot
                            ref={floating.refs.setReference}
                            {...interactions.getReferenceProps({
                                "aria-controls": open ? modalId : undefined,
                                "aria-expanded": open,
                                "aria-haspopup": "dialog",
                            })}
                        >
                            {trigger}
                        </Slot>
                    ) : (
                        <motion.button
                            ref={floating.refs.setReference}
                            {...interactions.getReferenceProps({
                                "aria-controls": open ? modalId : undefined,
                                "aria-expanded": open,
                                "aria-haspopup": "dialog",
                            })}
                            layoutId={layoutId}
                            type="button"
                        >
                            {trigger}
                        </motion.button>
                    )
                ) : null}
                <MotionConfig reducedMotion={animated ? "user" : "always"}>
                    <FloatingPortal preserveTabOrder root={root}>
                        <AnimatePresence mode="wait" propagate>
                            {open ? (
                                <FloatingOverlay
                                    lockScroll
                                    data-component="overlay"
                                    className={css("__floating-modal__tw-14", type === "drawer" ? "" : "__floating-modal__tw-15", overlayClassName)}
                                >
                                    <FloatingFocusManager
                                        modal
                                        guards
                                        context={floating.context}
                                        initialFocus={initialFocus}
                                        closeOnFocusOut={closeOnFocusOut}
                                    >
                                        <AnimatePresence propagate>
                                            <motion.div
                                                {...props}
                                                {...interactions.getFloatingProps({
                                                    id: modalId,
                                                    "aria-modal": open,
                                                    className: css(variants({ position, type }), className, "__floating-modal__tw-16"),
                                                })}
                                                ref={setModalRef}
                                                {...(title ? { "aria-labelledby": headingId } : { "aria-label": ariaTitle })}
                                                {...(ariaDescription ? { "aria-describedby": descriptionId } : undefined)}
                                                exit="exit"
                                                layout={true}
                                                animate="enter"
                                                initial="initial"
                                                layoutId={layoutId}
                                                variants={animation}
                                                data-component="modal"
                                                style={type === "drawer" ? { width: floatingSize } : { height: floatingSize, y: sheetY }}
                                            >
                                                {useResizer && resizer ? (
                                                    <>
                                                        <span id={resizeDescriptionId} className="__floating-modal__tw-17">
                                                            {t.dialogResizeInstructions}
                                                        </span>
                                                        <Draggable
                                                            onChange={onChange}
                                                            value={floatingSize}
                                                            sheet={type === "sheet"}
                                                            controlsId={modalId}
                                                            instructionsId={resizeDescriptionId}
                                                            position={position as DrawerPosition}
                                                            parent={floating.refs.floating}
                                                        />
                                                    </>
                                                ) : null}
                                                {title ? (
                                                    <motion.header {...draggableMotionProps} className="__floating-modal__tw-18">
                                                        {title ? (
                                                            <h2 id={headingId} className="__floating-modal__tw-19">
                                                                {title}
                                                            </h2>
                                                        ) : null}
                                                    </motion.header>
                                                ) : null}
                                                {ariaDescription ? (
                                                    <span id={descriptionId} className="__floating-modal__tw-17">
                                                        {ariaDescription}
                                                    </span>
                                                ) : null}
                                                <motion.section
                                                    ref={innerContent}
                                                    data-component="modal-body"
                                                    className={css("__floating-modal__tw-20", bodyClassName)}
                                                    onTouchEnd={async () => {
                                                        scroll.set(undefined);
                                                        scrollInitial.set(undefined);

                                                        if (isDragging.current) {
                                                            const currentY = sheetY.get() || 0;
                                                            const threshold = window.innerHeight * 0.2;
                                                            const sheetYNumeric = sheetY as MotionValue<number>;
                                                            if (currentY > threshold) {
                                                                await animate(sheetYNumeric, window.innerHeight, { duration: 0.2, ease: "easeIn" })
                                                                    .finished;
                                                                onChange(false);
                                                            } else {
                                                                animate(sheetYNumeric, 0, {
                                                                    type: "spring",
                                                                    bounce: 0,
                                                                    duration: 0.3,
                                                                });
                                                            }
                                                            isDragging.current = false;
                                                        }
                                                    }}
                                                    onTouchStart={(e: React.TouchEvent<HTMLElement>) => {
                                                        const touch = e.changedTouches[0];
                                                        scrollInitial.set(touch.pageY);
                                                        scroll.set(touch.pageY);
                                                        isDragging.current = false;
                                                    }}
                                                    onTouchMove={(e: React.TouchEvent<HTMLElement>) => {
                                                        const touch = e.changedTouches[0];
                                                        const y = touch.pageY;
                                                        const prevY = scroll.get() || y;
                                                        const scrollTop = innerContent.current?.scrollTop || 0;

                                                        if (!isDragging.current && scrollTop <= 0 && y > prevY && type === "sheet") {
                                                            isDragging.current = true;
                                                            dragStart.current = y;
                                                        }

                                                        if (isDragging.current) {
                                                            const delta = y - dragStart.current;
                                                            if (delta < 0) {
                                                                sheetY.set(delta * 0.2);
                                                            } else {
                                                                sheetY.set(delta);
                                                            }
                                                        }

                                                        scroll.set(y);
                                                    }}
                                                >
                                                    {children}
                                                </motion.section>
                                                {footer ? <footer className="__floating-modal__tw-21">{footer}</footer> : null}
                                                {closable ? (
                                                    <div className="__floating-modal__tw-22">
                                                        <button
                                                            type="button"
                                                            onClick={onClose}
                                                            aria-label={t.closeButton}
                                                            className="__floating-modal__tw-23"
                                                        >
                                                            <XIcon aria-hidden="true" className="__modal__close-icon" />
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </motion.div>
                                        </AnimatePresence>
                                    </FloatingFocusManager>
                                </FloatingOverlay>
                            ) : null}
                        </AnimatePresence>
                    </FloatingPortal>
                </MotionConfig>
            </Fragment>
        );
    }
) as unknown as ModalComponent;

type ButtonConfirmationAction = {
    value?: unknown;
    text?: Label;
    theme?: ButtonProps["theme"];
};

export type ConfirmOptions = {
    title?: Label;
    description?: Label;
    cancel?: ButtonConfirmationAction;
    confirm?: ButtonConfirmationAction;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

let confirmGlobal: ConfirmContextType = async <T,>(_: ConfirmOptions): Promise<T> => {
    if (typeof window !== "undefined") {
        console.warn("ConfirmationProvider is not mounted");
    }
    return false as unknown as T;
};

Modal.confirm = <T,>(options: ConfirmOptions): Promise<T> => confirmGlobal(options) as unknown as Promise<T>;

export const ModalConfirmProvider = ({ children }: { children: React.ReactNode }) => {
    const translations = useTranslations();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<Partial<ConfirmOptions>>({});
    const [resolve, setResolve] = useState<(value: boolean) => void>(() => {});
    const confirmRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (open) confirmRef.current?.focus();
    }, [open]);

    const confirmAction = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions(opts);
        setOpen(true);
        return new Promise((res) => {
            setResolve(() => res);
        });
    }, []);

    useEffect(() => {
        confirmGlobal = confirmAction;
    }, [confirmAction]);

    const onConfirm = () => {
        setOpen(false);
        const value = (options.confirm?.value as boolean) ?? true;
        resolve(value ?? true);
    };

    const onCancel = () => {
        setOpen(false);
        const value = (options.cancel?.value as boolean) ?? false;
        resolve(value ?? false);
    };

    return (
        <ConfirmContext.Provider value={confirmAction}>
            {children}
            <Modal
                open={open}
                type="dialog"
                closable={false}
                forceType
                role="alertdialog"
                onChange={(nextOpen) => (nextOpen ? setOpen(true) : onCancel())}
                ariaDescription={typeof options.description === "string" ? options.description : undefined}
                overlayClickClose={false}
                title={options.title || translations.modalConfirmTitle}
                className="container __floating-modal__tw-24"
                footer={
                    <div className="__floating-modal__tw-25">
                        <Button theme={options.cancel?.theme || "ghost-muted"} onClick={onCancel}>
                            {options.cancel?.text || translations.modalConfirmCancel}
                        </Button>
                        <Button ref={confirmRef} theme={options.confirm?.theme || "primary"} onClick={onConfirm}>
                            {options.confirm?.text || translations.modalConfirmConfirm}
                        </Button>
                    </div>
                }
            >
                <div className="__floating-modal__tw-26">{options.description}</div>
            </Modal>
        </ConfirmContext.Provider>
    );
};
