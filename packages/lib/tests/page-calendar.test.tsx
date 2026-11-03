import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Locales } from "the-mask-input";
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

    it("stretches the pill to fill the one-hour event block in day and week views", () => {
        const css = readFileSync(resolve(__dirname, "../src/components/page-calendar/page-calendar.css"), "utf8");
        const rule = css.match(/__page-calendar-day-view__event \.__page-calendar-event-pill__button,\s*\.__page-calendar-week-view__event \.__page-calendar-event-pill__button\s*\{([^}]*)\}/);
        expect(rule?.[1]).toContain("block-size: 100%");
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
        const renderView = (locale: Locales) => (
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
        const slots = screen.getAllByRole("button", { name: label });
        expect(slots).toHaveLength(view === "day" ? 1 : 7);
        await user.click(slots.at(-1)!);
        const expected = new Date(view === "day" ? date : days[6]);
        expected.setHours(13, 0, 0, 0);
        expect(onSlotClick).toHaveBeenCalledWith(expected);
    });
});

describe("PageCalendar weekStartsOn", () => {
    // 2025-01-15 is a Wednesday and 2025-01-01 is also a Wednesday.
    const renderEnglish = (props: Partial<React.ComponentProps<typeof PageCalendar>> = {}) =>
        render(
            <ComponentsProvider locale="en-US">
                <PageCalendar defaultDate={date} events={[]} {...props} />
            </ComponentsProvider>
        );

    it("starts the week on Monday by default", () => {
        expect(calendarUtils.getWeekDays(date).map(toDateKey)).toEqual([
            "2025-01-13",
            "2025-01-14",
            "2025-01-15",
            "2025-01-16",
            "2025-01-17",
            "2025-01-18",
            "2025-01-19",
        ]);
    });

    it("starts the week on the chosen weekday", () => {
        expect(calendarUtils.getWeekDays(date, 0).map(toDateKey)[0]).toBe("2025-01-12");
        expect(calendarUtils.getWeekDays(date, 0).map(toDateKey)[6]).toBe("2025-01-18");
        expect(calendarUtils.getWeekDays(date, 6).map(toDateKey)[0]).toBe("2025-01-11");
        expect(calendarUtils.getWeekDays(date, 3).map(toDateKey)[0]).toBe("2025-01-15");
    });

    it("starts the month grid on Monday by default and keeps 42 days", () => {
        const days = calendarUtils.getMonthDays(date);
        expect(days).toHaveLength(42);
        expect(toDateKey(days[0])).toBe("2024-12-30");
        expect(toDateKey(days[41])).toBe("2025-02-09");
    });

    it("starts the month grid on the chosen weekday and keeps 42 days", () => {
        const sunday = calendarUtils.getMonthDays(date, 0);
        expect(sunday).toHaveLength(42);
        expect(toDateKey(sunday[0])).toBe("2024-12-29");
        expect(toDateKey(sunday[41])).toBe("2025-02-08");
        expect(toDateKey(calendarUtils.getMonthDays(date, 6)[0])).toBe("2024-12-28");
        expect(toDateKey(calendarUtils.getMonthDays(date, 3)[0])).toBe("2025-01-01");
    });

    it("orders the month weekday header from Monday by default", () => {
        renderEnglish();
        expect(screen.getAllByRole("columnheader").map((node) => node.textContent)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
        expect(screen.getAllByRole("gridcell")[0].querySelector("button")).toHaveAccessibleName("Monday, Dec 30, 2024");
    });

    it("orders the month weekday header and grid from Sunday when weekStartsOn is 0", () => {
        renderEnglish({ weekStartsOn: 0 });
        expect(screen.getAllByRole("columnheader").map((node) => node.textContent)).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        expect(screen.getAllByRole("gridcell")[0].querySelector("button")).toHaveAccessibleName("Sunday, Dec 29, 2024");
    });

    it("lists the week view days from the chosen weekday", () => {
        renderEnglish({ defaultView: "week", weekStartsOn: 0 });
        expect(screen.getByTitle("Sunday, Jan 12, 2025")).toBeInTheDocument();
        expect(screen.getByTitle("Saturday, Jan 18, 2025")).toBeInTheDocument();
        expect(screen.queryByTitle("Sunday, Jan 19, 2025")).not.toBeInTheDocument();
    });
});
