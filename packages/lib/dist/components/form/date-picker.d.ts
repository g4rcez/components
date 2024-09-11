import { Override } from "../../types";
import { CalendarProps } from "../display/calendar";
import { InputProps } from "./input";
type DatePickerProps = Override<InputProps, CalendarProps & {}>;
export declare const DatePicker: ({ date, locale, disabledDate, autoFocusToday, onChange, markToday, ...props }: DatePickerProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=date-picker.d.ts.map