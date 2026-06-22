import { useContext } from "react";
import { Context } from "../config/context";
import { Tweaks } from "../config/default-tweaks";

export const useTweaks = (): Tweaks => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("ComponentsProvider must be used");
    return ctx.tweaks!;
};

export const useTableTweaks = () => useTweaks().table;
