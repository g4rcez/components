"use client";
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    eachDayOfInterval,
    endOfWeek,
    isAfter,
    isBefore,
    isSameMonth,
    isToday,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns";
import { AnimatePresence, motion, MotionConfig, Transition, Variants } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { RefObject, useEffect, useRef } from "react";
import { Is } from "sidekicker";
import TheMaskInput, { Locales } from "the-mask-input";
import { useReducer } from "use-typed-reducer";
import { useDebounce } from "../../hooks/use-debounce";
import { useLocale, useTranslations } from "../../hooks/use-components-provider";
import { css } from "../../lib/dom";
import { splitInto, uuid } from "../../lib/fns";

const transition: Transition = { type: "spring", bounce: 0.3, duration: 0.6 };

const dir =
    (mod: number) =>
    (n: number = 1) => ({ x: `${100 * mod * n}%`, opacity: 0.25 });

const variants: Variants = {
    middle: { x: "0%", opacity: 1 },
    enter: dir(1),
    exit: dir(-1),
};

const removeImmediately: Variants = { exit: { visibility: "hidden" } };

type Range = { from?: Date; to?: Date };

type OnChangeDate = (d: Date | undefined) => void;

type OnChangeRange = (d: Range | undefined) => void;

type DateStyle = (d: Date) => string;

type CalendarStyles = Partial<{
    day: string | DateStyle;
    weekDay: string | DateStyle;
    dayFrame: string | DateStyle;
    week: string | ((week: Date[]) => string);
    calendar: string | ((daysOfMonth: Date[]) => string);
}>;

export type CalendarProps<T extends "date" | "range" | undefined = undefined> = Partial<
    {
        locale: Locales;
        markRange: boolean;
        markToday: boolean;
        rangeMode: boolean;
        styles: CalendarStyles;
        changeOnlyOnClick: boolean;
        onChangeYear: (d: Date) => void;
        onChangeMonth: (d: Date) => void;
        RenderOnDay: React.FC<{ date: Date }>;
        disabledDate: (date: Date) => boolean;
        labelRange: { to: string; from: string };
    } & (T extends "date"
        ? { date: Date; onChange: OnChangeDate }
        : T extends "range"
          ? {
                range: Range;
                onChange: OnChangeRange;
            }
          : {}) &
        ({ date: Date; onChange: OnChangeDate } | { range: Range; onChange: OnChangeRange })
>;

const createDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month));
    return eachDayOfInterval({ start, end: addDays(start, 41) });
};

const formatMonth = (d: Date, locale?: Locales) => d.toLocaleDateString(locale, { month: "long" });

const getOptionsMonth = (id: string, date: Date, locale?: Locales) =>
    Array.from({ length: 12 }).map((_, i) => {
        const month = startOfMonth(new Date(1970, i, 1).setMonth(i));
        const label = formatMonth(month, locale);
        return (
            <option value={label} key={`${id}-${label}`} data-index={i}>
                {label}
            </option>
        );
    });

const onChangeUsingKeyboard = {
    ArrowLeft: (date: Date, duration: "days" | "month") => (duration === "days" ? subDays(date, 1) : subMonths(date, 1)),
    ArrowRight: (date: Date, duration: "days" | "month") => (duration === "days" ? addDays(date, 1) : addMonths(date, 1)),
    ArrowUp: (date: Date, duration: "days" | "month") => (duration === "days" ? subWeeks(date, 1) : subYears(date, 1)),
    ArrowDown: (date: Date, duration: "days" | "month") => (duration === "days" ? addWeeks(date, 1) : addYears(date, 1)),
} satisfies Record<string, (date: Date, duration: "days" | "month") => Date>;

const focusDate = (origin: HTMLElement | null, root: RefObject<HTMLElement>, next: Date, delay = 0) => {
    const d = next.toISOString();
    const select = () => {
        if (!!origin?.dataset.focustrap) {
            const el = root.current?.querySelector(`button[data-focustrap="${origin?.dataset.focustrap}"]`) as HTMLButtonElement;
            return setTimeout(() => el?.focus({ preventScroll: false }), delay);
        }
        if (root.current) {
            const element = root.current.querySelector<HTMLButtonElement>(`button[data-date="${d}"]`);
            if (element) return element.focus({ preventScroll: false });
        }
    };
    if (delay === 0) select();
    setTimeout(select, delay);
};

