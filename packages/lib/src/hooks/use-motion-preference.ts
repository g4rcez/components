"use client";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Whether motion should be reduced, safe for server rendering.
 *
 * The server cannot know the visitor's preference, so a style that depends on it differs between the server and the first
 * client render (a hydration mismatch). This reports `false` until after mount, then the real preference: the first render
 * always matches the server, and reduced motion applies a moment later.
 */
export const useMotionPreference = (): boolean => {
    const reduce = useReducedMotion() ?? false;
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted && reduce;
};
