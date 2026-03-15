import { isSameMonth, isToday } from "date-fns";
import { useLocale } from "../../hooks/use-locale";
import { useTranslations } from "../../hooks/use-translations";
import type { CalendarEvent } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { toDateKey, formatDay, getWeekDays, formatWeekDay, formatFullDate } from "./page-calendar.utils";
import { useMemo } from "react";

type MonthViewProps = {
    days: Date[];
    currentDate: Date;
    onDayClick: (date: Date) => void;
    eventsByDate: Map<string, CalendarEvent[]>;
    onEventClick: (event: CalendarEvent) => void;
};

export function MonthView({ days, eventsByDate, currentDate, onEventClick, onDayClick }: MonthViewProps) {
    const locale = useLocale();
    const t = useTranslations();
    const WEEKDAY_LABELS = useMemo(() => getWeekDays(new Date()), []);
    return (
        <div className="flex h-full flex-1 flex-col">
            <ul role="row" aria-hidden="true" className="grid grid-cols-7 border-b border-border">
                {WEEKDAY_LABELS.map((date) => {
                    const day = formatWeekDay(date, locale);
                    return (
                        <li key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                            {day}
                        </li>
                    );
                })}
            </ul>
            <div role="grid" aria-label={t.pageCalendarMonthGrid} className="grid flex-1 auto-rows-fr grid-cols-7">
                {days.map((day, idx) => {
                    const key = toDateKey(day);
                    const events = eventsByDate.get(key) || [];
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isCurrentDay = isToday(day);
                    const visible = events.slice(0, 2);
                    const overflow = events.length - 2;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onDayClick(day)}
                            aria-label={`${formatFullDate(day, locale)}${events.length > 0 ? `, ${t.pageCalendarEventCount(events.length)}` : ""}`}
                            className={`group flex min-h-32 cursor-pointer flex-col gap-1 border-b border-r border-border p-2 transition-colors hover:bg-muted hover:bg-opacity-20 ${!isCurrentMonth ? "opacity-50" : ""}`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isCurrentDay ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                                >
                                    {formatDay(day, locale)}
                                </span>
                                <span aria-hidden="true" className="text-lg leading-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-40">
                                    +
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {visible.map((event) => (
                                    <div key={event.id} onClick={(e) => e.stopPropagation()}>
                                        <EventPill compact event={event} onClick={() => onEventClick(event)} />
                                    </div>
                                ))}
                                {overflow > 0 && <span className="pl-1 text-xs text-muted-foreground">{t.pageCalendarMoreEvents(overflow)}</span>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
