import { useContext } from "react";
import type { Locales } from "the-mask-input";
import { Context } from "../config/context";

export const useLocale = (locale?: Locales): Locales | undefined => {
    const ctx = useContext(Context);
    if (locale) return locale;
    if (!ctx) return undefined;
    return ctx.locale || locale;
};
