"use client";
import { animate, useMotionValue, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { MORPH_SPRING } from "../lib/motion";
import { useResizeObserver } from "./use-resize-observer";

/**
 * Springs an element's inline size to whatever its content measures.
 *
 * Attach `measure` to the in-flow content wrapper and bind `width` to the clipping parent's `style.width`.
 * The first measurement is applied immediately (so mounting never animates), later ones spring, and
 * `instant` skips the spring for reduced motion.
 */
export const useMorphWidth = (instant: boolean) => {
    const width = useMotionValue<number | "auto">("auto");
    const [element, measure] = useState<HTMLElement | null>(null);
    const instantRef = useRef(instant);
    instantRef.current = instant;

    useResizeObserver(element, (entry) => {
        const next = entry.borderBoxSize?.[0]?.inlineSize ?? (entry.target as HTMLElement).getBoundingClientRect().width;
        if (width.get() === "auto" || instantRef.current) {
            width.jump(next);
            return;
        }
        animate(width as MotionValue<number>, next, MORPH_SPRING);
    });

    return { width, measure };
};
