import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useStableRef } from "../src/hooks/use-stable-ref";

describe("useStableRef", () => {
    it("starts with the initial value", () => {
        const { result } = renderHook(({ value }) => useStableRef(value), { initialProps: { value: "a" } });
        expect(result.current.current).toBe("a");
    });

    it("keeps the same ref object and exposes the latest value", () => {
        const { result, rerender } = renderHook(({ value }) => useStableRef(value), { initialProps: { value: "a" } });
        const ref = result.current;
        rerender({ value: "b" });
        expect(result.current).toBe(ref);
        expect(ref.current).toBe("b");
    });
});
