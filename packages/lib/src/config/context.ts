import { createContext } from "react";
import type { Locales } from "the-mask-input";
import type { ContextType } from "../hooks/use-components-provider";
import { parsers } from "../styles/design-tokens";
import { defaultTranslations, type Translations } from "./default-translations";
import { defaultTweaks, type Tweaks } from "./default-tweaks";

export type ContextProps = Partial<{
    tweaks: Partial<Tweaks>;
    map: Partial<Translations>;
    locale: Locales | undefined;
    parser: typeof parsers.hsla;
}>;

export const Context = createContext<ContextType>({
    tweaks: defaultTweaks,
    parser: parsers.hsla,
    map: defaultTranslations,
    locale: undefined as Locales | undefined,
});
