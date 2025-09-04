"use client";
import { format, isValid, parse, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { forwardRef, Fragment, useId, useMemo, useState } from "react";
import { Is } from "sidekicker";
import { useLocale } from "../../hooks/use-locale";
import { useTranslations } from "../../hooks/use-translations";
import { Override } from "../../types";
import { Calendar, CalendarProps } from "../display/calendar";
import { Dropdown } from "../floating/dropdown";
import { Input, InputProps } from "./input";

export type DatePickerProps = Omit<Override<InputProps, CalendarProps & {
    clickToClose?: boolean
}>, "currency">
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
} satisfies Partial<Record<keyof Intl.DateTimeFormatPartTypesRegistry, string | ((x: string) => string)>>;

const partValues = {
    literal: (_: Date, str: string) => str,
    hour: (date: Date) => date.getHours().toString(),
    year: (date: Date) => date.getFullYear().toString(),
    minute: (date: Date) => date.getMinutes().toString(),
    day: (date: Date) => date.getDate().toString().padStart(2, "0"),
    month: (date: Date) => (date.getMonth() + 1).toString().padStart(2, "0"),
} satisfies Partial<Record<keyof Intl.DateTimeFormatPartTypesRegistry, ((date: Date, str: string) => string)>>

const formatParts = (datetimeFormat: Intl.DateTimeFormat, date: Date) => {
    try {
        return datetimeFormat.formatToParts(date).map(x => {
            if ((x.type === "literal" && x.value === ", ")) {
                return { type: x.type, value: " " };
            }
            return x
        });
    } catch (e) {
        return [];
    }
};

type Mask = string | RegExp;

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    ({ date, locale: inputLocal, disabledDate, onChange, markToday, clickToClose, type, ...props }: DatePickerProps, externalRef) => {
        const locale = useLocale(inputLocal);
        const labelId = useId();
        const translation = useTranslations();
        const datetimeFormat = useMemo(() => new Intl.DateTimeFormat(locale, type === "datetime"
            ? { day: "numeric", month: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }
            : { day: "numeric", month: "numeric", year: "numeric" }),
            [locale, type]
        );
        const [innerDate, setInnerDate] = useState(date || undefined);
        const [open, setOpen] = useState(false);
        const mask: Mask[] = formatParts(datetimeFormat, fixedDate).flatMap((x) => (Is.keyof(parts, x.type) ? (parts[x.type](x.value) as any) : []));
        const placeholder = formatParts(datetimeFormat, fixedDate).reduce(
            (acc, x) => acc + (Is.keyof(placeholders, x.type) ? placeholders[x.type](x.value) : ""),
            ""
        );

        const [value, setValue] = useState(
            !innerDate
                ? ""
                : formatParts(datetimeFormat, innerDate).reduce(
                    (acc, x) => acc + (Is.keyof(parts, x.type) ? partValues[x.type](innerDate, x.value) : ""),
                    ""
                )
        );

        const onChangeDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setValue(v);
            if (mask.length === v.length) {
                const matches = mask.every((x, i) => {
                    const c = v.charAt(i);
                    return typeof x === "string" ? c === x : x.test(c);
                });
                if (matches) {
                    const parsed = parse(v, placeholder, new Date())
                    const d = type === "datetime" ? parsed : startOfDay(parsed);
                    setInnerDate(d);
                    return onChange?.(d);
                }
            }
            setInnerDate(undefined);
            return onChange?.(undefined);
        };

        const onChangeDate = (d: Date | undefined) => {
            setInnerDate(d);
            onChange?.(d);
            if (clickToClose) setOpen(false);
            if (d) return setValue(format(d, placeholder));
            return setValue("");
        };

        const validDate = isValid(innerDate);

        const htmlValue = validDate ? innerDate!.toISOString() : undefined;

        return (
            <Input
                {...props}
                mask={mask}
                value={value}
                id={undefined}
                name={undefined}
                data-value={htmlValue}
                formNoValidate={!open}
                data-target={props.name}
                data-component="date-picker"
                onChange={onChangeDateInput}
                required={props.required ?? true}
                error={open ? undefined : props.error}
                placeholder={props.placeholder || placeholder}
                right={
                    <Fragment>
                        <input
                            data-origin={props.name}
                            defaultValue={htmlValue}
                            form={props.form}
                            hidden
                            id={props.name}
                            name={props.name}
                            ref={externalRef}
                            type="date"
                        />
                        <Dropdown
                            open={open}
                            onChange={setOpen}
                            buttonProps={{ "aria-describedby": labelId }}
                            trigger={
                                <span aria-labelledby={labelId}>
                                    <span id={labelId} className="sr-only">
                                        {translation.datePickerCalendarButtonLabel}
                                    </span>
                                    <CalendarIcon />
                                </span>
                            }
                        >
                            <Calendar
                                {...(props as any)}
                                type={type}
                                locale={locale}
                                changeOnlyOnClick
                                markToday={markToday}
                                onChange={onChangeDate}
                                disabledDate={disabledDate}
                                date={validDate ? innerDate : undefined}
                            />
                        </Dropdown>
                    </Fragment>
                }
            />
        );
    }
);
