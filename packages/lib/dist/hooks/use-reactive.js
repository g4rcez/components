import { useEffect, useState } from "react";
export const useReactive = (t, initial) => {
    const [state, setState] = useState(() => (initial ? initial : t));
    useEffect(() => {
        setState(t);
    }, [t]);
    return [state, setState];
};
