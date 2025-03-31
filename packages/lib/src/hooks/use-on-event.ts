import { useEffect } from "react";

type Listener<K extends keyof WindowEventMap> = (event: WindowEventMap[K]) => void;

export const useOnEvent = <K extends keyof WindowEventMap>(event: K, func: Listener<K>) => {
    useEffect(() => {
        window.addEventListener(event, func);
        return () => window.removeEventListener(event, func);
    }, [event]);
};
