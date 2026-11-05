import { useEffect, useMemo, useRef } from "react";
import { useLocale } from "../../hooks/use-locale";
import { formatHourLabel, getHourSlots } from "./page-calendar.utils";

export const useHourGrid = () => {
    const locale = useLocale();
    const scrollBodyRef = useRef<HTMLDivElement>(null);
    const currentHourRef = useRef<HTMLDivElement>(null);
    const hours = getHourSlots();
    const hourLabels = useMemo(() => getHourSlots().map((hour) => formatHourLabel(hour, locale)), [locale]);

    useEffect(() => {
        if (scrollBodyRef.current && currentHourRef.current) {
            const top = currentHourRef.current.offsetTop;
            scrollBodyRef.current.scrollTop = top - scrollBodyRef.current.clientHeight / 2;
        }
    }, []);

    return { hours, hourLabels, scrollBodyRef, currentHourRef };
};
