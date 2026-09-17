import { fireEvent, render, screen } from "@testing-library/react";
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

    it("skips disabled tabs for directional and edge navigation", () => {
        render(
            <Tabs active="first">
                <Tab id="first" title="First">
                    First panel
                </Tab>
                <Tab id="disabled" title="Disabled" disabled>
                    Disabled panel
                </Tab>
                <Tab id="last" title="Last">
                    Last panel
                </Tab>
            </Tabs>
        );

        const tablist = screen.getByRole("tablist");
        const first = screen.getByRole("tab", { name: "First" });
        const last = screen.getByRole("tab", { name: "Last" });

        first.focus();
        fireEvent.keyDown(tablist, { key: "ArrowRight" });
        expect(last).toHaveFocus();
        expect(screen.getByRole("tab", { name: "Disabled" })).not.toHaveAttribute("aria-selected", "true");

        fireEvent.keyDown(tablist, { key: "Home" });
        expect(first).toHaveFocus();

        fireEvent.keyDown(tablist, { key: "End" });
        expect(last).toHaveFocus();
    });

    it("does not select or focus a tab when every tab is disabled", () => {
        const onChange = vi.fn();
        render(
            <Tabs active="missing" onChange={onChange}>
                <Tab id="first" title="First" disabled>
                    First panel
                </Tab>
                <Tab id="second" title="Second" disabled>
                    Second panel
                </Tab>
            </Tabs>
        );

        const tablist = screen.getByRole("tablist");
        fireEvent.keyDown(tablist, { key: "ArrowRight" });
        fireEvent.keyDown(tablist, { key: "Home" });
        fireEvent.keyDown(tablist, { key: "End" });

        expect(screen.getByRole("tab", { name: "First" })).not.toHaveFocus();
        expect(screen.getByRole("tab", { name: "Second" })).not.toHaveFocus();
        expect(onChange).not.toHaveBeenCalledWith("first");
        expect(onChange).not.toHaveBeenCalledWith("second");
    });
});
