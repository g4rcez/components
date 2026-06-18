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
        <header className="__page-calendar-calendar-header__tw-1 __page-calendar-calendar-header__tw-extra-1">
            <div className="__page-calendar-calendar-header__tw-2">
                <div className="__page-calendar-calendar-header__tw-3">
                    <div
                        aria-hidden="true"
                        className={`__page-calendar-calendar-header__tw-4 __page-calendar-calendar-header__tw-extra-1 ${isDateToday ? "__page-calendar-calendar-header__tw-5" : "__page-calendar-calendar-header__tw-6"}`}
                    >
                        <span className="__page-calendar-calendar-header__tw-7">{formatMonthShort(currentDate, locale)}</span>
                        <span className="__page-calendar-calendar-header__tw-8">{formatDay(currentDate, locale)}</span>
                    </div>
                    <div>
                        <h1 aria-live="polite" aria-atomic="true" className="__page-calendar-calendar-header__tw-9">
                            {formatMonthYear(currentDate, locale)}
                        </h1>
                        <span className="__page-calendar-calendar-header__tw-10">{t.pageCalendarWeekLabel(weekNum)}</span>
                    </div>
                </div>
                <nav aria-label={t.pageCalendarNavigation} className="__page-calendar-calendar-header__tw-11">
                    <div className="__page-calendar-calendar-header__tw-12">
                        <Button
                            size="small"
                            title={t.pageCalendarPrevious}
                            aria-label={t.pageCalendarPrevious}
                            theme="ghost-muted"
                            onClick={handlePrev}
                        >
                            <CaretLeftIcon className="__page-calendar-header__nav-icon" />
                        </Button>
                        <button
                            type="button"
                            aria-label={t.pageCalendarToday}
                            onClick={() => setCurrentDate(new Date())}
                            className="__page-calendar-calendar-header__tw-13"
                        >
                            {t.pageCalendarToday}
                        </button>
                        <Button size="small" title={t.pageCalendarNext} aria-label={t.pageCalendarNext} theme="ghost-muted" onClick={handleNext}>
                            <CaretRightIcon className="__page-calendar-header__nav-icon" />
                        </Button>
                    </div>
                    <div className="__page-calendar-calendar-header__tw-14">
                        {VIEWS.map((v) => (
                            <Button
                                size="small"
                                key={v.value}
                                rounded="squared"
                                onClick={() => setCurrentView(v.value)}
                                theme={currentView === v.value ? "primary" : "muted"}
                                aria-pressed={currentView === v.value}
                                className="__page-calendar-calendar-header__tw-15"
                            >
                                {v.label}
                            </Button>
                        ))}
                    </div>
                    {onAddEvent && (
                        <Button theme="primary" size="small" onClick={onAddEvent}>
                            <PlusCircleIcon className="__page-calendar-header__add-icon" />
                            {t.pageCalendarAddEvent}
                        </Button>
                    )}
                </nav>
            </div>
            {filterArea ??
                (filters.length > 0 && (
                    <div
                        role="group"
                        aria-label={t.pageCalendarFilter}
                        className="__page-calendar-calendar-header__tw-16 __page-calendar-calendar-header__tw-extra-2"
                    >
                        <span className="__page-calendar-calendar-header__tw-17">
                            <CalendarIcon aria-hidden="true" className="__page-calendar-header__filter-icon" />
                        </span>
                        <span className="__page-calendar-calendar-header__tw-18">{t.pageCalendarFilter}</span>
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
