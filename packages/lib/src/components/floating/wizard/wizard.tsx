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
import { type CSSProperties, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
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
    const { width, height } = useWindowSize();

    const labels = {
        next: labelsProp?.next ?? translation.wizardNext,
        previous: labelsProp?.previous ?? translation.wizardPrev,
        finish: labelsProp?.finish ?? translation.wizardFinish,
        skip: labelsProp?.skip ?? translation.wizardSkip,
    };

    const { refs, floatingStyles, context } = useFloating({
        open: active && isOverlayReady,
        placement: currentStep?.side || "bottom",
        whileElementsMounted: autoUpdate,
        middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    });

    const { getFloatingProps } = useInteractions([useRole(context)]);

    useEffect(() => {
        if (active) {
            setIndex(0);
        }
    }, [active]);

    useEffect(() => {
        if (!active) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            onClose();
        };
        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [active, onClose]);

    useEffect(() => {
        setIsOverlayReady(false);
    }, [index, active]);

    useEffect(() => {
        if (!active || !currentStep) return;
        const el = resolveElement(currentStep.element);
        if (el) {
            currentStep.onEnter?.();
            setTimeout(() => {
                setRect(el.getBoundingClientRect());
                refs.setReference(el);
                setElement(el);
            }, 100);
        } else {
            console.warn(`Driver: Element not found:`, currentStep.element);
            setElement(null);
            setRect({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 });
        }
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

    const handleNext = () => {
        currentStep.onNext?.();
        setTimeout(() => {
            if (index < steps.length - 1) {
                setIndex((i) => i + 1);
                onChange(index + 1);
            } else {
                onFinish();
                onClose();
            }
        }, 0);
    };

    const handlePrevious = () => {
        currentStep.onPrevious?.();
        if (index > 0) {
            setIndex((i) => i - 1);
            onChange(index - 1);
        }
    };

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
                                transition={{
                                    type: "spring",
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                animate={{
                                    x: rect.left - 5,
                                    y: rect.top - 5,
                                    width: rect.width + 10,
                                    height: rect.height + 10,
                                }}
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
                            className={wizardStyles.slots.floating}
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
                                        <Button size="small" onClick={handleNext}>
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
