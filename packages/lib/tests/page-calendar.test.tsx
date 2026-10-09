import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PageCalendar } from "../src/components/page-calendar/page-calendar";
import { DayView } from "../src/components/page-calendar/day-view";
import { WeekView } from "../src/components/page-calendar/week-view";
import { toDateKey } from "../src/components/page-calendar/page-calendar.utils";
import * as calendarUtils from "../src/components/page-calendar/page-calendar.utils";
import type { CalendarEvent, CalendarFilter } from "../src/components/page-calendar/page-calendar.types";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const date = new Date(2025, 0, 15, 10);
const events: CalendarEvent[] = [{ id: "planning", title: "Planning session", date, filterId: "meeting" }];
const enabledFilters: CalendarFilter[] = [{ id: "meeting", label: "Meetings", enabled: true, theme: "info" }];

afterEach(() => vi.restoreAllMocks());

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
    it("preserves first-match filters, unmatched events and source order", () => {
        const filterEvents: CalendarEvent[] = [
            { id: "first", title: "First visible", date, filterId: "unknown" },
            { id: "hidden", title: "Hidden meeting", date, filterId: "meeting" },
            { id: "last", title: "Last visible", date },
        ];
        const filters = [{ ...enabledFilters[0], enabled: false }, enabledFilters[0]];
        renderCalendar({ events: filterEvents, filters, filterArea: <span>Filters</span> });
        expect(screen.queryByText("Hidden meeting")).not.toBeInTheDocument();
        expect(screen.getAllByText(/^(First|Last) visible$/).map((node) => node.textContent)).toEqual(["First visible", "Last visible"]);
    });

    it("resolves each event once with filters and skips resolution for empty filters", () => {
        const filterEvents = [events[0], { ...events[0], id: "unknown", title: "Unknown event" }];
        const getFilterId = vi.fn((event: CalendarEvent) => (event.id === "planning" ? "meeting" : undefined));
        const filters = [
            { ...enabledFilters[0], id: "other" },
            { ...enabledFilters[0], enabled: false },
        ];
        const { rerender } = renderCalendar({ events: filterEvents, filters, getFilterId });
        expect(getFilterId).toHaveBeenCalledTimes(filterEvents.length);
        expect(screen.queryByText("Planning session")).not.toBeInTheDocument();
        expect(screen.getByText("Unknown event")).toBeInTheDocument();

        getFilterId.mockClear();
        rerender(
            <ComponentsProvider>
                <PageCalendar defaultDate={date} events={filterEvents} filters={[]} getFilterId={getFilterId} />
            </ComponentsProvider>
        );
        expect(getFilterId).not.toHaveBeenCalled();
        expect(screen.getByText("Planning session")).toBeInTheDocument();
    });

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

describe("PageCalendar formatting", () => {
    const formats: [typeof calendarUtils.formatDay, Intl.DateTimeFormatOptions][] = [
        [calendarUtils.formatEventTime, { hour: "2-digit", minute: "2-digit", hour12: false }],
        [calendarUtils.formatTime, { hour: "2-digit", minute: "2-digit", hour12: false }],
        [calendarUtils.formatDay, { day: "numeric" }],
        [calendarUtils.formatWeekDay, { weekday: "short" }],
        [calendarUtils.formatWeekdayShort, { weekday: "short" }],
        [calendarUtils.formatWeekdayLong, { weekday: "long" }],
        [calendarUtils.formatMonthYear, { month: "long", year: "numeric" }],
        [calendarUtils.formatMonthShort, { month: "short" }],
        [calendarUtils.formatFullDate, { weekday: "long", month: "short", day: "numeric", year: "numeric" }],
    ];

    it.each([undefined, "en-US", "pt-BR", "ar-EG"])("preserves native date and hour output for %s", (locale) => {
        for (const [format, options] of formats) {
            expect(format(date, locale)).toBe(new Intl.DateTimeFormat(locale, options).format(date));
            expect(() => format(new Date(Number.NaN), locale)).toThrow(RangeError);
            expect(() => format(date, "invalid_locale")).toThrow(RangeError);
        }
        for (const hour of [0, 1, 12, 23, 24]) {
            expect(calendarUtils.formatHourLabel(hour, locale)).toBe(
                new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(0, 0, 0, hour))
            );
        }
        expect(() => calendarUtils.formatHourLabel(Number.NaN, locale)).toThrow(RangeError);
    });

    it("reuses formatters by locale and options while keeping the cache bounded", async () => {
        vi.resetModules();
        const utils = await import("../src/components/page-calendar/page-calendar.utils");
        const DateTimeFormat = Intl.DateTimeFormat;
        const formatter = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(function (locale, options) {
            return new DateTimeFormat(locale, options);
        });
        utils.formatTime(date);
        utils.formatEventTime(date);
        utils.formatHourLabel(12);
        expect(formatter).toHaveBeenCalledTimes(1);
        utils.formatTime(date, "en-US");
        utils.formatDay(date, "en-US");
        utils.formatDay(date, "en-US");
        expect(formatter).toHaveBeenCalledTimes(3);
        for (let index = 0; index < 100; index++) utils.formatTime(date, `en-US-x-${index}`);
        formatter.mockClear();
        utils.formatTime(date);
        expect(formatter).toHaveBeenCalledTimes(1);
    });

    it.each(["day", "week"] as const)("memoizes %s hour labels and updates locale without changing slot dates", async (view) => {
        const user = userEvent.setup();
        const onSlotClick = vi.fn();
        const labels = vi.spyOn(calendarUtils, "formatHourLabel");
        const days = calendarUtils.getWeekDays(date);
        const props = { currentDate: date, eventsByDate: new Map<string, CalendarEvent[]>(), onEventClick: vi.fn(), onSlotClick };
        const renderView = (locale: string) => (
            <ComponentsProvider locale={locale}>
                {view === "day" ? <DayView {...props} onDateChange={vi.fn()} /> : <WeekView {...props} days={days} />}
            </ComponentsProvider>
        );
        const { rerender } = render(renderView("en-US"));
        expect(labels).toHaveBeenCalledTimes(24);
        labels.mockClear();
        rerender(renderView("en-US"));
        expect(labels).not.toHaveBeenCalled();
        rerender(renderView("ar-EG"));
        expect(labels).toHaveBeenCalledTimes(24);

        const label = new Intl.DateTimeFormat("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(0, 0, 0, 13));
        const slots = screen.getAllByRole("button", { name: label, exact: true });
        expect(slots).toHaveLength(view === "day" ? 1 : 7);
        await user.click(slots.at(-1)!);
        const expected = new Date(view === "day" ? date : days[6]);
        expected.setHours(13, 0, 0, 0);
        expect(onSlotClick).toHaveBeenCalledWith(expected);
    });
});
