import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RollingDigits, RollingText } from "../src/components/core/rolling-text/rolling-text";
import { useControllableState } from "../src/hooks/use-controllable-state";
import { rubberBand, vibrate } from "../src/lib/motion";

describe("rubberBand", () => {
    it("is zero without distance or room", () => {
        expect(rubberBand(0, 100)).toBe(0);
        expect(rubberBand(-20, 100)).toBe(0);
        expect(rubberBand(50, 0)).toBe(0);
    });

    it("grows with the distance but never reaches the dimension", () => {
        const samples = [1, 10, 50, 200, 1000, 100000].map((distance) => rubberBand(distance, 36));
        for (let i = 1; i < samples.length; i++) expect(samples[i]).toBeGreaterThan(samples[i - 1]);
        for (const sample of samples) expect(sample).toBeLessThan(36);
        expect(samples[samples.length - 1]).toBeGreaterThan(35.9);
    });

    it("resists more as the constant drops", () => {
        expect(rubberBand(40, 100, 0.2)).toBeLessThan(rubberBand(40, 100, 0.9));
    });

    it("is roughly linear (scaled by the constant) for tiny pulls", () => {
        expect(rubberBand(1, 1000, 0.5)).toBeCloseTo(0.5, 1);
    });
});

describe("vibrate", () => {
    afterEach(() => {
        Reflect.deleteProperty(navigator, "vibrate");
    });

    it("does nothing where the platform has no haptics", () => {
        expect(() => vibrate(10)).not.toThrow();
    });

    it("forwards the duration", () => {
        const spy = vi.fn();
        Object.defineProperty(navigator, "vibrate", { configurable: true, value: spy });
        vibrate(12);
        expect(spy).toHaveBeenCalledWith(12);
    });

    it("swallows platform errors", () => {
        Object.defineProperty(navigator, "vibrate", {
            configurable: true,
            value: () => {
                throw new Error("blocked");
            },
        });
        expect(() => vibrate(5)).not.toThrow();
    });
});

describe("useControllableState", () => {
    it("owns the state when uncontrolled and reports changes", () => {
        const onChange = vi.fn();
        const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));
        act(() => result.current[1](2));
        expect(result.current[0]).toBe(2);
        expect(onChange).toHaveBeenCalledWith(2);
    });

    it("defers to the value when controlled and only reports", () => {
        const onChange = vi.fn();
        const { result, rerender } = renderHook(({ value }) => useControllableState({ value, defaultValue: 0, onChange }), {
            initialProps: { value: 5 },
        });
        act(() => result.current[1](6));
        expect(result.current[0]).toBe(5);
        expect(onChange).toHaveBeenCalledWith(6);
        rerender({ value: 6 });
        expect(result.current[0]).toBe(6);
    });

    it("chains functional updates made in the same tick", () => {
        const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));
        act(() => {
            result.current[1]((count) => count + 1);
            result.current[1]((count) => count + 1);
            result.current[1]((count) => count + 1);
        });
        expect(result.current[0]).toBe(3);
    });

    it("skips no-op updates", () => {
        const onChange = vi.fn();
        const { result } = renderHook(() => useControllableState({ defaultValue: "a", onChange }));
        act(() => result.current[1]("a"));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("treats null as a real controlled value, not as absent", () => {
        const { result } = renderHook(() => useControllableState<string | null>({ value: null, defaultValue: "x" }));
        expect(result.current[0]).toBeNull();
    });
});

describe("RollingText", () => {
    it("exposes the full text to assistive technology exactly once", () => {
        const { container } = render(<RollingText value="Following" />);
        expect(screen.getByText("Following")).toBeInTheDocument();
        expect(container.querySelector(".__rolling-text__visual")).toHaveAttribute("aria-hidden", "true");
    });

    it("updates the text and only re-keys the characters that changed", () => {
        const { container, rerender } = render(<RollingText value="Send" />);
        const keep = container.querySelector(".__rolling-text__char")!;
        rerender(<RollingText value="Sent" />);
        expect(screen.getByText("Sent")).toBeInTheDocument();
        expect(container.querySelector(".__rolling-text__char")).toBe(keep);
    });

    it("renders nothing visible for an empty string", () => {
        const { container } = render(<RollingText value="" />);
        expect(container.querySelectorAll(".__rolling-text__char")).toHaveLength(0);
    });

    it("keeps spaces", () => {
        const { container } = render(<RollingText value="a b" />);
        expect([...container.querySelectorAll(".__rolling-text__char")].map((node) => node.getAttribute("data-char"))).toEqual(["a", " ", "b"]);
    });

    it("merges a className", () => {
        const { container } = render(<RollingText value="x" className="mine" />);
        expect(container.firstElementChild).toHaveClass("__rolling-text", "mine");
    });
});

describe("RollingDigits", () => {
    it("renders one glyph per digit and a single accessible number", () => {
        const { container } = render(<RollingDigits value={128} />);
        expect(screen.getByText("128")).toBeInTheDocument();
        expect(container.querySelectorAll(".__rolling-text__char")).toHaveLength(3);
    });

    it("keeps units in place when a digit appears on the left", () => {
        const { container, rerender } = render(<RollingDigits value={9} />);
        const units = container.querySelector(".__rolling-text__char")!;
        rerender(<RollingDigits value={19} />);
        expect(screen.getByText("19")).toBeInTheDocument();
        const glyphs = [...container.querySelectorAll(".__rolling-text__char")];
        expect(glyphs.length).toBeGreaterThanOrEqual(2);
        expect(glyphs[glyphs.length - 1]).toBe(units);
        expect(glyphs[glyphs.length - 1]).toHaveAttribute("data-char", "9");
    });

    it("handles negatives and zero", () => {
        const { rerender } = render(<RollingDigits value={0} />);
        expect(screen.getByText("0")).toBeInTheDocument();
        rerender(<RollingDigits value={-3} />);
        expect(screen.getByText("-3")).toBeInTheDocument();
    });

    it("accepts an explicit direction", () => {
        const { rerender } = render(<RollingDigits value={3} direction={-1} />);
        rerender(<RollingDigits value={4} direction={-1} />);
        expect(screen.getByText("4")).toBeInTheDocument();
        fireEvent.click(document.body);
    });
});
