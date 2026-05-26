import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { MonthView } from "../src/components/page-calendar/month-view";
import { formatFullDate, getMonthDays } from "../src/components/page-calendar/page-calendar.utils";
import type { CalendarEvent } from "../src/components/page-calendar/page-calendar.types";

const selectedDate = new Date(2026, 4, 13, 12);
const today = new Date(2026, 4, 15, 12);

function getDateName(date: Date) {
    return formatFullDate(date);
}

function renderMonthView(options?: Partial<{ currentDate: Date; eventsByDate: Map<string, CalendarEvent[]> }>) {
    const currentDate = options?.currentDate ?? selectedDate;
    return render(
        <ComponentsProvider>
            <MonthView
                days={getMonthDays(currentDate)}
                currentDate={currentDate}
                eventsByDate={options?.eventsByDate ?? new Map()}
                onDayClick={vi.fn()}
                onEventClick={vi.fn()}
            />
        </ComponentsProvider>
    );
}

function getDayButton(date: Date) {
    return screen.getByRole("button", { name: getDateName(date) });
}

function getDayGridcell(date: Date) {
    return getDayButton(date).closest('[role="gridcell"]');
}

afterEach(() => {
    vi.useRealTimers();
});

describe("MonthView a11y", () => {
    it("exposes a grid with row and gridcell semantics plus one date button per day", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(today);
        const { container } = renderMonthView();

        const grid = screen.getByRole("grid", { name: "Calendar month" });
        const rows = within(grid).getAllByRole("row");
        const weekRows = rows.slice(1);

        expect(within(rows[0]).getAllByRole("columnheader")).toHaveLength(7);
        expect(weekRows).toHaveLength(6);
        expect(weekRows.flatMap((row) => within(row).getAllByRole("gridcell"))).toHaveLength(42);
        expect(within(grid).getAllByRole("button")).toHaveLength(42);

        expect(getDayButton(selectedDate)).toHaveAccessibleName("Wednesday, May 13, 2026");
        expect(getDayGridcell(selectedDate)).toHaveAttribute("aria-selected", "true");
        expect(getDayButton(today)).toHaveAttribute("aria-current", "date");
        expect((await axe(container)).violations).toEqual([]);
    });

    it("keeps one tabbable day and moves focus with bounded calendar grid keys", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.setSystemTime(today);
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        renderMonthView();

        const grid = screen.getByRole("grid", { name: "Calendar month" });
        const dayButtons = within(grid).getAllByRole("button");

        expect(dayButtons.filter((button) => button.tabIndex === 0)).toEqual([getDayButton(selectedDate)]);
        expect(dayButtons.filter((button) => button.tabIndex === -1)).toHaveLength(41);

        getDayButton(selectedDate).focus();
        await user.keyboard("[ArrowRight]");
        expect(document.activeElement).toBe(getDayButton(new Date(2026, 4, 14, 12)));

        await user.keyboard("[ArrowLeft]");
        expect(document.activeElement).toBe(getDayButton(selectedDate));

        await user.keyboard("[ArrowDown]");
        expect(document.activeElement).toBe(getDayButton(new Date(2026, 4, 20, 12)));

        await user.keyboard("[ArrowUp]");
        expect(document.activeElement).toBe(getDayButton(selectedDate));

        await user.keyboard("[End]");
        expect(document.activeElement).toBe(getDayButton(new Date(2026, 4, 17, 12)));

        await user.keyboard("[Home]");
        expect(document.activeElement).toBe(getDayButton(new Date(2026, 4, 11, 12)));
    });
});
