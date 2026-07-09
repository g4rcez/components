import type React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DatePicker, type DateRangeValue } from "../src/components/form/date-picker/date-picker";
import { Input } from "../src/components/form/input/input";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderWithProvider = (ui: React.ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

describe("DatePicker range picker", () => {
    beforeEach(() => {
        global.ResizeObserver = class ResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        } as unknown as typeof ResizeObserver;
    });

    it("selects a preset with floating-ui typeahead before applying the range", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const quarter: DateRangeValue = { from: new Date(2026, 0, 1), to: new Date(2026, 2, 31) };

        renderWithProvider(
            <DatePicker
                name="period"
                title="Period"
                range={null}
                onChange={onChange}
                rangeLabels={{ searchPlaceholder: "Preset ranges", apply: "Apply" }}
                rangePresets={[
                    { label: "Month to date", range: { from: new Date(2026, 0, 1), to: new Date(2026, 0, 31) } },
                    { label: "Quarter", range: quarter },
                ]}
            />
        );

        await user.click(screen.getByRole("button", { name: /open a date picker/i }));
        const listbox = await screen.findByRole("listbox", { name: "Preset ranges" });

        await user.click(listbox);
        await user.keyboard("Q");
        expect(document.activeElement).toBe(within(listbox).getByRole("option", { name: "Quarter" }));

        await user.keyboard("[Enter]");
        expect(within(listbox).getByRole("option", { name: "Quarter" })).toHaveAttribute("aria-selected", "true");

        await user.click(screen.getByRole("button", { name: "Apply" }));

        await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.objectContaining(quarter)));
    });

    it("does not show an Optional label unless optionalText is explicit", () => {
        const { rerender } = renderWithProvider(<Input name="name" title="Name" />);

        expect(screen.queryByText("Optional")).not.toBeInTheDocument();

        rerender(
            <ComponentsProvider>
                <Input name="name" title="Name" optionalText="Optional" />
            </ComponentsProvider>
        );

        expect(screen.getByText("Optional")).toBeInTheDocument();
    });
});
