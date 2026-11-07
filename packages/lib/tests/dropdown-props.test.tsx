import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "../src/components/floating/dropdown/dropdown";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe("Dropdown props", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    it("draws the arrow by default", async () => {
        render(
            <Dropdown open title="Menu" trigger="Open menu">
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Menu" });
        expect(panel.querySelector("svg")).not.toBeNull();
    });

    it("removes the arrow with arrow={false}", async () => {
        render(
            <Dropdown open arrow={false} title="Menu" trigger="Open menu">
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Menu" });
        expect(panel.querySelector("svg")).toBeNull();
    });

    it("renders no header and no heading without a title, and keeps the aria-label", async () => {
        render(
            <Dropdown open arrow={false} aria-label="Pick an emoji" trigger="Open menu">
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Pick an emoji" });
        expect(panel.querySelector("header")).toBeNull();
        expect(panel.querySelector("h3")).toBeNull();
        expect(panel.firstElementChild).toHaveTextContent("Content");
    });

    it("keeps the header when there is a title", async () => {
        render(
            <Dropdown open arrow={false} title="Menu" trigger="Open menu">
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Menu" });
        expect(panel.querySelector("header h3")).toHaveTextContent("Menu");
    });

    it("merges className on the panel", async () => {
        render(
            <Dropdown open className="w-72" title="Menu" trigger="Open menu">
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Menu" });
        expect(panel).toHaveClass("w-72");
        expect(panel.className).toContain("__dropdown");
    });

    it.each([
        { side: "bottom", align: "start", origin: "left top" },
        { side: "bottom", align: "end", origin: "right top" },
        { side: "bottom", align: undefined, origin: "center top" },
        { side: "top", align: "start", origin: "left bottom" },
    ] as const)("places the panel with side=$side align=$align", async ({ side, align, origin }) => {
        render(
            <Dropdown open side={side} align={align} title="Menu" trigger="Open menu">
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Menu" });
        expect(panel.style.transformOrigin).toBe(origin);
    });

    it("moves focus to the initialFocus element when the panel opens", async () => {
        const Fixture = () => {
            const searchRef = useRef<HTMLInputElement>(null);
            return (
                <Dropdown asChild initialFocus={searchRef} title="Emoji" trigger={<button type="button">Open emoji</button>}>
                    <button type="button">First</button>
                    <input ref={searchRef} aria-label="Search" />
                </Dropdown>
            );
        };
        const user = userEvent.setup();
        render(<Fixture />);
        await user.click(screen.getByRole("button", { name: "Open emoji" }));
        await screen.findByRole("dialog", { name: "Emoji" });
        await waitFor(() => expect(screen.getByRole("textbox", { name: "Search" })).toHaveFocus());
    });

    it("closes on Escape and returns focus to the trigger", async () => {
        const user = userEvent.setup();
        render(
            <Dropdown asChild arrow={false} title="Menu" trigger={<button type="button">Open menu</button>}>
                <button type="button">Item</button>
            </Dropdown>
        );
        const trigger = screen.getByRole("button", { name: "Open menu" });
        await user.click(trigger);
        await screen.findByRole("dialog", { name: "Menu" });
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });
});
