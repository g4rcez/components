import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "../src/components/floating/tooltip";

class TestResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe("Tooltip a11y", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", TestResizeObserver);
    });

    it("uses non-interactive tooltip semantics by default", async () => {
        const { container } = render(
            <Tooltip open title="More information">
                Plain tooltip content
            </Tooltip>
        );

        const trigger = screen.getByText("More information");
        const tooltip = screen.getByRole("tooltip");

        expect(tooltip).toHaveTextContent("Plain tooltip content");
        expect(tooltip.id).not.toBe("");
        expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("keeps explicit popover dialog semantics available", async () => {
        const { container } = render(
            <Tooltip open popover as="button" title="More actions">
                <button type="button">Choose action</button>
            </Tooltip>
        );

        const dialog = screen.getByRole("dialog");

        expect(screen.getByRole("button", { name: "More actions" })).toBeInTheDocument();
        expect(dialog).toHaveTextContent("Choose action");
        expect(screen.getByRole("button", { name: "Choose action" })).toBeInTheDocument();
        expect((await axe(container)).violations).toHaveLength(0);
    });
});
