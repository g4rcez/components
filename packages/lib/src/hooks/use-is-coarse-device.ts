import { useEffect, useRef, useState } from "react";
import { isSsr } from "../lib/fns";

const getCoarse = () => window.matchMedia("(pointer: coarse)");

export const useIsCoarseDevice = (): boolean => {
    const mediaQueryRef = useRef<MediaQueryList | null>(null);
    const [isCoarse, setIsCoarse] = useState<boolean>(() => {
        if (isSsr()) return false;
        const mediaQuery = getCoarse();
        mediaQueryRef.current = mediaQuery;
        return mediaQuery.matches;
    });

    useEffect(() => {
        const mediaQuery = mediaQueryRef.current ?? getCoarse();
        mediaQueryRef.current = mediaQuery;
        setIsCoarse((current) => (current === mediaQuery.matches ? current : mediaQuery.matches));
        const onChange = (event: MediaQueryListEvent) => setIsCoarse((current) => (current === event.matches ? current : event.matches));
        mediaQuery.addEventListener("change", onChange);
        return () => mediaQuery.removeEventListener("change", onChange);
    }, []);

    return isCoarse;
};
