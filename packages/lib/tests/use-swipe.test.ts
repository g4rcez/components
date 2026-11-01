import { renderHook } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";

import { useSwipe } from "../src/hooks/use-swipe";

const touchStart = (x: number) => ({ touches: [{ clientX: x }] }) as unknown as React.TouchEvent;
const touchEnd = (x: number) => ({ changedTouches: [{ clientX: x }] }) as unknown as React.TouchEvent;

describe("useSwipe", () => {
    it("reports a right swipe when the finger moves right past the threshold", () => {
        const onSwipe = vi.fn();
        const { result } = renderHook(() => useSwipe(onSwipe, 50));
        const end = touchEnd(160);
        result.current.onTouchStart(touchStart(100));
        result.current.onTouchEnd(end);
        expect(onSwipe).toHaveBeenCalledTimes(1);
        expect(onSwipe).toHaveBeenCalledWith(end, "right");
    });

    it("reports a left swipe when the finger moves left past the threshold", () => {
        const onSwipe = vi.fn();
        const { result } = renderHook(() => useSwipe(onSwipe, 50));
        const end = touchEnd(40);
        result.current.onTouchStart(touchStart(100));
        result.current.onTouchEnd(end);
        expect(onSwipe).toHaveBeenCalledWith(end, "left");
    });

    it("ignores a move equal to or smaller than the threshold", () => {
        const onSwipe = vi.fn();
        const { result } = renderHook(() => useSwipe(onSwipe, 50));
        result.current.onTouchStart(touchStart(100));
        result.current.onTouchEnd(touchEnd(150));
        expect(onSwipe).not.toHaveBeenCalled();
    });

    it("ignores a touch end without a touch start", () => {
        const onSwipe = vi.fn();
        const { result } = renderHook(() => useSwipe(onSwipe, 50));
        result.current.onTouchEnd(touchEnd(500));
        expect(onSwipe).not.toHaveBeenCalled();
    });

    it("forgets the start position after a touch end", () => {
        const onSwipe = vi.fn();
        const { result } = renderHook(() => useSwipe(onSwipe, 50));
        result.current.onTouchStart(touchStart(100));
        result.current.onTouchEnd(touchEnd(200));
        result.current.onTouchEnd(touchEnd(400));
        expect(onSwipe).toHaveBeenCalledTimes(1);
    });
});
