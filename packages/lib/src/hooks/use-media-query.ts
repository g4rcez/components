import { useLayoutEffect, useState } from "react";
import { isSsr } from "../lib/fns";

const getMatches = (query: string, defaultValue: boolean): boolean => {
    if (isSsr()) {
        return defaultValue;
    }
    return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string, defaultValue: boolean = true) => {
    const [matches, setMatches] = useState(defaultValue);

    useLayoutEffect(() => {
        const matchMedia = window.matchMedia(query);
        const onChange = () => setMatches(getMatches(query, defaultValue));
        onChange();
        if (matchMedia.addListener) {
            matchMedia.addListener(onChange);
            return () => {
                return matchMedia.removeListener ? matchMedia.removeListener(onChange) : undefined;
            };
        }
        matchMedia.addEventListener("change", onChange);
        return () => matchMedia.removeEventListener("change", onChange);
    }, [query]);

    return matches;
};
