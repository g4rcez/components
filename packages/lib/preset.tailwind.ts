import forms from "@tailwindcss/forms";
import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";
import { defaultDarkTheme } from "./src/styles/theme";

const COLORS = createDesignTokens(defaultDarkTheme.colors, parsers.formatWithVar("hsla"));

export const css = String.raw;

const spacing = createDesignTokens(defaultDarkTheme.spacing, parsers.cssVariable);

const config: Partial<Config> = {
    theme: {
        extend: {
            transitionTimingFunction: {
                DEFAULT: "cubic-bezier(0,0,.58,1)",
                normal: "cubic-bezier(.25,.1,.25,1)",
            },
            spacing,
            transitionDuration: { DEFAULT: "375ms" },
            minWidth: { xs: "20rem", screen: "100vh" },
            borderRadius: createDesignTokens(defaultDarkTheme.rounded, parsers.cssVariable),
            fill: COLORS,
            colors: COLORS,
            placeholderColor: COLORS,
            borderColors: { ...COLORS, DEFAULT: COLORS.card.border },
            zIndex: {
                normal: "1",
                tooltip: "13",
                floating: "12",
                overlay: "11",
                navbar: "10",
                calendar: "2",
            },
            boxShadow: {
                floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 5px 12px",
            },
        },
    },
    plugins: [
        forms({ strategy: "class" }),
        plugin(function ({ addVariant }) {
            addVariant("link", ["&:hover", "&:active"]);
            addVariant("landing", ["&"]);
            addVariant("group-assert", [`:merge(.group):valid:has(.input:valid:not(:placeholder-shown)) &`]);
            addVariant("group-error", [
                `:merge(.group):invalid:has(.input:not(:focus):invalid[data-initialized=true]) &`,
                `:merge(.group[data-error=true]:has(.input[data-initialized=true])) &`,
                `:merge(.group[data-error=true][data-interactive=true]):has(.input) &`,
                `:merge(.group[data-error=true][data-interactive=true]):has(.input[data-initialized=true]) &`,
            ]);
            addVariant("group-checkbox-checked", [`:merge(&:has(.form-checkbox[type=checkbox]:checked))`]);
        }),
    ],
};

export { createDesignTokens, parsers, defaultDarkTheme };

export default config;
