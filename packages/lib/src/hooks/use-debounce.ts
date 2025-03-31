import { useRef } from "react";

type Fn = (...a: any[]) => any;

export const debounce = <T extends Fn>(fn: Fn, ms = 0) => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    return function debounced(...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), ms);
    };
};

export function useDebounce<T extends Fn>(fn: T, delay: number) {
    const debouncedValue = useRef(debounce(fn, delay));
    return debouncedValue.current;
}
