import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
                <Calendar locale="en-US" date={new Date(2026, 6, 5)} rangeMode range={{ from: new Date(2026, 6, 5), to: new Date(2026, 6, 8) }} />
            </ComponentsProvider>
        );

        expect(dayCell(new Date(2026, 6, 5))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 6))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 7))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 8))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 9))).not.toHaveAttribute("data-in-range");
    });

    it("marks range cells from the previous month shown in the current grid", () => {
        render(
            <ComponentsProvider>
                <Calendar locale="en-US" date={new Date(2026, 6, 5)} rangeMode range={{ from: new Date(2026, 5, 28), to: new Date(2026, 6, 9) }} />
            </ComponentsProvider>
        );

        expect(dayCell(new Date(2026, 5, 28))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 5, 29))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 5, 30))).toHaveAttribute("data-in-range", "true");
        expect(dayCell(new Date(2026, 6, 1))).toHaveAttribute("data-in-range", "true");
    });
});
