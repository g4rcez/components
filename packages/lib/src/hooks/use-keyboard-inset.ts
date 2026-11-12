import { type RefObject, useEffect } from "react";

/** CSS custom property that mirrors the on-screen keyboard height while `useKeyboardInset` is enabled. */
export const KEYBOARD_INSET_PROPERTY = "--var-keyboard-inset";

const SETTLE_DELAY = 320;

let subscribers = 0;

/**
 * How much of the layout viewport the on-screen keyboard covers, in px. iOS Safari shrinks the visual viewport and
 * leaves the layout viewport alone, so `position: fixed` surfaces stay under the keyboard. Where the webview itself
 * resizes (Android Chrome, Capacitor `resize: native`) both heights shrink together and this returns 0.
 */
export const readKeyboardInset = (view: Window = window) => {
    const viewport = view.visualViewport;
    if (!viewport) return 0;
    return Math.max(0, Math.round(view.innerHeight - viewport.height - viewport.offsetTop));
};

/**
 * Publishes the keyboard height as `--var-keyboard-inset` on `<html>` so fixed surfaces (bottom sheets, bars) can lift
 * with CSS, with no React re-render per frame. When `container` is given, the focused field inside it is scrolled into
 * view once the keyboard has settled.
 */
export const useKeyboardInset = (enabled: boolean, container?: RefObject<HTMLElement | null>) => {
    useEffect(() => {
        if (!enabled || typeof window === "undefined") return;
        const viewport = window.visualViewport;
        if (!viewport) return;
        const root = document.documentElement;
        let frame = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let covered = false;

        const reveal = () => {
            const active = document.activeElement;
            if (!covered || !(active instanceof HTMLElement) || !container?.current?.contains(active)) return;
            active.scrollIntoView({ block: "nearest" });
        };

        const update = () => {
            frame = 0;
            const inset = readKeyboardInset();
            covered = inset > 0;
            root.style.setProperty(KEYBOARD_INSET_PROPERTY, `${inset}px`);
            clearTimeout(timer);
            timer = setTimeout(reveal, SETTLE_DELAY);
        };

        const schedule = () => {
            if (frame === 0) frame = requestAnimationFrame(update);
        };

        subscribers += 1;
        viewport.addEventListener("resize", schedule);
        viewport.addEventListener("scroll", schedule);
        schedule();
        return () => {
            viewport.removeEventListener("resize", schedule);
            viewport.removeEventListener("scroll", schedule);
            cancelAnimationFrame(frame);
            clearTimeout(timer);
            subscribers -= 1;
            if (subscribers === 0) root.style.removeProperty(KEYBOARD_INSET_PROPERTY);
        };
    }, [enabled, container]);
};
