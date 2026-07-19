import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tab, Tabs } from "../src/components/display/tabs/tabs";

describe("Tabs", () => {
    it("renders a single animated indicator on the active tab", async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();

        const { container } = render(
            <Tabs active="overview" onChange={onChange}>
                <Tab id="overview" title="Overview">
                    Overview panel
                </Tab>
                <Tab id="usage" title="Usage">
                    Usage panel
                </Tab>
            </Tabs>
        );

        expect(container.querySelectorAll(".__tabs__indicator")).toHaveLength(1);
        expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");

        await user.click(screen.getByRole("tab", { name: "Usage" }));

        expect(container.querySelectorAll(".__tabs__indicator")).toHaveLength(1);
        expect(screen.getByRole("tab", { name: "Usage" })).toHaveAttribute("aria-selected", "true");
        expect(onChange).toHaveBeenLastCalledWith("usage");
    });
});
