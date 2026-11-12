"use client";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    type Placement,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useHover,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { AnimatePresence, motion, MotionConfig, useIsPresent } from "motion/react";
import type React from "react";
import { Fragment, isValidElement, type PropsWithChildren, useId, useMemo, useState } from "react";
import { VIEWPORT_PADDING } from "../../../constants";
import { css } from "../../../lib/dom";
import { placementOrigin } from "../../../lib/floating-origin";
import { floatingVariants } from "../../../lib/motion";
import { Slot } from "../../core/slot/slot";
import { dropdownStyles } from "./dropdown.styles";

type DropdownProps = {
    /** Use the `trigger` element itself as the trigger instead of wrapping it in a `<button>`. Pass an interactive element, such as a `Button`, only with this prop. */
    asChild?: boolean;
    open?: boolean;
    /** Side of the trigger where the panel opens. @default "bottom" */
    side?: "top" | "right" | "bottom" | "left";
    /** Alignment of the panel along the trigger edge. @default "center" */
    align?: "start" | "center" | "end";
    /** Gap in pixels between the trigger and the panel. @default 8 */
    offset?: number;
    /**
     * Class names merged on the panel root. Use them for width and layout (`w-72`, `w-auto`).
     * The design system CSS has no `@layer`, so it wins over utility classes: set padding and radius
     * with `--var-dropdown-surface-padding` and `--var-dropdown-surface-radius`, not with `p-*` or `rounded-*`.
     */
    className?: string;
    /** Element, or tabbable index, that receives focus when the panel opens. @default 0 */
    initialFocus?: React.ComponentProps<typeof FloatingFocusManager>["initialFocus"];
    lockPositionOnOpen?: boolean;
    hover?: boolean;
    returnFocus?: boolean;
    restoreFocus?: boolean;
    buttonProps?: React.HTMLProps<"button">;
    onChange?: (nextValue: boolean) => void;
    trigger: React.ReactElement | React.ReactNode;
    title?: React.ReactNode | React.ReactElement | string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
};

const dropdownVariants = floatingVariants({ distance: 6, enterScale: 0.96, exitScale: 0.97, enter: 0.2, exit: 0.14 });

const updatePositionOnce: typeof autoUpdate = (_reference, _floating, update) => {
    void update();
    return () => undefined;
};

type DropdownPanelProps = React.ComponentProps<typeof motion.div> & { placement: Placement; positioned: boolean };

/** The animated panel. While it leaves it ignores the pointer, so a closing panel cannot be clicked. */
const DropdownPanel = ({ placement, positioned, style, ref, ...props }: DropdownPanelProps) => {
    const present = useIsPresent();
    return (
        <motion.div
            {...props}
            ref={ref}
            custom={placement}
            variants={dropdownVariants}
            initial="initial"
            animate={positioned ? "open" : "initial"}
            exit="exit"
            style={{ ...style, pointerEvents: present ? undefined : "none" }}
        />
    );
};

export const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
    const headingId = useId();
    const hasTitle = typeof props.title === "string" ? props.title.trim().length > 0 : typeof props.title === "number" || Boolean(props.title);
    const isControlled = props.open !== undefined;
    const [innerOpen, setInnerOpen] = useState(false);
    const open = isControlled ? props.open : innerOpen;
    const gap = props.offset ?? 8;
    const align = props.align ?? "center";
    const placement: Placement = align === "center" ? (props.side ?? "bottom") : `${props.side ?? "bottom"}-${align}`;
    const middleware = useMemo(() => [offset(gap), flip({ fallbackAxisSideDirection: "end" }), shift({ padding: VIEWPORT_PADDING })], [gap]);
    const { refs, floatingStyles, context, isPositioned } = useFloating({
        open,
        placement,
        middleware,
        // Position with top/left: Motion owns `transform` for the enter and exit animation.
        transform: false,
        whileElementsMounted: props.lockPositionOnOpen ? updatePositionOnce : autoUpdate,
        onOpenChange: (nextValue, event) => {
            const element = (event as FocusEvent | undefined)?.relatedTarget as HTMLElement | null;
            if (element) {
                if (element.dataset.floating === "true" && !nextValue) return;
            }
            if (!isControlled) setInnerOpen(nextValue);
            props.onChange?.(nextValue);
        },
    });

    const click = useClick(context);
    const hover = useHover(context, { enabled: props.hover ?? false });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "dialog" });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role, hover]);

    const referenceProps = getReferenceProps(props.buttonProps as Parameters<typeof getReferenceProps>[0]);

    return (
        <Fragment>
            {props.asChild && isValidElement(props.trigger) ? (
                <Slot ref={refs.setReference as React.Ref<HTMLElement>} {...referenceProps}>
                    {props.trigger}
                </Slot>
            ) : (
                <button ref={refs.setReference} {...(referenceProps as React.HTMLProps<HTMLButtonElement>)} type="button">
                    {props.trigger}
                </button>
            )}
            <AnimatePresence>
                {open && (
                    <FloatingPortal key="dropdown" preserveTabOrder id={`${headingId}-portal`}>
                        <FloatingFocusManager
                            guards
                            restoreFocus={props.restoreFocus ?? true}
                            returnFocus={props.returnFocus ?? true}
                            initialFocus={props.initialFocus}
                            visuallyHiddenDismiss
                            context={context}
                            modal={false}
                        >
                            <MotionConfig reducedMotion="user">
                                <DropdownPanel
                                    {...getFloatingProps()}
                                    className={css(dropdownStyles.className({}), props.className)}
                                    ref={refs.setFloating}
                                    aria-label={hasTitle ? undefined : props["aria-label"]}
                                    aria-labelledby={hasTitle ? headingId : props["aria-labelledby"]}
                                    placement={context.placement}
                                    positioned={isPositioned}
                                    style={{
                                        ...(floatingStyles as unknown as React.CSSProperties),
                                        transformOrigin: placementOrigin(context.placement),
                                    }}
                                >
                                    {hasTitle && (
                                        <header className={dropdownStyles.slots.header}>
                                            <h3 id={headingId} className={dropdownStyles.slots.title}>
                                                {props.title}
                                            </h3>
                                        </header>
                                    )}
                                    {props.children}
                                </DropdownPanel>
                            </MotionConfig>
                        </FloatingFocusManager>
                    </FloatingPortal>
                )}
            </AnimatePresence>
        </Fragment>
    );
};
