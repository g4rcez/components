import { useEffect, useState } from "react";

export const useReactive = <T extends unknown>(t: T, initial?: T) => {
    const [state, setState] = useState(() => (initial ? initial : t));
    useEffect(() => {
        setState(t);
    }, [t]);
    return [state, setState] as const;
};
