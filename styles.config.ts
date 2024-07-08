import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import DarkMode from "./src/styles/dark.json";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";

const COLORS = createDesignTokens(DarkMode.colors, parsers.cssVariable);

const css = String.raw;

const config: Partial<Config> = {
    theme: {
        transitionTimingFunction: { DEFAULT: "cubic-bezier(1,.43,.36,.67)" },
        transitionDuration: { DEFAULT: "375ms" },
        extend: {
            fill: COLORS,
            colors: COLORS,
            borderColors: COLORS,
            placeholderColor: COLORS,
            zIndex: {
                floating: "10",
            },
            boxShadow: {
                floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px"
            }
        },
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant("link", ["&:hover", "&:active"]);
            addVariant("landing", ["&"]);
            addVariant("group-assert", [css`:merge(.group):valid:has(.input:valid:not(:placeholder-shown)) &`]);
            addVariant("group-error", [
                css`:merge(.group):invalid:has(.input:not(:focus):invalid[data-initialized=true]) &`,
                css`:merge(.group[data-error=true][data-interactive=true]):has(.input[data-initialized=true]) &`,
                css`:merge(.group[data-error=true][data-interactive=true]):has(.input) &`,
                css`:merge(.group[data-error=true]:has(.input[data-initialized=true])) &`,
            ]);
        }),
    ],
};

export default config;
