import forms from "@tailwindcss/forms";
import { Config } from "tailwindcss";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";
import { defaultLightTheme as theme } from "./src/styles/theme";
import customPlugins from "./plugin.tailwind";

const COLORS = createDesignTokens(theme.colors, parsers.formatWithVar("hsla"));

const spacing = createDesignTokens(theme.spacing, parsers.cssVariable);

const shadows = createDesignTokens(theme.shadow, parsers.cssVariable);

const config: Partial<Config> = {
    theme: {
        extend: {
            transitionTimingFunction: {
                DEFAULT: "cubic-bezier(0,0,.58,1)",
                normal: "cubic-bezier(.25,.1,.25,1)",
            },
            spacing,
            fill: COLORS,
            colors: COLORS,
            width: spacing,
            fontSize: spacing,
            boxShadow: shadows,
            dropShadow: shadows,
            placeholderColor: COLORS,
            transitionDuration: { DEFAULT: "375ms" },
            minWidth: { xs: "20rem", screen: "100vh" },
            borderColors: { ...COLORS, DEFAULT: COLORS.card.border },
            borderRadius: createDesignTokens(theme.rounded, parsers.cssVariable),
            zIndex: {
                navbar: "var(--z-navbar)",
                normal: "var(--z-normal)",
                overlay: "var(--z-overlay)",
                tooltip: "var(--z-tooltip)",
                calendar: "var(--z-calendar)",
                floating: "var(--z-floating)",
            },
        }
    },
    plugins: [forms({ strategy: "class" }), customPlugins],
};

export { createDesignTokens, parsers, theme, config, customPlugins };

export default config;
