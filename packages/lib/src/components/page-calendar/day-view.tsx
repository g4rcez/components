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
        return <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />;
    };

    const handleEventClick = (event: CalendarEvent<T>) => {
        setSelectedEvent(event);
        onEventClick(event);
    };

    return (
        <div className="flex flex-1 min-w-full">
            <div className="flex w-full flex-1 flex-col">
                <div aria-label={formatFullDate(currentDate, locale)} className="flex flex-shrink-0 items-center gap-3 border-b border-border px-4 py-2">
                    <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${isToday(currentDate) ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                    >
                        {formatDay(currentDate, locale)}
                    </span>
                    <div>
                        <div className="font-semibold">{formatWeekdayLong(currentDate, locale)}</div>
                        <div className="text-xs text-muted-foreground">{formatMonthYear(currentDate, locale)}</div>
                    </div>
                </div>
                <div ref={scrollBodyRef} className="flex flex-1 items-start overflow-y-auto">
                    <div className="w-[60px] flex-shrink-0">
                        {hours.map((hour) => (
                            <div key={hour} className="relative" style={{ height: HOUR_HEIGHT }}>
                                <span className="absolute -top-2.5 right-2 text-[10px] text-muted-foreground">
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
                                <div
                                    key={hour}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={formatHourLabel(hour, locale)}
                                    className="cursor-pointer border-b border-border/50 hover:bg-muted/20"
                                    style={{ height: HOUR_HEIGHT }}
                                    onClick={() => onSlotClick?.(slotDate)}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSlotClick?.(slotDate); } }}
                                />
                            );
                        })}
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="absolute left-1 right-1"
                                style={{ top: getTopOffset(event), height: HOUR_HEIGHT }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <EventPill event={event} onClick={() => handleEventClick(event)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto border-l border-card-border px-4">
                <Calendar
                    date={currentDate}
                    markToday
                    changeOnlyOnClick
                    RenderOnDay={RenderOnDay}
                    onChange={(d: Date | undefined) => d && onDateChange(d)}
                />
                {selectedEvent && (
                    <div className="flex flex-col gap-2 border-t p-3">
                        {renderEvent ? (
                            renderEvent(selectedEvent)
                        ) : (
                            <>
                                <div className="truncate text-sm font-semibold">{selectedEvent.title}</div>
                                <div className="text-xs text-muted-foreground">{formatFullDate(selectedEvent.date, locale)}</div>
                                <div className="text-xs text-muted-foreground">{formatTime(selectedEvent.date, locale)}</div>
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
