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
import { AnimatePresence, motion, MotionConfig, Transition, Variants } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { RefObject, useEffect, useRef } from "react";
import { Is } from "sidekicker";
import TheMaskInput, { Locales } from "the-mask-input";
import { useReducer } from "use-typed-reducer";
import { useDebounce } from "../../hooks/use-debounce";
import { useTranslations } from "../../hooks/use-translate-context";
import { css } from "../../lib/dom";
import { splitInto } from "../../lib/fns";
import { SetState } from "../../types";
import { Resizable } from "../core/resizable";

const transition: Transition = { type: "spring", bounce: 0.1, duration: 0.3 };

const dir =
    (mod: number) =>
    (n: number = 1) => ({ x: `${100 * mod * n}%`, opacity: 0.5 });

const variants: Variants = {
    middle: { x: "0%", opacity: 1 },
    enter: dir(1),
    exit: dir(-1),
};

const removeImmediately: Variants = { exit: { visibility: "hidden" } };

type Range = { from?: Date; to?: Date };

export type CalendarProps = Partial<
    {
        locale: Locales;
        markToday: boolean;
        rangeMode: boolean;
        changeOnlyOnClick: boolean;
        onChangeMonth: (d: Date) => void;
        onChangeYear: (d: Date) => void;
        RenderOnDay: React.FC<{ date: Date }>;
        disabledDate: (date: Date) => boolean;
        styles: Partial<{
            day: string;
            week: string;
            weekDay: string;
            dayFrame: string;
            calendar: string;
        }>;
    } & (
        | {
              date: Date;
              onChange: SetState<Date | undefined>;
          }
        | {
              range: Range;
              onChange: SetState<Range | undefined>;
          }
    )
>;

const createDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month));
    return eachDayOfInterval({ start, end: addDays(start, 41) });
};

const formatMonth = (d: Date, locale?: Locales) => d.toLocaleDateString(locale, { month: "long" });

const getOptionsMonth = (date: Date, locale?: Locales) =>
    Array.from({ length: 12 }).map((_, i) => {
        const month = startOfMonth(new Date(date).setMonth(i));
        const label = formatMonth(month, locale);
        return (
            <option key={label} value={label} data-index={i}>
                {label}
            </option>
        );
    });

const onChangeUsingKeyboard = {
    ArrowLeft: (date: Date, duration: "days" | "month") => {
        if (duration === "days") return subDays(date, 1);
        return subMonths(date, 1);
    },
    ArrowRight: (date: Date, duration: "days" | "month") => {
        if (duration === "days") return addDays(date, 1);
        return addMonths(date, 1);
    },
    ArrowUp: (date: Date, duration: "days" | "month") => {
        if (duration === "days") return subWeeks(date, 1);
        return subYears(date, 1);
    },
    ArrowDown: (date: Date, duration: "days" | "month") => {
        if (duration === "days") return addWeeks(date, 1);
        return addYears(date, 1);
    },
} satisfies Record<string, (date: Date, duration: "days" | "month") => Date>;

