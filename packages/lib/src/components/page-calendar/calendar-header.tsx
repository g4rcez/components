import { Button } from "../core/button";
import { Tag } from "../core/tag";
import { useLocale } from "../../hooks/use-locale";
import { useTranslations } from "../../hooks/use-translations";
import { ChevronLeft, ChevronRight, PlusCircle, Calendar } from "lucide-react";
import { addDays, addMonths, addWeeks, isToday, subDays, subMonths, subWeeks } from "date-fns";
import type { CalendarFilter, ViewMode } from "./page-calendar.types";
import { formatDay, formatMonthShort, formatMonthYear, getWeekNumber } from "./page-calendar.utils";
import type { SetState } from "../../types";
import { useMemo, type ReactNode } from "react";

type CalendarHeaderProps = {
    currentDate: Date;
    currentView: ViewMode;
    onAddEvent?: () => void;
    filters: CalendarFilter[];
    filterArea?: ReactNode;
    setCurrentDate: SetState<Date>;
    setCurrentView: SetState<ViewMode>;
    onToggleFilter: (id: string) => void;
};

export function CalendarHeader({
    currentDate,
    currentView,
    filters,
    filterArea,
    setCurrentDate,
    setCurrentView,
    onToggleFilter,
    onAddEvent,
}: CalendarHeaderProps) {
    const locale = useLocale();
    const t = useTranslations();
    const isDateToday = isToday(currentDate);

    const VIEWS = useMemo(() => [
        { value: "month" as ViewMode, label: t.pageCalendarMonthView },
        { value: "week" as ViewMode, label: t.pageCalendarWeekView },
        { value: "day" as ViewMode, label: t.pageCalendarDayView },
    ], [t]);

    const handlePrev = () => {
        setCurrentDate((currentDate) => {
            if (currentView === "month") return subMonths(currentDate, 1);
            if (currentView === "week") return subWeeks(currentDate, 1);
            return subDays(currentDate, 1);
        });
    };

    const handleNext = () => {
        setCurrentDate((currentDate) => {
            if (currentView === "month") return addMonths(currentDate, 1);
            if (currentView === "week") return addWeeks(currentDate, 1);
            return addDays(currentDate, 1);
        });
    };

    const weekNum = getWeekNumber(currentDate);

    return (
        <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        aria-hidden="true"
                        className={`flex size-12 flex-col items-center justify-center overflow-hidden rounded-lg text-xs ${isDateToday ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
                    >
                        <span className="font-light uppercase leading-none">{formatMonthShort(currentDate, locale)}</span>
                        <span className="text-xl font-medium leading-none">{formatDay(currentDate, locale)}</span>
                    </div>
                    <div>
                        <h1 aria-live="polite" aria-atomic="true" className="text-xl font-bold leading-tight">{formatMonthYear(currentDate, locale)}</h1>
                        <span className="text-xs text-muted-foreground">{t.pageCalendarWeekLabel(weekNum)}</span>
                    </div>
                </div>
                <nav aria-label={t.pageCalendarNavigation} className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button size="small" title={t.pageCalendarPrevious} aria-label={t.pageCalendarPrevious} theme="ghost-muted" onClick={handlePrev}>
                            <ChevronLeft size={16} />
                        </Button>
                        <button
                            type="button"
                            aria-label={t.pageCalendarToday}
                            onClick={() => setCurrentDate(new Date())}
                            className="rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
                        >
                            {t.pageCalendarToday}
                        </button>
                        <Button size="small" title={t.pageCalendarNext} aria-label={t.pageCalendarNext} theme="ghost-muted" onClick={handleNext}>
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                    <div className="flex rounded-md">
                        {VIEWS.map((v) => (
                            <Button
                                size="small"
                                key={v.value}
                                onClick={() => setCurrentView(v.value)}
                                theme={currentView === v.value ? "primary" : "muted"}
                                aria-pressed={currentView === v.value}
                                className="rounded-none first:rounded-l-button last:rounded-r-button"
                            >
                                {v.label}
                            </Button>
                        ))}
                    </div>
                    {onAddEvent && (
                        <Button theme="primary" size="small" onClick={onAddEvent}>
                            <PlusCircle size={14} />
                            {t.pageCalendarAddEvent}
                        </Button>
                    )}
                </nav>
            </div>
            {filterArea ??
                (filters.length > 0 && (
                    <div role="group" aria-label={t.pageCalendarFilter} className="flex flex-wrap items-center gap-1.5">
                        <Calendar size={14} className="text-muted-foreground" aria-hidden="true" />
                        <span className="mr-1 text-xs text-muted-foreground">{t.pageCalendarFilter}</span>
                        {filters.map((filter) => (
                            <Tag
                                as="button"
                                size="small"
                                type="button"
                                key={filter.id}
                                theme={filter.theme}
                                indicator={filter.enabled ? filter.theme : undefined}
                                aria-pressed={filter.enabled}
                                aria-label={`${filter.label}, ${filter.enabled ? t.pageCalendarFilterEnabled : t.pageCalendarFilterDisabled}`}
                                onClick={() => onToggleFilter(filter.id)}
                            >
                                {filter.label}
                            </Tag>
                        ))}
                    </div>
                ))}
        </header>
    );
}
