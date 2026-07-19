"use client";
import { createContext } from "react";
import type { IconProps } from "@phosphor-icons/react";
import type { Locales } from "the-mask-input";
import type { parsers } from "../styles/design-tokens";
import { components as defaultComponentTokens } from "../styles/components";
import type { defaultLightThemeTokens, TokenTree } from "../styles/theme-runtime";
import type { ComponentTokens } from "../styles/theme.types";
import { defaultTranslations, type Translations } from "./default-translations";
import { defaultTweaks, type Tweaks } from "./default-tweaks";
import type { NotificationProps } from "../components";

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
type RuntimeComponentTokens = typeof defaultLightThemeTokens.components;
export type ComponentTokenOverrides = DeepPartial<ComponentTokens & RuntimeComponentTokens>;

export type ContextType = Partial<{
    tweaks: Tweaks;
    map: Translations;
    components: TokenTree;
    locale: Locales | undefined;
    parser: typeof parsers.hsla;
    floatingRef?: HTMLElement | null;
    notifications?: NotificationProps;
}>;

export type ContextProps = Partial<{
    tweaks: Partial<Tweaks>;
    map: Partial<Translations>;
    locale: Locales | undefined;
    parser: typeof parsers.hsla;
    iconWeight: IconProps["weight"];
    notifications?: NotificationProps;
    rootFloating?: HTMLElement | null;
    components: ComponentTokenOverrides;
    injectComponentTokens: boolean;
}>;

export const Context = createContext<ContextType | undefined>(undefined);
