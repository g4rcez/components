import { useEffect, useRef } from "react";

type Listener<K extends keyof WindowEventMap> = (event: WindowEventMap[K]) => void;

export const useOnEvent = <K extends keyof WindowEventMap>(event: K, func: Listener<K>) => {
    const funcRef = useRef(func);
    funcRef.current = func;
    useEffect(() => {
        const handler = (e: WindowEventMap[K]) => funcRef.current(e);
        window.addEventListener(event, handler);
        return () => window.removeEventListener(event, handler);
    }, [event]);
};
