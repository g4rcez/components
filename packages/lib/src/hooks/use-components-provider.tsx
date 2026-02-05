"use client";
import React, { PropsWithChildren, useMemo } from "react";
import { Locales } from "the-mask-input";
import { parsers } from "../styles/design-tokens";
import { Context, ContextProps } from "../config/context";
import { defaultTranslations, Translations } from "../config/default-translations";
import { defaultTweaks, Tweaks } from "../config/default-tweaks";

export type ContextType = Partial<{
  tweaks: Tweaks;
  map: Translations;
  locale: Locales | undefined;
  parser: typeof parsers.hsla;
  floatingRef?: HTMLElement | null;
}>;

export const ComponentsProvider = (props: PropsWithChildren<ContextProps>) => {
  const memoMap = useMemo<ContextType>(
    () => ({
      locale: props.locale,
      floatingRef: props.rootFloating,
      tweaks: { ...defaultTweaks, ...props.tweaks },
      parser: props.parser || parsers.hsla,
      map: { ...defaultTranslations, ...props.map },
    }),
    [props]
  );
  return <Context.Provider value={memoMap}>{props.children}</Context.Provider>;
};
