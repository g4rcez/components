import React, { useState } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Autocomplete } from "../src/components/form/autocomplete/autocomplete";
import { autocompleteStyles } from "../src/components/form/autocomplete/autocomplete.styles";
import { MultiSelect } from "../src/components/form/multi-select/multi-select";
import { CommandPalette, type CommandItemTypes } from "../src/components/floating/command-palette/command-palette";
import { CombiKeys } from "../src/lib/combi-keys";

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
    it("associates Autocomplete and MultiSelect errors with their comboboxes", () => {
        render(
            <ComponentsProvider>
                <Autocomplete title="Assignee" name="assignee" error="Choose an assignee" options={options} />
                <MultiSelect title="Tags" name="tags" error="Choose at least one tag" options={options} />
            </ComponentsProvider>
        );

        const autocomplete = screen.getByRole("combobox", { name: "Assignee" });
        const multiSelect = screen.getByRole("combobox", { name: "Tags" });

        expect(autocomplete).toHaveAttribute("aria-invalid", "true");
        expect(autocomplete).toHaveAttribute("aria-describedby", "assignee-shadow-error");
        expect(multiSelect).toHaveAttribute("aria-invalid", "true");
        expect(multiSelect).toHaveAttribute("aria-describedby", "tags-error");
        expect(screen.getByText("Choose an assignee")).toHaveAttribute("id", "assignee-shadow-error");
        expect(screen.getByText("Choose at least one tag")).toHaveAttribute("id", "tags-error");
    });

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
        expect(combobox.parentElement).toHaveClass("__autocomplete__field-state");
        expect(combobox).toHaveAttribute("data-value", "alpha");
        expect((await axe(container)).violations).toHaveLength(0);

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        await user.click(combobox);
        expect(await screen.findByRole("listbox")).toBeInTheDocument();
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
        expect(combobox).toHaveClass("__autocomplete__input");
        expect(combobox).not.toHaveClass("__autocomplete__control-state");
        expect(caretButton).toBeDisabled();
        expect(caretButton).toHaveClass("__autocomplete__action");
        expect(combobox.parentElement).toHaveClass(autocompleteStyles.slots["disabled-border"]);

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

        const trigger = screen.getByRole("combobox", { name: "Tags" });
        await user.click(trigger);

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

        trigger.focus();
        await user.keyboard("[Escape]");
        await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
        expect(document.activeElement).toBe(trigger);

        await user.click(trigger);
        expect(await screen.findByRole("listbox")).toBeInTheDocument();
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
        expect(screen.queryByRole("button", { name: /preview|filters/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("region", { name: "Command preview" })).not.toBeInTheDocument();
        expect(document.querySelector('[data-component="command-palette-filters"]')).toBeNull();

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
    it("renders user-provided filters and toggles them independently from the preview", async () => {
        const user = userEvent.setup();
        const filterAction = vi.fn();
        const commands: CommandItemTypes[] = [
            { type: "shortcut", title: "Open Alpha", action: vi.fn() },
            { type: "shortcut", title: "Open Bravo", action: vi.fn() },
        ];

        render(
            <ComponentsProvider>
                <CommandPalette
                    open
                    commands={commands}
                    onChangeVisibility={() => {}}
                    filters={
                        <button type="button" onClick={filterAction}>
                            Only documents
                        </button>
                    }
                    Preview={({ command }) => <p>Preview: {typeof command.title === "string" ? command.title : "Command"}</p>}
                />
            </ComponentsProvider>
        );

        const preview = await screen.findByRole("region", { name: "Command preview" });
        const filters = screen.getByRole("button", { name: "Only documents" }).closest('[data-component="command-palette-filters"]') as HTMLElement;
        const combobox = screen.getByRole("combobox", { name: /command palette search/i });
        const listbox = screen.getByRole("listbox");
        const firstOption = within(listbox).getByRole("option", { name: "Open Alpha" });
        const secondOption = within(listbox).getByRole("option", { name: "Open Bravo" });
        const hidePreview = screen.getByRole("button", { name: "Hide preview" });
        const hideFilters = screen.getByRole("button", { name: "Hide filters" });

        expect(hidePreview).toHaveAttribute("aria-expanded", "true");
        expect(hidePreview).toHaveAttribute("aria-controls", preview.id);
        expect(preview).toHaveTextContent("Preview: Open Alpha");
        expect(firstOption).toHaveAttribute("aria-selected", "true");
        expect(combobox).toHaveAttribute("aria-activedescendant", firstOption.id);
        expect(hideFilters).toHaveAttribute("aria-expanded", "true");
        expect(hideFilters).toHaveAttribute("aria-controls", filters.id);
        expect(filters).not.toHaveAttribute("hidden");

        await user.click(screen.getByRole("button", { name: "Only documents" }));
        expect(filterAction).toHaveBeenCalledTimes(1);

        await user.click(combobox);
        await user.keyboard("[ArrowDown]");
        expect(secondOption).toHaveAttribute("aria-selected", "true");
        expect(preview).toHaveTextContent("Preview: Open Bravo");

        await user.click(hidePreview);
        expect(preview).toHaveAttribute("hidden");
        expect(screen.getByRole("button", { name: "Show preview" })).toHaveAttribute("aria-expanded", "false");
        expect(filters).not.toHaveAttribute("hidden");

        await user.click(hideFilters);
        expect(filters).toHaveAttribute("hidden");
        expect(preview).toHaveAttribute("hidden");

        await user.click(screen.getByRole("button", { name: "Show filters" }));
        expect(filters).not.toHaveAttribute("hidden");
        await user.click(screen.getByRole("button", { name: "Show preview" }));
        expect(preview).not.toHaveAttribute("hidden");
        const previewAccessibility = await axe(preview);
        const filtersAccessibility = await axe(filters);
        expect([...previewAccessibility.violations, ...filtersAccessibility.violations]).toEqual([]);
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

    it("reuses CommandPalette search and shortcuts during navigation and view toggles", async () => {
        const user = userEvent.setup();
        const enabled = vi.fn(({ text }: { text: string }) => text === "open");
        const commands: CommandItemTypes[] = [
            {
                type: "group",
                title: "Navigation",
                items: [
                    { type: "shortcut", title: "Open Alpha", action: vi.fn() },
                    { type: "shortcut", title: "Open Bravo", action: vi.fn() },
                    { type: "shortcut", title: "Conditional", enabled, action: vi.fn() },
                ],
            },
        ];
        const register = vi.spyOn(CombiKeys.prototype, "register");
        try {
            render(
                <ComponentsProvider>
                    <CommandPalette
                        open
                        commands={commands}
                        onChangeVisibility={() => {}}
                        filters={<span>Filters</span>}
                        Preview={({ command }) => <span>{typeof command.title === "string" ? command.title : "Preview"}</span>}
                    />
                </ComponentsProvider>
            );
            const combobox = await screen.findByRole("combobox", { name: /command palette search/i });
            await user.type(combobox, "open");
            expect(screen.getByRole("option", { name: "Conditional" })).toBeInTheDocument();
            const evaluations = enabled.mock.calls.length;
            const registrations = register.mock.calls.length;
            expect(evaluations).toBeGreaterThan(0);

            await user.keyboard("[ArrowDown][ArrowUp]");
            await user.click(screen.getByRole("button", { name: "Hide preview" }));
            await user.click(screen.getByRole("button", { name: "Hide filters" }));

            expect(enabled).toHaveBeenCalledTimes(evaluations);
            expect(register).toHaveBeenCalledTimes(registrations);

            fireEvent.change(combobox, { target: { value: "bravo" } });
            expect(enabled).toHaveBeenCalledTimes(evaluations + 1);
            expect(screen.queryByRole("option", { name: "Conditional" })).not.toBeInTheDocument();
            expect(screen.getByRole("option", { name: "Open Bravo" })).toHaveAttribute("aria-selected", "true");
            expect(register).toHaveBeenCalledTimes(registrations);
        } finally {
            register.mockRestore();
        }
    });

    it("uses current text and callbacks and replaces changed CommandPalette shortcuts", async () => {
        const oldVisibility = vi.fn();
        const visibility = vi.fn();
        const oldChangeText = vi.fn();
        const changeText = vi.fn();
        const action = vi.fn(({ setText }: { setText: (text: string) => void }) => setText("alpha updated"));
        const replacementAction = vi.fn();
        const commands: CommandItemTypes[] = [{ type: "shortcut", title: "Alpha", shortcut: "Control + j", action }];
        const register = vi.spyOn(CombiKeys.prototype, "register");
        try {
            const { rerender, unmount } = render(
                <ComponentsProvider>
                    <CommandPalette open commands={commands} bind="Control + k" onChangeVisibility={oldVisibility} onChangeText={oldChangeText} />
                </ComponentsProvider>
            );
            const combobox = await screen.findByRole("combobox", { name: /command palette search/i });
            fireEvent.change(combobox, { target: { value: "alpha" } });
            const registrations = register.mock.calls.length;
            rerender(
                <ComponentsProvider>
                    <CommandPalette open commands={commands} bind="Control + k" onChangeVisibility={visibility} onChangeText={changeText} />
                </ComponentsProvider>
            );
            expect(register).toHaveBeenCalledTimes(registrations);
            fireEvent.keyDown(document.body, { key: "j", ctrlKey: true });
            expect(action).toHaveBeenCalledTimes(1);
            expect(action).toHaveBeenLastCalledWith(expect.objectContaining({ text: "alpha", setOpen: visibility }));
            expect(changeText).toHaveBeenLastCalledWith("alpha updated");
            expect(combobox).toHaveValue("alpha updated");
            fireEvent.keyDown(document.body, { key: "k", ctrlKey: true });
            expect(visibility).toHaveBeenLastCalledWith(true);
            expect(oldVisibility).not.toHaveBeenCalled();

            const replacement: CommandItemTypes[] = [{ type: "shortcut", title: "Bravo", shortcut: "Control + l", action: replacementAction }];
            rerender(
                <ComponentsProvider>
                    <CommandPalette open commands={replacement} bind="Control + p" onChangeVisibility={visibility} onChangeText={changeText} />
                </ComponentsProvider>
            );
            fireEvent.change(combobox, { target: { value: "bravo" } });
            expect(changeText).toHaveBeenLastCalledWith("bravo");
            expect(oldChangeText).toHaveBeenCalledTimes(1);
            expect(screen.getByRole("option", { name: /Bravo/ })).toBeInTheDocument();
            visibility.mockClear();
            fireEvent.keyDown(document.body, { key: "j", ctrlKey: true });
            fireEvent.keyDown(document.body, { key: "k", ctrlKey: true });
            expect(action).toHaveBeenCalledTimes(1);
            expect(visibility).not.toHaveBeenCalled();
            fireEvent.keyDown(document.body, { key: "l", ctrlKey: true });
            expect(replacementAction).toHaveBeenCalledWith(expect.objectContaining({ text: "bravo" }));
            fireEvent.keyDown(document.body, { key: "p", ctrlKey: true });
            expect(visibility).toHaveBeenLastCalledWith(true);
            unmount();
            fireEvent.keyDown(document.body, { key: "l", ctrlKey: true });
            expect(replacementAction).toHaveBeenCalledTimes(1);
        } finally {
            register.mockRestore();
        }
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