const focusDate = (root: RefObject<HTMLElement>, next: Date, delay = 0) => {
    const d = next.toISOString();
    const select = () => {
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

type SelectMode = "from" | "to";

export const Calendar = ({
    RenderOnDay,
    changeOnlyOnClick = false,
    disabledDate,
    locale,
    markToday = true,
    onChangeMonth,
    onChangeYear,
    rangeMode = false,
    onChange,
    styles,
    ...props
}: CalendarProps) => {
    const translate = useTranslations();
    const { date, range } = props as { date: Date | undefined; range: Range };
    const now = date || new Date();
    const table = useRef<HTMLElement>(null);
    const [state, dispatch] = useReducer(
        {
            date: now,
            isAnimating: false,
            year: formatYear(now),
            months: getOptionsMonth(now, locale),
            direction: undefined as number | undefined,
            range: { from: range?.from, to: range?.to },
            selectMode: (rangeMode ? "from" : undefined) as SelectMode | undefined,
            week: eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }),
        },
        (get) => ({
            onChangeYear: (year: string) => ({ year }),
            setToday: () => ({ date: startOfDay(new Date()) }),
            onExitComplete: () => {
                focusDate(get.props().table, get.state().date, 200);
                return { isAnimating: false };
            },
            date: (callback: (d: Date) => Date) => {
                const newDate = callback(get.state().date);
                return { date: newDate, year: formatYear(newDate) };
            },
            nextMonth: () => {
                const state = get.state();
                if (state.isAnimating) return state;
                const date = addMonths(state.date, 1);
                return { date, isAnimating: true, direction: 1, year: formatYear(date) };
            },
            previousMonth: () => {
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
                        focusDate(get.props().table, date);
                        return { ...state, date, year: formatYear(date) };
                    }
                }
                return get.state();
            },
        }),
        {
            props: { onChangeMonth, onChangeYear, table },
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

    const zip = splitInto(createDays(state.date), 7);

    const currentAsString = state.date.toISOString();

    const monthString = formatMonth(state.date, locale);

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
            <div className={css("relative overflow-hidden", styles?.calendar)}>
                <div className="flex flex-col justify-center rounded text-center">
                    <Resizable>
                        <AnimatePresence
                            initial={false}
                            mode="popLayout"
                            presenceAffectsLayout
                            custom={state.direction}
                            onExitComplete={dispatch.onExitComplete}
                        >
                            <motion.div key={monthString} initial="enter" animate="middle" exit="exit">
                                <header className="relative flex justify-between">
                                    <motion.button
                                        onClick={dispatch.previousMonth}
                                        variants={removeImmediately}
                                        className="z-calendar rounded-full p-1.5 hover:bg-primary"
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                    </motion.button>
                                    <motion.span
                                        variants={variants}
                                        custom={state.direction}
                                        className="absolute inset-0 isolate z-normal flex items-center justify-center font-semibold"
                                    >
                                        <span className="flex w-fit items-center justify-center gap-0.5 py-1">
                                            <select
                                                style={{ width: `${monthString.length}ch` }}
                                                value={monthString}
                                                onChange={dispatch.onChangeMonth}
                                                className="w-fit cursor-pointer appearance-none bg-transparent capitalize proportional-nums hover:text-primary"
                                            >
                                                {state.months}
                                            </select>
                                            <TheMaskInput
                                                mask="int"
                                                value={state.year}
                                                maxLength={4}
                                                placeholder="YYYY"
                                                onChange={internalOnChangeYear}
                                                style={{ width: `${state.year.length}ch` }}
                                                className="w-16 cursor-pointer appearance-none bg-transparent hover:text-primary"
                                            />
                                        </span>
                                    </motion.span>
                                    <motion.button
                                        variants={removeImmediately}
                                        className="z-calendar rounded-full p-1.5 hover:bg-primary"
                                        onClick={dispatch.nextMonth}
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
                                <table className="mt-2 table min-w-full table-auto border-0">
                                    <thead>
                                        <tr>
                                            {state.week.map((dayOfWeek) => (
                                                <th
                                                    key={dayOfWeek.toString()}
                                                    className={css("py-2 text-sm font-medium capitalize", styles?.weekDay)}
                                                >
                                                    {dayOfWeek.toLocaleDateString(locale, { weekday: "short" })}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <motion.tbody
                                        variants={variants}
                                        custom={state.direction}
                                        onKeyDown={dispatch.onKeyDown}
                                        className={css(styles?.week)}
                                    >
                                        {zip.map((week, index) => {
                                            return (
                                                <tr key={`week-${week.length}-${index}`} className={styles?.week}>
                                                    {week.map((day) => {
                                                        const key = day.toISOString();
                                                        const isSelected = rangeMode
                                                            ? key === range?.to?.toISOString() || key === range?.from?.toISOString()
                                                            : key === date?.toISOString();
                                                        const today = isToday(day) && markToday;
                                                        const disabledByFn = disabledDate?.(day) || false;
                                                        const disableDate = !isSameMonth(day, state.date) || disabledByFn;
                                                        const isInRange = rangeMode ? inRange(range?.from, day, range?.to) : false;
                                                        return (
                                                            <td key={key} align="center" className={css("relative", styles?.dayFrame)}>
                                                                <button
                                                                    type="button"
                                                                    data-date={key}
                                                                    disabled={disabledByFn}
                                                                    data-range={rangeMode}
                                                                    onClick={dispatch.onSelectDate}
                                                                    data-view={state.date.getMonth().toString()}
                                                                    className={css(
                                                                        `flex size-10 items-center justify-center rounded-full font-semibold proportional-nums disabled:cursor-not-allowed ${today ? "text-primary" : ""} ${disableDate ? "text-disabled" : ""} ${isSelected ? "bg-primary text-primary-foreground" : ""}`,
                                                                        styles?.day,
                                                                        isInRange ? "size-10 border border-dashed border-card-border" : ""
                                                                    )}
                                                                >
                                                                    {day.getDate()}
                                                                    {isSelected && state.range.from?.toISOString() === key ? (
                                                                        <span className="absolute h-full w-full">
                                                                            <span className="flex h-full items-center justify-end">
                                                                                <span className="sr-only">{translate.calendarFromDate}</span>
                                                                                <ChevronRightIcon
                                                                                    aria-hidden="true"
                                                                                    className="text-primary-subtle"
                                                                                    absoluteStrokeWidth
                                                                                    size={28}
                                                                                    strokeWidth={3}
                                                                                />
                                                                            </span>
                                                                        </span>
                                                                    ) : null}
                                                                    {isSelected && state.range.to?.toISOString() === key ? (
                                                                        <span className="absolute h-full w-full">
                                                                            <span className="flex h-full items-center justify-start">
                                                                                <span className="sr-only">{translate.calendarToDate}</span>
                                                                                <ChevronLeftIcon
                                                                                    aria-hidden="true"
                                                                                    className="text-primary-subtle"
                                                                                    absoluteStrokeWidth
                                                                                    size={28}
                                                                                    strokeWidth={3}
                                                                                />
                                                                            </span>
                                                                        </span>
                                                                    ) : null}
                                                                </button>
                                                                {RenderOnDay ? <RenderOnDay date={day} /> : null}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </motion.tbody>
                                </table>
                            </motion.div>
                        </AnimatePresence>
                    </Resizable>
                </div>
                <footer className="mt-2 text-center text-primary">
                    <button className="duration-300 transition-transform hover:scale-105" type="button" onClick={dispatch.setToday}>
                        Today
                    </button>
                </footer>
            </div>
        </MotionConfig>
    );
};
