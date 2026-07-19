import type React from "react";
import { format } from "date-fns";
import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

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

    it("edits both dates inside one range control before applying", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        const ControlledRange = () => {
            const [range, setRange] = useState<DateRangeValue>({ from: new Date(2026, 6, 14), to: new Date(2026, 6, 30) });
            return (
                <DatePicker
                    name="period"
                    title="Report period"
                    type="range"
                    range={range}
                    onChange={(next: Date | DateRangeValue | undefined) => {
                        onChange(next);
                        setRange(next as DateRangeValue);
                    }}
                    rangeLabels={{ apply: "Apply" }}
                />
            );
        };

        render(
            <ComponentsProvider locale="en-US">
                <ControlledRange />
            </ComponentsProvider>
        );

        const group = screen.getByRole("group", { name: "Report period" });
        const from = within(group).getByRole("textbox", { name: "From" });
        const to = within(group).getByRole("textbox", { name: "To" });

        expect((await axe(group)).violations).toHaveLength(0);
        expect(from).toHaveValue("07/14/2026");
        expect(to).toHaveValue("07/30/2026");

        await user.clear(from);
        expect(onChange).not.toHaveBeenCalled();
        expect(to).toHaveValue("07/30/2026");
        await user.type(from, "08/01/2026");
        expect(from).toHaveValue("08/01/2026");
        expect(to).toHaveValue("07/30/2026");
        expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ from: new Date(2026, 7, 1), to: new Date(2026, 6, 30) }));

        await user.clear(to);
        await user.type(to, "08/15/2026");
        expect(from).toHaveValue("08/01/2026");
        expect(to).toHaveValue("08/15/2026");
        expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ from: new Date(2026, 7, 1), to: new Date(2026, 7, 15) }));
    });

    it("keeps the selected to date when typing a new from date after closing the calendar", async () => {
        const user = userEvent.setup();

        const ControlledRange = () => {
            const [range, setRange] = useState<DateRangeValue>(null);
            return (
                <DatePicker
                    name="period"
                    title="Report period"
                    type="range"
                    range={range}
                    onChange={(next: Date | DateRangeValue | undefined) => setRange(next as DateRangeValue)}
                />
            );
        };
        const today = new Date();
        const fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 2);
        const toDate = new Date(today);
        toDate.setDate(today.getDate() - 1);

        render(
            <ComponentsProvider locale="en-US">
                <ControlledRange />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: /open a date picker/i }));
        await user.click(
            screen.getByRole("button", {
                name: fromDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
            })
        );
        await user.click(
            screen.getByRole("button", {
                name: toDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
            })
        );

        const group = screen.getByRole("group", { name: "Report period" });
        const from = within(group).getByRole("textbox", { name: "From" });
        const to = within(group).getByRole("textbox", { name: "To" });
        const nextFromDate = new Date(today);
        nextFromDate.setDate(today.getDate() + 1);

        expect(to).toHaveValue(format(toDate, "MM/dd/yyyy"));
        await user.clear(from);
        await user.type(from, format(nextFromDate, "MM/dd/yyyy"));

        expect(to).toHaveValue(format(toDate, "MM/dd/yyyy"));
    });

    it("selects a preset with floating-ui typeahead before applying the range", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const quarter: DateRangeValue = { from: new Date(2026, 0, 1), to: new Date(2026, 2, 31) };

        renderWithProvider(
            <DatePicker
                name="period"
                title="Period"
                type="range"
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
