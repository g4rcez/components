import { __rest } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format, parse, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Fragment, useId, useMemo, useState } from "react";
import { Is } from "sidekicker";
import { Calendar } from "../display/calendar";
import { Dropdown } from "../floating/dropdown";
import { Input } from "./input";
import { useTranslations } from "../../hooks/use-translate-context";
const fixedDate = new Date(1970, 11, 31);
const parts = {
    year: () => [/\d/, /\d/, /\d/, /\d/],
    month: () => [/\d/, /\d/],
    day: () => [/\d/, /\d/],
    literal: (str) => str.split(""),
};
const placeholders = {
    year: () => "yyyy",
    month: () => "MM",
    day: () => "dd",
    literal: (str) => str,
};
const partValues = {
    literal: (date, str) => str,
    year: (date) => date.getFullYear(),
    day: (date) => date.getDate().toString().padStart(2, "0"),
    month: (date) => (date.getMonth() + 1).toString().padStart(2, "0"),
};
export const DatePicker = (_a) => {
    var _b;
    var { date, locale, disabledDate, autoFocusToday, onChange, markToday } = _a, props = __rest(_a, ["date", "locale", "disabledDate", "autoFocusToday", "onChange", "markToday"]);
    const labelId = useId();
    const translation = useTranslations();
    const datetimeFormat = useMemo(() => new Intl.DateTimeFormat(locale), [locale]);
    const [innerDate, setInnerDate] = useState(date || undefined);
    const [open, setOpen] = useState(false);
    const mask = datetimeFormat.formatToParts(fixedDate).flatMap((x) => (Is.keyof(parts, x.type) ? parts[x.type](x.value) : []));
    const placeholder = datetimeFormat
        .formatToParts(fixedDate)
        .reduce((acc, x) => acc + (Is.keyof(placeholders, x.type) ? placeholders[x.type](x.value) : ""), "");
    const [value, setValue] = useState(!innerDate
        ? ""
        : datetimeFormat
            .formatToParts(innerDate)
            .reduce((acc, x) => acc + (Is.keyof(parts, x.type) ? partValues[x.type](innerDate, x.value) : ""), ""));
    const onChangeDateInput = (e) => {
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
                onChange === null || onChange === void 0 ? void 0 : onChange(d);
            }
        }
    };
    const onChangeDate = (d) => {
        setInnerDate(d);
        onChange === null || onChange === void 0 ? void 0 : onChange(d);
        setValue(format(d, placeholder));
    };
    return (_jsx(Input, Object.assign({}, props, { mask: mask, value: value, onChange: onChangeDateInput, className: "uppercase", formNoValidate: !open, placeholder: placeholder, required: (_b = props.required) !== null && _b !== void 0 ? _b : true, error: open ? undefined : props.error, name: props.name ? `${props.name}-picker` : props.name, right: _jsxs(Fragment, { children: [_jsx("input", { defaultValue: innerDate === null || innerDate === void 0 ? void 0 : innerDate.toISOString(), hidden: true, type: "date", name: props.name }), _jsx(Dropdown, { open: open, restoreFocus: true, onChange: setOpen, trigger: _jsxs("span", { "aria-labelledby": labelId, children: [_jsx("span", { id: labelId, className: "sr-only", children: translation.datePickerCalendarButtonLabel }), _jsx(CalendarIcon, {})] }), buttonProps: { "aria-describedby": labelId }, children: _jsx(Calendar, Object.assign({}, props, { locale: locale, date: innerDate, onChange: onChangeDate, markToday: markToday, disabledDate: disabledDate, autoFocusToday: autoFocusToday })) })] }) })));
};
