import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Empty } from "../src/components/display/empty";

describe("Empty v6 styles", () => {
    it("renders stable root and slot classes", () => {
        const { container } = render(<Empty message="No records" />);

        const root = container.querySelector(".__empty");
        expect(root).toHaveAttribute("data-component", "empty");
        expect(root?.querySelector(".__empty__icon")).toHaveAttribute("data-slot", "icon");
        expect(screen.getByText("No records")).toHaveClass("__empty__message");
        expect(screen.getByText("No records")).toHaveAttribute("data-slot", "message");
    });
});
