import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "../src/components/display/calendar/calendar";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const labelFor = (date: Date) =>
    date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const dayCell = (date: Date) => screen.getByRole("button", { name: labelFor(date) }).closest("td");

describe("Calendar range", () => {
    it("marks whole cells across the selected range connection", () => {
        render(
            <ComponentsProvider>
                <Calendar
                    locale="en-US"
                    date={new Date(2026, 6, 5)}
                    type="range"
                    rangeMode
                    range={{ from: new Date(2026, 6, 5), to: new Date(2026, 6, 8) }}
                />
            </ComponentsProvider>
        );

        expect(dayCell(new Date(2026, 6, 5))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 6))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 7))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 8))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 9))).not.toHaveAttribute("data-in-range");
    });

    it("splits a range into row segments around the endpoint circles", () => {
        render(
            <ComponentsProvider>
                <Calendar
                    locale="en-US"
                    date={new Date(2026, 8, 1)}
                    type="range"
                    rangeMode
                    range={{ from: new Date(2026, 8, 10), to: new Date(2026, 8, 24) }}
                />
            </ComponentsProvider>
        );

        expect(dayCell(new Date(2026, 8, 10))).toHaveAttribute("data-range-start", "true");
        expect(dayCell(new Date(2026, 8, 10))).toHaveAttribute("data-range-segment-start", "true");
        expect(dayCell(new Date(2026, 8, 10))).not.toHaveAttribute("data-range-segment-end");
        expect(dayCell(new Date(2026, 8, 13))).toHaveAttribute("data-range-segment-start", "true");
        expect(dayCell(new Date(2026, 8, 19))).toHaveAttribute("data-range-segment-end", "true");
        expect(dayCell(new Date(2026, 8, 20))).toHaveAttribute("data-range-segment-start", "true");
        expect(dayCell(new Date(2026, 8, 24))).toHaveAttribute("data-range-end", "true");
        expect(dayCell(new Date(2026, 8, 24))).toHaveAttribute("data-range-segment-end", "true");
    });

    it("orders range endpoints when the second selected date is earlier", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const futureDate = new Date(2026, 6, 15);
        const earlierDate = new Date(2026, 6, 10);

        render(
            <ComponentsProvider>
                <Calendar locale="en-US" date={futureDate} type="range" rangeMode changeOnlyOnClick onChange={onChange} />
            </ComponentsProvider>
        );

        await user.click(screen.getByRole("button", { name: labelFor(futureDate) }));
        await user.click(screen.getByRole("button", { name: labelFor(earlierDate) }));

        expect(onChange).toHaveBeenLastCalledWith({ from: earlierDate, to: futureDate });
    });

    it("marks range cells from the previous month shown in the current grid", () => {
        render(
            <ComponentsProvider>
                <Calendar
                    locale="en-US"
                    date={new Date(2026, 6, 5)}
                    type="range"
                    rangeMode
                    range={{ from: new Date(2026, 5, 28), to: new Date(2026, 6, 9) }}
                />
            </ComponentsProvider>
        );

        expect(dayCell(new Date(2026, 5, 28))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 5, 29))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 5, 30))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 1))).toHaveAttribute("data-in-range", "true");
    });
});
