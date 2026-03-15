import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "../../hooks/use-translations";
import type { CalendarEvent, CalendarEventBase, CalendarFilter, ViewMode } from "./page-calendar.types";
import { groupEventsByDate, getMonthDays, getWeekDays } from "./page-calendar.utils";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";

type PageCalendarProps<T extends CalendarEventBase> = {
    defaultDate?: Date;
    defaultView?: ViewMode;
    filterArea?: ReactNode;
    onAddEvent?: () => void;
    getFilterId?: () => void;
    events: CalendarEvent<T>[];
    filters?: CalendarFilter[];
    onSlotClick?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    onChangeFilters?: (filters: CalendarFilter[]) => void;
};

const noop: any[] = [];

export function PageCalendar<T extends CalendarEventBase>({
    events,
    filterArea,
    onAddEvent,
    defaultDate,
    onSlotClick,
    getFilterId,
    renderEvent,
    onEventClick,
    filters = noop,
    defaultView = "month",
    onChangeFilters: onActiveFiltersChange,
}: PageCalendarProps<T>) {
    const t = useTranslations();
    const [currentView, setCurrentView] = useState<ViewMode>(defaultView);
    const [currentDate, setCurrentDate] = useState<Date>(() => defaultDate ?? new Date());
    const [internalFilters, setInternalFilters] = useState<CalendarFilter[]>(filters);

    const toggleFilter = (id: string) => {
        setInternalFilters((prev) => {
            const next = prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f));
            onActiveFiltersChange?.(next);
            return next;
        });
    };

    const filteredEvents = useMemo(() => {
        if (filters.length === 0) return events;
        const get = getFilterId ?? ((e: CalendarEvent<T>) => e?.filterId);
        return events.filter((e) => internalFilters.find((f) => f.id === get(e))?.enabled ?? true);
    }, [events, internalFilters, filters]);

    const eventsByDate = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
    const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate]);
    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

    const handleEventClick = (event: CalendarEvent) => onEventClick?.(event);

    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setCurrentView("day");
    };

    return (
        <div role="application" aria-label={t.pageCalendarLabel} className="flex h-full flex-grow flex-col gap-4">
            <CalendarHeader
                filters={internalFilters}
                filterArea={filterArea}
                onAddEvent={onAddEvent}
                currentDate={currentDate}
                currentView={currentView}
                setCurrentDate={setCurrentDate}
                setCurrentView={setCurrentView}
                onToggleFilter={toggleFilter}
            />
            {currentView === "month" && (
                <MonthView
                    days={monthDays}
                    currentDate={currentDate}
                    eventsByDate={eventsByDate}
                    onDayClick={handleDayClick}
                    onEventClick={handleEventClick}
                />
            )}
            {currentView === "week" && (
                <WeekView
                    days={weekDays}
                    currentDate={currentDate}
                    onSlotClick={onSlotClick}
                    eventsByDate={eventsByDate}
                    onEventClick={handleEventClick}
                />
            )}
            {currentView === "day" && (
                <DayView<T>
                    currentDate={currentDate}
                    onSlotClick={onSlotClick}
                    renderEvent={renderEvent}
                    eventsByDate={eventsByDate}
                    onDateChange={setCurrentDate}
                    onEventClick={handleEventClick}
                />
            )}
        </div>
    );
}
