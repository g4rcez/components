import { Locales } from "the-mask-input";
export type CalendarProps = {
    disabledDate?: (date: Date) => boolean;
    date?: Date;
    locale?: Locales;
    markToday?: boolean;
    autoFocusToday?: boolean;
    onChange?: (d: Date) => void;
};
export declare const Calendar: ({ locale, disabledDate, markToday, autoFocusToday, date, onChange }: CalendarProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=calendar.d.ts.map