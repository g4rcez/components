import { useRef } from "react";

type Fn = (...a: never[]) => unknown;

export const debounce = <T extends Fn>(fn: T, ms = 0): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    return function debounced(...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => (fn as unknown as (...a: Parameters<T>) => unknown)(...args), ms);
    };
};

export function useDebounce<T extends Fn>(fn: T, delay: number) {
    const debouncedValue = useRef(debounce(fn, delay));
    return debouncedValue.current;
}
