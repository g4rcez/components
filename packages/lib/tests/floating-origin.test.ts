import { describe, expect, it } from "vitest";
import { placementOrigin } from "../src/lib/floating-origin";

describe("placementOrigin", () => {
    it("grows a panel below its trigger from the top edge", () => {
        expect(placementOrigin("bottom")).toBe("center top");
        expect(placementOrigin("bottom-start")).toBe("left top");
        expect(placementOrigin("bottom-end")).toBe("right top");
    });

    it("grows a panel above its trigger from the bottom edge", () => {
        expect(placementOrigin("top")).toBe("center bottom");
        expect(placementOrigin("top-start")).toBe("left bottom");
        expect(placementOrigin("top-end")).toBe("right bottom");
    });

    it("grows a panel beside its trigger from the edge facing it", () => {
        expect(placementOrigin("right")).toBe("left center");
        expect(placementOrigin("right-start")).toBe("left top");
        expect(placementOrigin("right-end")).toBe("left bottom");
        expect(placementOrigin("left")).toBe("right center");
        expect(placementOrigin("left-start")).toBe("right top");
        expect(placementOrigin("left-end")).toBe("right bottom");
    });
});
