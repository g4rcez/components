"use client";
import { ArrowCounterClockwiseIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useTranslations, type TranslationOverrides } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import { MORPH_SPRING, SETTLE_SPRING } from "../../../lib/motion";
import { Button } from "../../core/button/button";
import { cardStackStyles } from "./card-stack.styles";
import { dragDecision, type CardStackDecision } from "./card-stack.utils";

export type { CardStackDecision } from "./card-stack.utils";

export type CardStackLabels = { left: string; right: string };

export type CardStackProps<T> = {
    /** Cards in order. The top one is the first that has not been decided. */
    items: T[];
    /** Stable key per item. */
    getKey: (item: T) => string;
    /** Short name used in labels and announcements. */
    getLabel: (item: T) => string;
    renderCard: (item: T) => ReactNode;
    /** Called on swipe, button or key decision. */
    onDecide?: (item: T, decision: CardStackDecision) => void;
    /** Called when the last decision is undone. */
    onUndo?: (item: T, decision: CardStackDecision) => void;
    /** Called when every card comes back. */
    onReset?: () => void;
    /** Button and stamp labels. @default { left: "Pass", right: "Keep" } */
    labels?: CardStackLabels;
    /** Past-tense labels for announcements, such as "skipped". Defaults to `labels`. */
    outcomes?: CardStackLabels;
    /** Accessible name of the stack. */
    label?: string;
    /** Shown after every card is decided. Defaults to a "Start over" button. */
    renderEmpty?: (reset: () => void) => ReactNode;
    className?: string;
    translations?: TranslationOverrides;
};

/** Only this many cards render, however long the deck is. */
const VISIBLE_CARDS = 4;
const OFFSCREEN = 520;

type Entry<T> = { item: T; decision: CardStackDecision };

const sign = (decision: CardStackDecision) => (decision === "left" ? -1 : 1);

const variants = {
    exit: ({ decision, reduce }: { decision: CardStackDecision; reduce: boolean }) =>
        reduce
            ? { opacity: 0, transition: { duration: 0.16 } }
            : {
                  x: sign(decision) * OFFSCREEN,
                  rotate: sign(decision) * 14,
                  opacity: 0,
                  transition: { ...SETTLE_SPRING, opacity: { duration: 0.14, delay: 0.03 } },
              },
};

type StackCardProps = {
    depth: number;
    reduce: boolean;
    ariaLabel: string;
    leftLabel: string;
    rightLabel: string;
    /** Set for a card flying back in after an undo. */
    enterFrom: CardStackDecision | null;
    onDecide: (decision: CardStackDecision) => void;
    children: ReactNode;
};

const StackCard = ({ depth, reduce, ariaLabel, leftLabel, rightLabel, enterFrom, onDecide, children }: StackCardProps) => {
    const top = depth === 0;
    const cardRef = useRef<HTMLDivElement | null>(null);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
    const leftStamp = useTransform(x, [-140, -24], [1, 0]);
    const rightStamp = useTransform(x, [24, 140], [0, 1]);
    const rest = reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1 - depth * 0.055, y: depth * 12 };

    const initial = enterFrom
        ? reduce
            ? { opacity: 0 }
            : { x: sign(enterFrom) * OFFSCREEN, rotate: sign(enterFrom) * 14, opacity: 0, scale: 1, y: 0 }
        : reduce
          ? { opacity: 0 }
          : { opacity: 0, scale: rest.scale - 0.05, y: rest.y + 12 };

    const release = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const decision = dragDecision({ offset: info.offset.x, velocity: info.velocity.x, width: cardRef.current?.offsetWidth ?? 0 });
        if (decision) onDecide(decision);
    };

    return (
        <motion.div
            ref={cardRef}
            role="group"
            aria-label={top ? ariaLabel : undefined}
            aria-hidden={top ? undefined : true}
            data-top={top ? "true" : "false"}
            data-depth={depth}
            className={cardStackStyles.slots.card}
            style={top ? { x, rotate, zIndex: VISIBLE_CARDS - depth } : { zIndex: VISIBLE_CARDS - depth }}
            drag={top ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.7}
            dragMomentum={false}
            initial={initial}
            animate={top ? { ...rest, x: 0 } : rest}
            variants={variants}
            exit="exit"
            transition={reduce ? { duration: 0.16 } : MORPH_SPRING}
            onDragEnd={release}
        >
            {top ? (
                <>
                    <motion.span
                        aria-hidden
                        className={css(cardStackStyles.slots.stamp, cardStackStyles.slots["stamp-left"])}
                        style={{ opacity: leftStamp }}
                    >
                        {leftLabel}
                    </motion.span>
                    <motion.span
                        aria-hidden
                        className={css(cardStackStyles.slots.stamp, cardStackStyles.slots["stamp-right"])}
                        style={{ opacity: rightStamp }}
                    >
                        {rightLabel}
                    </motion.span>
                </>
            ) : null}
            {children}
        </motion.div>
    );
};

/**
 * Reviews a deck one card at a time. Drag or flick the top card, press a button, or use the arrow keys;
 * undo returns the last card to the stack. Swiping is never required: every gesture has a button and a key.
 *
 * @example
 * ```tsx
 * <CardStack
 *   items={languages}
 *   getKey={(language) => language.id}
 *   getLabel={(language) => language.name}
 *   renderCard={(language) => <h3>{language.name}</h3>}
 *   labels={{ left: "Skip", right: "Learn" }}
 *   onDecide={(language, decision) => save(language.id, decision)}
 * />
 * ```
 */
