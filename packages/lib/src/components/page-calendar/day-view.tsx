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
        return (
            <span className="absolute bottom-page-calendar-dot-bottom left-1/2 size-page-calendar-dot-size -translate-x-1/2 rounded-full bg-primary" />
        );
    };

    const handleEventClick = (event: CalendarEvent<T>) => {
        setSelectedEvent(event);
        onEventClick(event);
    };

    return (
        <div className="flex min-w-full flex-1">
            <div className="flex w-full flex-1 flex-col">
                <div
                    aria-label={formatFullDate(currentDate, locale)}
                    className="flex flex-shrink-0 items-center gap-page-calendar-day-header-gap border-b border-border px-page-calendar-day-header-px py-page-calendar-day-header-py"
                >
                    <span
                        className={`inline-flex size-page-calendar-day-badge-size items-center justify-center rounded-full font-bold ${isToday(currentDate) ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                    >
                        {formatDay(currentDate, locale)}
                    </span>
                    <div>
                        <div className="font-semibold">{formatWeekdayLong(currentDate, locale)}</div>
                        <div className="text-typography-xs text-muted-foreground">{formatMonthYear(currentDate, locale)}</div>
                    </div>
                </div>
                <div ref={scrollBodyRef} className="flex flex-1 items-start overflow-y-auto">
                    <div className="w-page-calendar-gutter-w flex-shrink-0">
                        {hours.map((hour) => (
                            <div key={hour} className="relative" style={{ height: HOUR_HEIGHT }}>
                                <span className="absolute -top-2.5 right-2 text-page-calendar-hour-text text-muted-foreground">
                                    {hour === 0 ? "" : formatHourLabel(hour, locale)}
                                </span>
                                {hour === new Date().getHours() && <div ref={currentHourRef} />}
                            </div>
                        ))}
                    </div>
                    <div className="relative flex-1 border-l border-card-border">
                        {hours.map((hour) => {
                            const slotDate = new Date(currentDate);
                            slotDate.setHours(hour, 0, 0, 0);
                            return (
                                <button
                                    key={hour}
                                    type="button"
                                    aria-label={formatHourLabel(hour, locale)}
                                    className="w-full cursor-pointer border-b border-border/50 hover:bg-muted/20"
                                    style={{ height: HOUR_HEIGHT }}
                                    onClick={() => onSlotClick?.(slotDate)}
                                />
                            );
                        })}
                        {computeEventColumns(events).map(({ event, columnIndex, columnCount }) => (
                            <div
                                key={event.id}
                                role="presentation"
                                className="absolute"
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
            <div className="flex flex-col overflow-y-auto border-l border-card-border px-page-calendar-side-px">
                <Calendar
                    date={currentDate}
                    markToday
                    changeOnlyOnClick
                    RenderOnDay={RenderOnDay}
                    onChange={(d: Date | undefined) => d && onDateChange(d)}
                />
                {selectedEvent && (
                    <div className="flex flex-col gap-page-calendar-detail-gap border-t p-page-calendar-detail-p">
                        {renderEvent ? (
                            renderEvent(selectedEvent)
                        ) : (
                            <>
                                <div className="text-typography-sm truncate font-semibold">{selectedEvent.title}</div>
                                <div className="text-typography-xs text-muted-foreground">{formatFullDate(selectedEvent.date, locale)}</div>
                                <div className="text-typography-xs text-muted-foreground">{formatTime(selectedEvent.date, locale)}</div>
                                <Tag
                                    theme={selectedEvent.className ? "custom" : "primary"}
                                    size="small"
                                    className={`self-start${selectedEvent.className ? ` ${selectedEvent.className}` : ""}`}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
