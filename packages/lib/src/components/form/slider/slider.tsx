"use client";
import { Slider as Base } from "@base-ui/react/slider";
import { animate, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import { useEffect, useMemo, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useControllableState } from "../../../hooks/use-controllable-state";
import { useLocale } from "../../../hooks/use-locale";
import { css, mergeRefs } from "../../../lib/dom";
import { rubberBand, SETTLE_SPRING, vibrate } from "../../../lib/motion";
import { sliderStyles } from "./slider.styles";
import {
    DETENT_PX,
    keyDirection,
    MAX_STRETCH_PX,
    nearestIndex,
    normalizeMarks,
    snapToMarks,
    toValues,
    valueToPercent,
    type SliderMark,
} from "./slider.utils";

export type { SliderMark } from "./slider.utils";

type BaseProps = Parameters<typeof Base.Root>[0];
type SliderValue = number | readonly number[];
type ChangeDetails = Parameters<NonNullable<BaseProps["onValueChange"]>>[1];
type CommitDetails = Parameters<NonNullable<BaseProps["onValueCommitted"]>>[1];

export type SliderProps = BaseProps & {
    /** Shows a value tag above the thumb while it is hovered, focused or dragged. The tag sways with the thumb's speed. */
    tooltip?: boolean;
    /** Accessible name of the thumb(s). Ranges get "label 1", "label 2". */
    label?: string;
    /** Detents. A dragged thumb holds on each mark for a few pixels and the tick pops. Labelled marks print under the track and can be clicked. */
    marks?: readonly SliderMark[];
    /** Formats the value tag and the thumb's `aria-valuetext`. Defaults to `Intl.NumberFormat` with the `format` / `locale` props. */
    formatValue?: (value: number) => string;
    /** Rendered before the track, e.g. a muted speaker. */
    startIcon?: ReactNode;
    /** Rendered after the track, e.g. a loud speaker. */
    endIcon?: ReactNode;
    /** Rubber-band stretch past either end and a nudge at the limits. Turned off by reduced motion. @default true */
    elastic?: boolean;
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

type TagProps = { text: string; value: number; min: number; max: number; reduce: boolean };

/** Value tag. The text re-renders with the value; the sway runs on motion values only. */
const Tag = ({ text, value, min, max, reduce }: TagProps) => {
    const source = useMotionValue(value);
    useEffect(() => source.set(value), [source, value]);
    const velocity = useVelocity(source);
    const percentPerSecond = useTransform(velocity, (v) => (v / Math.max(max - min, Number.EPSILON)) * 100);
    const tilt = useSpring(
        useTransform(percentPerSecond, (v) => clamp(v * 0.08, -8, 8)),
        { stiffness: 600, damping: 40 }
    );
    const lag = useSpring(
        useTransform(percentPerSecond, (v) => clamp(-v * 0.12, -8, 8)),
        { stiffness: 500, damping: 36 }
    );
    return (
        <motion.span aria-hidden className={sliderStyles.slots.tag} style={reduce ? undefined : { rotate: tilt, x: lag }}>
            {text}
        </motion.span>
    );
};

type ThumbProps = {
    index: number;
    count: number;
    value: number;
    min: number;
    max: number;
    tag: boolean;
    reduce: boolean;
    label?: string;
    format: (value: number) => string;
    custom: boolean;
};

const Thumb = ({ index, count, value, min, max, tag, reduce, label, format, custom }: ThumbProps) => {
    const edge = value <= min ? "min" : value >= max ? "max" : undefined;
    return (
        <Base.Thumb
            index={index}
            data-edge={edge}
            className={sliderStyles.slots.thumb}
            getAriaLabel={label ? () => (count > 1 ? `${label} ${index + 1}` : label) : undefined}
            getAriaValueText={custom ? (_, current) => format(current) : undefined}
        >
            {tag ? <Tag text={format(value)} value={value} min={min} max={max} reduce={reduce} /> : null}
        </Base.Thumb>
    );
};

/**
 * Slider for one value or a range, built on Base UI.
 * Dragging past either end stretches the track like rubber, the thumb swells while held, `marks` act as detents
 * and `tooltip` adds a value tag that sways with the thumb. Every Base UI prop keeps working.
 *
 * @example
 * ```tsx
 * <Slider label="Volume" defaultValue={[40]} marks={[0, 50, 100]} tooltip />
 * ```
 */
export const Slider = (props: SliderProps) => {
    const {
        tooltip,
        className,
        defaultValue,
        value,
        label,
        marks,
        formatValue,
        startIcon,
        endIcon,
        elastic = true,
        min = 0,
        max = 100,
        onValueChange,
        onValueCommitted,
        ref: forwardedRef,
        ...restProps
    } = props;
    const locale = useLocale();
    const reduce = useMotionPreference();
    const rootRef = useRef<HTMLDivElement | null>(null);
    const controlRef = useRef<HTMLDivElement | null>(null);

    const [current, setCurrent] = useControllableState<SliderValue>({ value, defaultValue: defaultValue ?? min });
    const values = toValues(current);
    const latest = useRef(current);
    latest.current = current;
    const normalizedMarks = useMemo(() => normalizeMarks(marks, min, max), [marks, min, max]);
    const markValues = useMemo(() => normalizedMarks.map((mark) => mark.value), [normalizedMarks]);
    const labelled = normalizedMarks.filter((mark) => mark.label !== undefined && mark.label !== null);
    const snapped = useRef<number | null>(null);

    const formatter = useMemo(() => new Intl.NumberFormat(locale, restProps.format), [locale, restProps.format]);
    const format = formatValue ?? formatter.format;
    const horizontal = (restProps.orientation ?? "horizontal") === "horizontal";
    const canStretch = elastic && !reduce && horizontal && !restProps.disabled;

    const stretch = useMotionValue(0);
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        return stretch.on("change", (distance) => {
            const width = controlRef.current?.getBoundingClientRect().width || 1;
            const grown = Math.abs(distance);
            root.style.setProperty("--slider-scale-x", String(1 + grown / width));
            root.style.setProperty("--slider-origin", distance < 0 ? "right center" : "left center");
            root.style.setProperty("--slider-shift-max", `${Math.max(distance, 0)}px`);
            root.style.setProperty("--slider-shift-min", `${Math.min(distance, 0)}px`);
        });
    }, [stretch]);

    useEffect(() => {
        const control = controlRef.current;
        if (!control || !canStretch) return;

        const move = (event: PointerEvent) => {
            const rect = control.getBoundingClientRect();
            const over = event.clientX > rect.right ? event.clientX - rect.right : event.clientX < rect.left ? event.clientX - rect.left : 0;
            stretch.set(Math.sign(over) * rubberBand(Math.abs(over), MAX_STRETCH_PX));
        };
        const release = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
            animate(stretch, 0, { ...SETTLE_SPRING, velocity: stretch.getVelocity() });
        };
        const press = () => {
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", release);
            window.addEventListener("pointercancel", release);
        };
        control.addEventListener("pointerdown", press);
        return () => {
            control.removeEventListener("pointerdown", press);
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
        };
    }, [canStretch, stretch]);

    const snap = (next: SliderValue, reason: string): SliderValue => {
        if (!markValues.length || (reason !== "drag" && reason !== "track-press")) return next;
        const width = controlRef.current?.getBoundingClientRect().width ?? 0;
        if (width <= 0) return next;
        const threshold = (DETENT_PX * (max - min)) / width;
        const before = toValues(latest.current);
        const proposed = toValues(next);
        const result = proposed.map((entry, index) => (entry === before[index] ? entry : snapToMarks(entry, markValues, threshold)));
        const hit = result.find((entry, index) => entry !== proposed[index]);
        if (hit !== undefined && hit !== snapped.current) vibrate(5);
        snapped.current = hit ?? null;
        return typeof next === "number" ? result[0] : result;
    };

    const handleChange = (next: SliderValue, details: ChangeDetails) => {
        const resolved = snap(next, details.reason);
        latest.current = resolved;
        setCurrent(resolved);
        (onValueChange as ((value: SliderValue, details: ChangeDetails) => void) | undefined)?.(resolved, details);
    };

    // Base UI reports the raw pointer value on commit; a detent may have moved it.
    const handleCommit = (_next: SliderValue, details: CommitDetails) => {
        (onValueCommitted as ((value: SliderValue, details: CommitDetails) => void) | undefined)?.(latest.current, details);
    };

    // Captured, because Base UI's thumb stops propagation of the keys it handles.
    const handleKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
        (restProps as { onKeyDownCapture?: (event: KeyboardEvent<HTMLDivElement>) => void }).onKeyDownCapture?.(event);
        const direction = keyDirection(event.key);
        if (!canStretch || direction === 0) return;
        const thumb = (event.target as HTMLElement).closest<HTMLElement>("[data-index]");
        const index = Number(thumb?.getAttribute("data-index") ?? 0);
        const value = values[index];
        if (value === undefined || (direction > 0 ? value < max : value > min)) return;
        // A kick that snaps back: jump() starts the spring from rest instead of from the speed of the jump.
        stretch.jump(direction * 4);
        animate(stretch, 0, SETTLE_SPRING);
    };

    const commitMark = (mark: number, event: MouseEvent<HTMLButtonElement>) => {
        if (restProps.disabled) return;
        const target = nearestIndex(values, mark);
        const next: SliderValue =
            typeof current === "number" ? mark : values.map((entry, index) => (index === target ? mark : entry)).sort((a, b) => a - b);
        latest.current = next;
        setCurrent(next);
        const details = {
            reason: "none",
            event: event.nativeEvent,
            cancel() {},
            allowPropagation() {},
            isCanceled: false,
            isPropagationAllowed: false,
            trigger: undefined,
            activeThumbIndex: target,
        };
        (onValueChange as ((value: SliderValue, details: unknown) => void) | undefined)?.(next, details);
        (onValueCommitted as ((value: SliderValue, details: unknown) => void) | undefined)?.(next, { reason: "none", event: event.nativeEvent });
    };

    const control = (
        <Base.Control ref={controlRef} className={css(sliderStyles.slots.control, className)}>
            <Base.Track className={sliderStyles.slots.track}>
                <Base.Indicator className={sliderStyles.slots.indicator} />
                {normalizedMarks.map((mark) => (
                    <span
                        key={mark.value}
                        aria-hidden
                        className={sliderStyles.slots.tick}
                        data-active={values.includes(mark.value) ? "true" : undefined}
                        style={{ insetInlineStart: `${valueToPercent(mark.value, min, max)}%` }}
                    />
                ))}
            </Base.Track>
            {values.map((entry, index) => (
                <Thumb
                    key={index}
                    index={index}
                    count={values.length}
                    value={entry}
                    min={min}
                    max={max}
                    tag={tooltip ?? false}
                    reduce={reduce}
                    label={label}
                    format={format}
                    custom={formatValue !== undefined}
                />
            ))}
        </Base.Control>
    );

    const markLabels = labelled.length ? (
        <div aria-hidden className={sliderStyles.slots.marks}>
            {labelled.map((mark) => (
                <button
                    key={mark.value}
                    type="button"
                    tabIndex={-1}
                    className={sliderStyles.slots["mark-label"]}
                    style={{ insetInlineStart: `${valueToPercent(mark.value, min, max)}%` }}
                    onClick={(event) => commitMark(mark.value, event)}
                >
                    {mark.label}
                </button>
            ))}
        </div>
    ) : null;

    const hasIcons = startIcon !== undefined || endIcon !== undefined;
    const body = markLabels ? (
        <div className={sliderStyles.slots.body}>
            {control}
            {markLabels}
        </div>
    ) : (
        control
    );

    return (
        <Base.Root
            {...restProps}
            ref={mergeRefs(rootRef, forwardedRef)}
            min={min}
            max={max}
            locale={locale}
            value={current as never}
            onKeyDownCapture={handleKeyDownCapture as never}
            onValueChange={handleChange as never}
            onValueCommitted={handleCommit as never}
            className={sliderStyles.className()}
        >
            {hasIcons ? (
                <div className={sliderStyles.slots.row}>
                    {startIcon !== undefined ? (
                        <span aria-hidden data-side="start" className={sliderStyles.slots.icon}>
                            {startIcon}
                        </span>
                    ) : null}
                    {markLabels ? body : <div className={sliderStyles.slots.body}>{body}</div>}
                    {endIcon !== undefined ? (
                        <span aria-hidden data-side="end" className={sliderStyles.slots.icon}>
                            {endIcon}
                        </span>
                    ) : null}
                </div>
            ) : (
                body
            )}
        </Base.Root>
    );
};
Slider.displayName = "Slider";
