"use client";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    FloatingPortal,
    offset,
    type Placement,
    shift,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { type CSSProperties, Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useResizeObserver } from "../../../hooks/use-resize-observer";
import { useTranslations } from "../../../hooks/use-translations";
import { useWindowSize } from "../../../hooks/use-window-size";
import { noop } from "../../../lib/fns";
import { Button } from "../../core/button/button";
import { wizardStyles } from "./wizard.styles";

export type WizardStep = {
    side?: Placement;
    onNext?: () => void;
    onEnter?: () => void;
    onPrevious?: () => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    element: string | Element | React.RefObject<Element | null>;
};

export type WizardProps = {
    active?: boolean;
    steps: WizardStep[];
    onClose?: () => void;
    onFinish?: () => void;
    onChange?: (index: number) => void;
    labels?: { next?: string; skip?: string; finish?: string; previous?: string };
};

const getRect = (element: Element | null) => {
    if (!element) return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };
    return element.getBoundingClientRect();
};

const resolveElement = (element: WizardStep["element"]): Element | null => {
    if (typeof element === "string") {
        return document.querySelector(element);
    }
    if ("current" in element) {
        return element.current;
    }
    return element;
};

export const Wizard = ({ steps, active = false, onClose = noop, onFinish = noop, onChange = noop, labels: labelsProp }: WizardProps) => {
    const translation = useTranslations();
    const [index, setIndex] = useState(0);
    const currentStep = steps[index];
    const [element, setElement] = useState<Element | null>(null);
    const [rect, setRect] = useState(getRect(null));
    const [isOverlayReady, setIsOverlayReady] = useState(false);
    const arrowRef = useRef(null);
    const navigationPendingRef = useRef(false);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const { width, height } = useWindowSize();

    const labels = {
        next: labelsProp?.next ?? translation.wizardNext,
        skip: labelsProp?.skip ?? translation.wizardSkip,
        finish: labelsProp?.finish ?? translation.wizardFinish,
        previous: labelsProp?.previous ?? translation.wizardPrev,
    };

    const { refs, floatingStyles, context } = useFloating({
        open: active && isOverlayReady,
        whileElementsMounted: autoUpdate,
        placement: currentStep?.side || "bottom",
        middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    });

    const { getFloatingProps } = useInteractions([useRole(context)]);

    useEffect(() => {
        setIndex(0);
    }, [active]);

    useEffect(() => {
        setIsOverlayReady(false);
    }, [index, active]);

    useEffect(() => {
        if (!active || !currentStep) return;
        const el = resolveElement(currentStep.element);
        if (!el) {
            refs.setReference(null);
            setElement(null);
            setRect(getRect(null));
            setIsOverlayReady(true);
            return;
        }

        currentStep.onEnter?.();
        const timeout = window.setTimeout(() => {
            setRect(el.getBoundingClientRect());
            refs.setReference(el);
            setElement(el);
        }, 100);
        return () => window.clearTimeout(timeout);
    }, [index, active, currentStep, refs]);

    useLayoutEffect(() => {
        if (!element) return;
        const update = () => setRect(element.getBoundingClientRect());
        update();
        window.addEventListener("scroll", update, { capture: true, passive: true });
        window.addEventListener("resize", update, { capture: true, passive: true });
        return () => {
            window.removeEventListener("scroll", update, { capture: true });
            window.removeEventListener("resize", update, { capture: true });
        };
    }, [element, width, height]);

    useResizeObserver(element as HTMLElement, (entry) => {
        setRect(entry.target.getBoundingClientRect());
    });

    const handleNext = useCallback(() => {
        if (navigationPendingRef.current) return;
        navigationPendingRef.current = true;
        currentStep.onNext?.();
        window.setTimeout(() => {
            if (index < steps.length - 1) {
                setIndex((i) => i + 1);
                onChange(index + 1);
            } else {
                onFinish();
                onClose();
            }
            navigationPendingRef.current = false;
        }, 0);
    }, [currentStep, index, onChange, onClose, onFinish, steps.length]);

    const handlePrevious = useCallback(() => {
        if (index === 0) return;
        currentStep.onPrevious?.();
        setIndex((i) => i - 1);
        onChange(index - 1);
    }, [currentStep, index, onChange]);

    useEffect(() => {
        if (!active) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;
            const target = event.target;
            if (target instanceof HTMLElement && (target.isContentEditable || target.matches("input, textarea, select, [role='textbox']"))) {
                return;
            }
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                handleNext();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                handlePrevious();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [active, handleNext, handlePrevious, onClose]);

    useEffect(() => {
        if (active && isOverlayReady) nextButtonRef.current?.focus();
    }, [active, index, isOverlayReady]);

    if (!active) return null;

    const hasNext = index < steps.length - 1;
    const hasPrevious = index > 0;

    return (
        <FloatingPortal>
            <div className={wizardStyles.className({})}>
                <svg className={wizardStyles.slots.overlay} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <mask id="driver-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <motion.rect
                                rx="4"
                                fill="black"
                                initial={false}
                                onAnimationComplete={() => setIsOverlayReady(true)}
                                transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
                                animate={{ x: rect.left - 5, y: rect.top - 5, width: rect.width + 10, height: rect.height + 10 }}
                            />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" mask="url(#driver-mask)" className={wizardStyles.slots.spotlight} />
                </svg>
                <AnimatePresence mode="wait">
                    {currentStep && isOverlayReady && (
                        <div
                            {...getFloatingProps()}
                            ref={refs.setFloating}
                            className={wizardStyles.slots.floating}
                            style={
                                element
                                    ? (floatingStyles as CSSProperties)
                                    : {
                                          position: "fixed",
                                          top: "50%",
                                          left: "50%",
                                          transform: "translate(-50%, -50%)",
                                      }
                            }
                        >
                            <motion.div
                                transition={{ duration: 0.2 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                className={wizardStyles.slots.surface}
                            >
                                {element && <FloatingArrow ref={arrowRef} context={context} className={wizardStyles.slots.arrow} />}
                                {currentStep.title && <h3>{currentStep.title}</h3>}
                                {currentStep.description && <Fragment>{currentStep.description}</Fragment>}
                                <div className={wizardStyles.slots.footer}>
                                    <Button theme="raw" size="small" onClick={onClose} className={wizardStyles.slots["skip-button"]}>
                                        {labels.skip}
                                    </Button>
                                    <div className={wizardStyles.slots.actions}>
                                        {hasPrevious && (
                                            <Button size="small" theme="ghost-muted" onClick={handlePrevious}>
                                                {labels.previous}
                                            </Button>
                                        )}
                                        <Button ref={nextButtonRef} size="small" onClick={handleNext}>
                                            {hasNext ? labels.next : labels.finish}
                                        </Button>
                                    </div>
                                </div>
                                <div className={wizardStyles.slots.counter}>
                                    {index + 1} / {steps.length}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </FloatingPortal>
    );
};
