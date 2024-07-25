import { format, parse, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { Fragment, useMemo, useState } from "react";
import { Is } from "sidekicker";
import { Mask } from "the-mask-input/dist/src/types";
import { Override } from "../../types";
import { Calendar, CalendarProps } from "../display/calendar";
import { Dropdown } from "../floating/dropdown";
import { Input, InputProps } from "./input";

type DatePickerProps = Override<InputProps, CalendarProps & {}>;

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

export const DatePicker = ({ date, locale, disabledDate, autoFocusToday, onChange, markToday, ...props }: DatePickerProps) => {
    const datetimeFormat = useMemo(() => new Intl.DateTimeFormat(locale), [locale]);
    const [innerDate, setInnerDate] = useState(date || undefined);
    const [open, setOpen] = useState(false);
    const mask: Mask[] = datetimeFormat.formatToParts(fixedDate).flatMap((x) => (Is.keyof(parts, x.type) ? (parts[x.type](x.value) as any) : []));
    const placeholder = datetimeFormat

        .formatToParts(fixedDate)
        .reduce((acc, x) => acc + (Is.keyof(placeholders, x.type) ? placeholders[x.type](x.value) : ""), "");

    const [value, setValue] = useState(
        !innerDate
            ? ""
            : datetimeFormat

                  .formatToParts(innerDate)
                  .reduce((acc, x) => acc + (Is.keyof(parts, x.type) ? partValues[x.type](innerDate, x.value) : ""), "")
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
                onChange?.(d);
            }
        }
    };

    const onChangeDate = (d: Date) => {
        setInnerDate(d);
        onChange?.(d);
        setValue(format(d, placeholder));
    };

    return (
        <Input
            {...props}
            mask={mask}
            value={value}
            onChange={onChangeDateInput}
            className="uppercase"
            formNoValidate={!open}
            placeholder={placeholder}
            required={props.required ?? true}
            error={open ? undefined : props.error}
            name={props.name ? `${props.name}-picker` : props.name}
            right={
                <Fragment>
                    <input defaultValue={innerDate?.toISOString()} hidden type="date" name={props.name} />
                    <Dropdown trigger={<CalendarIcon />} onChange={setOpen} open={open}>
                        <Calendar
                            {...props}
                            locale={locale}
                            date={innerDate}
                            onChange={onChangeDate}
                            markToday={markToday}
                            disabledDate={disabledDate}
                            autoFocusToday={autoFocusToday}
                        />
                    </Dropdown>
                </Fragment>
            }
        />
    );
};
