import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "../src/components/floating/tooltip/tooltip";
import { Autocomplete } from "../src/components/form/autocomplete/autocomplete";
import { MultiSelect } from "../src/components/form/multi-select/multi-select";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const options = [
    { value: "alpha", label: "Alpha" },
    { value: "bravo", label: "Bravo" },
];

const openPopover = async (field: React.ReactNode) => {
    const user = userEvent.setup();
    render(
        <ComponentsProvider>
            <Tooltip popover as="button" title="Filters">
                {field}
            </Tooltip>
        </ComponentsProvider>
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await screen.findByRole("dialog");
    await user.click(await screen.findByRole("combobox", { name: "Tags" }));
    await screen.findByRole("listbox");
    // MultiSelect moves the combobox role to the input inside the list when it opens.
    return { user, combobox: screen.getByRole("combobox", { name: "Tags" }) };
};

describe("Tooltip popover: Escape closes one layer at a time", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    it("Autocomplete: the first Escape closes the list and keeps focus on the input, the second closes the popover", async () => {
        const { user, combobox } = await openPopover(<Autocomplete title="Tags" name="tags" options={options} />);

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(combobox).toHaveFocus();

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("MultiSelect: the first Escape closes the list, the second closes the popover", async () => {
        const { user } = await openPopover(<MultiSelect title="Tags" name="tags" options={options} />);

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
