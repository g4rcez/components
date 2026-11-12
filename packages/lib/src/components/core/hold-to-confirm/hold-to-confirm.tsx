"use client";
import { TrashIcon } from "@phosphor-icons/react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from "react";
import { useMorphWidth } from "../../../hooks/use-morph-width";
import { useTranslations, type TranslationOverrides } from "../../../hooks/use-translations";
import { css, mergeRefs } from "../../../lib/dom";
import { SETTLE_SPRING, vibrate } from "../../../lib/motion";
import { holdToConfirmStyles, type HoldToConfirmStyleProps } from "./hold-to-confirm.styles";

/** How far outside the button the pointer may drift before the hold is cancelled. */
const SLIDE_TOLERANCE = 24;
const HOLD_KEYS = new Set([" ", "Enter"]);

export type HoldToConfirmProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> &
    HoldToConfirmStyleProps & {
        /** Instruction shown on the button, e.g. "Hold to delete branch". */
        label: string;
        /** Called once when the hold completes. */
        onConfirm: () => void;
        /** Label shown after completion. */
        confirmedLabel?: string;
        /** Hold length in milliseconds. */
        duration?: number;
        /** Leading icon. Replaced by a check once confirmed. */
        icon?: ReactNode;
        /** Controls the done state. Pass `false` to reset, leave `undefined` to let the component manage it. */
        confirmed?: boolean;
        /** Reports when a hold starts and ends, e.g. to show a nearby hint. */
        onHoldChange?: (holding: boolean) => void;
        translations?: TranslationOverrides;
    };

/** A check that draws itself in. */
const DrawnCheck = ({ instant }: { instant: boolean }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={instant ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1], delay: 0.03 }}
        />
    </svg>
);

type ContentProps = {
    icon: ReactNode;
    label: string;
    done: boolean;
    instant: boolean;
    className?: string;
    contentRef?: (element: HTMLSpanElement | null) => void;
};

const Content = ({ icon, label, done, instant, className, contentRef }: ContentProps) => {
    const first = useRef(true);
    useEffect(() => {
        first.current = false;
    }, []);
    return (
        <span ref={contentRef} className={className}>
            <span className={holdToConfirmStyles.slots.icon}>{done ? <DrawnCheck instant={instant} /> : icon}</span>
            <motion.span
                key={label}
                className={holdToConfirmStyles.slots.label}
                initial={first.current ? false : instant ? { opacity: 0 } : { opacity: 0, y: 3 }}
                animate={instant ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: instant ? 0.1 : 0.14, ease: [0.23, 1, 0.32, 1] }}
            >
                {label}
            </motion.span>
        </span>
    );
};

/**
 * A button that runs its action only after being held down, for destructive or hard-to-undo actions
 * whose consequence is already visible on screen.
 *
 * @example
 * ```tsx
 * <HoldToConfirm label="Hold to delete branch" onConfirm={() => remove(branch.name)} />
 * ```
 */
