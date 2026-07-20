"use client";
import {
    type ElementProps,
    type FloatingContext,
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
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
} from "motion/react";
import React, {
    type ForwardedRef,
    forwardRef,
    Fragment,
    type PropsWithChildren,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useFloatingRef } from "../../../hooks/use-floating-ref";
import { useMediaQuery } from "../../../hooks/use-media-query";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { Label, Nil, Override } from "../../../types";
import { Button, type ButtonProps } from "../../core/button/button";
import { Slot } from "../../core/slot/slot";
import { modalStyles } from "./modal.styles";

const MotionFloatingOverlay = motion.create(FloatingOverlay);

type AnimationLabels = "initial" | "enter" | "exit";

const ConfirmContext = React.createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

export const useConfirm = () => React.useContext(ConfirmContext);

export type ModalType = "dialog" | "drawer" | "sheet";

export type DrawerPosition = "left" | "right";

type ModalAnimation = Record<AnimationLabels, TargetAndTransition>;

type Animations = {
    sheet: ModalAnimation;
    dialog: ModalAnimation;
    drawer: (type: DrawerPosition) => ModalAnimation;
};

const modalEaseOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

const overlayAnimation: ModalAnimation = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.18, ease: modalEaseOut } },
    exit: { opacity: 0, transition: { duration: 0.14, ease: modalEaseOut } },
};

const drawerAnimation = (closedTransform: string, transformOrigin: string): ModalAnimation => ({
    initial: {
        opacity: 0.96,
        transform: closedTransform,
        transformOrigin,
    },
    enter: {
        opacity: 1,
        transform: "translate3d(0, 0, 0)",
        transformOrigin,
        transition: { duration: 0.26, ease: modalEaseOut },
    },
    exit: {
        opacity: 0.96,
        transform: closedTransform,
        transformOrigin,
        transition: { duration: 0.18, ease: modalEaseOut },
    },
});

const drawerLeft = drawerAnimation("translate3d(-100%, 0, 0)", "left center");
const drawerRight = drawerAnimation("translate3d(100%, 0, 0)", "right center");

const animations: Animations = {
    drawer: (type) => (type === "left" ? drawerLeft : drawerRight),
    sheet: {
        initial: {
            opacity: 1,
            y: "100%",
            transformOrigin: "bottom center",
        },
        enter: {
            opacity: 1,
            y: "0%",
            transformOrigin: "bottom center",
            transition: { type: "spring", duration: 0.34, bounce: 0.08 },
        },
        exit: {
            opacity: 1,
            y: "100%",
            transformOrigin: "bottom center",
            transition: { duration: 0.2, ease: modalEaseOut },
        },
    },
    dialog: {
        initial: {
            opacity: 0,
            transform: "translate3d(0, 8px, 0) scale(0.96)",
            transformOrigin: "center",
        },
        enter: {
            opacity: 1,
            transform: "translate3d(0, 0, 0) scale(1)",
            transformOrigin: "center",
            transition: { type: "spring", duration: 0.28, bounce: 0.08 },
        },
        exit: {
            opacity: 0,
            transform: "translate3d(0, 4px, 0) scale(0.98)",
            transformOrigin: "center",
            transition: { duration: 0.16, ease: modalEaseOut },
        },
    },
};

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
const modalMaxViewportRatio = 0.9;

const calculateClose = (n: number) => n * 0.6;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getViewportSize = (axis: "inline" | "block", fallback: number) => {
    const viewport = axis === "inline" ? window.innerWidth : window.innerHeight;
    const documentSize = axis === "inline" ? document.documentElement.clientWidth : document.documentElement.clientHeight;
    return viewport || documentSize || fallback;
};

const getModalMaxSize = (axis: "inline" | "block", fallback: number) => getViewportSize(axis, fallback) * modalMaxViewportRatio;

