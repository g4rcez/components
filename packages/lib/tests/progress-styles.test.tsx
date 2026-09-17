import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "../src/components/display/progress/progress";

describe("Progress v6 styles", () => {
    it("renders stable root and slot classes", () => {
        const { container } = render(<Progress value={35} container="custom-root" className="custom-bar" textClassName="custom-label" />);

        const root = container.querySelector(".__progress");
        const indicator = container.querySelector(".__progress__indicator");
        const label = screen.getByText("35 %");

        expect(root).toHaveAttribute("data-component", "progress");
        expect(root).toHaveClass("__progress", "custom-root");
        expect(indicator).toHaveAttribute("data-slot", "indicator");
        expect(indicator).toHaveClass("__progress__indicator", "custom-bar");
        expect(label).toHaveAttribute("data-slot", "label");
        expect(label).toHaveClass("__progress__label", "custom-label");
    });

    it.each([
        { value: -25, expected: "0" },
        { value: 125, expected: "100" },
    ])("clamps the exposed value ($value) to the progress range", ({ value, expected }) => {
        render(<Progress min={0} max={100} value={value} />);

        const progress = screen.getByRole("progressbar");
        expect(progress).toHaveAttribute("aria-valuenow", expected);
    });
});