export const HoldToConfirm = forwardRef<HTMLButtonElement, HoldToConfirmProps>(function HoldToConfirm(
    {
        label,
        tone,
        icon,
        onConfirm,
        confirmed,
        className,
        disabled,
        duration = 1200,
        onHoldChange,
        translations,
        confirmedLabel,
        onBlur,
        onKeyUp,
        onKeyDown,
        onPointerUp,
        onPointerMove,
        onPointerDown,
        onPointerCancel,
        onContextMenu,
        onLostPointerCapture,
        ...props
    },
    forwardedRef
) {
    const t = useTranslations(translations);
    const reduce = useMotionPreference();
    const hintId = useId();
    const doneLabel = confirmedLabel ?? t.holdToConfirmDone;

    const [internalDone, setInternalDone] = useState(false);
    const [completions, setCompletions] = useState(0);
    const [holding, setHolding] = useState(false);
    const done = confirmed ?? internalDone;

    const progress = useMotionValue(done ? 1 : 0);
    const clip = useTransform(progress, (value) => `inset(0 ${(1 - value) * 100}% 0 0)`);
    const { width, measure } = useMorphWidth(reduce);

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const holdingRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fillRef = useRef<AnimationPlaybackControls | null>(null);
    const latest = useRef({ onConfirm, onHoldChange, duration, done, confirmed, reduce });
    latest.current = { onConfirm, onHoldChange, duration, done, confirmed, reduce };

    const rewind = useCallback(() => {
        fillRef.current?.stop();
        if (latest.current.reduce) {
            progress.jump(0);
            return;
        }
        // Start the rewind from rest, so a released fill never drifts forward first.
        fillRef.current = animate(progress, 0, { ...SETTLE_SPRING, velocity: 0 });
    }, [progress]);

    const clearTimer = useCallback(() => {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    const complete = useCallback(() => {
        clearTimer();
        fillRef.current?.stop();
        progress.jump(1);
        holdingRef.current = false;
        setHolding(false);
        const { onConfirm: confirm, onHoldChange: holdChange, confirmed: controlled } = latest.current;
        if (controlled === undefined) setInternalDone(true);
        setCompletions((count) => count + 1);
        holdChange?.(false);
        vibrate(10);
        confirm();
    }, [clearTimer, progress]);

    const begin = useCallback(() => {
        const { done: isDone, duration: length, onHoldChange: holdChange } = latest.current;
        if (holdingRef.current || isDone) return;
        holdingRef.current = true;
        holdChange?.(true);
        setHolding(true);
        fillRef.current?.stop();
        const remaining = Math.max(0, (1 - progress.get()) * length);
        fillRef.current = animate(progress, 1, { duration: remaining / 1000, ease: "linear" });
        timerRef.current = setTimeout(complete, remaining);
    }, [complete, progress]);

    const end = useCallback(() => {
        if (!holdingRef.current) return;
        holdingRef.current = false;
        clearTimer();
        setHolding(false);
        latest.current.onHoldChange?.(false);
        rewind();
    }, [clearTimer, rewind]);

    useEffect(() => {
        if (done || holdingRef.current) return;
        if (progress.get() > 0) rewind();
    }, [done, completions, progress, rewind]);

    useEffect(
        () => () => {
            clearTimer();
            fillRef.current?.stop();
        },
        [clearTimer]
    );

    const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || disabled || (event.pointerType === "mouse" && event.button !== 0)) return;
        try {
            event.currentTarget.setPointerCapture?.(event.pointerId);
        } catch {
            /* capture is an enhancement */
        }
        begin();
    };

    const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
        onPointerMove?.(event);
        if (!holdingRef.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const outside =
            event.clientX < rect.left - SLIDE_TOLERANCE ||
            event.clientX > rect.right + SLIDE_TOLERANCE ||
            event.clientY < rect.top - SLIDE_TOLERANCE ||
            event.clientY > rect.bottom + SLIDE_TOLERANCE;
        if (outside) end();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !HOLD_KEYS.has(event.key)) return;
        event.preventDefault();
        if (!event.repeat && !disabled) begin();
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyUp?.(event);
        if (!HOLD_KEYS.has(event.key)) return;
        event.preventDefault();
        end();
    };

    const seconds = Math.round(duration / 100) / 10;
    const leading = icon ?? <TrashIcon aria-hidden weight="bold" />;

    return (
        <>
            <motion.button
                {...(props as object)}
                type="button"
                ref={mergeRefs(buttonRef, forwardedRef)}
                disabled={disabled}
                aria-disabled={done || undefined}
                aria-describedby={[hintId, props["aria-describedby"]].filter(Boolean).join(" ")}
                data-component="hold-to-confirm"
                data-holding={holding ? "true" : undefined}
                data-confirmed={done ? "true" : undefined}
                className={css(holdToConfirmStyles.className({ tone }), className)}
                style={{ ...props.style, width }}
                onBlur={(event) => {
                    onBlur?.(event);
                    end();
                }}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={(event) => {
                    onPointerUp?.(event);
                    end();
                }}
                onPointerCancel={(event) => {
                    onPointerCancel?.(event);
                    end();
                }}
                onLostPointerCapture={(event) => {
                    onLostPointerCapture?.(event);
                    end();
                }}
                onContextMenu={(event) => {
                    onContextMenu?.(event);
                    event.preventDefault();
                }}
            >
                <motion.span aria-hidden className={holdToConfirmStyles.slots.fill} style={{ scaleX: progress }} />
                <Content
                    done={done}
                    instant={reduce}
                    icon={leading}
                    contentRef={measure}
                    label={done ? doneLabel : label}
                    className={holdToConfirmStyles.slots.content}
                />
                <motion.span
                    aria-hidden
                    className={css(holdToConfirmStyles.slots.content, holdToConfirmStyles.slots.overlay)}
                    style={{ clipPath: clip }}
                >
                    <span className={holdToConfirmStyles.slots.icon}>{done ? <DrawnCheck instant /> : leading}</span>
                    <span className={holdToConfirmStyles.slots.label}>{done ? doneLabel : label}</span>
                </motion.span>
            </motion.button>
            <span id={hintId} className={holdToConfirmStyles.slots.hint}>
                {t.holdToConfirmHint(seconds)}
            </span>
            <span role="status" aria-live="polite" className={holdToConfirmStyles.slots.status}>
                {done ? doneLabel : ""}
            </span>
        </>
    );
});
HoldToConfirm.displayName = "HoldToConfirm";