const Draggable = (props: DraggableProps) => {
    const translations = useTranslations();

    const getKeyboardResize = (delta: number) => {
        const element = props.parent.current;
        if (!element) return undefined;

        const rect = element.getBoundingClientRect();
        const current = props.value.get() || (props.sheet ? rect.height : rect.width);

        if (props.sheet) {
            const max = getModalMaxSize("block", rect.height || current);
            return clamp(current + delta, calculateClose(max), max);
        }

        const max = getModalMaxSize("inline", rect.width || current);
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
                const max = getModalMaxSize("block", rect.height || v);
                const screenHeightToClose = calculateClose(max);
                if (result >= screenHeightToClose) return props.value.set(clamp(result, screenHeightToClose, max));
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement?.blur();
                }
                props.onChange(false);
                return setTimeout(() => props.value.set(undefined), 350);
            }
            const div = props.parent.current as HTMLElement;
            const v = props.value.get() || div.getBoundingClientRect().width;
            const delta = props.position === "right" ? -info.delta.x : info.delta.x;
            const max = getModalMaxSize("inline", div.getBoundingClientRect().width || v);
            const value = Math.abs(v + delta);
            return props.value.set(clamp(value, 0, max));
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
                modalStyles.slots.resizer,
                props.sheet ? `${modalStyles.slots.resizer}--sheet` : `${modalStyles.slots.resizer}--drawer`,
                props.sheet
                    ? `${modalStyles.slots.resizer}--sheet-handle`
                    : props.position === "left"
                      ? `${modalStyles.slots.resizer}--drawer-right`
                      : `${modalStyles.slots.resizer}--drawer-left`
            )}
        >
            {props.sheet ? <div className={modalStyles.slots["sheet-pill"]} /> : null}
        </motion.button>
    );
};

const positions = { drawer: "right", sheet: "none", dialog: "none" } as const;

const fetchPosition = (isDesktop: Nil<boolean>, forceType: Nil<boolean>, propsType: Nil<ModalType>, propsPosition: Nil<DrawerPosition>) => {
    const type = propsType || "dialog";
    if (propsType === "drawer" && (isDesktop || forceType)) return propsPosition ?? positions.drawer;
    if (isDesktop) return positions[type];
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
        const floating = useFloating({
            open,
            onOpenChange: onChange,
            strategy: "fixed",
        });
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

        useEffect(() => {
            floatingSize.set(undefined);
        }, [type, floatingSize]);

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
                                <MotionFloatingOverlay
                                    lockScroll
                                    exit="exit"
                                    animate="enter"
                                    initial="initial"
                                    variants={overlayAnimation}
                                    data-component="overlay"
                                    className={css(
                                        modalStyles.slots.overlay,
                                        type === "drawer" ? "" : `${modalStyles.slots.overlay}--centered`,
                                        overlayClassName
                                    )}
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
                                                    className: css(
                                                        modalStyles.className({ position, type }),
                                                        type === "dialog" ? "container" : undefined,
                                                        className,
                                                        modalStyles.slots.content
                                                    ),
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
                                                style={
                                                    type === "drawer"
                                                        ? { width: floatingSize }
                                                        : type === "sheet"
                                                          ? { height: floatingSize }
                                                          : undefined
                                                }
                                            >
                                                {useResizer && resizer ? (
                                                    <>
                                                        <span id={resizeDescriptionId} className={modalStyles.slots["sr-description"]}>
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
                                                    <motion.header {...draggableMotionProps} className={modalStyles.slots.header}>
                                                        {title ? (
                                                            <h2 id={headingId} className={modalStyles.slots.title}>
                                                                {title}
                                                            </h2>
                                                        ) : null}
                                                    </motion.header>
                                                ) : null}
                                                {ariaDescription ? (
                                                    <span id={descriptionId} className={modalStyles.slots["sr-description"]}>
                                                        {ariaDescription}
                                                    </span>
                                                ) : null}
                                                <motion.section data-component="modal-body" className={css(modalStyles.slots.body, bodyClassName)}>
                                                    {children}
                                                </motion.section>
                                                {footer ? <footer className={modalStyles.slots.footer}>{footer}</footer> : null}
                                                {closable ? (
                                                    <div className={modalStyles.slots["close-control"]}>
                                                        <button
                                                            type="button"
                                                            onClick={onClose}
                                                            aria-label={t.closeButton}
                                                            className={modalStyles.slots["close-button"]}
                                                        >
                                                            <XIcon aria-hidden="true" className={modalStyles.slots["close-icon"]} />
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </motion.div>
                                        </AnimatePresence>
                                    </FloatingFocusManager>
                                </MotionFloatingOverlay>
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
                className={css("container", modalStyles.slots["confirm-dialog"])}
                footer={
                    <div className={modalStyles.slots["confirm-actions"]}>
                        <Button theme={options.cancel?.theme || "ghost-muted"} onClick={onCancel}>
                            {options.cancel?.text || translations.modalConfirmCancel}
                        </Button>
                        <Button ref={confirmRef} theme={options.confirm?.theme || "primary"} onClick={onConfirm}>
                            {options.confirm?.text || translations.modalConfirmConfirm}
                        </Button>
                    </div>
                }
            >
                <div className={modalStyles.slots["confirm-description"]}>{options.description}</div>
            </Modal>
        </ConfirmContext.Provider>
    );
};
