import type { TagProps } from "../core/tag";

export type ViewMode = "month" | "week" | "day";

export type CalendarEventBase = { date: Date; id: string };

export type CalendarEvent<T extends CalendarEventBase = CalendarEventBase> = T & {
    title: string;
    filterId?: string;
    className?: string;
};

export type CalendarFilter = {
    id: string;
    label: string;
    enabled: boolean;
    theme: TagProps["theme"];
};
