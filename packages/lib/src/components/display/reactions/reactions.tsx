"use client";
import { SmileyIcon } from "@phosphor-icons/react";
import { animate, AnimatePresence, motion, useIsPresent, useMotionValue } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import {
    createElement,
    forwardRef,
    isValidElement,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ComponentType,
    type KeyboardEvent,
    type ReactNode,
} from "react";
import { useControllableState } from "../../../hooks/use-controllable-state";
import { useTranslations, type TranslationOverrides } from "../../../hooks/use-translations";
import { css, mergeRefs } from "../../../lib/dom";
import { MORPH_SPRING } from "../../../lib/motion";
import { RollingDigits } from "../../core/rolling-text/rolling-text";
import { Dropdown } from "../../floating/dropdown/dropdown";
import { reactionsStyles } from "./reactions.styles";

export type ReactionIcon = ReactNode | ComponentType<{ "aria-hidden"?: boolean }>;

export type ReactionOption = {
    id: string;
    /** Accessible name, e.g. "Thumbs up". */
    label: string;
    /** An element, text such as an emoji, or an icon component (Phosphor icons work as-is). */
    icon: ReactionIcon;
};

export type Reaction = {
    id: string;
    count: number;
    /** Whether the current person has reacted with this option. */
    reacted: boolean;
};

export type ReactionChange = { id: string; reacted: boolean };

export type ReactionsProps = {
    /** Every reaction the picker offers. */
    options: ReactionOption[];
    /** Controlled reactions. Pills keep this order and a pill whose count is zero leaves the bar. */
    value?: Reaction[];
    /** Initial reactions when uncontrolled. */
    defaultValue?: Reaction[];
    /** Receives the next list and the change that produced it. Persist here and pass `value` back for server-backed counts. */
    onValueChange?: (next: Reaction[], change: ReactionChange) => void;
    /** Accessible name of the bar. */
    label?: string;
    className?: string;
    translations?: TranslationOverrides;
};

const isComponent = (icon: unknown): icon is ComponentType<{ "aria-hidden"?: boolean }> =>
    typeof icon === "function" || (typeof icon === "object" && icon !== null && !isValidElement(icon) && "$$typeof" in icon);

const renderIcon = (icon: ReactionIcon) => (isComponent(icon) ? createElement(icon, { "aria-hidden": true }) : icon);

type PillProps = {
    option: ReactionOption;
    reaction: Reaction;
    reduce: boolean;
    name: string;
    onToggle: (id: string, focused: boolean) => void;
    register: (id: string, element: HTMLButtonElement | null) => void;
};

const Pill = forwardRef<HTMLButtonElement, PillProps>(function Pill({ option, reaction, reduce, name, onToggle, register }, forwardedRef) {
    const present = useIsPresent();
    const optionId = option.id;
    const track = useCallback((element: HTMLButtonElement | null) => register(optionId, element), [register, optionId]);
    const kick = useMotionValue(1);

    const press = (focused: boolean) => {
        if (!reduce) {
            // Taps stack: each one adds to the scale and carries the spring's current speed.
            kick.jump(Math.min(kick.get() + 0.14, 1.4));
            animate(kick, 1, { type: "spring", stiffness: 800, damping: 22, velocity: 2 });
        }
        onToggle(option.id, focused);
    };

    return (
        <motion.button
            layout="position"
            type="button"
            ref={mergeRefs(forwardedRef, track)}
            aria-pressed={reaction.reacted}
            aria-label={name}
            aria-hidden={present ? undefined : true}
            tabIndex={present ? undefined : -1}
            style={present ? undefined : { pointerEvents: "none" }}
            data-reaction-id={option.id}
            className={reactionsStyles.slots.pill}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, filter: "blur(1.5px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, filter: "blur(1.5px)" }}
            transition={reduce ? { duration: 0.1 } : { layout: MORPH_SPRING, default: MORPH_SPRING }}
            onClick={(event) => press(event.currentTarget === document.activeElement)}
        >
            <motion.span aria-hidden className={reactionsStyles.slots.icon} style={{ scale: kick }}>
                {renderIcon(option.icon)}
            </motion.span>
            <RollingDigits value={reaction.count} className={reactionsStyles.slots.count} />
        </motion.button>
    );
});

type PickerProps = {
    options: ReactionOption[];
    list: readonly Reaction[];
    label: string;
    layoutId: string;
    onPick: (id: string) => void;
};

/** Toolbar of every option with roving tabindex and a highlight that glides between them. */
const Picker = ({ options, list, label, layoutId, onPick }: PickerProps) => {
    const [active, setActive] = useState(0);
    const [hovered, setHovered] = useState<number | null>(null);
    const [focused, setFocused] = useState(false);
    const refs = useRef<Array<HTMLButtonElement | null>>([]);
    const highlighted = hovered ?? (focused ? active : null);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const last = options.length - 1;
        let next: number | null = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = active >= last ? 0 : active + 1;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = active <= 0 ? last : active - 1;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = last;
        if (next === null) return;
        event.preventDefault();
        setActive(next);
        refs.current[next]?.focus();
    };

    return (
        <div
            role="toolbar"
            tabIndex={-1}
            aria-label={label}
            className={reactionsStyles.slots.picker}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}
            onPointerLeave={() => setHovered(null)}
        >
            {options.map((option, index) => (
                <button
                    key={option.id}
                    type="button"
                    ref={(element) => {
                        refs.current[index] = element;
                    }}
                    aria-label={option.label}
                    aria-pressed={list.some((reaction) => reaction.id === option.id && reaction.reacted)}
                    tabIndex={index === active ? 0 : -1}
                    data-reaction-option={option.id}
                    className={reactionsStyles.slots.option}
                    onFocus={() => setActive(index)}
                    onPointerEnter={(event) => {
                        if (event.pointerType === "mouse") setHovered(index);
                    }}
                    onClick={() => onPick(option.id)}
                >
                    {highlighted === index ? (
                        <motion.span aria-hidden layoutId={layoutId} className={reactionsStyles.slots.highlight} transition={MORPH_SPRING} />
                    ) : null}
                    <span aria-hidden className={reactionsStyles.slots.icon}>
                        {renderIcon(option.icon)}
                    </span>
                </button>
            ))}
        </div>
    );
};

