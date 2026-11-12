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
import { VIEWPORT_PADDING } from "../../../constants";
import { useResizeObserver } from "../../../hooks/use-resize-observer";
import type { TranslationOverrides } from "../../../hooks/use-translations";
import { useTranslations } from "../../../hooks/use-translations";
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
    translations?: TranslationOverrides;
};

const getRect = (element: Element | null) => {
    if (!element) return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };
    return element.getBoundingClientRect();
};

/** Whether the target sits inside the viewport with room around it. A target taller than the viewport only needs its top edge in view. */
const isInView = (rect: DOMRect | ReturnType<typeof getRect>) => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const fitsVertically =
        rect.height > height - VIEWPORT_PADDING * 2
            ? rect.top >= 0 && rect.top < height - VIEWPORT_PADDING
            : rect.top >= VIEWPORT_PADDING && rect.bottom <= height - VIEWPORT_PADDING;
    const fitsHorizontally =
        rect.width > width - VIEWPORT_PADDING * 2
            ? rect.left >= 0 && rect.left < width - VIEWPORT_PADDING
            : rect.left >= VIEWPORT_PADDING && rect.right <= width - VIEWPORT_PADDING;
    return fitsVertically && fitsHorizontally;
};

/** Brings a target that is outside the viewport into view, centered, smoothly unless the person asked for reduced motion. */
const scrollIntoViewIfNeeded = (element: Element) => {
    if (typeof element.scrollIntoView !== "function" || isInView(element.getBoundingClientRect())) return;
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ block: "center", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
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

export const Wizard = ({
    steps,
    active = false,
    onClose = noop,
    onFinish = noop,
    onChange = noop,
    labels: labelsProp,
    translations,
}: WizardProps) => {
    const translation = useTranslations(translations);
    const [index, setIndex] = useState(0);
    const currentStep = steps[index];
    const [element, setElement] = useState<Element | null>(null);
    const [rect, setRect] = useState(getRect(null));
    const [isOverlayReady, setIsOverlayReady] = useState(false);
    const arrowRef = useRef(null);
    const navigationPendingRef = useRef(false);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

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

    // `onEnter` runs once per step, before the target is looked up, so it can open the panel or modal the step points at.
    // The steps array is often rebuilt on every render, so the step object itself cannot be the key.
    const enteredRef = useRef<string | null>(null);

    useEffect(() => {
        if (!active || !currentStep) {
            enteredRef.current = null;
            return;
        }
        const key = `${index}`;
        const hasOnEnter = typeof currentStep.onEnter === "function";
        if (enteredRef.current !== key) {
            enteredRef.current = key;
            currentStep.onEnter?.();
        }

        let cancelled = false;
        let timeout = 0;
        let frame = 0;
        const startedAt = performance.now();
        // A step that opens something (a modal, a panel) needs a moment for the target to mount, so it is looked up again.
        const lookupWindow = hasOnEnter ? 1500 : 0;

        const showMissing = () => {
            refs.setReference(null);
            setElement(null);
            setRect(getRect(null));
            setIsOverlayReady(true);
        };

        // Follows the target for a moment after it appears: a modal or panel is still sliding or scaling in, and that
        // movement fires neither scroll nor resize.
        const follow = (el: Element, until: number) => {
            const tick = () => {
                if (cancelled) return;
                setRect((previous) => {
                    const next = el.getBoundingClientRect();
                    return previous.top === next.top &&
                        previous.left === next.left &&
                        previous.width === next.width &&
                        previous.height === next.height
                        ? previous
                        : next;
                });
                if (performance.now() < until) frame = window.requestAnimationFrame(tick);
            };
            frame = window.requestAnimationFrame(tick);
        };

        const attempt = () => {
            if (cancelled) return;
            const el = resolveElement(currentStep.element);
            if (!el) {
                if (performance.now() - startedAt < lookupWindow) timeout = window.setTimeout(attempt, 50);
                else showMissing();
                return;
            }
            // A step can point at something far down the page or inside a scroller: bring it into view first. The scroll
            // listener below keeps the spotlight and the floating card following it while the page moves.
            scrollIntoViewIfNeeded(el);
            setRect(el.getBoundingClientRect());
            refs.setReference(el);
            setElement(el);
            if (hasOnEnter) follow(el, performance.now() + 700);
        };

        // The first look is immediate when nothing is going to open, so a missing target centers the card right away.
        if (!hasOnEnter && !resolveElement(currentStep.element)) {
            showMissing();
            return () => {
                cancelled = true;
            };
        }
        timeout = window.setTimeout(attempt, 100);
        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
            window.cancelAnimationFrame(frame);
        };
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
    }, [element]);

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
