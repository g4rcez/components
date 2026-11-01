import { useCallback, useEffect, useRef } from "react";

type Fn = (...a: never[]) => unknown;

export function useDebounce<T extends Fn>(fn: T, delay: number) {
    const fnRef = useRef(fn);
    const delayRef = useRef(delay);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    fnRef.current = fn;
    delayRef.current = delay;

    const debounced = useCallback((...args: Parameters<T>) => {
        if (timerRef.current !== undefined) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            timerRef.current = undefined;
            const callback = fnRef.current as unknown as (...callbackArgs: Parameters<T>) => unknown;
            callback(...args);
        }, delayRef.current);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current !== undefined) clearTimeout(timerRef.current);
            timerRef.current = undefined;
        };
    }, []);

    return debounced;
}
