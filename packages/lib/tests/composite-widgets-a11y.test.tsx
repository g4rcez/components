import React, { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Autocomplete } from "../src/components/form/autocomplete";
import { MultiSelect } from "../src/components/form/multi-select";
import { CommandPalette, type CommandItemTypes } from "../src/components/floating/command-palette";

Element.prototype.scrollIntoView = function scrollIntoView() {};

class ResizeObserverMock {
    constructor(private callback: ResizeObserverCallback) {}
    observe(target: Element) {
        this.callback(
            [
                {
                    target,
                    contentRect: { width: 320, height: 160 } as DOMRectReadOnly,
                    borderBoxSize: [{ inlineSize: 320, blockSize: 160 }] as ResizeObserverSize[],
                    contentBoxSize: [{ inlineSize: 320, blockSize: 160 }] as ResizeObserverSize[],
                    devicePixelContentBoxSize: [{ inlineSize: 320, blockSize: 160 }] as ResizeObserverSize[],
                },
            ],
            this as unknown as ResizeObserver
        );
    }
    unobserve() {}
    disconnect() {}
}

class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

const options = [
    { value: "alpha", label: "Alpha" },
    { value: "bravo", label: "Bravo" },
    { value: "charlie", label: "Charlie" },
];

describe("composite widget a11y", () => {
    it("keeps Autocomplete focus on the combobox while ArrowDown updates aria-activedescendant", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const { container } = render(
            <ComponentsProvider>
                <Autocomplete title="Assignee" name="assignee" placeholder="Pick assignee" options={options} onChange={onChange} />
            </ComponentsProvider>
        );

        const combobox = screen.getByRole("combobox", { name: "Assignee" });
        await user.click(combobox);

        const listbox = await screen.findByRole("listbox");
        await within(listbox).findByRole("option", { name: "Alpha" });
        await user.keyboard("[ArrowDown]");

        const activeId = combobox.getAttribute("aria-activedescendant");
        expect(document.activeElement).toBe(combobox);
        expect(combobox).toHaveAttribute("aria-controls", listbox.id);
        expect(activeId).toBeTruthy();
        expect(within(listbox).getByRole("option", { name: "Alpha" })).toHaveAttribute("id", activeId);
        expect((await axe(listbox)).violations).toHaveLength(0);

        await user.keyboard("[Enter]");

        await waitFor(() => expect(onChange).toHaveBeenCalled());
        await waitFor(() => expect(document.activeElement).toBe(combobox));
        expect(combobox.parentElement).toHaveClass("__form-autocomplete__tw-6");
        expect(combobox).toHaveAttribute("data-value", "alpha");
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("keeps disabled Autocomplete readonly with not-allowed affordances", async () => {
        const user = userEvent.setup();

        const { container } = render(
            <ComponentsProvider>
                <Autocomplete disabled title="Assignee" name="assignee" placeholder="Pick assignee" options={options} />
            </ComponentsProvider>
        );

        const combobox = screen.getByRole("combobox", { name: "Assignee" });
        const caretButton = container.querySelector("button");

        expect(combobox).toBeDisabled();
        expect(combobox).toHaveClass("__form-autocomplete__tw-12");
        expect(caretButton).toBeDisabled();
        expect(caretButton).toHaveClass("__form-autocomplete__tw-8");
        expect(combobox.parentElement).toHaveClass("__form-autocomplete__disabled-border");

        await user.click(combobox);
        if (caretButton) await user.click(caretButton);

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("keeps MultiSelect input focus, exposes selected options, and toggles with Enter and Space", async () => {
        const user = userEvent.setup();
        const onChangeOptions = vi.fn();

        render(
            <ComponentsProvider>
                <MultiSelect title="Tags" name="tags" placeholder="Pick tags" options={options} onChangeOptions={onChangeOptions} />
            </ComponentsProvider>
        );

        await user.click(screen.getByText("Pick tags"));

        const combobox = await screen.findByRole("combobox", { name: "Tags" });
        const listbox = await screen.findByRole("listbox");
        await within(listbox).findByRole("option", { name: "Alpha" });

        await user.keyboard("[ArrowDown]");
        const firstActiveId = combobox.getAttribute("aria-activedescendant");

        expect(document.activeElement).toBe(combobox);
        expect(combobox).toHaveAttribute("aria-controls", listbox.id);
        expect(within(listbox).getByRole("option", { name: "Alpha" })).toHaveAttribute("id", firstActiveId);

        await user.keyboard("[Enter]");

        await waitFor(() => expect(onChangeOptions).toHaveBeenLastCalledWith(["alpha"]));
        expect(within(listbox).getByRole("option", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
        expect(document.activeElement).toBe(combobox);

        await user.keyboard("[ArrowDown][Space]");

        await waitFor(() => expect(onChangeOptions).toHaveBeenLastCalledWith(["alpha", "bravo"]));
        expect(within(listbox).getByRole("option", { name: "Bravo" })).toHaveAttribute("aria-selected", "true");
        expect((await axe(listbox)).violations).toEqual([]);
    });

    it("keeps CommandPalette input focus, runs the active command on Enter, and closes on Escape", async () => {
        const user = userEvent.setup();
        const action = vi.fn();

        const commands: CommandItemTypes[] = [
            { type: "group", title: "Navigation", items: [] },
            { type: "shortcut", title: "Open Alpha", action },
            { type: "shortcut", title: "Open Bravo", action: vi.fn() },
        ];

        const ControlledPalette = () => {
            const [open, setOpen] = useState(true);
            return (
                <ComponentsProvider>
                    <CommandPalette open={open} commands={commands} onChangeVisibility={setOpen} />
                </ComponentsProvider>
            );
        };

        render(<ControlledPalette />);

        const combobox = await screen.findByRole("combobox", { name: /command palette search/i });
        const listbox = await screen.findByRole("listbox");

        await user.click(combobox);
        await user.keyboard("[ArrowDown]");

        const activeId = combobox.getAttribute("aria-activedescendant");
        expect(document.activeElement).toBe(combobox);
        expect(combobox).toHaveAttribute("aria-controls", listbox.id);
        expect(within(listbox).getByRole("option", { name: /Open Alpha/ })).toHaveAttribute("id", activeId);
        expect((await axe(listbox)).violations).toHaveLength(0);

        await user.keyboard("[Enter]");

        expect(action).toHaveBeenCalledTimes(1);
        expect(document.activeElement).toBe(combobox);

        await user.keyboard("[Escape]");

        await waitFor(() => expect(screen.queryByRole("combobox", { name: /command palette search/i })).not.toBeInTheDocument());
    });

    it("keeps CommandPalette arrow navigation inside filtered options", async () => {
        const user = userEvent.setup();
        const alphaAction = vi.fn();
        const bravoAction = vi.fn();
        const charlieAction = vi.fn();

        const commands: CommandItemTypes[] = [
            { type: "group", title: "Navigation", items: [] },
            { type: "shortcut", title: "Open Alpha", action: alphaAction },
            { type: "shortcut", title: "Open Bravo", action: bravoAction },
            { type: "shortcut", title: "Open Charlie", action: charlieAction },
        ];

        render(
            <ComponentsProvider>
                <CommandPalette open commands={commands} onChangeVisibility={() => {}} />
            </ComponentsProvider>
        );

        const combobox = await screen.findByRole("combobox", { name: /command palette search/i });
        const listbox = await screen.findByRole("listbox");

        await user.type(combobox, "bravo");

        const bravoOption = await within(listbox).findByRole("option", { name: /Open Bravo/ });
        expect(within(listbox).queryByRole("option", { name: /Open Alpha/ })).not.toBeInTheDocument();
        expect(within(listbox).queryByRole("option", { name: /Open Charlie/ })).not.toBeInTheDocument();

        await user.keyboard("[ArrowDown][ArrowDown]");

        expect(document.activeElement).toBe(combobox);
        expect(bravoOption).toHaveAttribute("id", combobox.getAttribute("aria-activedescendant"));

        await user.keyboard("[Enter]");

        expect(alphaAction).not.toHaveBeenCalled();
        expect(bravoAction).toHaveBeenCalledTimes(1);
        expect(charlieAction).not.toHaveBeenCalled();
    });

    it("uses provider map labels for CommandPalette title, search, placeholder, and results", async () => {
        const user = userEvent.setup();

        const commands: CommandItemTypes[] = [
            { type: "group", title: "Navigation", items: [] },
            { type: "shortcut", title: "Open Alpha", action: vi.fn() },
        ];

        render(
            <ComponentsProvider
                map={{
                    commandPaletteResults: "Matches",
                    commandPaletteSearchLabel: "Find action",
                    commandPaletteSearchPlaceholder: "Type action",
                    commandPaletteTitle: "Actions",
                }}
            >
                <CommandPalette open commands={commands} onChangeVisibility={() => {}} />
            </ComponentsProvider>
        );

        expect(await screen.findByRole("dialog", { name: "Actions" })).toBeInTheDocument();

        const combobox = screen.getByRole("combobox", { name: "Find action" });
        expect(combobox).toHaveAttribute("placeholder", "Type action");

        await user.type(combobox, "alpha");

        expect(screen.getByText("Matches")).toBeInTheDocument();
    });
});
