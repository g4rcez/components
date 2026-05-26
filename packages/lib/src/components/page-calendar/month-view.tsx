import { isSameMonth, isToday } from "date-fns";
import { useLocale } from "../../hooks/use-locale";
import { useTranslations } from "../../hooks/use-translations";
import { css } from "../../lib/dom";
import type { CalendarEvent } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { toDateKey, formatDay, getWeekDays, formatWeekDay, formatFullDate } from "./page-calendar.utils";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

const daysInWeek = 7;

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
    const selectedDateKey = toDateKey(currentDate);
    const selectedDayIndex = useMemo(() => {
        const index = days.findIndex((day) => toDateKey(day) === selectedDateKey);
        return index >= 0 ? index : 0;
    }, [days, selectedDateKey]);
    const [focusedDayIndex, setFocusedDayIndex] = useState(selectedDayIndex);
    const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const weeks = useMemo(() => {
        const rows: Date[][] = [];
        for (let rowStart = 0; rowStart < days.length; rowStart += daysInWeek) {
            rows.push(days.slice(rowStart, rowStart + daysInWeek));
        }
        return rows;
    }, [days]);

    useEffect(() => {
        setFocusedDayIndex(selectedDayIndex);
    }, [selectedDayIndex]);

    const moveFocus = (nextIndex: number) => {
        const boundedIndex = Math.min(Math.max(nextIndex, 0), days.length - 1);
        setFocusedDayIndex(boundedIndex);
        dayButtonRefs.current[boundedIndex]?.focus();
    };

    const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, dayIndex: number) => {
        const weekStart = Math.floor(dayIndex / daysInWeek) * daysInWeek;
        const weekEnd = Math.min(weekStart + daysInWeek - 1, days.length - 1);
        const keyMoves: Partial<Record<string, number>> = {
            ArrowRight: dayIndex + 1,
            ArrowLeft: dayIndex - 1,
            ArrowDown: dayIndex + daysInWeek,
            ArrowUp: dayIndex - daysInWeek,
            Home: weekStart,
            End: weekEnd,
        };
        const nextIndex = keyMoves[event.key];
        if (nextIndex === undefined) return;
        event.preventDefault();
        moveFocus(nextIndex);
    };

    return (
        <div className="flex h-full flex-1 flex-col">
            <div role="grid" aria-label={t.pageCalendarMonthGrid} className="flex flex-1 flex-col">
                <div role="row" className="grid grid-cols-7 border-b border-border">
                    {WEEKDAY_LABELS.map((date) => {
                        const day = formatWeekDay(date, locale);
                        return (
                            <div
                                role="columnheader"
                                key={day}
                                className="py-page-calendar-weekday-py text-center text-page-calendar-weekday-text font-medium text-muted-foreground"
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
                {weeks.map((week, weekIndex) => (
                    <div role="row" key={toDateKey(week[0])} className="grid flex-1 grid-cols-7">
                        {week.map((day, dayIndexInWeek) => {
                            const dayIndex = weekIndex * daysInWeek + dayIndexInWeek;
                            const key = toDateKey(day);
                            const events = eventsByDate.get(key) || [];
                            const isCurrentMonth = isSameMonth(day, currentDate);
                            const isCurrentDay = isToday(day);
                            const isSelected = key === selectedDateKey;
                            return (
                                <div
                                    key={key}
                                    role="gridcell"
                                    aria-selected={isSelected ? true : undefined}
                                    className={css(
                                        "group flex min-h-page-calendar-cell-min-h flex-col gap-page-calendar-cell-gap border-b border-r border-border p-page-calendar-cell-p transition-colors hover:bg-muted hover:bg-opacity-20",
                                        !isCurrentMonth && "opacity-50"
                                    )}
                                >
                                    <button
                                        type="button"
                                        ref={(node) => {
                                            dayButtonRefs.current[dayIndex] = node;
                                        }}
                                        tabIndex={focusedDayIndex === dayIndex ? 0 : -1}
                                        onFocus={() => setFocusedDayIndex(dayIndex)}
                                        onKeyDown={(event) => handleDayKeyDown(event, dayIndex)}
                                        onClick={() => onDayClick(day)}
                                        aria-current={isCurrentDay ? "date" : undefined}
                                        aria-label={`${formatFullDate(day, locale)}${events.length > 0 ? `, ${t.pageCalendarEventCount(events.length)}` : ""}`}
                                        className="flex w-full cursor-pointer items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                                    >
                                        <span
                                            className={`flex size-page-calendar-month-badge-size items-center justify-center rounded-full text-page-calendar-month-badge-text font-medium ${isCurrentDay ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                                        >
                                            {formatDay(day, locale)}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="text-page-calendar-overflow-text leading-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-40"
                                        >
                                            +
                                        </span>
                                    </button>
                                    <div className="min-h-0 flex-1 overflow-y-auto">
                                        <div className="flex flex-col gap-page-calendar-cell-gap-tight">
                                            {events.map((event) => (
                                                <div
                                                    key={event.id}
                                                    role="presentation"
                                                    onClick={(event) => event.stopPropagation()}
                                                    onKeyDown={(event) => event.stopPropagation()}
                                                >
                                                    <EventPill compact event={event} onClick={() => onEventClick(event)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
