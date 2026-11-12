import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "../src/components/floating/dropdown/dropdown";
import { Tooltip } from "../src/components/floating/tooltip/tooltip";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe("Tooltip props", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("wraps the title in a span by default", () => {
        const { container } = render(<Tooltip title="Copy">Copy text</Tooltip>);
        expect(container.firstElementChild?.tagName).toBe("SPAN");
    });

    it("uses the title element itself as the trigger with asChild", () => {
        const { container } = render(
            <Tooltip asChild open title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        const button = screen.getByRole("button", { name: "Copy" });
        expect(container.firstElementChild).toBe(button);
        expect(button).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);
    });

    it("keeps the handler of the asChild trigger", async () => {
        const onClick = vi.fn();
        render(
            <Tooltip
                asChild
                title={
                    <button type="button" onClick={onClick}>
                        Copy
                    </button>
                }
            >
                Copy text
            </Tooltip>
        );
        await userEvent.click(screen.getByRole("button", { name: "Copy" }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it.each(["top", "right", "bottom", "left"] as const)("places the tooltip on the %s side when placement is set", (placement) => {
        render(
            <Tooltip open placement={placement} title="Anchor">
                Content
            </Tooltip>
        );
        expect(screen.getByRole("tooltip")).toHaveAttribute("data-placement", placement);
    });

    it("opens on top by default", () => {
        render(
            <Tooltip open title="Anchor">
                Content
            </Tooltip>
        );
        expect(screen.getByRole("tooltip").getAttribute("data-placement")).toBe("top");
    });

    it("has no arrow by default", () => {
        render(
            <Tooltip open title="Anchor">
                Content
            </Tooltip>
        );
        expect(screen.getByRole("tooltip").querySelector("svg")).toBeNull();
    });

    it("draws the arrow with arrow", () => {
        render(
            <Tooltip open arrow title="Anchor">
                Content
            </Tooltip>
        );
        expect(screen.getByRole("tooltip").querySelector("svg")).not.toBeNull();
    });

    it("draws the arrow by default in popover mode and removes it with arrow={false}", () => {
        const { rerender } = render(
            <Tooltip open popover title="Anchor">
                Content
            </Tooltip>
        );
        expect(screen.getByRole("dialog").querySelector("svg")).not.toBeNull();
        rerender(
            <Tooltip open popover arrow={false} title="Anchor">
                Content
            </Tooltip>
        );
        expect(screen.getByRole("dialog").querySelector("svg")).toBeNull();
    });

    it("closes on click with closeOnClick and stays closed while the pointer moves over the trigger", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild closeOnClick delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        const button = screen.getByRole("button", { name: "Copy" });
        await user.hover(button);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        await user.click(button);
        await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
        await user.pointer({ target: button, coords: { clientX: 3, clientY: 3 } });
        await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
        await user.unhover(button);
        await user.hover(button);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("stays open after a click by default", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        const button = screen.getByRole("button", { name: "Copy" });
        await user.hover(button);
        await user.click(button);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("opens on a touch tap by default", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        await user.pointer({ keys: "[TouchA]", target: screen.getByRole("button", { name: "Copy" }) });
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("does not open on a touch tap with touch={false}", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild touch={false} delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        await user.pointer({ keys: "[TouchA]", target: screen.getByRole("button", { name: "Copy" }) });
        await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    });

    it("opens on a mouse hover with touch={false} after an earlier touch tap", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild touch={false} delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        const button = screen.getByRole("button", { name: "Copy" });
        await user.pointer({ keys: "[TouchA]", target: button });
        await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
        await user.unhover(button);
        await user.hover(button);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("opens on a mouse hover with touch={false}", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild touch={false} delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        await user.hover(screen.getByRole("button", { name: "Copy" }));
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("waits for the open delay on hover", () => {
        vi.useFakeTimers();
        render(
            <Tooltip delay={300} title="Anchor">
                Content
            </Tooltip>
        );
        fireEvent.mouseMove(screen.getByText("Anchor"));
        act(() => {
            vi.advanceTimersByTime(299);
        });
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("closes with Escape", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip asChild delay={0} title={<button type="button">Copy</button>}>
                Copy text
            </Tooltip>
        );
        await user.hover(screen.getByRole("button", { name: "Copy" }));
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        await user.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    });

    describe("Tooltip and Dropdown on the same button", () => {
        const renderShared = () =>
            render(
                <Dropdown
                    asChild
                    title="Files"
                    trigger={
                        <Tooltip asChild closeOnClick delay={0} title={<button type="button">Server files</button>}>
                            Open the server files
                        </Tooltip>
                    }
                >
                    <p>Panel content</p>
                </Dropdown>
            );

        it("renders one button and no wrapper element", () => {
            const { container } = renderShared();
            expect(container.children).toHaveLength(1);
            expect(container.firstElementChild).toBe(screen.getByRole("button", { name: "Server files" }));
        });

        it("shows the tooltip on hover and the dropdown on click, and the click closes the tooltip", async () => {
            const user = userEvent.setup();
            renderShared();
            const button = screen.getByRole("button", { name: "Server files" });
            await user.hover(button);
            expect(screen.getByRole("tooltip")).toHaveTextContent("Open the server files");
            expect(button).toHaveAttribute("aria-expanded", "false");
            await user.click(button);
            await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
            expect(screen.getByRole("dialog")).toHaveTextContent("Panel content");
            expect(button).toHaveAttribute("aria-expanded", "true");
        });
    });

    describe("popover mode on a focusable status icon", () => {
        const renderIcon = () =>
            render(
                <Tooltip asChild popover arrow={false} delay={0} title={<button type="button" aria-label="Sync status" />}>
                    Synced a minute ago
                </Tooltip>
            );

        it("opens on hover", async () => {
            const user = userEvent.setup();
            renderIcon();
            await user.hover(screen.getByLabelText("Sync status"));
            expect(screen.getByRole("dialog")).toHaveTextContent("Synced a minute ago");
        });

        it("opens on keyboard focus", async () => {
            const user = userEvent.setup();
            renderIcon();
            await user.tab();
            expect(screen.getByLabelText("Sync status")).toHaveFocus();
            expect(screen.getByRole("dialog")).toHaveTextContent("Synced a minute ago");
        });

        it("opens on a touch tap", async () => {
            const user = userEvent.setup();
            renderIcon();
            await user.pointer({ keys: "[TouchA]", target: screen.getByLabelText("Sync status") });
            expect(screen.getByRole("dialog")).toHaveTextContent("Synced a minute ago");
        });

        it("closes with Escape and keeps the focus on the trigger", async () => {
            const user = userEvent.setup();
            renderIcon();
            await user.tab();
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            await user.keyboard("{Escape}");
            await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
            expect(screen.getByLabelText("Sync status")).toHaveFocus();
        });
    });
});
