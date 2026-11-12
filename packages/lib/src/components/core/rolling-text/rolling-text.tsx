"use client";
import { AnimatePresence, motion } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import { useRef } from "react";
import { css } from "../../../lib/dom";
import { MORPH_SPRING } from "../../../lib/motion";
import { rollingTextStyles } from "./rolling-text.styles";

export type RollingDirection = 1 | -1;

type BaseProps = {
    className?: string;
    /** Rolls up (`1`) or down (`-1`). Derived from the value change when omitted. */
    direction?: RollingDirection;
};

export type RollingTextProps = BaseProps & {
    value: string;
};

export type RollingDigitsProps = BaseProps & {
    value: number;
};

const OFFSET = "40%";

/** Keeps the direction of the last change, so unrelated re-renders never flip an animation in flight. */
const useDirection = (value: string | number, direction?: RollingDirection): RollingDirection => {
    const last = useRef<{ value: string | number; direction: RollingDirection }>({ value, direction: 1 });
    if (last.current.value !== value) {
        const rising = typeof value === "number" && typeof last.current.value === "number" ? value > last.current.value : true;
        last.current = { value, direction: rising ? 1 : -1 };
    }
    return direction ?? last.current.direction;
};

type Glyph = { key: string; char: string };

const Glyphs = ({ glyphs, direction }: { glyphs: Glyph[]; direction: RollingDirection }) => {
    const reduce = useMotionPreference();
    const enter = reduce ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? OFFSET : `-${OFFSET}`, filter: "blur(1.5px)" };
    const exit = reduce ? { opacity: 0 } : { opacity: 0, y: direction > 0 ? `-${OFFSET}` : OFFSET, filter: "blur(1.5px)" };
    const settled = reduce ? { opacity: 1 } : { opacity: 1, y: "0%", filter: "blur(0px)" };

    return (
        <span aria-hidden className={rollingTextStyles.slots.visual}>
            <AnimatePresence initial={false} mode="popLayout">
                {glyphs.map((glyph) => (
                    <motion.span
                        key={glyph.key}
                        data-char={glyph.char}
                        initial={enter}
                        animate={settled}
                        exit={exit}
                        transition={reduce ? { duration: 0.1 } : MORPH_SPRING}
                        className={rollingTextStyles.slots.char}
                    />
                ))}
            </AnimatePresence>
        </span>
    );
};

/**
 * Text where only the characters that changed rise in from a soft blur.
 * The full string stays available to assistive technology in a visually hidden node.
 */
export const RollingText = ({ value, className, direction }: RollingTextProps) => {
    const resolved = useDirection(value, direction);
    const glyphs = Array.from(value).map((char, index) => ({ char, key: `${index}:${char}` }));

    return (
        <span data-component="rolling-text" className={css(rollingTextStyles.className({}), className)}>
            <span className={rollingTextStyles.slots.label}>{value}</span>
            <Glyphs glyphs={glyphs} direction={resolved} />
        </span>
    );
};
RollingText.displayName = "RollingText";

/**
 * A number whose digits roll individually, in the direction of the change.
 * Digits are keyed from the right, so units stay put while a new tens digit appears.
 */
export const RollingDigits = ({ value, className, direction }: RollingDigitsProps) => {
    const resolved = useDirection(value, direction);
    const text = String(value);
    const glyphs = Array.from(text).map((char, index) => ({ char, key: `${text.length - index}:${char}` }));

    return (
        <span data-component="rolling-text" className={css(rollingTextStyles.className({}), className)}>
            <span className={rollingTextStyles.slots.label}>{text}</span>
            <Glyphs glyphs={glyphs} direction={resolved} />
        </span>
    );
};
RollingDigits.displayName = "RollingDigits";
