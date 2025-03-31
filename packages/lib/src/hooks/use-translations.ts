import { useContext } from "react";
import { Context } from "../config/context";
import { defaultTranslations } from "../config/default-translations";

export const useTranslations = () => {
    const ctx = useContext(Context);
    if (!ctx) return defaultTranslations;
    return ctx.map!;
};
