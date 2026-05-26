import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { Toolbar } from "../src/components/floating/toolbar";

describe("Toolbar", () => {
    it("exposes an accessible toolbar name and preserves root props", async () => {
        const { container } = render(
            <Toolbar aria-label="Formatting tools" className="custom-toolbar" data-testid="toolbar">
                <button type="button">Bold</button>
            </Toolbar>
        );

        const toolbar = screen.getByRole("toolbar", { name: "Formatting tools" });
        const axeResults = await axe(container);

        expect(toolbar).toHaveClass("custom-toolbar");
        expect(toolbar).toHaveAttribute("data-testid", "toolbar");
        expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
        expect(axeResults.violations).toHaveLength(0);
    });
});
