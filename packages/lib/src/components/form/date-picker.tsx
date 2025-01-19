import { format, isValid, parse, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { forwardRef, Fragment, useId, useMemo, useState } from "react";
import { Is } from "sidekicker";
import { useLocale, useTranslations } from "../../hooks/use-components-provider";
import { Override } from "../../types";
import { Calendar, CalendarProps } from "../display/calendar";
import { Dropdown } from "../floating/dropdown";
import { Input, InputProps } from "./input";

export type DatePickerProps = Override<InputProps, CalendarProps<"date">>;

const fixedDate = new Date(1970, 11, 31);

const parts = {
    year: () => [/\d/, /\d/, /\d/, /\d/],
    month: () => [/\d/, /\d/],
    day: () => [/\d/, /\d/],
    literal: (str: string) => str.split(""),
} satisfies Partial<Record<keyof Intl.DateTimeFormatPartTypesRegistry, (str: string) => Array<string | RegExp>>>;

const placeholders = {
    year: () => "yyyy",
    month: () => "MM",
    day: () => "dd",
    literal: (str: string) => str,
};

const partValues = {
    literal: (date: Date, str: string) => str,
    year: (date: Date) => date.getFullYear(),
    day: (date: Date) => date.getDate().toString().padStart(2, "0"),
    month: (date: Date) => (date.getMonth() + 1).toString().padStart(2, "0"),
};

const formatParts = (datetimeFormat: Intl.DateTimeFormat, date: Date) => {
    try {
        return datetimeFormat.formatToParts(date);
    } catch (e) {
        return [];
    }
};

type Mask = string | RegExp;

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    ({ date, locale: inputLocal, disabledDate, onChange, markToday, ...props }: DatePickerProps, externalRef) => {
        const locale = inputLocal || useLocale();
        const labelId = useId();
        const translation = useTranslations();
        const datetimeFormat = useMemo(() => new Intl.DateTimeFormat(locale), [locale]);
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
                    const d = startOfDay(parse(v, placeholder, new Date()));
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
                data-value={htmlValue}
                data-target={props.name}
                className="uppercase"
                formNoValidate={!open}
                placeholder={props.placeholder ?? placeholder}
                onChange={onChangeDateInput}
                required={props.required ?? true}
                error={open ? undefined : props.error}
                name={undefined}
                id={undefined}
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
                            trigger={
                                <span aria-labelledby={labelId}>
                                    <span id={labelId} className="sr-only">
                                        {translation.datePickerCalendarButtonLabel}
                                    </span>
                                    <CalendarIcon />
                                </span>
                            }
                            buttonProps={{ "aria-describedby": labelId }}
                        >
                            <Calendar
                                {...props}
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
