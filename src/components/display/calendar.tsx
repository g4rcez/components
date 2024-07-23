"use client";
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    eachDayOfInterval,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    parse,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns";
import { AnimatePresence, motion, MotionConfig, Transition, Variants } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { Locales } from "the-mask-input";
import { Resizable } from "../core/resizable";

const transition: Transition = { type: "tween", bounce: 0.15, duration: 0.3 };

const dir =
    (mod: number) =>
        (n: number = 1) => ({ x: `${100 * mod * n}%`, opacity: 0.5 });

const variants: Variants = {
    middle: { x: "0%", opacity: 1 },
    enter: dir(1),
    exit: dir(-1),
};

const removeImmediately: Variants = {
    exit: { visibility: "hidden" },
};

type CalendarProps = {
    locale?: Locales;
    markToday?: boolean;
};

const createDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month));
    return eachDayOfInterval({ start, end: addDays(start, 41) });
};

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

const isSameDay = (d1: Date, d2: Date) =>
    d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();

export const Calendar = ({ locale = undefined, markToday = true }: CalendarProps) => {
    const now = new Date();
    const week = useRef(eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }));
    const [current, setCurrent] = useState<Date>(now);
    const monthString = format(current || now, "yyyy-MM");
    const [direction, setDirection] = useState<number | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState(false);
    const month = parse(monthString, "yyyy-MM", current);
    const currentAsString = current.toISOString();

    const nextMonth = () => {
        if (isAnimating) return;
        setCurrent((prev) => addMonths(prev, 1));
        setDirection(1);
        setIsAnimating(true);
    };

    const previousMonth = () => {
        if (isAnimating) return;
        setCurrent((prev) => subMonths(prev, 1));
        setDirection(-1);
        setIsAnimating(true);
    };

    const days = createDays(month);

    const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        const key = e.key;
        if (key in onChangeUsingKeyboard) {
            if (current) {
                setCurrent((prev) => {
                    const next: Date = onChangeUsingKeyboard[key](prev, e.shiftKey ? "month" : "days");
                    focusDate(next);
                    return next;
                });
                if (key === "ArrowUp" || key === "ArrowDown") e.preventDefault();
            }
        }
    };

    const onSelectDate = (e: React.MouseEvent<HTMLButtonElement>) => {
        const date = e.currentTarget.dataset.date || "";
        const d = new Date(date);
        setCurrent(d);
    };

    const onExitComplete = () => {
        setIsAnimating(false);
        focusDate(current, 200);
    };

    return (
        <MotionConfig transition={transition}>
            <div className="relative overflow-hidden">
                <div className="flex flex-col justify-center rounded text-center">
                    <Resizable>
                        <AnimatePresence mode="popLayout" initial={false} custom={direction} onExitComplete={onExitComplete}>
                            <motion.div key={monthString} initial="enter" animate="middle" exit="exit">
                                <header className="relative flex justify-between">
                                    <motion.button
                                        onClick={previousMonth}
                                        variants={removeImmediately}
                                        className="z-calendar rounded-full p-1.5 hover:bg-primary-subtle"
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                    </motion.button>
                                    <motion.p
                                        variants={variants}
                                        custom={direction}
                                        className="absolute inset-0 flex items-center justify-center font-semibold"
                                    >
                                        {format(month, "MMMM yyyy")}
                                    </motion.p>
                                    <motion.button
                                        variants={removeImmediately}
                                        className="z-calendar rounded-full p-1.5 hover:bg-primary-subtle"
                                        onClick={nextMonth}
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
                                <div className="mt-3 grid grid-cols-7 gap-y-4">
                                    {week.current.map((dayOfWeek) => (
                                        <span key={dayOfWeek.toString()} className="font-medium">
                                            {dayOfWeek.toLocaleDateString(locale, { weekday: "short" })}
                                        </span>
                                    ))}
                                </div>
                                <motion.ul
                                    onKeyDown={onKeyDown}
                                    variants={variants}
                                    custom={direction}
                                    className="mt-4 pb-2 grid grid-cols-7 gap-y-4"
                                >
                                    {days.map((day) => {
                                        const key = day.toISOString();
                                        const isSelected = key === currentAsString;
                                        const today = isToday(day) && markToday;
                                        return (
                                            <li key={key} className="w-full flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    data-date={key}
                                                    onClick={onSelectDate}
                                                    data-view={current.getMonth().toString()}
                                                    className={`size-8 rounded-full font-semibold flex items-center justify-center proportional-nums ${today ? "text-primary" : ""} ${isSameMonth(day, month) ? "" : "text-disabled"} ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
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
            </div>
        </MotionConfig>
    );
};
