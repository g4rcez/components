"use client";
import { useFloating, useInteractions, useListNavigation, useTypeahead } from "@floating-ui/react";
import { CalendarIcon } from "@phosphor-icons/react";
import { endOfMonth, endOfYear, format, isValid, parse, startOfDay, startOfMonth, startOfYear, subDays, subMonths } from "date-fns";
import type React from "react";
import { forwardRef, Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Is } from "sidekicker";
import MaskInput from "the-mask-input";
import { useLocale } from "../../../hooks/use-locale";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { Override } from "../../../types";
import { Button } from "../../core/button/button";
import { Calendar, type DatepickerType, type CalendarProps } from "../../display/calendar/calendar";
import { Dropdown } from "../../floating/dropdown/dropdown";
import { freeTextStyles } from "../input/free-text.styles";
import { Input, type InputProps } from "../input/input";
import { InputFeedback } from "../input/input-field";
import { inputFieldStyles } from "../input/input-field.styles";
import { datePickerStyles } from "./date-picker.styles";

export type DateRangeValue = { from?: Date; to?: Date } | null;

export type DatePickerPreset = { label: string; range: DateRangeValue | ((today: Date) => DateRangeValue) };

export type DatePickerRangeLabels = Partial<{
    searchPlaceholder: string;
    today: string;
    cancel: string;
    apply: string;
}>;

type DatePickerBaseProps = Omit<
    Override<
        InputProps,
        CalendarProps<DatepickerType> & {
            floating?: boolean;
            clickToClose?: boolean;
            rangePresets?: DatePickerPreset[];
            rangeLabels?: DatePickerRangeLabels;
        }
    >,
    "currency" | "date" | "range" | "rangeMode" | "onChange"
>;

type DatePickerDateProps = DatePickerBaseProps & {
    date?: Date;
    range?: never;
    rangeMode?: false;
    type?: "date" | "datetime";
    onChange?: (date: Date | undefined) => void;
};

type DatePickerRangeProps = DatePickerBaseProps & {
    date?: never;
    range?: DateRangeValue;
    rangeMode?: true;
    type: "range";
    onChange?: (range: DateRangeValue) => void;
};

