import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MultiSelect } from "../src/components/form/multi-select/multi-select";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const options = [
    { label: "Alpha", value: "alpha" },
    { label: "Bravo", value: "bravo" },
];

describe("MultiSelect", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
    });

    afterEach(() => vi.unstubAllGlobals());

    it("renders custom tag content while preserving removal behavior", async () => {
        const user = userEvent.setup();
        const onChangeOptions = vi.fn();

        render(
            <ComponentsProvider>
                <MultiSelect
                    title="Tags"
                    options={options}
                    defaultValue={["alpha"]}
                    onChangeOptions={onChangeOptions}
                    renderTag={(option) => <strong>{String(option.label).toUpperCase()}</strong>}
                />
            </ComponentsProvider>
        );

        expect(screen.getByText("ALPHA")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Remove Alpha" }));

        await waitFor(() => expect(screen.queryByText("ALPHA")).not.toBeInTheDocument());
        expect(onChangeOptions).toHaveBeenLastCalledWith([]);
    });

    it("derives tags and callback values from repeated selection and removal", async () => {
        const user = userEvent.setup();
        const onChangeOptions = vi.fn();
        render(
            <ComponentsProvider>
                <MultiSelect title="Tags" options={options} onChangeOptions={onChangeOptions} />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("combobox", { name: "Tags" }));
        for (let cycle = 0; cycle < 2; cycle += 1) {
            await user.click(await screen.findByRole("option", { name: "Alpha" }));
            expect(onChangeOptions).toHaveBeenLastCalledWith(["alpha"]);
            expect(screen.getByRole("button", { name: "Remove Alpha" })).toBeInTheDocument();
            await user.click(screen.getByRole("button", { name: "Remove Alpha" }));
            expect(onChangeOptions).toHaveBeenLastCalledWith([]);
            expect(screen.queryByRole("button", { name: "Remove Alpha" })).not.toBeInTheDocument();
        }
    });

    it("changes controlled tags only when the parent accepts a selection", async () => {
        const user = userEvent.setup();
        const onChangeOptions = vi.fn();
        const view = (value: string[]) => (
            <ComponentsProvider>
                <MultiSelect title="Tags" options={options} value={value} onChangeOptions={onChangeOptions} />
            </ComponentsProvider>
        );
        const { rerender } = render(view([]));

        await user.click(screen.getByRole("combobox", { name: "Tags" }));
        await user.click(await screen.findByRole("option", { name: "Alpha" }));
        expect(onChangeOptions).toHaveBeenLastCalledWith(["alpha"]);
        expect(screen.queryByRole("button", { name: "Remove Alpha" })).not.toBeInTheDocument();

        rerender(view(["alpha"]));
        await user.click(screen.getByRole("button", { name: "Remove Alpha" }));
        expect(onChangeOptions).toHaveBeenLastCalledWith([]);
        expect(screen.getByRole("button", { name: "Remove Alpha" })).toBeInTheDocument();

        rerender(view([]));
        expect(screen.queryByRole("button", { name: "Remove Alpha" })).not.toBeInTheDocument();
    });

    it("keeps the minimum-width field slot after selecting a tag", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ComponentsProvider>
                <MultiSelect title="Tags" options={options} />
            </ComponentsProvider>
        );
        const field = container.querySelector('fieldset[data-component="multi-select"]');

        expect(field).toHaveClass("__multi-select__field");

        await user.click(screen.getByRole("combobox", { name: "Tags" }));
        await user.click(await screen.findByRole("option", { name: "Alpha" }));

        expect(field).toHaveClass("__multi-select__field");
    });

    it("uses the Checkbox component for option selection state", async () => {
        const user = userEvent.setup();

        render(
            <ComponentsProvider>
                <MultiSelect title="Tags" options={options} />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("combobox", { name: "Tags" }));

        const listbox = await screen.findByRole("listbox");
        const option = await within(listbox).findByRole("option", { name: "Alpha" });
        const checkbox = option.querySelector('input[type="checkbox"]');

        expect(checkbox).not.toBeNull();
        expect(checkbox).not.toBeChecked();

        await user.click(option);

        expect(checkbox).toBeChecked();
    });
});
