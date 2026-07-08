import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "../../hooks/use-translations";
import { pageCalendarStyles } from "./page-calendar.styles";
import type { CalendarEvent, CalendarEventBase, CalendarFilter, ViewMode } from "./page-calendar.types";
import { groupEventsByDate, getMonthDays, getWeekDays } from "./page-calendar.utils";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { Loading } from "../display/spinner/spinner";

type PageCalendarProps<T extends CalendarEventBase> = {
    defaultDate?: Date;
    defaultView?: ViewMode;
    filterArea?: ReactNode;
    onAddEvent?: () => void;
    getFilterId?: () => void;
    events: CalendarEvent<T>[];
    loading?: boolean;
    filters?: CalendarFilter[];
    onSlotClick?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    onChangeFilters?: (filters: CalendarFilter[]) => void;
};

const noop: CalendarFilter[] = [];

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
    loading = false,
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
    }, [events, internalFilters, filters, getFilterId]);

    const eventsByDate = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
    const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate]);
    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

    const handleEventClick = (event: CalendarEvent) => onEventClick?.(event);

    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setCurrentView("day");
    };

    return (
        <section
            aria-label={t.pageCalendarLabel}
            aria-busy={loading || undefined}
            data-component="page-calendar"
            className={pageCalendarStyles.className({})}
        >
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
            {loading ? (
                <Loading />
            ) : (
                <>
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
                </>
            )}
        </section>
    );
}
