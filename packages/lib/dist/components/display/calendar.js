"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addDays, addMonths, addWeeks, addYears, eachDayOfInterval, endOfWeek, isSameMonth, isToday, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears, } from "date-fns";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect } from "react";
import { Is } from "sidekicker";
import TheMaskInput from "the-mask-input";
import { useReducer } from "use-typed-reducer";
import { useDebounce } from "../../hooks/use-debounce";
import { Resizable } from "../core/resizable";
const transition = { type: "spring", bounce: 0.1, duration: 0.3 };
const dir = (mod) => (n = 1) => ({ x: `${100 * mod * n}%`, opacity: 0.5 });
const variants = {
    middle: { x: "0%", opacity: 1 },
    enter: dir(1),
    exit: dir(-1),
};
const removeImmediately = { exit: { visibility: "hidden" } };
const createDays = (month) => {
    const start = startOfWeek(startOfMonth(month));
    return eachDayOfInterval({ start, end: addDays(start, 41) });
};
const formatMonth = (d, locale) => d.toLocaleDateString(locale, { month: "long" });
const getOptionsMonth = (date, locale) => Array.from({ length: 12 }).map((_, i) => {
    const month = startOfMonth(new Date(date).setMonth(i));
    const label = formatMonth(month, locale);
    return (_jsx("option", { value: label, "data-index": i, children: label }, label));
});
const onChangeUsingKeyboard = {
    ArrowLeft: (date, duration) => {
        if (duration === "days")
            return subDays(date, 1);
        return subMonths(date, 1);
    },
    ArrowRight: (date, duration) => {
        if (duration === "days")
            return addDays(date, 1);
        return addMonths(date, 1);
    },
    ArrowUp: (date, duration) => {
        if (duration === "days")
            return subWeeks(date, 1);
        return subYears(date, 1);
    },
    ArrowDown: (date, duration) => {
        if (duration === "days")
            return addWeeks(date, 1);
        return addYears(date, 1);
    },
};
const focusDate = (next, delay = 0) => {
    const d = next.toISOString();
    const select = () => {
        const element = document.querySelector(`button[data-date="${d}"]`);
        if (element)
            return element.focus({ preventScroll: false });
    };
    if (delay === 0)
        select();
    setTimeout(select, delay);
};
const formatYear = (now) => now.getFullYear().toString().padStart(4, "0");
export const Calendar = ({ locale, disabledDate, markToday = true, autoFocusToday = true, date, onChange }) => {
    const now = date || new Date();
    const [state, dispatch] = useReducer({
        date: now,
        isAnimating: false,
        year: formatYear(now),
        direction: undefined,
        months: getOptionsMonth(now, locale),
        week: eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) }),
    }, (get) => ({
        onChangeYear: (year) => ({ year }),
        setToday: () => ({ date: startOfDay(new Date()) }),
        onExitComplete: () => {
            focusDate(get.state().date, 200);
            return { isAnimating: false };
        },
        date: (callback) => {
            const newDate = callback(get.state().date);
            return { date: newDate, year: formatYear(newDate) };
        },
        nextMonth: () => {
            const state = get.state();
            if (state.isAnimating)
                return state;
            const date = addMonths(state.date, 1);
            return { date, isAnimating: true, direction: 1, year: formatYear(date) };
        },
        previousMonth: () => {
            const state = get.state();
            if (state.isAnimating)
                return state;
            const date = subMonths(state.date, 1);
            return { date, isAnimating: true, direction: -1, year: formatYear(date) };
        },
        onSelectDate: (e) => {
            const d = e.currentTarget.dataset.date || "";
            const date = new Date(d);
            return { date, year: formatYear(date) };
        },
        onChangeMonth: (e) => {
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
        onKeyDown: (e) => {
            const key = e.key;
            if (key in onChangeUsingKeyboard) {
                if (key === "ArrowUp" || key === "ArrowDown")
                    e.preventDefault();
                const prev = get.state().date;
                const date = Is.keyof(onChangeUsingKeyboard, key) ? onChangeUsingKeyboard[key](prev, e.shiftKey ? "month" : "days") : null;
                if (date !== null) {
                    focusDate(date);
                    return { date, year: formatYear(date) };
                }
            }
            return get.state();
        },
    }));
    const days = createDays(state.date);
    const currentAsString = state.date.toISOString();
    const monthString = formatMonth(state.date, locale);
    useEffect(() => onChange === null || onChange === void 0 ? void 0 : onChange(state.date), [currentAsString]);
    const defer = useDebounce((y) => {
        dispatch.date((prev) => {
            const d = new Date(prev);
            d.setFullYear(+y);
            return d;
        });
    }, 700);
    const onChangeYear = (e) => {
        const value = e.currentTarget.value;
        dispatch.onChangeYear(value);
        defer(value);
    };
    return (_jsx(MotionConfig, { transition: transition, children: _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("div", { className: "flex flex-col justify-center rounded text-center", children: _jsx(Resizable, { children: _jsx(AnimatePresence, { presenceAffectsLayout: true, mode: "popLayout", initial: false, custom: state.direction, onExitComplete: dispatch.onExitComplete, children: _jsxs(motion.div, { initial: "enter", animate: "middle", exit: "exit", children: [_jsxs("header", { className: "relative flex justify-between", children: [_jsx(motion.button, { onClick: dispatch.previousMonth, variants: removeImmediately, className: "z-calendar rounded-full p-1.5 hover:bg-primary", children: _jsx(ChevronLeftIcon, { className: "h-4 w-4" }) }), _jsx(motion.span, { variants: variants, custom: state.direction, className: "absolute z-normal isolate inset-0 flex items-center justify-center font-semibold", children: _jsxs("span", { className: "w-fit flex items-center justify-center gap-0.5 py-1", children: [_jsx("select", { style: { width: `${monthString.length}ch` }, value: monthString, onChange: dispatch.onChangeMonth, className: "appearance-none capitalize bg-transparent proportional-nums hover:text-primary cursor-pointer w-fit", children: state.months }), _jsx(TheMaskInput, { mask: "int", value: state.year, maxLength: 4, placeholder: "YYYY", onChange: onChangeYear, style: { width: `${state.year.length}ch` }, className: "w-16 bg-transparent appearance-none hover:text-primary cursor-pointer" })] }) }), _jsx(motion.button, { variants: removeImmediately, className: "z-calendar rounded-full p-1.5 hover:bg-primary", onClick: dispatch.nextMonth, children: _jsx(ChevronRightIcon, { className: "h-4 w-4" }) }), _jsx("div", { className: "absolute inset-0", style: {
                                                    backgroundImage: "linear-gradient(to right, hsla(var(--card-background)) 15%, transparent 30%, transparent 70%, hsla(var(--card-background)) 85%)",
                                                } })] }), _jsx("div", { className: "mt-4 grid grid-cols-7 gap-y-4", children: state.week.map((dayOfWeek) => (_jsx("span", { className: "font-medium capitalize text-sm", children: dayOfWeek.toLocaleDateString(locale, { weekday: "short" }) }, dayOfWeek.toString()))) }), _jsx(motion.ul, { onKeyDown: dispatch.onKeyDown, variants: variants, custom: state.direction, className: "mt-4 pb-2 grid grid-cols-7 gap-y-4", children: days.map((day) => {
                                            const key = day.toISOString();
                                            const isSelected = key === currentAsString;
                                            const today = isToday(day) && markToday;
                                            const disabledByFn = (disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(day)) || false;
                                            const disableDate = !isSameMonth(day, state.date) || disabledByFn;
                                            return (_jsx("li", { className: "w-full flex items-center justify-center", children: _jsx("button", { type: "button", "data-date": key, disabled: disabledByFn, onClick: dispatch.onSelectDate, "data-view": state.date.getMonth().toString(), className: `size-8 disabled:cursor-not-allowed rounded-full font-semibold flex items-center justify-center proportional-nums ${today ? "text-primary" : ""} ${disableDate ? "text-disabled" : ""} ${isSelected ? "bg-primary text-primary-foreground" : ""}`, children: day.getDate() }) }, key));
                                        }) })] }, monthString) }) }) }), _jsx("footer", { className: "text-center text-primary mt-2", children: _jsx("button", { className: "hover:scale-105 transition-transform duration-300", type: "button", onClick: dispatch.setToday, children: "Today" }) })] }) }));
};
