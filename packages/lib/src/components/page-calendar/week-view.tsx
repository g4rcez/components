import { isToday } from "date-fns";
import { useEffect, useRef } from "react";
import { useLocale } from "../../hooks/use-locale";
import type { CalendarEvent } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { css } from "../../lib/dom";
import { pageCalendarWeekViewStyles } from "./week-view.styles";
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

export function WeekView({ days, eventsByDate, currentDate, onEventClick, onSlotClick }: WeekViewProps) {
    const locale = useLocale();
    const currentHourRef = useRef<HTMLDivElement>(null);
    const scrollBodyRef = useRef<HTMLDivElement>(null);
    const hours = getHourSlots();
    const selectedDateKey = toDateKey(currentDate);

    useEffect(() => {
        if (scrollBodyRef.current && currentHourRef.current) {
            const top = currentHourRef.current.offsetTop;
            scrollBodyRef.current.scrollTop = top - scrollBodyRef.current.clientHeight / 2;
        }
    }, []);

    return (
        <div className={pageCalendarWeekViewStyles.slots.root}>
            <div className={pageCalendarWeekViewStyles.slots.header}>
                <div className={pageCalendarWeekViewStyles.slots.gutter} />
                {days.map((day, idx) => {
                    const isCurrentDay = isToday(day);
                    const isSelectedDay = toDateKey(day) === selectedDateKey;
                    let dayBadgeState = "default";
                    if (isCurrentDay) {
                        dayBadgeState = "today";
                    }
                    if (isSelectedDay) {
                        dayBadgeState = "selected";
                    }
                    return (
                        <div key={idx} title={formatFullDate(day, locale)} className={pageCalendarWeekViewStyles.slots.weekday}>
                            <span className={pageCalendarWeekViewStyles.slots["weekday-name"]}>{formatWeekdayShort(day, locale)}</span>
                            <span
                                className={css(
                                    pageCalendarWeekViewStyles.slots["day-badge"],
                                    `${pageCalendarWeekViewStyles.slots["day-badge"]}--${dayBadgeState}`
                                )}
                            >
                                {formatDay(day, locale)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div ref={scrollBodyRef} className={pageCalendarWeekViewStyles.slots["scroll-body"]}>
                <div className={pageCalendarWeekViewStyles.slots.gutter}>
                    {hours.map((hour) => (
                        <div key={hour} className={pageCalendarWeekViewStyles.slots["hour-row"]} style={{ height: HOUR_HEIGHT }}>
                            <span className={pageCalendarWeekViewStyles.slots["hour-label"]}>{hour === 0 ? "" : formatHourLabel(hour, locale)}</span>
                            {hour === new Date().getHours() && <div ref={currentHourRef} />}
                        </div>
                    ))}
                </div>
                {days.map((day, dayIdx) => {
                    const key = toDateKey(day);
                    const events = eventsByDate.get(key) || [];
                    return (
                        <div key={dayIdx} className={pageCalendarWeekViewStyles.slots["day-column"]}>
                            {hours.map((hour) => {
                                const slotDate = new Date(day);
                                slotDate.setHours(hour, 0, 0, 0);
                                return (
                                    <button
                                        key={hour}
                                        type="button"
                                        aria-label={formatHourLabel(hour, locale)}
                                        className={pageCalendarWeekViewStyles.slots["time-slot"]}
                                        style={{ height: HOUR_HEIGHT }}
                                        onClick={() => onSlotClick?.(slotDate)}
                                    />
                                );
                            })}
                            {computeEventColumns(events).map(({ event, columnIndex, columnCount }) => (
                                <div
                                    key={event.id}
                                    role="presentation"
                                    className={pageCalendarWeekViewStyles.slots.event}
                                    style={{
                                        top: getTopOffset(event),
                                        height: HOUR_HEIGHT,
                                        left: `calc(${(columnIndex / columnCount) * 100}% + 1px)`,
                                        width: `calc(${100 / columnCount}% - 2px)`,
                                    }}
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
