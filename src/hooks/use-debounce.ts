import { useRef } from "react";

type Fn = (...a: any[]) => any;

const debounce = <T extends Fn>(fn: Fn, ms = 0) => {
    let timeoutId = undefined;
    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

export function useDebounce<T extends Fn>(fn: T, delay: number) {
    const debouncedValue = useRef(debounce(fn, delay));
    return debouncedValue.current;
}
