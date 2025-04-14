import { useEffect, useRef, useState } from "react";
import { isSsr } from "../lib/fns";

const getCoarse = () => window.matchMedia("@media (pointer: coarse)")

export const useIsCoarseDevice = (): boolean => {
    const ref = useRef(isSsr() ? null : getCoarse());
    const [isCoarse, setIsCoarse] = useState<boolean>(isSsr() ? false : ref.current?.matches ?? false);
    useEffect(() => {
        const coerse = ref.current === null ? getCoarse() : ref.current
        coerse.addEventListener("change", (e) => setIsCoarse(e.matches));
    }, []);

    return isCoarse;
};
