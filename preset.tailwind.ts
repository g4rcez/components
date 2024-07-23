import forms from "@tailwindcss/forms";
import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";
import { defaultDarkTheme } from "./src/styles/theme";

const COLORS = createDesignTokens(defaultDarkTheme.colors, parsers.formatWithVar("hsla"));

const config: Partial<Config> = {
    theme: {
        transitionTimingFunction: { DEFAULT: "cubic-bezier(1,.43,.36,.67)" },
        transitionDuration: { DEFAULT: "375ms" },
        extend: {
            minWidth: { xs: "20rem" },
            borderRadius: createDesignTokens(defaultDarkTheme.rounded, parsers.cssVariable),
            fill: COLORS,
            colors: COLORS,
            placeholderColor: COLORS,
            borderColors: { ...COLORS, DEFAULT: COLORS.card.border },
            zIndex: {
                tooltip: "11",
                floating: "10",
                calendar: "2",
            },
            boxShadow: {
                floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px",
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
                `:merge(.group[data-error=true][data-interactive=true]):has(.input[data-initialized=true]) &`,
                `:merge(.group[data-error=true][data-interactive=true]):has(.input) &`,
                `:merge(.group[data-error=true]:has(.input[data-initialized=true]) ) &`,
            ]);
        }),
    ],
};

export default config;

export { createDesignTokens, parsers, defaultDarkTheme };