export type DatePickerProps<T extends DatepickerType = "date"> = T extends "range" ? DatePickerRangeProps : DatePickerDateProps;

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
                    </button>
                );
            })}
        </div>
    );
};

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps<DatepickerType>>(
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
            type = "date",
            ...props
        }: DatePickerProps<DatepickerType>,
        externalRef
    ) => {
        const onChangeValue = onChange as ((value: Date | DateRangeValue | undefined) => void) | undefined;
        const locale = useLocale(inputLocal);
        const labelId = useId();
        const rangeId = props.id ?? props.name ?? labelId;
        const translation = useTranslations();
        const datetimeFormat = useMemo(() => new Intl.DateTimeFormat(locale, type === "datetime" ? DATE_TIME_FORMAT : DATE_FORMAT), [locale, type]);
        const rangeMode = inputRangeMode || range !== undefined;
        const [innerDate, setInnerDate] = useState(date || undefined);
        const [innerRange, setInnerRange] = useState<DateRangeValue | undefined>(range);
        const innerRangeRef = useRef<DateRangeValue | undefined>(range);
        const [draftRange, setDraftRange] = useState<DateRangeValue | undefined>(range);
        const draftRangeRef = useRef<DateRangeValue | undefined>(range);
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

        const [value, setValue] = useState(formatDateValue(innerDate));
        const [rangeValues, setRangeValues] = useState(() => ({
            from: formatDateValue(innerRange?.from),
            to: formatDateValue(innerRange?.to),
        }));
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
                    return onChangeValue?.(d);
                }
            }
            setInnerDate(undefined);
            return onChangeValue?.(undefined);
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
            innerRangeRef.current = range;
            draftRangeRef.current = range;
            setInnerRange(range);
            setDraftRange(range);
            setRangeValues({ from: formatDateValue(range?.from), to: formatDateValue(range?.to) });
        }, [isoRangeEffect, formatDateValue, range, rangeMode]);

        const onChangeDate = (d: Date | DateRangeValue | undefined) => {
            if (rangeMode) {
                const nextRange = (d as DateRangeValue | undefined) ?? null;
                draftRangeRef.current = nextRange;
                setDraftRange(nextRange);
                setRangeValues({ from: formatDateValue(nextRange?.from), to: formatDateValue(nextRange?.to) });
                if (clickToClose && nextRange?.from && nextRange?.to) applyRange(nextRange);
                return;
            }
            const nextDate = d as Date | undefined;
            setInnerDate(nextDate);
            onChangeValue?.(nextDate);
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

        const applyRange = (nextRange = draftRangeRef.current ?? null) => {
            innerRangeRef.current = nextRange;
            draftRangeRef.current = nextRange;
            setInnerRange(nextRange);
            onChangeValue?.(nextRange);
            setRangeValues({ from: formatDateValue(nextRange?.from), to: formatDateValue(nextRange?.to) });
            setOpen(false);
        };

        const onChangeRangeInput = (key: "from" | "to") => (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            setRangeValues((current) => ({ ...current, [key]: inputValue }));

            const matchesMask =
                mask.length === inputValue.length &&
                mask.every((part, index) => {
                    const character = inputValue.charAt(index);
                    return typeof part === "string" ? character === part : part.test(character);
                });
            // Keep the committed range intact while a masked date is incomplete.
            // Otherwise a controlled parent receives a transient `undefined` endpoint.
            if (!matchesMask) return;

            const parsed = parse(inputValue, placeholder, new Date());
            if (!isValid(parsed)) return;

            const nextRange = {
                ...(draftRangeRef.current ?? innerRangeRef.current),
                [key]: type === "datetime" ? parsed : startOfDay(parsed),
            };
            draftRangeRef.current = nextRange;
            setDraftRange(nextRange);
            if (!open) {
                innerRangeRef.current = nextRange;
                setInnerRange(nextRange);
                onChangeValue?.(nextRange);
            }
        };

        const resetRangeInput = (key: "from" | "to") => () => {
            const currentRange = open ? draftRangeRef.current : innerRangeRef.current;
            setRangeValues((current) => ({ ...current, [key]: formatDateValue(currentRange?.[key]) }));
        };

        const cancelRange = () => {
            draftRangeRef.current = innerRangeRef.current;
            setDraftRange(innerRangeRef.current);
            setRangeValues({ from: formatDateValue(innerRangeRef.current?.from), to: formatDateValue(innerRangeRef.current?.to) });
            setOpen(false);
        };

        const CalendarComponent = (
            <Calendar
                {...(props as unknown as CalendarProps)}
                locale={locale}
                changeOnlyOnClick
                date={calendarDate}
                markRange={markRange}
                markToday={markToday}
                rangeMode={rangeMode}
                onChange={onChangeDate}
                disabledDate={disabledDate}
                type={rangeMode ? "range" : type}
                range={rangeMode ? draftRange : undefined}
            />
        );

        const CalendarDropdown = floating ? (
            <Dropdown
                open={open}
                buttonProps={{ "aria-describedby": labelId }}
                onChange={(nextOpen) => {
                    if (nextOpen) {
                        draftRangeRef.current = innerRangeRef.current;
                        setDraftRange(innerRangeRef.current);
                    }
                    setOpen(nextOpen);
                }}
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
                                onSelect={(nextRange) => {
                                    draftRangeRef.current = nextRange;
                                    setDraftRange(nextRange);
                                    setRangeValues({ from: formatDateValue(nextRange?.from), to: formatDateValue(nextRange?.to) });
                                }}
                            />
                        </aside>
                        <div>{CalendarComponent}</div>
                        <footer className={datePickerStyles.slots.actions}>
                            <Button
                                size="small"
                                theme="ghost-primary"
                                onClick={() => {
                                    const today = startOfDay(new Date());
                                    draftRangeRef.current = { from: today, to: today };
                                    setDraftRange(draftRangeRef.current);
                                    setRangeValues({ from: formatDateValue(today), to: formatDateValue(today) });
                                }}
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
        ) : null;

        const HiddenInput = (
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
        );

        const rangeInputClassName = css(
            freeTextStyles.className({ size: props.size }),
            freeTextStyles.slots.input,
            freeTextStyles.slots.placeholder,
            freeTextStyles.slots.surface,
            freeTextStyles.slots.transition,
            freeTextStyles.slots.invalid,
            freeTextStyles.slots["input-state"],
            datePickerStyles.slots["range-input"]
        );
        const rangeRequired = props.required ?? true;

        return (
            <Fragment>
                {rangeMode ? (
                    <fieldset
                        form={props.form}
                        disabled={props.disabled}
                        data-error={!!props.error}
                        data-value={htmlValue}
                        data-target={props.name}
                        data-component="date-picker"
                        aria-disabled={props.disabled}
                        className={css(
                            inputFieldStyles.className({ size: props.size }),
                            inputFieldStyles.slots.fieldset,
                            datePickerStyles.className({}),
                            datePickerStyles.slots["range-field"],
                            props.container,
                            props.className
                        )}
                    >
                        <legend className={datePickerStyles.slots["sr-label"]}>{props.title}</legend>
                        <InputFeedback id={rangeId} info={props.info} title={props.title} hideLeft={props.hideLeft} reportStatus={props.reportStatus}>
                            {props.optionalText?.trim() && !rangeRequired ? (
                                <span aria-disabled={props.disabled} className={inputFieldStyles.slots.optional}>
                                    {props.optionalText}
                                </span>
                            ) : null}
                            {props.rightLabel}
                        </InputFeedback>
                        <div
                            className={css(
                                inputFieldStyles.slots.border,
                                inputFieldStyles.slots.control,
                                inputFieldStyles.slots["control-surface"],
                                inputFieldStyles.slots["control-state"],
                                inputFieldStyles.slots["control-disabled"],
                                !props.disabled && freeTextStyles.slots["field-state"],
                                props.disabled && freeTextStyles.slots["disabled-border"],
                                datePickerStyles.slots["range-control"]
                            )}
                        >
                            {props.left ? (
                                <span className={css(inputFieldStyles.slots["slot-start"], inputFieldStyles.slots.slot)}>{props.left}</span>
                            ) : null}
                            <MaskInput
                                mask={mask}
                                type="text"
                                id={`${rangeId}-from`}
                                form={props.form}
                                value={rangeValues.from}
                                required={rangeRequired}
                                disabled={props.disabled}
                                readOnly={props.readOnly}
                                aria-invalid={!!props.error}
                                aria-label={translation.calendarFromDate}
                                aria-describedby={props.error ? `${rangeId}-error` : undefined}
                                placeholder={props.placeholder || translation.datepickerPlaceholder(placeholder)}
                                className={rangeInputClassName}
                                onChange={onChangeRangeInput("from")}
                                onBlur={resetRangeInput("from")}
                            />
                            <span aria-hidden="true" className={datePickerStyles.slots["range-separator"]}>
                                –
                            </span>
                            <MaskInput
                                mask={mask}
                                type="text"
                                id={`${rangeId}-to`}
                                form={props.form}
                                value={rangeValues.to}
                                required={rangeRequired}
                                disabled={props.disabled}
                                readOnly={props.readOnly}
                                aria-invalid={!!props.error}
                                aria-label={translation.calendarToDate}
                                aria-describedby={props.error ? `${rangeId}-error` : undefined}
                                placeholder={props.placeholder || translation.datepickerPlaceholder(placeholder)}
                                className={rangeInputClassName}
                                onChange={onChangeRangeInput("to")}
                                onBlur={resetRangeInput("to")}
                            />
                            {floating ? (
                                <span className={css(inputFieldStyles.slots["slot-end"], inputFieldStyles.slots.slot)}>
                                    {HiddenInput}
                                    {CalendarDropdown}
                                </span>
                            ) : null}
                        </div>
                        <p
                            id={`${rangeId}-error`}
                            role="alert"
                            className={css(inputFieldStyles.slots["error-text"], inputFieldStyles.slots["error-state"], inputFieldStyles.slots.error)}
                        >
                            {open ? null : props.error}
                        </p>
                        <p
                            id={`${rangeId}-feedback`}
                            className={css(inputFieldStyles.slots["feedback-text"], inputFieldStyles.slots["feedback-state"])}
                        >
                            {props.feedback}
                        </p>
                    </fieldset>
                ) : (
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
                        required={rangeRequired}
                        mask={mask}
                        error={open ? undefined : props.error}
                        readOnly={props.readOnly}
                        className={css(datePickerStyles.className({}), props.className)}
                        placeholder={props.placeholder || translation.datepickerPlaceholder(placeholder)}
                        right={
                            floating ? (
                                <Fragment>
                                    {HiddenInput}
                                    {CalendarDropdown}
                                </Fragment>
                            ) : null
                        }
                    />
                )}
                {floating ? null : (
                    <Fragment>
                        {HiddenInput}
                        {CalendarComponent}
                    </Fragment>
                )}
            </Fragment>
        );
    }
);
