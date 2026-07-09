"use client";
import { useFloating, useInteractions, useListNavigation, useTypeahead } from "@floating-ui/react";
import { endOfMonth, endOfYear, format, isValid, parse, startOfDay, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import { CalendarIcon, CheckIcon } from "@phosphor-icons/react";
import type React from "react";
import { forwardRef, Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Is } from "sidekicker";
import { useLocale } from "../../../hooks/use-locale";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { Override } from "../../../types";
import { Calendar, type CalendarProps } from "../../display/calendar/calendar";
import { Button } from "../../core/button/button";
import { Dropdown } from "../../floating/dropdown/dropdown";
import { Input, type InputProps } from "../input/input";
import { datePickerStyles } from "./date-picker.styles";

export type DateRangeValue = { from?: Date; to?: Date } | null;

export type DatePickerPreset = { label: string; range: DateRangeValue | ((today: Date) => DateRangeValue) };

export type DatePickerRangeLabels = Partial<{
    searchPlaceholder: string;
    today: string;
    cancel: string;
    apply: string;
}>;

export type DatePickerProps = Omit<
    Override<
        InputProps,
        CalendarProps & {
            floating?: boolean;
            clickToClose?: boolean;
            range?: DateRangeValue | null;
            rangePresets?: DatePickerPreset[];
            rangeLabels?: DatePickerRangeLabels;
        }
    >,
    "currency"
>;

const fixedDate = new Date(1970, 11, 31);

const parts = {
    year: () => [/\d/, /\d/, /\d/, /\d/],
    month: () => [/\d/, /\d/],
    day: () => [/\d/, /\d/],
    hour: () => [/\d/, /\d/],
    minute: () => [/\d/, /\d/],
    literal: (str: string) => str.split(""),
} satisfies Partial<Record<keyof Intl.DateTimeFormatPartTypesRegistry, (str: string) => Array<string | RegExp>>>;

const placeholders = {
    day: () => "dd",
    hour: () => "HH",
    month: () => "MM",
    minute: () => "mm",
    year: () => "yyyy",
    literal: (str: string) => str,
} satisfies Partial<Record<keyof Intl.DateTimeFormatPartTypesRegistry, string | ((x: string, locale: Intl.RelativeTimeFormat) => string)>>;

const formatParts = (datetimeFormat: Intl.DateTimeFormat, date: Date) => {
    try {
        return datetimeFormat.formatToParts(date).map((x) => {
            if (x.type === "literal" && x.value === ", ") {
                return { type: x.type, value: " " };
            }
            return x;
        });
    } catch {
        return [];
    }
};

type Mask = string | RegExp;

const DATE_TIME_FORMAT = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
} as const;

const DATE_FORMAT = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
} as const;

const isValidRange = (range: DateRangeValue | undefined) => isValid(range?.from) || isValid(range?.to);

const getPresetRanges = (
    labels: {
        today: string;
        yesterday: string;
        last7Days: string;
        last30Days: string;
        thisMonth: string;
        lastMonth: string;
        thisYear: string;
    },
    today = startOfDay(new Date())
) => [
    { label: labels.today, range: { from: today, to: today } },
    { label: labels.yesterday, range: { from: subDays(today, 1), to: subDays(today, 1) } },
    { label: labels.last7Days, range: { from: subDays(today, 6), to: today } },
    { label: labels.last30Days, range: { from: subDays(today, 29), to: today } },
    { label: labels.thisMonth, range: { from: startOfMonth(today), to: endOfMonth(today) } },
    { label: labels.lastMonth, range: { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) } },
    { label: labels.thisYear, range: { from: startOfYear(today), to: endOfYear(today) } },
];

const isSameRange = (a: DateRangeValue | undefined, b: DateRangeValue | undefined) =>
    a?.from?.toDateString() === b?.from?.toDateString() && a?.to?.toDateString() === b?.to?.toDateString();

type ResolvedDatePickerPreset = { label: string; range: DateRangeValue };

