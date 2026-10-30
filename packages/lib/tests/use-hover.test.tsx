import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useHover } from "../src/hooks/use-hover";

const setup = () => {
    const element = document.createElement("div");
    const hook = renderHook(() => useHover({ current: element }));
    return { element, ...hook };
};

describe("useHover", () => {
    it("starts as not hovered", () => {
        const { result } = setup();
        expect(result.current).toBe(false);
    });

    it("is hovered after mouseenter and not hovered after mouseleave", () => {
        const { element, result } = setup();
        act(() => {
            element.dispatchEvent(new MouseEvent("mouseenter"));
        });
        expect(result.current).toBe(true);
        act(() => {
            element.dispatchEvent(new MouseEvent("mouseleave"));
        });
        expect(result.current).toBe(false);
    });

    it("returns false when the ref has no element", () => {
        const { result } = renderHook(() => useHover({ current: null as unknown as HTMLElement }));
        expect(result.current).toBe(false);
    });
});
