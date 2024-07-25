"use client";
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    eachDayOfInterval,
    endOfWeek,
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
import React, { useEffect } from "react";
import { Is } from "sidekicker";
import TheMaskInput, { Locales } from "the-mask-input";
import { useReducer } from "use-typed-reducer";
import { useDebounce } from "../../hooks/use-debounce";
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

export type CalendarProps = {
    disabledDate?: (date: Date) => boolean;
    date?: Date;
    locale?: Locales;
    markToday?: boolean;
    autoFocusToday?: boolean;
    onChange?: (d: Date) => void;
};

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

const focusDate = (next: Date, delay = 0) => {
    const d = next.toISOString();
    const select = () => {
        const element = document.querySelector<HTMLButtonElement>(`button[data-date="${d}"]`);
        if (element) return element.focus({ preventScroll: false });
    };
    if (delay === 0) select();
    setTimeout(select, delay);
};

const formatYear = (now: Date) => now.getFullYear().toString().padStart(4, "0");

export const Calendar = ({ locale, disabledDate, markToday = true, autoFocusToday = true, date, onChange }: CalendarProps) => {
    const now = date || new Date();
    const [state, dispatch] = useReducer(
        {
            date: now,
            isAnimating: false,
            year: formatYear(now),
            direction: undefined as number | undefined,
            months: getOptionsMonth(now, locale),
            week: eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }),
        },
        (get) => ({
            onChangeYear: (year: string) => ({ year }),
            setToday: () => ({ date: startOfDay(new Date()) }),
            onExitComplete: () => {
                focusDate(get.state().date, 200);
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
                const d = e.currentTarget.dataset.date || "";
                const date = new Date(d);
                return { date, year: formatYear(date) };
            },
            onChangeMonth: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                const array = Array.from(e.target.options);
                const month = array.find((x) => x.value === value);
                if (month) {
                    const i = month.dataset.index || "";
                    const d = new Date(get.state().date);
                    d.setMonth(+i);
                    return { date: d, year: formatYear(d) };
                }
                return get.state();
            },
            onKeyDown: (e: React.KeyboardEvent<HTMLUListElement>) => {
                const key = e.key;
                if (key in onChangeUsingKeyboard) {
                    if (key === "ArrowUp" || key === "ArrowDown") e.preventDefault();
                    const prev = get.state().date;
                    const date = Is.keyof(onChangeUsingKeyboard, key) ? onChangeUsingKeyboard[key](prev, e.shiftKey ? "month" : "days") : null;
                    if (date !== null) {
                        focusDate(date);
                        return { date, year: formatYear(date) };
                    }
                }
                return get.state();
            },
        })
    );

    const days = createDays(state.date);
    const currentAsString = state.date.toISOString();
    const monthString = formatMonth(state.date, locale);

    useEffect(() => onChange?.(state.date), [currentAsString]);

    const defer = useDebounce((y: string) => {
        dispatch.date((prev) => {
            const d = new Date(prev);
            d.setFullYear(+y);
            return d;
        });
    }, 700);

    const onChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        dispatch.onChangeYear(value);
        defer(value);
    };

    return (
        <MotionConfig transition={transition}>
            <div className="relative overflow-hidden">
                <div className="flex flex-col justify-center rounded text-center">
                    <Resizable>
                        <AnimatePresence
                            presenceAffectsLayout
                            mode="popLayout"
                            initial={false}
                            custom={state.direction}
                            onExitComplete={dispatch.onExitComplete}
                        >
                            <motion.div key={monthString} initial="enter" animate="middle" exit="exit">
                                <header className="relative flex justify-between">
                                    <motion.button
                                        onClick={dispatch.previousMonth}
                                        variants={removeImmediately}
                                        className="z-calendar rounded-full p-1.5 hover:bg-primary-subtle"
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                    </motion.button>
                                    <motion.span
                                        variants={variants}
                                        custom={state.direction}
                                        className="absolute z-normal isolate inset-0 flex items-center justify-center font-semibold"
                                    >
                                        <span className="w-fit flex items-center justify-center gap-0.5 py-1">
                                            <select
                                                style={{ width: `${monthString.length}ch` }}
                                                value={monthString}
                                                onChange={dispatch.onChangeMonth}
                                                className="appearance-none capitalize bg-transparent proportional-nums hover:text-primary cursor-pointer w-fit"
                                            >
                                                {state.months}
                                            </select>
                                            <TheMaskInput
                                                mask="int"
                                                value={state.year}
                                                maxLength={4}
                                                placeholder="YYYY"
                                                onChange={onChangeYear}
                                                style={{ width: `${state.year.length}ch` }}
                                                className="w-16 bg-transparent appearance-none hover:text-primary cursor-pointer"
                                            />
                                        </span>
                                    </motion.span>
                                    <motion.button
                                        variants={removeImmediately}
                                        className="z-calendar rounded-full p-1.5 hover:bg-primary-subtle"
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
                                <div className="mt-4 grid grid-cols-7 gap-y-4">
                                    {state.week.map((dayOfWeek) => (
                                        <span key={dayOfWeek.toString()} className="font-medium capitalize text-sm">
                                            {dayOfWeek.toLocaleDateString(locale, { weekday: "short" })}
                                        </span>
                                    ))}
                                </div>
                                <motion.ul
                                    onKeyDown={dispatch.onKeyDown}
                                    variants={variants}
                                    custom={state.direction}
                                    className="mt-4 pb-2 grid grid-cols-7 gap-y-4"
                                >
                                    {days.map((day) => {
                                        const key = day.toISOString();
                                        const isSelected = key === currentAsString;
                                        const today = isToday(day) && markToday;
                                        const disabledByFn = disabledDate?.(day) || false;
                                        const disableDate = !isSameMonth(day, state.date) || disabledByFn;
                                        return (
                                            <li key={key} className="w-full flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    data-date={key}
                                                    disabled={disabledByFn}
                                                    onClick={dispatch.onSelectDate}
                                                    data-view={state.date.getMonth().toString()}
                                                    className={`size-8 disabled:cursor-not-allowed rounded-full font-semibold flex items-center justify-center proportional-nums ${today ? "text-primary" : ""} ${disableDate ? "text-disabled" : ""} ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                                                >
                                                    {day.getDate()}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </motion.ul>
                            </motion.div>
                        </AnimatePresence>
                    </Resizable>
                </div>
                <footer className="text-center text-primary mt-2">
                    <button className="hover:scale-105 transition-transform duration-300" type="button" onClick={dispatch.setToday}>
                        Today
                    </button>
                </footer>
            </div>
        </MotionConfig>
    );
};
