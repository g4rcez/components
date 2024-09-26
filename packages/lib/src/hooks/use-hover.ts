import { RefObject, useEffect, useState } from "react";

export const useHover = (ref: RefObject<HTMLElement>) => {
    const [hovered, setHovered] = useState(false);
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);

    useEffect(() => {
        const el = ref.current; // cache external ref value for use in cleanup
        if (el) {
            el.addEventListener("mouseenter", enter);
            el.addEventListener("mouseleave", leave);
            return () => {
                el.removeEventListener("mouseenter", enter);
                el.removeEventListener("mouseleave", leave);
            };
        }
    }, []);
    return hovered;
};
