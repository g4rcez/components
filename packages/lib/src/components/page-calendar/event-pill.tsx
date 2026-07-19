import { Button } from "../core/button/button";
import { css } from "../../lib/dom";
import { useTranslations } from "../../hooks/use-translations";
import type { CalendarEvent } from "./page-calendar.types";
import { formatEventTime } from "./page-calendar.utils";
import { pageCalendarEventPillStyles } from "./event-pill.styles";

type EventPillProps = {
    compact?: boolean;
    onClick: () => void;
    event: CalendarEvent;
};

export function EventPill({ event, onClick, compact = false }: EventPillProps) {
    const t = useTranslations();
    const props = {
        className: css(pageCalendarEventPillStyles.slots.button, event.className),
    };
    if (compact) {
        return (
            <Button
                {...props}
                size="tiny"
                onClick={onClick}
                title={event.title}
                theme={event.className ? "raw" : "primary"}
                aria-label={t.pageCalendarEventAt(event.title, formatEventTime(event.date))}
            >
                {event.title}
            </Button>
        );
    }

    return (
        <Button
            {...props}
            size="tiny"
            onClick={onClick}
            title={event.title}
            aria-label={t.pageCalendarEventAt(event.title, formatEventTime(event.date))}
            theme={event.className ? "raw" : "primary"}
        >
            <div className={pageCalendarEventPillStyles.slots.title}>{event.title}</div>
            <div className={pageCalendarEventPillStyles.slots.time}>{formatEventTime(event.date)}</div>
        </Button>
    );
}
