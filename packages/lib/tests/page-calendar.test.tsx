import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PageCalendar } from "../src/components/page-calendar/page-calendar";
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
