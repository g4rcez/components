import { isToday } from "date-fns";
import { useEffect, useRef } from "react";
import { useLocale } from "../../hooks/use-locale";
import type { CalendarEvent } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { getHourSlots, toDateKey, formatWeekdayShort, formatDay, formatHourLabel, formatFullDate, computeEventColumns } from "./page-calendar.utils";

const HOUR_HEIGHT = 48;

type WeekViewProps = {
    days: Date[];
    eventsByDate: Map<string, CalendarEvent[]>;
    currentDate: Date;
    onEventClick: (event: CalendarEvent) => void;
    onSlotClick?: (date: Date) => void;
};

function getTopOffset(event: CalendarEvent): number {
    const hour = event.date.getHours();
    const minutes = event.date.getMinutes();
    return hour * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT;
}

export function WeekView({ days, eventsByDate, onEventClick, onSlotClick }: WeekViewProps) {
    const locale = useLocale();
    const currentHourRef = useRef<HTMLDivElement>(null);
    const scrollBodyRef = useRef<HTMLDivElement>(null);
    const hours = getHourSlots();

    useEffect(() => {
        if (scrollBodyRef.current && currentHourRef.current) {
            const top = currentHourRef.current.offsetTop;
            scrollBodyRef.current.scrollTop = top - scrollBodyRef.current.clientHeight / 2;
        }
    }, []);

    return (
        <div className="__page-calendar-week-view__tw-1 __page-calendar-week-view__tw-extra-1">
            <div className="__page-calendar-week-view__tw-2 __page-calendar-week-view__tw-extra-2">
                <div className="__page-calendar-week-view__tw-3 __page-calendar-week-view__tw-extra-2" />
                {days.map((day, idx) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <div key={idx} aria-label={formatFullDate(day, locale)} className="__page-calendar-week-view__tw-4">
                            <span className="__page-calendar-week-view__tw-5">{formatWeekdayShort(day, locale)}</span>
                            <span
                                className={`__page-calendar-week-view__tw-6 ${isCurrentDay ? "__page-calendar-week-view__tw-7" : "__page-calendar-week-view__tw-8"}`}
                            >
                                {formatDay(day, locale)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div ref={scrollBodyRef} className="__page-calendar-week-view__tw-9">
                <div className="__page-calendar-week-view__tw-3 __page-calendar-week-view__tw-extra-2">
                    {hours.map((hour) => (
                        <div key={hour} className="__page-calendar-week-view__tw-10" style={{ height: HOUR_HEIGHT }}>
                            <span className="__page-calendar-week-view__tw-11">{hour === 0 ? "" : formatHourLabel(hour, locale)}</span>
                            {hour === new Date().getHours() && <div ref={currentHourRef} />}
                        </div>
                    ))}
                </div>
                {days.map((day, dayIdx) => {
                    const key = toDateKey(day);
                    const events = eventsByDate.get(key) || [];
                    return (
                        <div key={dayIdx} className="__page-calendar-week-view__tw-12">
                            {hours.map((hour) => {
                                const slotDate = new Date(day);
                                slotDate.setHours(hour, 0, 0, 0);
                                return (
                                    <button
                                        key={hour}
                                        type="button"
                                        aria-label={formatHourLabel(hour, locale)}
                                        className="__page-calendar-week-view__tw-13"
                                        style={{ height: HOUR_HEIGHT }}
                                        onClick={() => onSlotClick?.(slotDate)}
                                    />
                                );
                            })}
                            {computeEventColumns(events).map(({ event, columnIndex, columnCount }) => (
                                <div
                                    key={event.id}
                                    role="presentation"
                                    className="__page-calendar-week-view__tw-14"
                                    style={{
                                        top: getTopOffset(event),
                                        height: HOUR_HEIGHT,
                                        left: `calc(${(columnIndex / columnCount) * 100}% + 1px)`,
                                        width: `calc(${100 / columnCount}% - 2px)`,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                >
                                    <EventPill event={event} onClick={() => onEventClick(event)} />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