/**
 * A bar of reaction pills with a picker to add more. Counts roll digit by digit, pills reflow on a spring,
 * and a pill whose count reaches zero leaves the bar.
 *
 * @example
 * ```tsx
 * <Reactions
 *   options={[{ id: "up", label: "Thumbs up", icon: ThumbsUpIcon }, { id: "heart", label: "Heart", icon: HeartIcon }]}
 *   defaultValue={[{ id: "up", count: 4, reacted: false }]}
 *   onValueChange={(next, change) => save(change)}
 * />
 * ```
 */
export const Reactions = ({ options, value, defaultValue, onValueChange, label, className, translations }: ReactionsProps) => {
    const t = useTranslations(translations);
    const reduce = useMotionPreference();
    const highlightId = useId();
    const [list, setList] = useControllableState<readonly Reaction[]>({ value, defaultValue: defaultValue ?? [] });
    const [open, setOpen] = useState(false);
    const [announcement, setAnnouncement] = useState({ text: "", tick: 0 });
    const addRef = useRef<HTMLButtonElement | null>(null);
    const pills = useRef(new Map<string, HTMLButtonElement>());
    const pendingFocus = useRef<{ removed: string; target: string } | null>(null);
    const latest = useRef({ list, onValueChange });
    latest.current = { list, onValueChange };
    const register = useCallback((id: string, element: HTMLButtonElement | null) => {
        if (element) pills.current.set(id, element);
        else pills.current.delete(id);
    }, []);

    const byId = useMemo(() => new Map(options.map((option) => [option.id, option])), [options]);
    const visible = list.filter((reaction) => reaction.count > 0 && byId.has(reaction.id));

    // When the focused pill leaves the bar, focus its neighbour (or the add button) once it is gone.
    useEffect(() => {
        const pending = pendingFocus.current;
        if (!pending || visible.some((reaction) => reaction.id === pending.removed)) return;
        pendingFocus.current = null;
        (pending.target === "add" ? addRef.current : pills.current.get(pending.target))?.focus();
    });

    const toggle = (id: string, focused: boolean) => {
        const { list: current, onValueChange: notify } = latest.current;
        const existing = current.find((reaction) => reaction.id === id);
        const reacted = !(existing?.reacted ?? false);
        const count = Math.max(0, (existing?.count ?? 0) + (reacted ? 1 : -1));
        const entry: Reaction = { id, count, reacted };
        const next = !existing
            ? [...current, entry]
            : entry.count > 0
              ? current.map((reaction) => (reaction.id === id ? entry : reaction))
              : current.filter((reaction) => reaction.id !== id);

        if (focused && entry.count === 0) {
            const ids = visible.map((reaction) => reaction.id);
            const at = ids.indexOf(id);
            pendingFocus.current = { removed: id, target: ids[at + 1] ?? ids[at - 1] ?? "add" };
        } else {
            pendingFocus.current = null;
        }

        const name = byId.get(id)?.label ?? id;
        setAnnouncement((previous) => ({
            tick: previous.tick + 1,
            text: reacted ? t.reactionsAdded(name, entry.count) : t.reactionsRemoved(name, entry.count),
        }));
        setList(next);
        notify?.([...next], { id, reacted });
    };

    return (
        <>
            <motion.div
                layout="size"
                role="group"
                aria-label={label ?? t.reactionsLabel}
                className={css(reactionsStyles.className({}), className)}
                transition={reduce ? { duration: 0 } : { layout: MORPH_SPRING }}
            >
                <AnimatePresence initial={false} mode="popLayout">
                    {visible.map((reaction) => {
                        const option = byId.get(reaction.id)!;
                        return (
                            <Pill
                                key={reaction.id}
                                option={option}
                                reaction={reaction}
                                reduce={reduce}
                                onToggle={toggle}
                                name={t.reactionsPill({ label: option.label, count: reaction.count, reacted: reaction.reacted })}
                                register={register}
                            />
                        );
                    })}
                </AnimatePresence>
                <Dropdown
                    asChild
                    side="bottom"
                    align="start"
                    offset={6}
                    open={open}
                    onChange={setOpen}
                    className={reactionsStyles.slots.panel}
                    aria-label={t.reactionsPickerLabel}
                    trigger={
                        <motion.button layout="position" type="button" ref={addRef} aria-label={t.reactionsAdd} className={reactionsStyles.slots.add}>
                            <span aria-hidden className={reactionsStyles.slots.icon}>
                                <SmileyIcon weight="bold" />
                            </span>
                        </motion.button>
                    }
                >
                    <Picker
                        options={options}
                        list={list}
                        label={t.reactionsPickerLabel}
                        layoutId={highlightId}
                        onPick={(id) => {
                            setOpen(false);
                            toggle(id, false);
                        }}
                    />
                </Dropdown>
            </motion.div>
            <span role="status" aria-live="polite" className={reactionsStyles.slots.status}>
                {announcement.text ? <span key={announcement.tick}>{announcement.text}</span> : null}
            </span>
        </>
    );
};
Reactions.displayName = "Reactions";
