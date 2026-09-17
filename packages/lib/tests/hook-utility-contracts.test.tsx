import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "../src/hooks/use-debounce";
import { useIsCoarseDevice } from "../src/hooks/use-is-coarse-device";
import { useReactive } from "../src/hooks/use-reactive";
import { useRemoveScroll } from "../src/hooks/use-remove-scroll";
import { mergeRefs } from "../src/lib/dom";
import { path, splitInto } from "../src/lib/fns";

const originalMatchMedia = window.matchMedia;

class MatchMediaList {
    matches = false;
    media = "(pointer: coarse)";
    onchange: ((this: MediaQueryList, event: MediaQueryListEvent) => void) | null = null;
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    addListener = vi.fn();
    removeListener = vi.fn();
    dispatchEvent = vi.fn(() => true);
}

describe("hook and utility contracts", () => {
    beforeEach(() => {
        vi.useRealTimers();
        window.matchMedia = vi.fn(() => new MatchMediaList()) as unknown as typeof window.matchMedia;
    });

    afterEach(() => {
        vi.useRealTimers();
        window.matchMedia = originalMatchMedia;
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

    it("restores scroll styles on disable and unmount, and leaves block-only unchanged", () => {
        const root = document.documentElement;
        root.style.overflowY = "scroll";
        root.style.padding = "4px";
        root.style.paddingRight = "8px";
        const previous = {
            overflowY: root.style.overflowY,
            padding: root.style.padding,
            paddingRight: root.style.paddingRight,
        };
        Object.defineProperty(root, "scrollHeight", { configurable: true, value: 200 });
        Object.defineProperty(root, "clientHeight", { configurable: true, value: 100 });

        const ScrollConsumer = ({ remove, removeStyle = "overflow-hidden" }: { remove: boolean; removeStyle?: "overflow-hidden" | "block-only" }) => {
            const ref = useRemoveScroll<HTMLDivElement>(remove, removeStyle);
            return <div ref={ref} />;
        };

        const { rerender, unmount } = render(<ScrollConsumer remove />);
        expect(root.style.overflowY).toBe("hidden");
        expect(root.style.padding).not.toBe(previous.padding);

        rerender(<ScrollConsumer remove={false} />);
        expect(root.style.overflowY).toBe(previous.overflowY);
        expect(root.style.padding).toBe(previous.padding);
        expect(root.style.paddingRight).toBe(previous.paddingRight);

        rerender(<ScrollConsumer remove />);
        unmount();
        expect(root.style.overflowY).toBe(previous.overflowY);
        expect(root.style.padding).toBe(previous.padding);
        expect(root.style.paddingRight).toBe(previous.paddingRight);

        render(<ScrollConsumer remove removeStyle="block-only" />);
        expect(root.style.overflowY).toBe(previous.overflowY);
        expect(root.style.padding).toBe(previous.padding);
    });

    it("keeps a shared scroll lock until every consumer unmounts", () => {
        const root = document.documentElement;
        root.style.overflowY = "scroll";
        root.style.padding = "4px";
        root.style.paddingRight = "8px";
        const previous = {
            overflowY: root.style.overflowY,
            padding: root.style.padding,
            paddingRight: root.style.paddingRight,
        };
        Object.defineProperty(root, "scrollHeight", { configurable: true, value: 200 });
        Object.defineProperty(root, "clientHeight", { configurable: true, value: 100 });

        const ScrollConsumer = () => {
            const ref = useRemoveScroll<HTMLDivElement>(true);
            return <div ref={ref} />;
        };

        const first = render(<ScrollConsumer />);
        const second = render(<ScrollConsumer />);
        first.unmount();
        expect(root.style.overflowY).toBe("hidden");
        second.unmount();
        expect(root.style.overflowY).toBe(previous.overflowY);
        expect(root.style.padding).toBe(previous.padding);
        expect(root.style.paddingRight).toBe(previous.paddingRight);
    });

    it("uses the coarse-pointer media query and removes its listener", () => {
        const media = new MatchMediaList();
        media.matches = true;
        const listener = vi.fn();
        media.addEventListener.mockImplementation((_type, callback) => listener.mockImplementation(callback as never));
        const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue(media as unknown as MediaQueryList);

        const { result, unmount } = renderHook(() => useIsCoarseDevice());

        expect(matchMedia).toHaveBeenCalledWith("(pointer: coarse)");
        expect(result.current).toBe(true);

        const changeListener = media.addEventListener.mock.calls[0]?.[1] as ((event: MediaQueryListEvent) => void) | undefined;
        act(() => changeListener?.({ matches: false } as MediaQueryListEvent));
        expect(result.current).toBe(false);

        unmount();
        expect(media.removeEventListener).toHaveBeenCalledWith("change", changeListener);
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
