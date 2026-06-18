import { isToday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Tag } from "../core/tag";
import { useLocale } from "../../hooks/use-locale";
import type { CalendarEvent, CalendarEventBase } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { Calendar } from "../display/calendar";
import {
    getHourSlots,
    toDateKey,
    formatDay,
    formatWeekdayLong,
    formatMonthYear,
    formatHourLabel,
    formatFullDate,
    formatTime,
    computeEventColumns,
} from "./page-calendar.utils";

const HOUR_HEIGHT = 48;

function getTopOffset(event: CalendarEvent): number {
    const hour = event.date.getHours();
    const minutes = event.date.getMinutes();
    return hour * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT;
}

type DayViewProps<T extends CalendarEventBase> = {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onSlotClick?: (date: Date) => void;
    eventsByDate: Map<string, CalendarEvent<T>[]>;
    onEventClick: (event: CalendarEvent<T>) => void;
    renderEvent?: (event: CalendarEvent<T>) => React.ReactNode;
};

export function DayView<T extends CalendarEventBase>({
    currentDate,
    onSlotClick,
    renderEvent,
    eventsByDate,
    onDateChange,
    onEventClick,
}: DayViewProps<T>) {
    const locale = useLocale();
    const currentHourRef = useRef<HTMLDivElement>(null);
    const scrollBodyRef = useRef<HTMLDivElement>(null);
    const hours = getHourSlots();
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent<T> | null>(null);

    useEffect(() => {
        if (scrollBodyRef.current && currentHourRef.current) {
            const top = currentHourRef.current.offsetTop;
            scrollBodyRef.current.scrollTop = top - scrollBodyRef.current.clientHeight / 2;
        }
    }, []);

    const dayKey = toDateKey(currentDate);
    const events = eventsByDate.get(dayKey) || [];

    const RenderOnDay = ({ date }: { date: Date }) => {
        const key = toDateKey(date);
        const hasEvents = (eventsByDate.get(key) || []).length > 0;
        const isSelected = toDateKey(date) === toDateKey(currentDate);
        if (!hasEvents || isSelected) return null;
        return <span className="__page-calendar-day-view__tw-1" />;
    };

    const handleEventClick = (event: CalendarEvent<T>) => {
        setSelectedEvent(event);
        onEventClick(event);
    };

    return (
        <div className="__page-calendar-day-view__tw-2">
            <div className="__page-calendar-day-view__tw-3 __page-calendar-day-view__tw-extra-1">
                <div aria-label={formatFullDate(currentDate, locale)} className="__page-calendar-day-view__tw-4 __page-calendar-day-view__tw-extra-2">
                    <span
                        className={`__page-calendar-day-view__tw-5 ${isToday(currentDate) ? "__page-calendar-day-view__tw-6" : "__page-calendar-day-view__tw-7"}`}
                    >
                        {formatDay(currentDate, locale)}
                    </span>
                    <div>
                        <div className="__page-calendar-day-view__tw-8">{formatWeekdayLong(currentDate, locale)}</div>
                        <div className="__page-calendar-day-view__tw-9">{formatMonthYear(currentDate, locale)}</div>
                    </div>
                </div>
                <div ref={scrollBodyRef} className="__page-calendar-day-view__tw-10">
                    <div className="__page-calendar-day-view__tw-11 __page-calendar-day-view__tw-extra-2">
                        {hours.map((hour) => (
                            <div key={hour} className="__page-calendar-day-view__tw-12" style={{ height: HOUR_HEIGHT }}>
                                <span className="__page-calendar-day-view__tw-13">{hour === 0 ? "" : formatHourLabel(hour, locale)}</span>
                                {hour === new Date().getHours() && <div ref={currentHourRef} />}
                            </div>
                        ))}
                    </div>
                    <div className="__page-calendar-day-view__tw-14">
                        {hours.map((hour) => {
                            const slotDate = new Date(currentDate);
                            slotDate.setHours(hour, 0, 0, 0);
                            return (
                                <button
                                    key={hour}
                                    type="button"
                                    aria-label={formatHourLabel(hour, locale)}
                                    className="__page-calendar-day-view__tw-15"
                                    style={{ height: HOUR_HEIGHT }}
                                    onClick={() => onSlotClick?.(slotDate)}
                                />
                            );
                        })}
                        {computeEventColumns(events).map(({ event, columnIndex, columnCount }) => (
                            <div
                                key={event.id}
                                role="presentation"
                                className="__page-calendar-day-view__tw-16"
                                style={{
                                    top: getTopOffset(event),
                                    height: HOUR_HEIGHT,
                                    left: `calc(${(columnIndex / columnCount) * 100}% + 2px)`,
                                    width: `calc(${100 / columnCount}% - 4px)`,
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                            >
                                <EventPill event={event} onClick={() => handleEventClick(event)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="__page-calendar-day-view__tw-17 __page-calendar-day-view__tw-extra-1">
                <Calendar
                    date={currentDate}
                    markToday
                    changeOnlyOnClick
                    RenderOnDay={RenderOnDay}
                    onChange={(d: Date | undefined) => d && onDateChange(d)}
                />
                {selectedEvent && (
                    <div className="__page-calendar-day-view__tw-18 __page-calendar-day-view__tw-extra-1">
                        {renderEvent ? (
                            renderEvent(selectedEvent)
                        ) : (
                            <>
                                <div className="__page-calendar-day-view__tw-19">{selectedEvent.title}</div>
                                <div className="__page-calendar-day-view__tw-9">{formatFullDate(selectedEvent.date, locale)}</div>
                                <div className="__page-calendar-day-view__tw-9">{formatTime(selectedEvent.date, locale)}</div>
                                <Tag
                                    theme={selectedEvent.className ? "custom" : "primary"}
                                    size="small"
                                    className={`__page-calendar-day-view__tw-20 ${selectedEvent.className ? ` ${selectedEvent.className}` : ""}`}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
