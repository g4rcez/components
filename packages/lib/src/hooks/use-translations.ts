import { useContext } from "react";
import { Context } from "../config/context";
import { defaultTranslations } from "../config/default-translations";

import type { Translations } from "../config/default-translations";

export type TranslationOverrides = Partial<Translations>;

export const useTranslations = (overrides?: TranslationOverrides): Translations => {
    const ctx = useContext(Context);
    if (!overrides) return ctx?.map ?? defaultTranslations;
    return { ...defaultTranslations, ...ctx?.map, ...overrides };
};
