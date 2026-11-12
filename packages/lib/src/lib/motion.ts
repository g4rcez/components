/** Shared motion presets and helpers for the gesture-driven components. */

/** Width / padding / layout morphs: quick and settled, with no visible bounce. */
export const MORPH_SPRING = { type: "spring", stiffness: 900, damping: 56, mass: 0.9 } as const;

/** Release and rewind: same feel as the swipeable list rows. */
export const SETTLE_SPRING = { type: "spring", stiffness: 800, damping: 52, mass: 0.8, restDelta: 0.5, restSpeed: 8 } as const;

/** Closing surfaces: no overshoot. */
export const FOLD_SPRING = { type: "spring", stiffness: 900, damping: 60, mass: 0.9 } as const;

/**
 * iOS-style rubber banding. `distance` is how far past the edge the pointer is, `dimension` the size of the
 * axis. The result grows with `distance` but never reaches `dimension`.
 */
export const rubberBand = (distance: number, dimension: number, constant = 0.55) => {
    if (distance <= 0 || dimension <= 0) return 0;
    return (1 - 1 / ((distance * constant) / dimension + 1)) * dimension;
};

/** Short haptic tick where the platform supports it. Safe on the server and a no-op elsewhere. */
export const vibrate = (milliseconds: number) => {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
        navigator.vibrate(milliseconds);
    } catch {
        /* haptics are optional */
    }
};

type FloatingSide = "top" | "right" | "bottom" | "left";

/** Offset that places a floating panel `distance` px toward its trigger, so it travels away from the trigger as it opens. */
export const floatingTravel = (placement: string, distance: number): { x: number; y: number } => {
    const side = placement.split("-")[0] as FloatingSide;
    if (side === "top") return { x: 0, y: distance };
    if (side === "bottom") return { x: 0, y: -distance };
    if (side === "left") return { x: distance, y: 0 };
    return { x: -distance, y: 0 };
};

const FLOATING_EASE_OUT = [0.23, 1, 0.32, 1] as const;
const FLOATING_EASE_IN = [0.4, 0, 1, 1] as const;

/**
 * Enter and exit variants for tooltips, dropdowns and other panels anchored to a trigger. Pass the current placement as
 * `custom` so the travel follows the side the panel opens on. Exit is shorter than enter, and neither bounces.
 */
export const floatingVariants = ({ distance = 4, enterScale = 0.94, exitScale = 0.96, enter = 0.18, exit = 0.12 } = {}) => ({
    initial: (placement: string) => ({ opacity: 0, scale: enterScale, ...floatingTravel(placement, distance) }),
    open: { x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: enter, ease: FLOATING_EASE_OUT } },
    exit: (placement: string) => ({
        opacity: 0,
        scale: exitScale,
        ...floatingTravel(placement, distance / 2),
        transition: { duration: exit, ease: FLOATING_EASE_IN },
    }),
});
