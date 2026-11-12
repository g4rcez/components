"use client";
import { AnimatePresence, motion } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import { forwardRef, useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useControllableState } from "../../../hooks/use-controllable-state";
import { useMorphWidth } from "../../../hooks/use-morph-width";
import { useTranslations, type TranslationOverrides } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import { spinnerStyles } from "../../display/spinner/spinner.styles";
import { RollingText } from "../rolling-text/rolling-text";
import { actionSwapStyles, type ActionSwapStyleProps } from "./action-swap.styles";

export type ActionSwapTone = "neutral" | "primary" | "success" | "warn" | "danger" | "quiet";

export type ActionSwapState = {
    /** Stable identifier, used as the value. */
    id: string;
    label: string;
    icon?: ReactNode;
    tone?: ActionSwapTone;
    /** Shown while `onAction` is pending. Without it the pill folds into a round spinner. */
    pendingLabel?: string;
    /** Milliseconds before the component advances to the next state on its own. Useful for brief confirmations. */
    holdFor?: number;
};

type Phase = "idle" | "working" | "failed";

export type ActionSwapProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "value" | "defaultValue" | "onClick"> &
    ActionSwapStyleProps & {
        /** Ordered list of at least two states. Pressing the button moves to the next one and wraps around. */
        states: ActionSwapState[];
        /** Controlled state id. */
        value?: string;
        /** Initial state id when uncontrolled. Defaults to the first state. */
        defaultValue?: string;
        onValueChange?: (id: string, state: ActionSwapState) => void;
        /**
         * Runs on press with the state being left and the one coming next.
         * Return a promise to show a working phase; the swap happens when it resolves and a rejection shows `failureLabel`.
         */
        onAction?: (current: ActionSwapState, next: ActionSwapState) => void | Promise<unknown>;
        /** Label shown for 1.8s after `onAction` rejects. */
        failureLabel?: string;
        translations?: TranslationOverrides;
    };

/** The working phase stays visible at least this long so it never flashes. */
const MIN_WORKING_MS = 450;
const FAILURE_MS = 1800;

const isThenable = (value: unknown): value is PromiseLike<unknown> =>
    typeof value === "object" && value !== null && typeof (value as PromiseLike<unknown>).then === "function";

const wait = (ms: number, timers: Set<ReturnType<typeof setTimeout>>) =>
    new Promise<void>((resolve) => {
        if (ms <= 0) return resolve();
        const id = setTimeout(() => {
            timers.delete(id);
            resolve();
        }, ms);
        timers.add(id);
    });

type IconProps = { node: ReactNode; iconKey: string; wipe: boolean; reduce: boolean };

const SwapIcon = ({ node, iconKey, wipe, reduce }: IconProps) => (
    <span className={actionSwapStyles.slots.icon} aria-hidden>
        <AnimatePresence initial={false} mode="popLayout">
            <motion.span
                key={iconKey}
                style={{ display: "inline-flex", inlineSize: "100%", blockSize: "100%" }}
                initial={
                    reduce ? { opacity: 0 } : wipe ? { opacity: 1, clipPath: "inset(0 100% 0 0)" } : { opacity: 0, scale: 0.8, filter: "blur(1px)" }
                }
                animate={reduce ? { opacity: 1 } : wipe ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, filter: "blur(1px)" }}
                transition={{ duration: reduce ? 0.1 : 0.15, ease: [0.23, 1, 0.32, 1] }}
            >
                {node}
            </motion.span>
        </AnimatePresence>
    </span>
);

/**
 * A pill button that cycles through related states (Pin → Pinned, Compile → Compiled).
 * Width, tone, icon and label morph together on every press.
 *
 * @example
 * ```tsx
 * <ActionSwap
 *   states={[
 *     { id: "pin", label: "Pin", icon: <PushPinIcon />, tone: "primary" },
 *     { id: "pinned", label: "Pinned", icon: <CheckIcon />, tone: "neutral" },
 *   ]}
 *   onAction={(_, next) => api.setPinned("rust", next.id === "pinned")}
 * />
 * ```
 */
