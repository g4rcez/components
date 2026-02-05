"use client";
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
  rootFloating?: HTMLElement | null;
}>;

export const Context = createContext<ContextType>({
  parser: parsers.hsla,
  tweaks: defaultTweaks,
  floatingRef: undefined,
  map: defaultTranslations,
  locale: undefined as Locales | undefined,
});
