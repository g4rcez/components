import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useResizeObserver } from "../src/hooks/use-resize-observer";

class FakeResizeObserver {
    static instances: FakeResizeObserver[] = [];
    observed: Element[] = [];
    disconnected = false;
    constructor(private readonly callback: (entries: ResizeObserverEntry[]) => void) {
        FakeResizeObserver.instances.push(this);
    }
    observe = (element: Element) => {
        this.observed.push(element);
    };
    disconnect = () => {
        this.disconnected = true;
    };
    unobserve = () => {};
    emit = (entries: ResizeObserverEntry[]) => this.callback(entries);
}

const entry = (width: number) => ({ contentRect: { width } }) as unknown as ResizeObserverEntry;

describe("useResizeObserver", () => {
    beforeEach(() => {
        FakeResizeObserver.instances = [];
        vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("does not observe when the element is null", () => {
        renderHook(() => useResizeObserver(null, vi.fn()));
        expect(FakeResizeObserver.instances).toHaveLength(0);
    });

    it("calls onResize with the first entry", () => {
        const element = document.createElement("div");
        const onResize = vi.fn();
        renderHook(() => useResizeObserver(element, onResize));
        const [observer] = FakeResizeObserver.instances;
        expect(observer.observed).toEqual([element]);
        const first = entry(100);
        observer.emit([first, entry(200)]);
        expect(onResize).toHaveBeenCalledTimes(1);
        expect(onResize).toHaveBeenCalledWith(first);
    });

    it("ignores a notification with no entries", () => {
        const onResize = vi.fn();
        renderHook(() => useResizeObserver(document.createElement("div"), onResize));
        FakeResizeObserver.instances[0].emit([]);
        expect(onResize).not.toHaveBeenCalled();
    });

    it("calls the latest callback without observing again", () => {
        const element = document.createElement("div");
        const first = vi.fn();
        const second = vi.fn();
        const { rerender } = renderHook(({ cb }) => useResizeObserver(element, cb), { initialProps: { cb: first } });
        rerender({ cb: second });
        expect(FakeResizeObserver.instances).toHaveLength(1);
        FakeResizeObserver.instances[0].emit([entry(50)]);
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(1);
    });

    it("disconnects on unmount", () => {
        const { unmount } = renderHook(() => useResizeObserver(document.createElement("div"), vi.fn()));
        const [observer] = FakeResizeObserver.instances;
        expect(observer.disconnected).toBe(false);
        unmount();
        expect(observer.disconnected).toBe(true);
    });

    it("observes the new element when the element changes", () => {
        const a = document.createElement("div");
        const b = document.createElement("div");
        const { rerender } = renderHook(({ el }) => useResizeObserver(el, vi.fn()), { initialProps: { el: a } });
        rerender({ el: b });
        expect(FakeResizeObserver.instances).toHaveLength(2);
        expect(FakeResizeObserver.instances[0].disconnected).toBe(true);
        expect(FakeResizeObserver.instances[1].observed).toEqual([b]);
    });
});
