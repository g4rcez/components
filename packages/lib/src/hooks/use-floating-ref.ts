import { useContext } from "react";
import { Context } from "../config/context";

export const useFloatingRef = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("ComponentsProvider must be used");
    return ctx.floatingRef ?? undefined;
};
