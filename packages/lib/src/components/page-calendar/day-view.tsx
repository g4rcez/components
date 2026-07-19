import { isToday } from "date-fns";
import { css } from "../../lib/dom";
import { useEffect, useRef, useState } from "react";
import { Tag } from "../core/tag/tag";
import { useLocale } from "../../hooks/use-locale";
import type { CalendarEvent, CalendarEventBase } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { Calendar } from "../display/calendar/calendar";
import { pageCalendarDayViewStyles } from "./day-view.styles";
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
        return <span className={pageCalendarDayViewStyles.slots["event-dot"]} />;
    };

    const handleEventClick = (event: CalendarEvent<T>) => {
        setSelectedEvent(event);
        onEventClick(event);
    };

    return (
        <div className={pageCalendarDayViewStyles.slots.root}>
            <div className={pageCalendarDayViewStyles.slots.main}>
                <div aria-label={formatFullDate(currentDate, locale)} className={pageCalendarDayViewStyles.slots.header}>
                    <span
                        className={css(
                            pageCalendarDayViewStyles.slots["day-badge"],
                            `${pageCalendarDayViewStyles.slots["day-badge"]}--${isToday(currentDate) ? "today" : "default"}`
                        )}
                    >
                        {formatDay(currentDate, locale)}
                    </span>
                    <div>
                        <div className={pageCalendarDayViewStyles.slots.weekday}>{formatWeekdayLong(currentDate, locale)}</div>
                        <div className={pageCalendarDayViewStyles.slots["date-label"]}>{formatMonthYear(currentDate, locale)}</div>
                    </div>
                </div>
                <div ref={scrollBodyRef} className={pageCalendarDayViewStyles.slots["scroll-body"]}>
                    <div className={pageCalendarDayViewStyles.slots.gutter}>
                        {hours.map((hour) => (
                            <div key={hour} className={pageCalendarDayViewStyles.slots["hour-row"]} style={{ height: HOUR_HEIGHT }}>
                                <span className={pageCalendarDayViewStyles.slots["hour-label"]}>
                                    {hour === 0 ? "" : formatHourLabel(hour, locale)}
                                </span>
                                {hour === new Date().getHours() && <div ref={currentHourRef} />}
                            </div>
                        ))}
                    </div>
                    <div className={pageCalendarDayViewStyles.slots.grid}>
                        {hours.map((hour) => {
                            const slotDate = new Date(currentDate);
                            slotDate.setHours(hour, 0, 0, 0);
                            return (
                                <button
                                    key={hour}
                                    type="button"
                                    aria-label={formatHourLabel(hour, locale)}
                                    className={pageCalendarDayViewStyles.slots["time-slot"]}
                                    style={{ height: HOUR_HEIGHT }}
                                    onClick={() => onSlotClick?.(slotDate)}
                                />
                            );
                        })}
                        {computeEventColumns(events).map(({ event, columnIndex, columnCount }) => (
                            <div
                                key={event.id}
                                role="presentation"
                                className={pageCalendarDayViewStyles.slots.event}
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
            <div className={pageCalendarDayViewStyles.slots["side-panel"]}>
                <Calendar
                    date={currentDate}
                    markToday
                    changeOnlyOnClick
                    RenderOnDay={RenderOnDay}
                    onChange={(d: Date | undefined) => d && onDateChange(d)}
                />
                {selectedEvent && (
                    <div className={pageCalendarDayViewStyles.slots.detail}>
                        {renderEvent ? (
                            renderEvent(selectedEvent)
                        ) : (
                            <>
                                <div className={pageCalendarDayViewStyles.slots["event-title"]}>{selectedEvent.title}</div>
                                <div className={pageCalendarDayViewStyles.slots["detail-meta"]}>{formatFullDate(selectedEvent.date, locale)}</div>
                                <div className={pageCalendarDayViewStyles.slots["detail-meta"]}>{formatTime(selectedEvent.date, locale)}</div>
                                <Tag
                                    theme={selectedEvent.className ? "custom" : "primary"}
                                    size="small"
                                    className={css(pageCalendarDayViewStyles.slots["event-tag"], selectedEvent.className)}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
