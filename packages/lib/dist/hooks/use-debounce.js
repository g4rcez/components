import { useRef } from "react";
const debounce = (fn, ms = 0) => {
    let timeoutId = undefined;
    return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), ms);
    };
};
export function useDebounce(fn, delay) {
    const debouncedValue = useRef(debounce(fn, delay));
    return debouncedValue.current;
}
