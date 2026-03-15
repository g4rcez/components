import { isToday } from "date-fns";
import { useEffect, useRef } from "react";
import { useLocale } from "../../hooks/use-locale";
import type { CalendarEvent } from "./page-calendar.types";
import { EventPill } from "./event-pill";
import { getHourSlots, toDateKey, formatWeekdayShort, formatDay, formatHourLabel, formatFullDate } from "./page-calendar.utils";

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
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-shrink-0 border-b border-border">
                <div className="w-[60px] flex-shrink-0" />
                {days.map((day, idx) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <div key={idx} aria-label={formatFullDate(day, locale)} className="flex-1 py-2 text-center text-xs font-medium text-muted-foreground">
                            <span className="block">{formatWeekdayShort(day, locale)}</span>
                            <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${isCurrentDay ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                            >
                                {formatDay(day, locale)}
                            </span>
                        </div>
                    );
                })}
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
                {days.map((day, dayIdx) => {
                    const key = toDateKey(day);
                    const events = eventsByDate.get(key) || [];
                    return (
                        <div key={dayIdx} className="relative flex-1 border-l border-card-border">
                            {hours.map((hour) => {
                                const slotDate = new Date(day);
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
                                    className="absolute left-0.5 right-0.5"
                                    style={{ top: getTopOffset(event), height: HOUR_HEIGHT }}
                                    onClick={(e) => e.stopPropagation()}
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
