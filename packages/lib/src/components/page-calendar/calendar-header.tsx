import { Button } from "../core/button/button";
import { css } from "../../lib/dom";
import { Tag } from "../core/tag/tag";
import { useLocale } from "../../hooks/use-locale";
import { useTranslations } from "../../hooks/use-translations";
import { CaretLeftIcon, CaretRightIcon, PlusCircleIcon, CalendarIcon } from "@phosphor-icons/react";
import { addDays, addMonths, addWeeks, isToday, subDays, subMonths, subWeeks } from "date-fns";
import type { CalendarFilter, ViewMode } from "./page-calendar.types";
import { formatDay, formatMonthShort, formatMonthYear, getWeekNumber } from "./page-calendar.utils";
import type { SetState } from "../../types";
import { useMemo, type ReactNode } from "react";
import { pageCalendarHeaderStyles } from "./calendar-header.styles";
import { DatePicker } from "../form/date-picker/date-picker";

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
        <header className={pageCalendarHeaderStyles.slots.root}>
            <div className={pageCalendarHeaderStyles.slots.toolbar}>
                <div className={pageCalendarHeaderStyles.slots["date-summary"]}>
                    <div
                        aria-hidden="true"
                        className={css(
                            pageCalendarHeaderStyles.slots["date-badge"],
                            `${pageCalendarHeaderStyles.slots["date-badge"]}--${isDateToday ? "today" : "default"}`
                        )}
                    >
                        <span className={pageCalendarHeaderStyles.slots["month-label"]}>{formatMonthShort(currentDate, locale)}</span>
                        <span className={pageCalendarHeaderStyles.slots["day-number"]}>{formatDay(currentDate, locale)}</span>
                    </div>
                    <div>
                        <h1 aria-live="polite" aria-atomic="true" className={pageCalendarHeaderStyles.slots.title}>
                            {formatMonthYear(currentDate, locale)}
                        </h1>
                        <span className={pageCalendarHeaderStyles.slots["week-label"]}>{t.pageCalendarWeekLabel(weekNum)}</span>
                    </div>
                </div>
                <nav aria-label={t.pageCalendarNavigation} className={pageCalendarHeaderStyles.slots.nav}>
                    <div className={pageCalendarHeaderStyles.slots["nav-buttons"]}>
                        <Button
                            size="tiny"
                            theme="ghost-muted"
                            onClick={handlePrev}
                            title={t.pageCalendarPrevious}
                            aria-label={t.pageCalendarPrevious}
                        >
                            <CaretLeftIcon className={pageCalendarHeaderStyles.slots["nav-icon"]} />
                        </Button>
                        <Button size="tiny" theme="ghost-muted" aria-label={t.pageCalendarToday} onClick={() => setCurrentDate(new Date())}>
                            {t.pageCalendarToday}
                        </Button>
                        <Button size="tiny" onClick={handleNext} theme="ghost-muted" title={t.pageCalendarNext} aria-label={t.pageCalendarNext}>
                            <CaretRightIcon className={pageCalendarHeaderStyles.slots["nav-icon"]} />
                        </Button>
                    </div>
                    {currentView !== "month" && (
                        <DatePicker
                            date={currentDate}
                            size="small"
                            hiddenLabel
                            required={false}
                            clickToClose
                            title={t.pageCalendarDatePicker}
                            container={pageCalendarHeaderStyles.slots["date-picker"]}
                            onChange={(date: Date | undefined) => date && setCurrentDate(date)}
                        />
                    )}
                    <div className={pageCalendarHeaderStyles.slots["view-switch"]}>
                        {VIEWS.map((v) => (
                            <Button
                                size="tiny"
                                key={v.value}
                                rounded="squared"
                                onClick={() => setCurrentView(v.value)}
                                theme={currentView === v.value ? "primary" : "muted"}
                                aria-pressed={currentView === v.value}
                                className={pageCalendarHeaderStyles.slots["view-button"]}
                            >
                                {v.label}
                            </Button>
                        ))}
                    </div>
                    {onAddEvent && (
                        <Button theme="primary" size="tiny" onClick={onAddEvent}>
                            <PlusCircleIcon className={pageCalendarHeaderStyles.slots["add-icon"]} />
                            {t.pageCalendarAddEvent}
                        </Button>
                    )}
                </nav>
            </div>
            {filterArea ??
                (filters.length > 0 && (
                    <fieldset aria-label={t.pageCalendarFilter} className={pageCalendarHeaderStyles.slots.filters}>
                        <span className={pageCalendarHeaderStyles.slots["filter-icon-wrapper"]}>
                            <CalendarIcon aria-hidden="true" className={pageCalendarHeaderStyles.slots["filter-icon"]} />
                        </span>
                        <span className={pageCalendarHeaderStyles.slots["filter-label"]}>{t.pageCalendarFilter}</span>
                        {filters.map((filter) => (
                            <Tag
                                as="button"
                                size="tiny"
                                type="button"
                                key={filter.id}
                                theme={filter.theme}
                                aria-pressed={filter.enabled}
                                onClick={() => onToggleFilter(filter.id)}
                                indicator={filter.enabled ? filter.theme || undefined : undefined}
                                aria-label={`${filter.label}, ${filter.enabled ? t.pageCalendarFilterEnabled : t.pageCalendarFilterDisabled}`}
                            >
                                {filter.label}
                            </Tag>
                        ))}
                    </fieldset>
                ))}
        </header>
    );
}
