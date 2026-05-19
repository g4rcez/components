import { Button } from "../core/button";
import { Tag } from "../core/tag";
import { useLocale } from "../../hooks/use-locale";
import { useTranslations } from "../../hooks/use-translations";
import { CaretLeftIcon, CaretRightIcon, PlusCircleIcon, CalendarIcon } from "@phosphor-icons/react";
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

    const VIEWS = useMemo(
        () => [
            { value: "month" as ViewMode, label: t.pageCalendarMonthView },
            { value: "week" as ViewMode, label: t.pageCalendarWeekView },
            { value: "day" as ViewMode, label: t.pageCalendarDayView },
        ],
        [t]
    );

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
        <header className="flex flex-col gap-page-calendar-header-gap">
            <div className="flex items-center justify-between gap-page-calendar-header-gap">
                <div className="flex items-center gap-page-calendar-date-gap">
                    <div
                        aria-hidden="true"
                        className={`rounded-page-calendar-badge-radius flex size-page-calendar-badge-size flex-col items-center justify-center overflow-hidden text-page-calendar-week-label-text ${isDateToday ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
                    >
                        <span className="font-light uppercase leading-none">{formatMonthShort(currentDate, locale)}</span>
                        <span className="text-page-calendar-title-text font-medium leading-none">{formatDay(currentDate, locale)}</span>
                    </div>
                    <div>
                        <h1 aria-live="polite" aria-atomic="true" className="text-page-calendar-title-text font-bold leading-tight">
                            {formatMonthYear(currentDate, locale)}
                        </h1>
                        <span className="text-page-calendar-week-label-text text-muted-foreground">{t.pageCalendarWeekLabel(weekNum)}</span>
                    </div>
                </div>
                <nav aria-label={t.pageCalendarNavigation} className="flex items-center gap-page-calendar-nav-gap">
                    <div className="flex items-center gap-page-calendar-nav-btn-gap">
                        <Button
                            size="small"
                            title={t.pageCalendarPrevious}
                            aria-label={t.pageCalendarPrevious}
                            theme="ghost-muted"
                            onClick={handlePrev}
                        >
                            <CaretLeftIcon size={16} />
                        </Button>
                        <button
                            type="button"
                            aria-label={t.pageCalendarToday}
                            onClick={() => setCurrentDate(new Date())}
                            className="rounded-page-calendar-today-radius px-page-calendar-today-px py-page-calendar-today-py text-page-calendar-today-text transition-colors hover:bg-muted/50"
                        >
                            {t.pageCalendarToday}
                        </button>
                        <Button size="small" title={t.pageCalendarNext} aria-label={t.pageCalendarNext} theme="ghost-muted" onClick={handleNext}>
                            <CaretRightIcon size={16} />
                        </Button>
                    </div>
                    <div className="rounded-page-calendar-view-switch-radius flex">
                        {VIEWS.map((v) => (
                            <Button
                                size="small"
                                key={v.value}
                                onClick={() => setCurrentView(v.value)}
                                theme={currentView === v.value ? "primary" : "muted"}
                                aria-pressed={currentView === v.value}
                                className="first:rounded-l-button last:rounded-r-button rounded-button-radius-squared"
                            >
                                {v.label}
                            </Button>
                        ))}
                    </div>
                    {onAddEvent && (
                        <Button theme="primary" size="small" onClick={onAddEvent}>
                            <PlusCircleIcon size={14} />
                            {t.pageCalendarAddEvent}
                        </Button>
                    )}
                </nav>
            </div>
            {filterArea ??
                (filters.length > 0 && (
                    <div role="group" aria-label={t.pageCalendarFilter} className="flex flex-wrap items-center gap-page-calendar-filter-gap">
                        <CalendarIcon size={14} className="text-muted-foreground" aria-hidden="true" />
                        <span className="mr-page-calendar-nav-mr text-page-calendar-filter-text text-muted-foreground">{t.pageCalendarFilter}</span>
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