const formatYear = (now: Date) => now.getFullYear().toString().padStart(4, "0");

const inRange = (start: Date | undefined, middle: Date, end: Date | undefined) => {
    if (start === undefined || end === undefined) return false;
    return isAfter(middle, start) && isBefore(middle, end);
};

type CalendarBodyProps = {
    date: Date | null;
    labelRange?: { to: string; from: string };
    disabledDate?: (date: Date) => boolean;
    dispatch: any;
    range?: Range;
    zip: Date[][];
    onKeyDown: any;
    direction?: number;
    markToday?: boolean;
    markRange?: boolean;
    rangeMode?: boolean;
    styles?: CalendarStyles;
    RenderOnDay?: React.FC<{ date: Date }>;
    stateDate: Date;
    stateRange: Range;
};

const CalendarBody = (props: CalendarBodyProps) => {
    const translate = useTranslations();
    return (
        <motion.tbody layout variants={variants} custom={props.direction} onKeyDown={props.onKeyDown} className={css(props.styles?.week)}>
            {props.zip.map((week, index) => {
                const weekClassName = Is.function(props.styles?.week) ? props.styles?.week(week) : props.styles?.week;
                return (
                    <tr key={`week-${week.length}-${index}`} className={weekClassName}>
                        {week.map((day) => {
                            const key = day.toISOString();
                            const isSelected = props.rangeMode
                                ? key === props.range?.to?.toISOString() || key === props.range?.from?.toISOString()
                                : key === props.date?.toISOString();
                            const today = isToday(day) && props.markToday;
                            const disabledByFn = props.disabledDate?.(day) || false;
                            const sameMonth = isSameMonth(day, props.stateDate);
                            const disableDate = !sameMonth || disabledByFn;
                            const isInRange = props.rangeMode ? inRange(props.range?.from, day, props.range?.to) : false;
                            return (
                                <td
                                    key={key}
                                    align="center"
                                    className={css(
                                        "relative",
                                        Is.function(props.styles?.dayFrame) ? props.styles?.dayFrame(day) : props.styles?.dayFrame
                                    )}
                                >
                                    <button
                                        type="button"
                                        data-date={key}
                                        disabled={disabledByFn}
                                        data-samemonth={sameMonth}
                                        data-range={props.rangeMode}
                                        onClick={props.dispatch.onSelectDate}
                                        data-view={props.stateDate.getMonth().toString()}
                                        className={css(
                                            `flex size-10 items-center justify-center rounded-full proportional-nums disabled:cursor-not-allowed ${today ? "text-emphasis" : ""} ${disableDate ? "text-disabled" : ""} ${isSelected ? "bg-primary text-primary-foreground" : ""}`,
                                            isInRange && props.markRange ? "size-10 border border-dashed border-card-border" : "",
                                            Is.function(props.styles?.day) ? props.styles?.day(day) : props.styles?.day
                                        )}
                                    >
                                        {day.getDate()}
                                        {isSelected && props.stateRange.from?.toISOString() === key ? (
                                            <span className="absolute -top-2 left-0 h-full w-full">
                                                <span className="text-xs text-foreground">
                                                    {props.labelRange?.from ?? translate.calendarFromDate}
                                                </span>
                                            </span>
                                        ) : null}
                                        {isSelected && props.stateRange.to?.toISOString() === key ? (
                                            <span className="absolute -top-2 left-0 h-full w-full">
                                                <span className="text-xs text-foreground">{props.labelRange?.to ?? translate.calendarToDate}</span>
                                            </span>
                                        ) : null}
                                    </button>
                                    {props.RenderOnDay ? <props.RenderOnDay date={day} /> : null}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </motion.tbody>
    );
};

type SelectMode = "from" | "to";

export const Calendar = ({
    RenderOnDay,
    changeOnlyOnClick = false,
    labelRange,
    disabledDate,
    locale,
    markToday = true,
    onChangeMonth,
    onChangeYear,
    rangeMode = false,
    onChange,
    styles,
    markRange = true,
    ...props
}: CalendarProps) => {
    const id = useRef(uuid());
    const translations = useTranslations();
    const currentLocale = useLocale(locale);
    const root = useRef<HTMLTableElement>(null);
    const { date, range } = props as { date: Date | undefined; range?: Range };
    const providedDate = date || new Date();
    const monthClicked = useRef<HTMLButtonElement | null>(null);

    const [state, dispatch] = useReducer(
        {
            date: providedDate,
            isAnimating: false,
            year: formatYear(providedDate),
            direction: undefined as number | undefined,
            range: { from: range?.from, to: range?.to },
            months: getOptionsMonth(id.current, providedDate, currentLocale),
            selectMode: (rangeMode ? "from" : undefined) as SelectMode | undefined,
            week: eachDayOfInterval({ start: startOfWeek(providedDate), end: endOfWeek(providedDate) }),
        },
        (get) => ({
            onChangeYear: (year: string) => ({ year }),
            setToday: () => ({ date: startOfDay(new Date()) }),
            onExitComplete: () => {
                focusDate(monthClicked.current || null, root, get.state().date, 200);
                monthClicked.current = null;
                return { isAnimating: false };
            },
            date: (callback: (d: Date) => Date) => {
                const newDate = callback(get.state().date);
                return { date: newDate, year: formatYear(newDate) };
            },
            nextMonth: (e: React.MouseEvent<HTMLButtonElement>) => {
                monthClicked.current = e.currentTarget;
                const state = get.state();
                if (state.isAnimating) return state;
                const date = addMonths(state.date, 1);
                return { date, isAnimating: true, direction: 1, year: formatYear(date) };
            },
            previousMonth: (e: React.MouseEvent<HTMLButtonElement>) => {
                monthClicked.current = e.currentTarget;
                const state = get.state();
                if (state.isAnimating) return state;
                const date = subMonths(state.date, 1);
                return { date, isAnimating: true, direction: -1, year: formatYear(date) };
            },
            onSelectDate: (e: React.MouseEvent<HTMLButtonElement>) => {
                const state = get.state();
                const isRangeMode = e.currentTarget.dataset.range === "true";
                const d = e.currentTarget.dataset.date || "";
                const date = new Date(d);
                return {
                    date,
                    year: formatYear(date),
                    selectMode: state.selectMode === undefined ? undefined : state.selectMode === "from" ? "to" : "from",
                    range: !isRangeMode
                        ? state.range
                        : {
                              from: state.selectMode === "from" ? date : state.range.from,
                              to: state.selectMode === "to" ? date : state.range.to,
                          },
                };
            },
            onChangeMonth: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                const array = Array.from(e.target.options);
                const month = array.find((x) => x.value === value);
                const state = get.state();
                if (month) {
                    const i = month.dataset.index || "";
                    const d = new Date(get.state().date);
                    d.setMonth(+i);
                    return { ...state, date: d, year: formatYear(d) };
                }
                return state;
            },
            onKeyDown: (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
                const key = e.key;
                const state = get.state();
                if (key in onChangeUsingKeyboard) {
                    if (key === "ArrowUp" || key === "ArrowDown") e.preventDefault();
                    const prev = get.state().date;
                    const date = Is.keyof(onChangeUsingKeyboard, key) ? onChangeUsingKeyboard[key](prev, e.shiftKey ? "month" : "days") : null;
                    if (date !== null) {
                        focusDate(e.target as HTMLElement, root, date);
                        return { ...state, date, year: formatYear(date) };
                    }
                }
                return get.state();
            },
        }),
        {
            props: { onChangeMonth, onChangeYear },
            postMiddleware: [
                (state, _, args) => {
                    const isValidMethod = args.method === "onChangeMonth" || args.method === "previousMonth" || args.method === "nextMonth";
                    if (isValidMethod) args.props.onChangeMonth?.(state.date);
                    return state;
                },
                (state, _, args) => {
                    const isValidMethod = args.method === "onChangeYear";
                    if (isValidMethod) args.props.onChangeYear?.(state.date);
                    return state;
                },
                (state, _, args) => {
                    const isValidMethod = args.method === "onSelectDate" || args.method === "setToday" || args.method === "onKeyDown";
                    if (rangeMode && isValidMethod && changeOnlyOnClick) {
                        onChange?.(state.range as any);
                        return state;
                    }
                    if (isValidMethod && changeOnlyOnClick) onChange?.(state.date);
                    return state;
                },
            ],
        }
    );

    const allDaysOfMonth = createDays(state.date);

    const zip = splitInto(allDaysOfMonth, 7);

    const currentAsString = state.date.toISOString();

    const monthString = formatMonth(state.date, currentLocale);

    useEffect(() => {
        if (!changeOnlyOnClick) onChange?.(state.date);
    }, [currentAsString]);

    const defer = useDebounce((y: string) => {
        dispatch.date((prev) => {
            const d = new Date(prev);
            d.setFullYear(+y);
            return d;
        });
    }, 1200);

    const internalOnChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        dispatch.onChangeYear(value);
        onChangeYear?.(new Date(value));
        defer(value);
    };

    return (
        <MotionConfig transition={transition}>
            <div
                data-component="calendar"
                ref={root}
                className={css("relative overflow-hidden", Is.function(styles?.calendar) ? styles?.calendar(allDaysOfMonth) : styles?.calendar)}
            >
                <div className="flex flex-col justify-center rounded text-center">
                    <AnimatePresence initial={false} mode="popLayout" custom={state.direction} onExitComplete={dispatch.onExitComplete}>
                        <motion.div key={monthString} initial="enter" animate="middle" exit="exit">
                            <header className="relative flex justify-between">
                                <motion.button
                                    layout
                                    type="button"
                                    data-focustrap="prev"
                                    variants={removeImmediately}
                                    onClick={dispatch.previousMonth}
                                    title={translations.calendarBackMonth}
                                    className="z-calendar rounded-full p-1.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </motion.button>
                                <motion.span
                                    layout
                                    variants={variants}
                                    custom={state.direction}
                                    className="absolute inset-0 isolate z-normal flex items-center justify-center font-semibold"
                                >
                                    <span className="flex w-fit items-center justify-center gap-0.5 py-1">
                                        <select
                                            aria-label={translations.calendarMonthLabel}
                                            value={monthString}
                                            onChange={dispatch.onChangeMonth}
                                            style={{ width: `${monthString.length + 1}ch` }}
                                            className="cursor-pointer appearance-none bg-transparent capitalize proportional-nums hover:text-primary"
                                        >
                                            {state.months}
                                        </select>
                                        <TheMaskInput
                                            mask="int"
                                            maxLength={4}
                                            placeholder="YYYY"
                                            value={state.year}
                                            onChange={internalOnChangeYear}
                                            style={{ width: `${state.year.length}ch` }}
                                            className="w-16 cursor-pointer appearance-none bg-transparent hover:text-primary"
                                        />
                                    </span>
                                </motion.span>
                                <motion.button
                                    layout
                                    type="button"
                                    data-focustrap="next"
                                    variants={removeImmediately}
                                    onClick={dispatch.nextMonth}
                                    title={translations.calendarNextMonth}
                                    className="z-calendar rounded-full p-1.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </motion.button>
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(to right, hsla(var(--card-background)) 15%, transparent 30%, transparent 70%, hsla(var(--card-background)) 85%)",
                                    }}
                                />
                            </header>
                            <motion.table className="mt-2 table min-w-full table-auto border-0">
                                <thead>
                                    <tr>
                                        {state.week.map((dayOfWeek) => (
                                            <th
                                                role="columnheader"
                                                key={dayOfWeek.toString()}
                                                className={css(
                                                    "py-2 text-sm font-medium capitalize",
                                                    Is.function(styles?.weekDay) ? styles.weekDay(dayOfWeek) : styles?.weekDay
                                                )}
                                            >
                                                {dayOfWeek.toLocaleDateString(currentLocale, { weekday: "short" })}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <CalendarBody
                                    zip={zip}
                                    range={range}
                                    styles={styles}
                                    date={date || null}
                                    dispatch={dispatch}
                                    markRange={markRange}
                                    markToday={markToday}
                                    rangeMode={rangeMode}
                                    stateDate={state.date}
                                    labelRange={labelRange}
                                    stateRange={state.range}
                                    RenderOnDay={RenderOnDay}
                                    direction={state.direction}
                                    disabledDate={disabledDate}
                                    onKeyDown={dispatch.onKeyDown}
                                />
                            </motion.table>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <footer className="mt-2 text-center text-primary">
                    <button className="transition-transform duration-300 hover:scale-105" type="button" onClick={dispatch.setToday}>
                        {translations.calendarToday}
                    </button>
                </footer>
            </div>
        </MotionConfig>
    );
};
