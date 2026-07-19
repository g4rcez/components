import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Expand } from "../src/components/floating/expand/expand";

describe("Expand", () => {
    beforeEach(() => {
        global.ResizeObserver = class ResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        };
    });

    it("renders expanded content inside the local floating portal", async () => {
        const { container } = render(
            <Expand trigger="Need help">
                <div>Floating details</div>
            </Expand>
        );

        const trigger = screen.getByRole("button", { name: "Need help" });
        const root = container.querySelector(".__expand");

        expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(root?.querySelector(".__expand__content")).toBeNull();

        fireEvent.click(trigger);

        await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
        const content = root?.querySelector(".__expand__content");
        expect(content).toBeInTheDocument();
        expect(content).not.toHaveStyle({ top: "0px" });
        expect(screen.getByText("Floating details")).toBeInTheDocument();
    });
});
