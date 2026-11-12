export type CardStackDecision = "left" | "right";

/** Fraction of the card width a drag must cover to count as a decision. */
export const DISTANCE_RATIO = 0.28;
export const MIN_DISTANCE = 80;
/** Release speed (px/s) that counts as a flick, once the card has moved a little. */
export const FLICK_VELOCITY = 500;
export const FLICK_MIN_DISTANCE = 24;

type Release = {
    /** Horizontal distance from where the card started. */
    offset: number;
    /** Horizontal release velocity in px/s. */
    velocity: number;
    /** Card width, to scale the distance threshold. */
    width: number;
};

/**
 * Whether releasing a drag decides the card, and to which side.
 * A far drag decides it; so does a quick flick after a short move. Anything else snaps back (`null`).
 */
export const dragDecision = ({ offset, velocity, width }: Release): CardStackDecision | null => {
    const distance = Math.max(MIN_DISTANCE, width * DISTANCE_RATIO);
    const far = Math.abs(offset) > distance;
    const flicked = Math.abs(velocity) > FLICK_VELOCITY && Math.abs(offset) > FLICK_MIN_DISTANCE;
    if (!far && !flicked) return null;
    const direction = offset !== 0 ? offset : velocity;
    return direction < 0 ? "left" : "right";
};
