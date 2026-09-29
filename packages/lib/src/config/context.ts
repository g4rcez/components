"use client";
import { createContext } from "react";
import type { IconProps } from "@phosphor-icons/react";
import type { Locales } from "the-mask-input";
import type { parsers } from "../styles/design-tokens";
import type { ThemeComponentOverrides } from "../styles/theme-runtime";
import type { Translations } from "./default-translations";
import type { Tweaks } from "./default-tweaks";
import type { NotificationProps } from "../components";

export type ContextType = Partial<{
    tweaks: Tweaks;
    map: Translations;
    components: ThemeComponentOverrides;
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
    components: ThemeComponentOverrides;
    injectComponentTokens: boolean;
}>;

export const Context = createContext<ContextType | undefined>(undefined);
