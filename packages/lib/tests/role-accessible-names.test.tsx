import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "../src/components/floating/dropdown/dropdown";
import { Expand } from "../src/components/floating/expand/expand";
import { Progress } from "../src/components/display/progress/progress";
import { Tab, Tabs } from "../src/components/display/tabs/tabs";
import { Switch } from "../src/components/form/switch/switch";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe("role-based widget accessible names", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
        Element.prototype.scrollIntoView = () => {};
    });

    it("names a Dropdown dialog from its visible title", () => {
        render(
            <Dropdown open trigger="Open menu" title="Menu settings">
                <p>Menu content</p>
            </Dropdown>
        );

        expect(screen.getByRole("dialog", { name: "Menu settings" })).toBeInTheDocument();
    });

    it("names a Dropdown dialog with consumer ARIA props when its title is absent", () => {
        render(
            <>
                <span id="dropdown-name">Filter options</span>
                <Dropdown open trigger="Open filters" aria-labelledby="dropdown-name">
                    <p>Filter content</p>
                </Dropdown>
            </>
        );

        expect(screen.getByRole("dialog", { name: "Filter options" })).toBeInTheDocument();
    });

    it("accepts an aria-label for a titleless Dropdown dialog", () => {
        render(
            <Dropdown open trigger="Open filters" aria-label="Filter options">
                <p>Filter content</p>
            </Dropdown>
        );

        expect(screen.getByRole("dialog", { name: "Filter options" })).toBeInTheDocument();
    });

    it("names an Expand dialog from its visible trigger", async () => {
        render(
            <Expand trigger="Need help">
                <p>Help content</p>
            </Expand>
        );

        const trigger = screen.getByRole("button", { name: "Need help" });
        fireEvent.click(trigger);
        await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

        expect(screen.getByRole("dialog", { name: "Need help" })).toBeInTheDocument();
    });

    it("uses a consumer name for an icon-only Expand trigger and its dialog", async () => {
        render(
            <Expand trigger={<span aria-hidden="true">?</span>} aria-label="Help options">
                <p>Help content</p>
            </Expand>
        );

        const trigger = screen.getByRole("button", { name: "Help options" });
        fireEvent.click(trigger);
        await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

        expect(screen.getByRole("dialog", { name: "Help options" })).toBeInTheDocument();
    });

    it("uses aria-labelledby on an icon-only Expand trigger and its dialog", async () => {
        render(
            <>
                <span id="expand-trigger-name">Help options</span>
                <Expand trigger={<span aria-hidden="true">?</span>} aria-labelledby="expand-trigger-name">
                    <p>Help content</p>
                </Expand>
            </>
        );

        const trigger = screen.getByRole("button", { name: "Help options" });
        fireEvent.click(trigger);
        await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

        const dialog = await screen.findByRole("dialog");
        expect(dialog).toHaveAccessibleName("Help options");
    });

    it("names Progress from its visible label", () => {
        render(<Progress value={45} label="Uploading files" />);

        expect(screen.getByRole("progressbar", { name: "Uploading files" })).toBeInTheDocument();
    });

    it("uses consumer aria-label or aria-labelledby when Progress has no visible label", () => {
        const { rerender } = render(<Progress value={45} aria-label="Upload progress" />);

        expect(screen.getByRole("progressbar", { name: "Upload progress" })).toBeInTheDocument();

        rerender(
            <>
                <span id="progress-name">Uploading files</span>
                <Progress value={45} aria-labelledby="progress-name" />
            </>
        );

        expect(screen.getByRole("progressbar", { name: "Uploading files" })).toBeInTheDocument();
    });

    it("forwards aria-label and aria-labelledby to the Tabs tablist", () => {
        const { rerender } = render(
            <>
                <span id="tabs-name">Account sections</span>
                <Tabs active="profile" aria-labelledby="tabs-name">
                    <Tab id="profile" title="Profile">
                        Profile content
                    </Tab>
                    <Tab id="security" title="Security">
                        Security content
                    </Tab>
                </Tabs>
            </>
        );

        expect(screen.getByRole("tablist", { name: "Account sections" })).toBeInTheDocument();

        rerender(
            <Tabs active="profile" aria-label="Account sections">
                <Tab id="profile" title="Profile">
                    Profile content
                </Tab>
                <Tab id="security" title="Security">
                    Security content
                </Tab>
            </Tabs>
        );

        expect(screen.getByRole("tablist", { name: "Account sections" })).toBeInTheDocument();
    });

    it("preserves a visible Switch label", () => {
        render(<Switch>Enable notifications</Switch>);

        expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
    });

    it("routes a consumer Switch name to the switch button, not the hidden checkbox", () => {
        const { container } = render(<Switch aria-label="Enable background sync" />);
        const switchButton = screen.getByRole("switch", { name: "Enable background sync" });
        const checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]');

        expect(switchButton).toHaveAttribute("aria-label", "Enable background sync");
        expect(switchButton).not.toHaveAttribute("aria-labelledby");
        expect(checkbox).not.toHaveAttribute("aria-label");
        expect(checkbox).not.toHaveAttribute("aria-labelledby");
        expect(switchButton).toHaveAttribute("aria-checked", "false");

        fireEvent.click(switchButton);

        expect(switchButton).toHaveAttribute("aria-checked", "true");
        expect(checkbox).toBeChecked();
    });

    it("routes consumer aria-labelledby to the Switch button, not the hidden checkbox", () => {
        const { container } = render(
            <>
                <span id="switch-name">Enable quiet mode</span>
                <Switch aria-labelledby="switch-name" />
            </>
        );
        const switchButton = screen.getByRole("switch", { name: "Enable quiet mode" });
        const checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]');

        expect(switchButton).toHaveAttribute("aria-labelledby", "switch-name");
        expect(checkbox).not.toHaveAttribute("aria-label");
        expect(checkbox).not.toHaveAttribute("aria-labelledby");
    });
});
