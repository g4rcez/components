"use client";
import { useCallback, useRef, useState } from "react";

export type ControllableStateOptions<T> = {
    /** Controlled value. When `undefined` the hook owns the state. */
    value?: T;
    /** Initial value used while uncontrolled. */
    defaultValue: T;
    /** Called with every accepted change, controlled or not. */
    onChange?: (next: T) => void;
};

/**
 * Controlled / uncontrolled state in one hook.
 * The setter is stable per mode and reads the latest value through a ref, so rapid consecutive calls
 * (e.g. quick taps) chain correctly even before React re-renders.
 */
export const useControllableState = <T>({ value, defaultValue, onChange }: ControllableStateOptions<T>) => {
    const [internal, setInternal] = useState<T>(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? (value as T) : internal;
    const currentRef = useRef(current);
    const onChangeRef = useRef(onChange);
    currentRef.current = current;
    onChangeRef.current = onChange;

    const setValue = useCallback(
        (next: T | ((previous: T) => T)) => {
            const resolved = typeof next === "function" ? (next as (previous: T) => T)(currentRef.current) : next;
            if (Object.is(resolved, currentRef.current)) return;
            currentRef.current = resolved;
            if (!controlled) setInternal(resolved);
            onChangeRef.current?.(resolved);
        },
        [controlled]
    );

    return [current, setValue] as const;
};