const DatePickerPresetList = ({
    label,
    presets,
    value,
    onSelect,
}: {
    label: string;
    presets: ResolvedDatePickerPreset[];
    value: DateRangeValue | undefined;
    onSelect: (range: DateRangeValue) => void;
}) => {
    const listboxId = useId();
    const listRef = useRef<Array<HTMLElement | null>>([]);
    const labelsRef = useRef<Array<string | null>>([]);
    const selectedIndex = presets.findIndex((preset) => isSameRange(preset.range, value));
    const [activeIndex, setActiveIndex] = useState<number | null>(selectedIndex >= 0 ? selectedIndex : 0);
    const { context } = useFloating({ open: true });
    labelsRef.current = presets.map((preset) => preset.label);

    useEffect(() => {
        listRef.current = listRef.current.slice(0, presets.length);
        if (activeIndex !== null && activeIndex >= presets.length) setActiveIndex(presets.length ? 0 : null);
    }, [activeIndex, presets.length]);

    const listNavigation = useListNavigation(context, {
        activeIndex,
        listRef,
        loop: true,
        onNavigate: setActiveIndex,
        selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
    });
    const typeahead = useTypeahead(context, {
        activeIndex,
        listRef: labelsRef,
        onMatch: (index) => {
            setActiveIndex(index);
            listRef.current[index]?.focus();
        },
    });
    const { getFloatingProps, getItemProps } = useInteractions([listNavigation, typeahead]);

    return (
        <div
            {...getFloatingProps({
                "aria-label": label,
                id: listboxId,
                role: "listbox",
                tabIndex: 0,
                onKeyDown: (event) => {
                    if (event.target !== event.currentTarget) return;
                    const activePreset = activeIndex === null ? undefined : presets[activeIndex];
                    if ((event.key === "Enter" || event.key === " ") && activePreset) {
                        event.preventDefault();
                        onSelect(activePreset.range);
                    }
                },
                className: datePickerStyles.slots["preset-list"],
            })}
        >
            {presets.map((preset, index) => {
                const selected = isSameRange(preset.range, value);
                return (
                    <button
                        {...getItemProps({
                            ref: (node) => {
                                listRef.current[index] = node;
                            },
                            onClick: () => onSelect(preset.range),
                            onFocus: () => setActiveIndex(index),
                        })}
                        role="option"
                        type="button"
                        key={preset.label}
                        aria-selected={selected}
                        id={`${listboxId}-${index}`}
                        data-selected={selected || undefined}
                        tabIndex={activeIndex === index ? 0 : -1}
                        className={datePickerStyles.slots["preset-button"]}
                    >
                        {preset.label}
                        {selected ? <CheckIcon aria-hidden="true" className={datePickerStyles.slots["preset-check"]} /> : null}
                    </button>
                );
            })}
        </div>
    );
};

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    (
        {
            date,
            range,
            rangeMode: inputRangeMode,
            locale: inputLocal,
            disabledDate,
            onChange,
            markToday,
            markRange,
            rangePresets,
            rangeLabels,
            clickToClose,
            floating = true,
            type,
            ...props
        }: DatePickerProps,
        externalRef
    ) => {
        const locale = useLocale(inputLocal);
        const labelId = useId();
        const translation = useTranslations();
        const datetimeFormat = useMemo(() => new Intl.DateTimeFormat(locale, type === "datetime" ? DATE_TIME_FORMAT : DATE_FORMAT), [locale, type]);
        const rangeMode = inputRangeMode || range !== undefined;
        const [innerDate, setInnerDate] = useState(date || undefined);
        const [innerRange, setInnerRange] = useState<DateRangeValue | undefined>(range);
        const [draftRange, setDraftRange] = useState<DateRangeValue | undefined>(range);
        const [open, setOpen] = useState(false);
        const mask = formatParts(datetimeFormat, fixedDate).flatMap((x) =>
            Is.keyof(parts, x.type) ? (parts[x.type]!(x.value) as Mask[]) : ([] as Mask[])
        );
        const placeholder = useMemo(() => {
            return formatParts(datetimeFormat, fixedDate).reduce(
                (acc, x) => acc + (Is.keyof(placeholders, x.type) ? placeholders[x.type](x.value) : ""),
                ""
            );
        }, [datetimeFormat]);

        const isoDateEffect = date?.toISOString();
        const isoRangeEffect = `${range?.from?.toISOString() || ""}/${range?.to?.toISOString() || ""}`;

        const formatDateValue = useCallback((d: Date | undefined) => (isValid(d) ? format(d!, placeholder) : ""), [placeholder]);
        const formatRangeValue = useCallback(
            (r: DateRangeValue | undefined) => [formatDateValue(r?.from), formatDateValue(r?.to)].filter(Boolean).join(" – "),
            [formatDateValue]
        );

        const [value, setValue] = useState(rangeMode ? formatRangeValue(innerRange) : formatDateValue(innerDate));
        const labels = {
            searchPlaceholder: rangeLabels?.searchPlaceholder || translation.datePickerSearchPeriodPlaceholder,
            today: rangeLabels?.today || translation.datePickerTodayPreset,
            cancel: rangeLabels?.cancel || translation.datePickerCancel,
            apply: rangeLabels?.apply || translation.datePickerApply,
        };
        const presetRanges = useMemo(() => {
            const today = startOfDay(new Date());
            const defaults = getPresetRanges(
                {
                    today: translation.datePickerTodayPreset,
                    yesterday: translation.datePickerYesterdayPreset,
                    last7Days: translation.datePickerLast7DaysPreset,
                    last30Days: translation.datePickerLast30DaysPreset,
                    thisMonth: translation.datePickerThisMonthPreset,
                    lastMonth: translation.datePickerLastMonthPreset,
                    thisYear: translation.datePickerThisYearPreset,
                },
                today
            );
            return (rangePresets || defaults).map((preset) => ({
                label: preset.label,
                range: typeof preset.range === "function" ? preset.range(today) : preset.range,
            }));
        }, [rangePresets, translation]);

        const onChangeDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (rangeMode) return;
            const v = e.target.value;
            setValue(v);
            if (mask.length === v.length) {
                const matches = mask.every((x, i) => {
                    const c = v.charAt(i);
                    return typeof x === "string" ? c === x : x.test(c);
                });
                if (matches) {
                    const parsed = parse(v, placeholder, new Date());
                    const d = type === "datetime" ? parsed : startOfDay(parsed);
                    setInnerDate(d);
                    return onChange?.(d);
                }
            }
            setInnerDate(undefined);
            return onChange?.(undefined);
        };

        useEffect(() => {
            if (rangeMode) return;
            if (isValid(date)) {
                setInnerDate(date);
                setValue(formatDateValue(date));
            }
        }, [isoDateEffect, formatDateValue, date, rangeMode]);

        useEffect(() => {
            if (!rangeMode) return;
            setInnerRange(range);
            setDraftRange(range);
            setValue(formatRangeValue(range));
        }, [isoRangeEffect, formatRangeValue, range, rangeMode]);

        const onChangeDate = (d: Date | DateRangeValue | undefined) => {
            if (rangeMode) {
                const nextRange = d as DateRangeValue | undefined;
                setDraftRange(nextRange);
                if (clickToClose && nextRange?.from && nextRange?.to) applyRange(nextRange);
                return;
            }
            const nextDate = d as Date | undefined;
            setInnerDate(nextDate);
            onChange?.(nextDate);
            if (clickToClose) setOpen(false);
            return setValue(formatDateValue(nextDate));
        };

        const validDate = isValid(innerDate);
        const validRange = isValidRange(innerRange);
        const htmlValue = (() => {
            if (rangeMode) return validRange ? `${innerRange?.from?.toISOString() || ""}/${innerRange?.to?.toISOString() || ""}` : undefined;
            return validDate ? innerDate!.toISOString() : undefined;
        })();
        const nativeValue = (() => {
            if (rangeMode) return htmlValue || "";
            return validDate ? format(innerDate!, "yyyy-MM-dd") : "";
        })();
        const calendarDate = !rangeMode && validDate ? innerDate : undefined;

        const applyRange = (nextRange = draftRange) => {
            setInnerRange(nextRange);
            onChange?.(nextRange as Date & DateRangeValue);
            setValue(formatRangeValue(nextRange));
            setOpen(false);
        };

        const cancelRange = () => {
            setDraftRange(innerRange);
            setOpen(false);
        };

        const CalendarComponent = (
            <Calendar
                {...(props as unknown as CalendarProps)}
                type={type}
                locale={locale}
                changeOnlyOnClick
                markToday={markToday}
                onChange={onChangeDate}
                disabledDate={disabledDate}
                date={calendarDate}
                range={rangeMode ? draftRange : undefined}
                rangeMode={rangeMode}
                markRange={markRange}
            />
        );

        return (
            <Fragment>
                <Input
                    {...props}
                    value={value}
                    id={undefined}
                    name={undefined}
                    data-value={htmlValue}
                    formNoValidate={!open}
                    data-target={props.name}
                    data-component="date-picker"
                    onChange={onChangeDateInput}
                    required={props.required ?? true}
                    mask={rangeMode ? undefined : mask}
                    error={open ? undefined : props.error}
                    readOnly={rangeMode || props.readOnly}
                    className={css(datePickerStyles.className({}), props.className)}
                    placeholder={props.placeholder || translation.datepickerPlaceholder(placeholder)}
                    right={
                        floating ? (
                            <Fragment>
                                <input
                                    data-origin={props.name}
                                    value={nativeValue || ""}
                                    form={props.form}
                                    hidden
                                    id={props.name}
                                    name={props.name}
                                    ref={externalRef}
                                    type={rangeMode ? "hidden" : "date"}
                                    readOnly
                                />
                                <Dropdown
                                    open={open}
                                    onChange={(nextOpen) => {
                                        if (nextOpen) setDraftRange(innerRange);
                                        setOpen(nextOpen);
                                    }}
                                    buttonProps={{ "aria-describedby": labelId }}
                                    trigger={
                                        <span>
                                            <span id={labelId} className={datePickerStyles.slots["sr-label"]}>
                                                {translation.datePickerCalendarButtonLabel}
                                            </span>
                                            <CalendarIcon aria-hidden="true" className={datePickerStyles.slots["calendar-icon"]} />
                                        </span>
                                    }
                                >
                                    {rangeMode ? (
                                        <div className={datePickerStyles.slots.panel}>
                                            <aside className={datePickerStyles.slots.presets}>
                                                <DatePickerPresetList
                                                    label={labels.searchPlaceholder}
                                                    presets={presetRanges}
                                                    value={draftRange}
                                                    onSelect={setDraftRange}
                                                />
                                            </aside>
                                            <div>{CalendarComponent}</div>
                                            <footer className={datePickerStyles.slots.actions}>
                                                <Button
                                                    size="small"
                                                    theme="ghost-primary"
                                                    onClick={() => setDraftRange({ from: startOfDay(new Date()), to: startOfDay(new Date()) })}
                                                >
                                                    {labels.today}
                                                </Button>
                                                <span className={datePickerStyles.slots["actions-confirm"]}>
                                                    <Button size="small" onClick={cancelRange} theme="ghost-muted">
                                                        {labels.cancel}
                                                    </Button>
                                                    <Button size="small" onClick={() => applyRange()}>
                                                        {labels.apply}
                                                    </Button>
                                                </span>
                                            </footer>
                                        </div>
                                    ) : (
                                        CalendarComponent
                                    )}
                                </Dropdown>
                            </Fragment>
                        ) : null
                    }
                />
                {floating ? null : (
                    <Fragment>
                        <input
                            hidden
                            readOnly
                            id={props.name}
                            form={props.form}
                            name={props.name}
                            ref={externalRef}
                            data-origin={props.name}
                            value={nativeValue || ""}
                            type={rangeMode ? "hidden" : "date"}
                        />
                        {CalendarComponent}
                    </Fragment>
                )}
            </Fragment>
        );
    }
);
