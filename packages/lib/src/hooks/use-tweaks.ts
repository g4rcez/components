import { useContext } from "react";
import { Context } from "../config/context";
import { defaultTweaks, Tweaks } from "../config/default-tweaks";

export const useTweaks = (): Tweaks => {
    const ctx = useContext(Context);
    if (!ctx) return defaultTweaks;
    return ctx.tweaks!;
};
