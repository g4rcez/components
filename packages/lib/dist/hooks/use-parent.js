import { useEffect, useState } from "react";
export const useParentHeight = (ref) => {
    const [h, setH] = useState(0);
    useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const parent = element.parentElement;
        if (!parent)
            return;
        const listener = () => {
            setH(parent.clientHeight);
        };
        parent.addEventListener("resize", listener);
        listener();
        return () => {
            parent.removeEventListener("resize", listener);
        };
    }, []);
    return h;
};
