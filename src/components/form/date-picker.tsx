import { format, parse, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { Fragment, useState } from "react";
import { Locales } from "the-mask-input";
import { Override } from "../../types";
import { Calendar } from "../display/calendar";
import { Dropdown } from "../floating/dropdown";
import { Input, InputProps } from "./input";

type DatePickerProps = Override<
    InputProps,
    {
        date?: Date;
        locale?: Locales;
        onChange?: (date: Date) => void;
    }
>;

const fixedDate = new Date(1970, 11, 31);

const parts = {
    month: () => [/\d/, /\d/],
    literal: (str: string) => str.split(""),
    day: () => [/\d/, /\d/],
    year: () => [/\d/, /\d/, /\d/, /\d/],
};

const placeholders = {
    month: () => "MM",
    literal: (str: string) => str,
    day: () => "dd",
    year: () => "yyyy",
};

const partValues = {
    literal: (date: Date, str: string) => str,
    year: (date: Date) => date.getFullYear(),
    day: (date: Date) => date.getDate().toString().padStart(2, "0"),
    month: (date: Date) => (date.getMonth() + 1).toString().padStart(2, "0"),
};

export const DatePicker = (props: DatePickerProps) => {
    const locale = new Intl.DateTimeFormat(props.locale);
    const [date, setDate] = useState(props.date || null);
    const [open, setOpen] = useState(false);
    const mask = locale.formatToParts(fixedDate).flatMap((x) => parts[x.type](x.value));
    const placeholder = locale.formatToParts(fixedDate).reduce((acc, x) => acc + placeholders[x.type](x.value), "");

    const [value, setValue] = useState(
        date === null ? "" : locale.formatToParts(date).reduce((acc, x) => acc + partValues[x.type](date, x.value), "")
    );

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setValue(v);
        if (mask.length === v.length) {
            const matches = mask.every((x: RegExp | string, i) => {
                const c = v.charAt(i);
                return typeof x === "string" ? c === x : x.test(c);
            });
            if (matches) {
                const d = startOfDay(parse(v, placeholder, new Date()));
                setDate(d);
                props.onChange?.(d);
            }
        }
    };

    const onChangeDate = (d: Date) => {
        setDate(d);
        props.onChange?.(d);
        setValue(format(d, placeholder));
    };

    return (
        <Input
            {...props}
            mask={mask}
            value={value}
            onChange={onChange}
            className="uppercase"
            formNoValidate={!open}
            placeholder={placeholder}
            required={props.required ?? true}
            error={open ? undefined : props.error}
            name={props.name ? `${props.name}-picker` : props.name}
            right={
                <Fragment>
                    <input defaultValue={date?.toISOString()} hidden type="date" name={props.name} />
                    <Dropdown trigger={<CalendarIcon />} onChange={setOpen} open={open}>
                        <Calendar date={date} onChange={onChangeDate} locale={props.locale} />
                    </Dropdown>
                </Fragment>
            }
        />
    );
};
