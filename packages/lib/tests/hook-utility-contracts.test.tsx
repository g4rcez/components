import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "../src/hooks/use-debounce";
import { useReactive } from "../src/hooks/use-reactive";
import { useRemoveScroll } from "../src/hooks/use-remove-scroll";
import { mergeRefs } from "../src/lib/dom";
import { path, splitInto } from "../src/lib/fns";

describe("hook and utility contracts", () => {
    beforeEach(() => {
        vi.useRealTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("uses the latest debounced callback and cancels pending work on unmount", () => {
        vi.useFakeTimers();
        const first = vi.fn((value: string) => value);
        const second = vi.fn((value: string) => value);
        const { result, rerender, unmount } = renderHook(({ callback }) => useDebounce(callback, 100), {
            initialProps: { callback: first },
        });

        act(() => result.current("old"));
        rerender({ callback: second });
        act(() => result.current("latest"));
        act(() => vi.advanceTimersByTime(100));

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledWith("latest");

        const pending = vi.fn((value: string) => value);
        const pendingHook = renderHook(() => useDebounce(pending, 100));
        act(() => pendingHook.result.current("cancelled"));
        pendingHook.unmount();
        act(() => vi.advanceTimersByTime(100));
        expect(pending).not.toHaveBeenCalled();
        unmount();
    });

    it.each(["", "100px"])("contains wheel events only while enabled (height %s)", (height) => {
        const root = document.documentElement;
        const originalStyle = root.getAttribute("style");
        const ScrollConsumer = ({ enabled }: { enabled: boolean }) => {
            const ref = useRemoveScroll<HTMLDivElement>(enabled);
            return <div ref={ref} data-testid="popup" style={{ height }} />;
        };
        const { getByTestId, rerender, unmount } = render(<ScrollConsumer enabled={false} />);
        const popup = getByTestId("popup");
        vi.spyOn(popup, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, height ? 60 : 100));
        let scrollHeight = 100;
        Object.defineProperty(popup, "scrollHeight", { configurable: true, get: () => scrollHeight });
        const wheel = () => {
            const event = new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 10 });
            popup.dispatchEvent(event);
            return event.defaultPrevented;
        };

        try {
            // An enclosing overlay owns these document styles, not the popup.
            root.style.overflowY = "hidden";
            root.style.paddingRight = "15px";
            const lockedStyle = root.getAttribute("style");
            expect(wheel()).toBe(false);

            rerender(<ScrollConsumer enabled />);
            expect(wheel()).toBe(true);
            scrollHeight = 200;
            expect(wheel()).toBe(false);
            scrollHeight = 100;
            expect(root.getAttribute("style")).toBe(lockedStyle);

            rerender(<ScrollConsumer enabled={false} />);
            expect(wheel()).toBe(false);
            expect(root.getAttribute("style")).toBe(lockedStyle);
            rerender(<ScrollConsumer enabled />);
            expect(wheel()).toBe(true);
            unmount();
            expect(wheel()).toBe(false);
            expect(root.getAttribute("style")).toBe(lockedStyle);
        } finally {
            unmount();
            if (originalStyle === null) root.removeAttribute("style");
            else root.setAttribute("style", originalStyle);
        }
    });

    it("preserves falsy reactive initial values and ignores nullish refs", () => {
        const values: Array<boolean | number | string | null> = [false, 0, "", null];
        values.forEach((initial) => {
            const observed: unknown[] = [];
            renderHook(
                ({ value }) => {
                    const reactive = useReactive<unknown>("fallback", value);
                    observed.push(reactive[0]);
                    return reactive;
                },
                { initialProps: { value: initial } }
            );
            expect(observed[0]).toBe(initial);
        });

        const callbackRef = vi.fn();
        const objectRef = { current: null as HTMLDivElement | null };
        const merged = mergeRefs(callbackRef, objectRef, null, undefined);
        const element = document.createElement("div");

        expect(() => merged(element)).not.toThrow();
        expect(callbackRef).toHaveBeenCalledWith(element);
        expect(objectRef.current).toBe(element);
        merged(null);
        expect(objectRef.current).toBeNull();
    });

    it("preserves falsy path results and returns contiguous chunks", () => {
        expect(path({ value: false }, "value")).toBe(false);
        expect(path({ value: 0 }, "value")).toBe(0);
        expect(path({ nested: { value: 3 } }, "nested.value")).toBe(3);

        expect(splitInto([1, 2, 3, 4], 2)).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(splitInto([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        expect(splitInto([1, 2], 5)).toEqual([[1, 2]]);
        expect(splitInto([1, 2], 0)).toEqual([]);
        expect(splitInto([1, 2], 2.5)).toEqual([]);
    });
});
