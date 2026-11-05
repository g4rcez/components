import type { TranslationOverrides } from "../../hooks/use-translations";
import { isToday } from "date-fns";
import { useLocale } from "../../hooks/use-locale";
import { useHourGrid } from "./use-hour-grid";
import type { CalendarEvent } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { css } from "../../lib/dom";
import { pageCalendarWeekViewStyles } from "./week-view.styles";
import { toDateKey, formatWeekdayShort, formatDay, formatFullDate, computeEventColumns, getTopOffset, HOUR_HEIGHT } from "./page-calendar.utils";

type WeekViewProps = {
    days: Date[];
    eventsByDate: Map<string, CalendarEvent[]>;
    currentDate: Date;
    onEventClick: (event: CalendarEvent) => void;
    onSlotClick?: (date: Date) => void;
    translations?: TranslationOverrides;
};

export function WeekView({ days, eventsByDate, currentDate, onEventClick, onSlotClick, translations }: WeekViewProps) {
    const locale = useLocale();
    const { hours, hourLabels, scrollBodyRef, currentHourRef } = useHourGrid();
    const selectedDateKey = toDateKey(currentDate);

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
                            <span className={pageCalendarWeekViewStyles.slots["hour-label"]}>{hour === 0 ? "" : hourLabels[hour]}</span>
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
                                        aria-label={hourLabels[hour]}
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
                                        left: `calc(${(columnIndex / columnCount) * 100}% + var(--var-spacing-base) * 0.0625)`,
                                        width: `calc(${100 / columnCount}% - var(--var-spacing-base) * 0.125)`,
                                    }}
                                >
                                    <EventPill event={event} onClick={() => onEventClick(event)} translations={translations} />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
