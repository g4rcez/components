import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useMediaQuery } from "../src/hooks/use-media-query";

const originalMatchMedia = window.matchMedia;

const installMatchMedia = (initial: boolean) => {
    let matches = initial;
    const listeners = new Set<() => void>();
    window.matchMedia = ((query: string) => ({
        get matches() {
            return matches;
        },
        media: query,
        addEventListener: (_: string, fn: () => void) => listeners.add(fn),
        removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    })) as unknown as typeof window.matchMedia;
    return {
        listeners,
        set: (next: boolean) => {
            matches = next;
            listeners.forEach((fn) => fn());
        },
    };
};

describe("useMediaQuery", () => {
    afterEach(() => {
        window.matchMedia = originalMatchMedia;
    });

    it("returns the current match on mount", () => {
        installMatchMedia(false);
        const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        expect(result.current).toBe(false);
    });

    it("updates when the media query changes", () => {
        const media = installMatchMedia(false);
        const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        act(() => media.set(true));
        expect(result.current).toBe(true);
    });

    it("removes the change listener on unmount", () => {
        const media = installMatchMedia(true);
        const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
        expect(media.listeners.size).toBe(1);
        unmount();
        expect(media.listeners.size).toBe(0);
    });
});