export const ActionSwap = forwardRef<HTMLButtonElement, ActionSwapProps>(function ActionSwap(
    { states, value, defaultValue, onValueChange, onAction, failureLabel, size, className, disabled, translations, ...props },
    ref
) {
    const t = useTranslations(translations);
    const reduce = useMotionPreference();
    const { width, measure } = useMorphWidth(reduce);

    const [currentId, setCurrentId] = useControllableState<string>({
        value,
        defaultValue: defaultValue ?? states[0].id,
        onChange: (id) => onValueChange?.(id, states.find((state) => state.id === id) ?? states[0]),
    });
    const index = Math.max(
        0,
        states.findIndex((state) => state.id === currentId)
    );
    const current = states[index];
    const next = states[(index + 1) % states.length];

    const [phase, setPhase] = useState<Phase>("idle");
    const [announcement, setAnnouncement] = useState("");
    const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
    const failTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const alive = useRef(true);
    const latest = useRef({ current, next, onAction, setCurrentId });
    latest.current = { current, next, onAction, setCurrentId };
    const resolvedFailure = failureLabel ?? t.actionSwapTryAgain;
    const resolvedFailureRef = useRef(resolvedFailure);
    resolvedFailureRef.current = resolvedFailure;

    useEffect(() => {
        alive.current = true;
        const pending = timers.current;
        return () => {
            alive.current = false;
            pending.forEach(clearTimeout);
            pending.clear();
            if (failTimer.current !== null) clearTimeout(failTimer.current);
        };
    }, []);

    const first = useRef(true);
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        setAnnouncement(current.label);
    }, [current.id, current.label]);

    useEffect(() => {
        if (phase !== "idle" || !current.holdFor) return;
        const id = setTimeout(() => latest.current.setCurrentId(latest.current.next.id), current.holdFor);
        return () => clearTimeout(id);
    }, [phase, current.id, current.holdFor]);

    const press = useCallback(async () => {
        const { current: from, next: to, onAction: action, setCurrentId: commit } = latest.current;
        if (failTimer.current !== null) clearTimeout(failTimer.current);
        failTimer.current = null;

        let result: void | Promise<unknown>;
        try {
            result = action?.(from, to);
        } catch {
            result = Promise.reject(new Error("ActionSwap onAction threw"));
        }
        if (!isThenable(result)) {
            setPhase("idle");
            commit(to.id);
            return;
        }

        const startedAt = Date.now();
        setPhase("working");
        let failed = false;
        try {
            await result;
        } catch {
            failed = true;
        }
        await wait(MIN_WORKING_MS - (Date.now() - startedAt), timers.current);
        if (!alive.current) return;

        if (failed) {
            setPhase("failed");
            setAnnouncement(resolvedFailureRef.current);
            failTimer.current = setTimeout(() => alive.current && setPhase("idle"), FAILURE_MS);
            return;
        }
        setPhase("idle");
        commit(to.id);
    }, []);

    const working = phase === "working";
    const failed = phase === "failed";
    const tone: ActionSwapTone = failed ? "danger" : (current.tone ?? "neutral");
    const label = failed ? resolvedFailure : working ? (current.pendingLabel ?? "") : current.label;
    const round = working && !current.pendingLabel;
    const iconKey = working ? "working" : failed ? "failed" : current.id;
    const icon = working ? <span className={css(spinnerStyles.className({}), actionSwapStyles.slots.spinner)} /> : failed ? null : current.icon;

    return (
        <>
            <motion.button
                {...(props as object)}
                type="button"
                ref={ref}
                disabled={disabled}
                aria-label={label || current.label}
                aria-busy={working || undefined}
                aria-disabled={working || undefined}
                data-tone={tone}
                data-phase={phase}
                data-round={round ? "true" : undefined}
                data-component="action-swap"
                className={css(actionSwapStyles.className({ size }), className)}
                style={{ ...props.style, width }}
                onClick={() => {
                    if (disabled || working) return;
                    void press();
                }}
            >
                <span ref={measure} className={actionSwapStyles.slots.content}>
                    {icon ? <SwapIcon node={icon} iconKey={iconKey} wipe={!working && tone === "success"} reduce={reduce} /> : null}
                    {label ? <RollingText value={label} className={actionSwapStyles.slots.label} /> : null}
                </span>
            </motion.button>
            <span role="status" aria-live="polite" className={actionSwapStyles.slots.status}>
                {announcement}
            </span>
        </>
    );
});
ActionSwap.displayName = "ActionSwap";
