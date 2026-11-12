import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KEYBOARD_INSET_PROPERTY, readKeyboardInset, useKeyboardInset } from "../src/hooks/use-keyboard-inset";

class FakeViewport extends EventTarget {
    height = 800;
    offsetTop = 0;
}

const read = () => document.documentElement.style.getPropertyValue(KEYBOARD_INSET_PROPERTY);

describe("useKeyboardInset", () => {
    let viewport: FakeViewport;

    beforeEach(() => {
        vi.useFakeTimers();
        viewport = new FakeViewport();
        vi.stubGlobal("innerHeight", 800);
        Object.defineProperty(window, "visualViewport", { value: viewport, configurable: true });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        Reflect.deleteProperty(window, "visualViewport");
        document.documentElement.style.removeProperty(KEYBOARD_INSET_PROPERTY);
    });

    const flush = () => act(() => vi.advanceTimersByTime(32));

    it("computes the covered height from the visual viewport", () => {
        viewport.height = 500;
        expect(readKeyboardInset()).toBe(300);
        viewport.offsetTop = 40;
        expect(readKeyboardInset()).toBe(260);
    });

    it("never returns a negative inset", () => {
        viewport.height = 900;
        expect(readKeyboardInset()).toBe(0);
    });

    it("publishes the inset on <html> and follows viewport changes", () => {
        renderHook(() => useKeyboardInset(true));
        flush();
        expect(read()).toBe("0px");
        viewport.height = 480;
        act(() => viewport.dispatchEvent(new Event("resize")));
        flush();
        expect(read()).toBe("320px");
    });

    it("clears the property when disabled or unmounted", () => {
        viewport.height = 480;
        const { rerender, unmount } = renderHook(({ on }) => useKeyboardInset(on), { initialProps: { on: true } });
        flush();
        expect(read()).toBe("320px");
        rerender({ on: false });
        expect(read()).toBe("");
        rerender({ on: true });
        flush();
        unmount();
        expect(read()).toBe("");
    });

    it("scrolls the focused field into view once the keyboard settles", () => {
        const container = document.createElement("div");
        const field = document.createElement("input");
        container.append(field);
        document.body.append(container);
        field.scrollIntoView = vi.fn();
        field.focus();
        viewport.height = 480;
        renderHook(() => useKeyboardInset(true, { current: container }));
        flush();
        act(() => vi.advanceTimersByTime(400));
        expect(field.scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
        container.remove();
    });

    it("does nothing without visualViewport", () => {
        Reflect.deleteProperty(window, "visualViewport");
        expect(readKeyboardInset()).toBe(0);
        expect(() => renderHook(() => useKeyboardInset(true))).not.toThrow();
        expect(read()).toBe("");
    });
});
