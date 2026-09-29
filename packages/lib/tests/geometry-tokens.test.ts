import { describe, expect, it } from "vitest";
import { defaultGeometryBases, defaultGeometryTokens, geometryToken } from "../src/styles/geometry-defaults";

describe("geometry token inspection", () => {
    it("exposes shared bases and use-site fallbacks separately", () => {
        expect(defaultGeometryBases).toStrictEqual({ spacing: "1rem", radius: "1rem" });
        expect(defaultGeometryTokens["--var-button-height"]).toBe("calc(var(--var-spacing-base) * 2.5)");
        expect(defaultGeometryTokens["--var-card-surface-radius"]).toBe("calc(var(--var-radius-base) / 4)");
    });

    it("keeps semantic CSS fallbacks reactive to the selected base", () => {
        expect(geometryToken("button-height")).toBe("var(--var-button-height, calc(var(--var-spacing-base) * 2.5))");
        expect(geometryToken("card-surface-radius")).toBe("var(--var-card-surface-radius, calc(var(--var-radius-base) / 4))");
        expect(geometryToken("rounded-full")).toBe("var(--var-rounded-full)");
    });
});
