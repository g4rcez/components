import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PageCalendar } from "../src/components/page-calendar/page-calendar";
import { DayView } from "../src/components/page-calendar/day-view";
import { WeekView } from "../src/components/page-calendar/week-view";
import { toDateKey } from "../src/components/page-calendar/page-calendar.utils";
import type { CalendarEvent, CalendarFilter } from "../src/components/page-calendar/page-calendar.types";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const date = new Date(2025, 0, 15, 10);
const events: CalendarEvent[] = [{ id: "planning", title: "Planning session", date, filterId: "meeting" }];
const enabledFilters: CalendarFilter[] = [{ id: "meeting", label: "Meetings", enabled: true, theme: "info" }];

const renderCalendar = (props: Partial<React.ComponentProps<typeof PageCalendar>> = {}) =>
    render(
        <ComponentsProvider>
            <PageCalendar defaultDate={date} events={events} filters={enabledFilters} {...props} />
        </ComponentsProvider>
    );

describe("PageCalendar density geometry", () => {
    it.each(["day", "week"] as const)("keeps %s events aligned with the overridable hour height", (view) => {
        const event = { ...events[0], date: new Date(2025, 0, 15, 10, 30) };
        const props = { currentDate: date, eventsByDate: new Map([[toDateKey(date), [event]]]), onEventClick: vi.fn() };
        render(
            <ComponentsProvider>
                {view === "day" ? <DayView {...props} onDateChange={vi.fn()} /> : <WeekView {...props} days={[date]} />}
            </ComponentsProvider>
        );
        const positionedEvent = screen.getByText("Planning session").closest<HTMLElement>('[role="presentation"]');
        expect(positionedEvent?.style.height).toBe("var(--var-page-calendar-hour-block-size, calc(var(--var-spacing-base) * 3))");
        expect(positionedEvent?.style.top).toContain("--var-page-calendar-hour-block-size");
        expect(positionedEvent?.style.top).toContain("10.5");
        expect(positionedEvent?.style.width).toContain("--var-spacing-base");
    });
});

describe("PageCalendar filters", () => {
    it("renders tag filters and hides events when a filter is disabled", async () => {
        const user = userEvent.setup();
        const onChangeFilters = vi.fn();
        renderCalendar({ onChangeFilters });

        expect(screen.getByText("Planning session")).toBeInTheDocument();
        const filter = screen.getByRole("button", { name: /Meetings, enabled/i });
        expect(filter).toHaveAttribute("aria-pressed", "true");

        await user.click(filter);

        expect(screen.queryByText("Planning session")).not.toBeInTheDocument();
        expect(onChangeFilters).toHaveBeenCalledWith([{ ...enabledFilters[0], enabled: false }]);
    });

    it("synchronizes filter state when controlled filters change", async () => {
        const { rerender } = renderCalendar();

        rerender(
            <ComponentsProvider>
                <PageCalendar defaultDate={date} events={events} filters={[{ ...enabledFilters[0], enabled: false }]} />
            </ComponentsProvider>
        );

        expect(screen.queryByText("Planning session")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Meetings, disabled/i })).toHaveAttribute("aria-pressed", "false");
    });
});
