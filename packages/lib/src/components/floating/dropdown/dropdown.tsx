"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
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
import type React from "react";
import { Fragment, isValidElement, type PropsWithChildren, useId, useMemo, useRef, useState } from "react";
import { VIEWPORT_PADDING } from "../../../constants";
import { css } from "../../../lib/dom";
import { placementOrigin } from "../../../lib/floating-origin";
import { Slot } from "../../core/slot/slot";
import { dropdownStyles } from "./dropdown.styles";

type DropdownProps = {
    /** Use the `trigger` element itself as the trigger instead of wrapping it in a `<button>`. Pass an interactive element, such as a `Button`, only with this prop. */
    asChild?: boolean;
    open?: boolean;
    /** Draw the arrow that points at the trigger. @default true */
    arrow?: boolean;
    /** Side of the trigger where the panel opens. @default "bottom" */
    side?: "top" | "right" | "bottom" | "left";
    /** Alignment of the panel along the trigger edge. @default "center" */
    align?: "start" | "center" | "end";
    /** Gap in pixels between the trigger and the panel. @default 10 */
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

const updatePositionOnce: typeof autoUpdate = (_reference, _floating, update) => {
    void update();
    return () => undefined;
};

export const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
    const headingId = useId();
    const hasTitle = typeof props.title === "string" ? props.title.trim().length > 0 : typeof props.title === "number" || Boolean(props.title);
    const isControlled = props.open !== undefined;
    const [innerOpen, setInnerOpen] = useState(false);
    const open = isControlled ? props.open : innerOpen;
    const arrowRef = useRef(null);
    const showArrow = props.arrow ?? true;
    const gap = props.offset ?? 10;
    const align = props.align ?? "center";
    const placement: Placement = align === "center" ? (props.side ?? "bottom") : `${props.side ?? "bottom"}-${align}`;
    const middleware = useMemo(
        () => [
            offset(gap),
            flip({ fallbackAxisSideDirection: "end" }),
            shift({ padding: VIEWPORT_PADDING }),
            ...(showArrow ? [arrow({ padding: 5, element: arrowRef })] : []),
        ],
        [gap, showArrow]
    );
    const { refs, floatingStyles, context } = useFloating({
        open,
        placement,
        middleware,
        // Position with top/left so the CSS enter animation can use the `scale` property.
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
            {open && (
                <FloatingPortal preserveTabOrder id={`${headingId}-portal`}>
                    <FloatingFocusManager
                        guards
                        restoreFocus={props.restoreFocus ?? true}
                        returnFocus={props.returnFocus ?? true}
                        initialFocus={props.initialFocus}
                        visuallyHiddenDismiss
                        context={context}
                        modal={false}
                    >
                        <div
                            className={css(dropdownStyles.className({}), props.className)}
                            ref={refs.setFloating}
                            {...getFloatingProps()}
                            aria-label={hasTitle ? undefined : props["aria-label"]}
                            aria-labelledby={hasTitle ? headingId : props["aria-labelledby"]}
                            style={{ ...(floatingStyles as unknown as React.CSSProperties), transformOrigin: placementOrigin(context.placement) }}
                        >
                            {showArrow && <FloatingArrow ref={arrowRef} context={context} strokeWidth={0.1} className={dropdownStyles.slots.arrow} />}
                            {hasTitle && (
                                <header className={dropdownStyles.slots.header}>
                                    <h3 id={headingId} className={dropdownStyles.slots.title}>
                                        {props.title}
                                    </h3>
                                </header>
                            )}
                            {props.children}
                        </div>
                    </FloatingFocusManager>
                </FloatingPortal>
            )}
        </Fragment>
    );
};
