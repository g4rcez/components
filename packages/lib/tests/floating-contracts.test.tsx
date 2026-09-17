import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { CommandPalette, type CommandItemTypes } from "../src/components/floating/command-palette/command-palette";
import { Dropdown } from "../src/components/floating/dropdown/dropdown";
import { Expand } from "../src/components/floating/expand/expand";
import { Tooltip } from "../src/components/floating/tooltip/tooltip";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe("floating and command contracts", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
        Element.prototype.scrollIntoView = () => {};
    });

    it("keeps a controlled Dropdown closed or open until the parent changes open", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { rerender } = render(
            <Dropdown open={false} onChange={onChange} trigger="Open menu" title="Menu">
                <div>Menu content</div>
            </Dropdown>
        );

        await user.click(screen.getByRole("button", { name: "Open menu" }));
        expect(onChange).toHaveBeenLastCalledWith(true);
        expect(screen.queryByText("Menu content")).not.toBeInTheDocument();

        rerender(
            <Dropdown open title="Menu" onChange={onChange} trigger="Open menu">
                <div>Menu content</div>
            </Dropdown>
        );
        expect(await screen.findByText("Menu content")).toBeInTheDocument();

        onChange.mockClear();
        await user.keyboard("{Escape}");
        expect(onChange).toHaveBeenLastCalledWith(false);
        expect(screen.getByText("Menu content")).toBeInTheDocument();

        rerender(
            <Dropdown open={false} title="Menu" onChange={onChange} trigger="Open menu">
                <div>Menu content</div>
            </Dropdown>
        );
        await waitFor(() => expect(screen.queryByText("Menu content")).not.toBeInTheDocument());
    });

    it("keeps controlled Tooltip changes owned by the parent and preserves no-popover defaults", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const { rerender } = render(
            <Tooltip open={false} popover title="Actions" onChange={onChange}>
                <button type="button">Action content</button>
            </Tooltip>
        );

        await user.click(screen.getByText("Actions"));
        expect(onChange).toHaveBeenLastCalledWith(true);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        rerender(
            <Tooltip open popover title="Actions" onChange={onChange}>
                <button type="button">Action content</button>
            </Tooltip>
        );
        expect(await screen.findByRole("dialog")).toHaveTextContent("Action content");

        rerender(
            <Tooltip open={false} popover title="Actions" onChange={onChange}>
                <button type="button">Action content</button>
            </Tooltip>
        );
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

        rerender(
            <Tooltip title="Plain tooltip">
                <span>Plain content</span>
            </Tooltip>
        );
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("keeps controlled Expand changes owned by the parent", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const { rerender } = render(
            <Expand trigger="Show details" open={false} onOpenChange={onOpenChange}>
                <div>Expanded details</div>
            </Expand>
        );

        await user.click(screen.getByRole("button", { name: "Show details" }));
        expect(onOpenChange).toHaveBeenLastCalledWith(true);
        expect(screen.queryByText("Expanded details")).not.toBeInTheDocument();

        rerender(
            <Expand trigger="Show details" open onOpenChange={onOpenChange}>
                <div>Expanded details</div>
            </Expand>
        );
        expect(await screen.findByText("Expanded details")).toBeInTheDocument();
    });

    it("calls CommandPalette text callbacks and prefers a custom empty message", async () => {
        const user = userEvent.setup();
        const onChangeText = vi.fn();
        const action = vi.fn(({ setText }: { setText: (text: string) => void }) => setText("from action"));
        const commands: CommandItemTypes[] = [{ type: "shortcut", title: "Open item", action }];

        render(
            <ComponentsProvider map={{ commandPaletteEmpty: "Provider empty" }}>
                <CommandPalette open commands={commands} emptyMessage="Nothing here" onChangeText={onChangeText} onChangeVisibility={() => {}} />
            </ComponentsProvider>
        );

        const combobox = await screen.findByRole("combobox", { name: /command palette search/i });
        expect(onChangeText).not.toHaveBeenCalled();
        await user.type(combobox, "missing");
        expect(onChangeText).toHaveBeenLastCalledWith("missing");
        expect(screen.getByText("Nothing here")).toBeInTheDocument();

        await user.clear(combobox);
        await user.click(screen.getByRole("option", { name: "Open item" }));
        expect(action).toHaveBeenCalledTimes(1);
        expect(onChangeText).toHaveBeenLastCalledWith("from action");
    });

    it("exposes one localized loading status for CommandPalette placeholders", async () => {
        render(
            <ComponentsProvider map={{ commandPaletteLoading: "Loading commands" }}>
                <CommandPalette open loading commands={[]} onChangeVisibility={() => {}} />
            </ComponentsProvider>
        );

        const status = await screen.findByRole("status", { name: "Loading commands" });
        expect(status).toHaveAttribute("aria-busy", "true");
        expect(screen.getAllByRole("status")).toHaveLength(1);
    });
});