export const CardStack = <T,>({
    items,
    getKey,
    getLabel,
    renderCard,
    onDecide,
    onUndo,
    onReset,
    labels,
    outcomes,
    label,
    renderEmpty,
    className,
    translations,
}: CardStackProps<T>) => {
    const t = useTranslations(translations);
    const reduce = useMotionPreference();
    const hintId = useId();
    const [history, setHistory] = useState<Entry<T>[]>([]);
    const [leaving, setLeaving] = useState<CardStackDecision>("right");
    const [returning, setReturning] = useState<{ key: string; from: CardStackDecision } | null>(null);
    const [announcement, setAnnouncement] = useState({ text: "", tick: 0 });

    const leftLabel = labels?.left ?? t.cardStackPass;
    const rightLabel = labels?.right ?? t.cardStackKeep;
    const outcome = (decision: CardStackDecision) => (outcomes ?? { left: leftLabel, right: rightLabel })[decision];

    const decidedKeys = new Set(history.map((entry) => getKey(entry.item)));
    const remaining = items.filter((item) => !decidedKeys.has(getKey(item)));
    const visible = remaining.slice(0, VISIBLE_CARDS);
    const total = items.length;
    const position = history.length + 1;

    const announce = (text: string) => setAnnouncement((previous) => ({ text, tick: previous.tick + 1 }));

    const decide = (decision: CardStackDecision) => {
        const top = remaining[0];
        if (top === undefined) return;
        setLeaving(decision);
        setReturning(null);
        setHistory((entries) => [...entries, { item: top, decision }]);
        onDecide?.(top, decision);
        announce(t.cardStackDecided({ label: getLabel(top), outcome: outcome(decision) }));
    };

    const undo = () => {
        const last = history[history.length - 1];
        if (!last) return;
        setReturning({ key: getKey(last.item), from: last.decision });
        setHistory((entries) => entries.slice(0, -1));
        onUndo?.(last.item, last.decision);
        announce(t.cardStackUndone(getLabel(last.item)));
    };

    const reset = () => {
        setReturning(null);
        setHistory([]);
        onReset?.();
        announce(t.cardStackReset);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget && (event.target as HTMLElement).closest("input, textarea, select, [contenteditable='true']"))
            return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            decide(event.key === "ArrowLeft" ? "left" : "right");
        } else if (event.key === "Backspace" || ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z")) {
            event.preventDefault();
            undo();
        }
    };

    return (
        <div data-component="card-stack" className={css(cardStackStyles.className({}), className)}>
            <div className={cardStackStyles.slots.body}>
                <div
                    role="group"
                    tabIndex={0}
                    aria-roledescription="card stack"
                    aria-label={label ?? t.cardStackLabel}
                    aria-describedby={hintId}
                    className={cardStackStyles.slots.stage}
                    onKeyDown={handleKeyDown}
                >
                    <AnimatePresence initial={false} custom={{ decision: leaving, reduce }}>
                        {visible.map((item, depth) => {
                            const key = getKey(item);
                            return (
                                <StackCard
                                    key={key}
                                    depth={depth}
                                    reduce={reduce}
                                    leftLabel={leftLabel}
                                    rightLabel={rightLabel}
                                    enterFrom={returning?.key === key ? returning.from : null}
                                    ariaLabel={t.cardStackCard({ label: getLabel(item), index: position, total })}
                                    onDecide={decide}
                                >
                                    {renderCard(item)}
                                </StackCard>
                            );
                        })}
                    </AnimatePresence>
                    {remaining.length === 0 ? (
                        <div className={cardStackStyles.slots.empty}>
                            {renderEmpty ? (
                                renderEmpty(reset)
                            ) : (
                                <Button theme="neutral" onClick={reset}>
                                    {t.cardStackStartOver}
                                </Button>
                            )}
                        </div>
                    ) : null}
                </div>
                <div className={cardStackStyles.slots.controls}>
                    <Button
                        theme="neutral"
                        icon={<XIcon aria-hidden weight="bold" />}
                        disabled={remaining.length === 0}
                        onClick={() => decide("left")}
                    >
                        {leftLabel}
                    </Button>
                    <Button
                        theme="ghost-neutral"
                        aria-label={t.cardStackUndo}
                        icon={<ArrowCounterClockwiseIcon aria-hidden weight="bold" />}
                        disabled={history.length === 0}
                        onClick={undo}
                    >
                        <span className={cardStackStyles.slots["undo-label"]}>{t.cardStackUndo}</span>
                    </Button>
                    <Button
                        theme="primary"
                        icon={<CheckIcon aria-hidden weight="bold" />}
                        disabled={remaining.length === 0}
                        onClick={() => decide("right")}
                    >
                        {rightLabel}
                    </Button>
                </div>
                <span id={hintId} className={cardStackStyles.slots.hint}>
                    {t.cardStackHint}
                </span>
                <span role="status" aria-live="polite" className={cardStackStyles.slots.status}>
                    {announcement.text ? <span key={announcement.tick}>{announcement.text}</span> : null}
                </span>
            </div>
        </div>
    );
};
CardStack.displayName = "CardStack";
