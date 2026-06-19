import { Button } from "../core/button/button";
import { css } from "../../lib/dom";
import { useTranslations } from "../../hooks/use-translations";
import type { CalendarEvent } from "./page-calendar.types";
import { formatEventTime } from "./page-calendar.utils";
import type { CSSProperties } from "react";

type EventPillProps = {
    compact?: boolean;
    onClick: () => void;
    event: CalendarEvent;
};

export function EventPill({ event, onClick, compact = false }: EventPillProps) {
    const t = useTranslations();
    const props = {
        style: {
            border: "0",
            padding: "0 0.5rem",
            height: "1.25rem",
            borderRadius: "0.25rem",
        } as CSSProperties,
        className: css("__page-calendar-event-pill__border __page-calendar-event-pill__slot-1", event.className),
    };
    if (compact) {
        return (
            <Button
                {...props}
                size="small"
                onClick={onClick}
                title={event.title}
                aria-label={t.pageCalendarEventAt(event.title, formatEventTime(event.date))}
                theme={event.className ? "raw" : "primary"}
            >
                {event.title}
            </Button>
        );
    }

    return (
        <Button
            {...props}
            size="small"
            onClick={onClick}
            title={event.title}
            aria-label={t.pageCalendarEventAt(event.title, formatEventTime(event.date))}
            theme={event.className ? "raw" : "primary"}
        >
            <div className="__page-calendar-event-pill__slot-2">{event.title}</div>
            <div className="__page-calendar-event-pill__slot-3">{formatEventTime(event.date)}</div>
        </Button>
    );
}
