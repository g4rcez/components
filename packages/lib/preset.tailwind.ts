import forms from "@tailwindcss/forms";
import { Config } from "tailwindcss";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";
import { components } from "./src/styles/components";
import { defaultLightTheme as theme } from "./src/styles/theme";
import customPlugins from "./plugin.tailwind";

const COLORS = createDesignTokens(theme.colors, parsers.formatWithVar("hsla"));

const spacing = createDesignTokens(theme.spacing, parsers.cssVariable);

const shadows = createDesignTokens(theme.shadow, parsers.cssVariable);

const componentBorderRadius: Record<string, string> = {};
const componentBorderWidth: Record<string, string> = {};
const componentSpacing: Record<string, string> = {};
const componentFontSize: Record<string, string> = {};
for (const [component, attrs] of Object.entries(components)) {
    if (!attrs || typeof attrs !== "object") continue;
    if (component === "typography") {
        for (const attr of Object.keys(attrs)) {
            componentFontSize[attr] = `var(--typography-${attr})`;
        }
        continue;
    }
    for (const attr of Object.keys(attrs)) {
        const key = `${component}-${attr}`;
        if (attr === "radius") componentBorderRadius[key] = `var(--${key})`;
        else if (attr === "border" || attr.endsWith("-border")) {
            componentBorderWidth[key] = `var(--${key})`;
            componentSpacing[key] = `var(--${key})`;
        } else if (attr === "text" || attr.endsWith("-text") || attr.startsWith("text-")) {
            componentFontSize[key] = `var(--${key})`;
            componentSpacing[key] = `var(--${key})`;
        } else componentSpacing[key] = `var(--${key})`;
    }
}

const config: Partial<Config> = {
    theme: {
        extend: {
            transitionTimingFunction: {
                DEFAULT: "cubic-bezier(0,0,.58,1)",
                normal: "cubic-bezier(.25,.1,.25,1)",
            },
            spacing: { ...spacing, ...componentSpacing },
            fill: COLORS,
            colors: COLORS,
            width: { ...spacing, ...componentSpacing },
            fontSize: { ...spacing, ...componentFontSize },
            boxShadow: shadows,
            dropShadow: shadows,
            lineHeight: { typography: "1.45" },
            letterSpacing: { typography: "0.0175" },
            placeholderColor: COLORS,
            transitionDuration: { DEFAULT: "375ms" },
            minWidth: { xs: "20rem", screen: "100vh" },
            borderColors: { ...COLORS, DEFAULT: COLORS.card.border },
            borderRadius: {
                ...createDesignTokens(theme.rounded, parsers.cssVariable),
                ...componentBorderRadius,
            },
            borderWidth: { ...componentBorderWidth },
            zIndex: {
                wizard: "var(--z-wizard)",
                navbar: "var(--z-navbar)",
                normal: "var(--z-normal)",
                overlay: "var(--z-overlay)",
                tooltip: "var(--z-tooltip)",
                calendar: "var(--z-calendar)",
                floating: "var(--z-floating)",
            },
        },
    },
    plugins: [forms({ strategy: "class" }), customPlugins],
};

export { createDesignTokens, parsers, theme, config, customPlugins };

export default config;
