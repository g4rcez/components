import type { ReactNode } from "react";

export type SliderMark = number | { value: number; label?: ReactNode };

export type NormalizedMark = { value: number; label?: ReactNode };

/** A dragged thumb holds on a mark for about this many pixels. */
export const DETENT_PX = 7;

/** The track never stretches further than this, however far the pointer goes. */
export const MAX_STRETCH_PX = 36;

export const toValues = (value: number | readonly number[]): number[] => (typeof value === "number" ? [value] : [...value]);

export const valueToPercent = (value: number, min: number, max: number) => (max === min ? 0 : ((value - min) / (max - min)) * 100);

/** Drops marks outside the range, de-duplicates them and sorts ascending. */
export const normalizeMarks = (marks: readonly SliderMark[] | undefined, min: number, max: number): NormalizedMark[] => {
    if (!marks?.length) return [];
    const seen = new Map<number, NormalizedMark>();
    for (const mark of marks) {
        const normalized = typeof mark === "number" ? { value: mark } : mark;
        if (!Number.isFinite(normalized.value) || normalized.value < min || normalized.value > max) continue;
        const previous = seen.get(normalized.value);
        if (!previous || (previous.label === undefined && normalized.label !== undefined)) seen.set(normalized.value, normalized);
    }
    return [...seen.values()].sort((a, b) => a.value - b.value);
};

/** Returns the closest mark when it is within `threshold` (in value units), otherwise the value itself. */
export const snapToMarks = (value: number, marks: readonly number[], threshold: number): number => {
    if (threshold <= 0) return value;
    let best = value;
    let distance = Infinity;
    for (const mark of marks) {
        const gap = Math.abs(mark - value);
        if (gap <= threshold && gap < distance) {
            best = mark;
            distance = gap;
        }
    }
    return best;
};

/** Index of the entry closest to `target`. */
export const nearestIndex = (values: readonly number[], target: number) => {
    let index = 0;
    for (let i = 1; i < values.length; i++) {
        if (Math.abs(values[i] - target) < Math.abs(values[index] - target)) index = i;
    }
    return index;
};

export type KeyDirection = 1 | -1 | 0;

/** Direction a slider key moves the value, ignoring writing direction. */
export const keyDirection = (key: string): KeyDirection => {
    switch (key) {
        case "ArrowRight":
        case "ArrowUp":
        case "PageUp":
        case "End":
            return 1;
        case "ArrowLeft":
        case "ArrowDown":
        case "PageDown":
        case "Home":
            return -1;
        default:
            return 0;
    }
};
