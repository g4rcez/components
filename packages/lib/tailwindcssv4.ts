import forms from "@tailwindcss/forms";
import plugin from "tailwindcss/plugin";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";
import { defaultLightTheme as theme } from "./src/styles/theme";

const COLORS = createDesignTokens(theme.colors, parsers.formatWithVar("hsla"));
const spacing = createDesignTokens(theme.spacing, parsers.cssVariable);
const shadows = createDesignTokens(theme.shadow, parsers.cssVariable);

const css = String.raw;

/**
 * Migrated Tailwind CSS v4 plugin.
 * This combines the custom variants and theme extensions from the v3 preset and plugin.
 */
export default plugin(
  ({ addVariant }) => {
    addVariant("hocus", ["&:hover", "&:focus"]);
    addVariant("link", ["&:hover", "&:active"]);
    addVariant("group-assert", [
      css`:merge(.group):valid:has(.input:valid:not(:placeholder-shown)) &`,
    ]);
    addVariant("group-checkbox-checked", [
      css`:merge(&:has(.form-checkbox[type="checkbox"]:checked))`,
    ]);
    addVariant("group-error", [
      css`:merge(.group):invalid:has(.input:not(:focus):invalid[data-initialized=true]) &`,
      css`:merge(.group[data-error=true]:has(.input[data-initialized=true])) &`,
      css`:merge(.group[data-error=true][data-interactive=true]):has(.input) &`,
      css`:merge(.group[data-error=true][data-interactive=true]):has(.input[data-initialized=true]) &`,
    ]);
  },
  {
    plugins: [forms({ strategy: "class" }) ],
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
        lineHeight: { typography: "1.45" },
        letterSpacing: { typography: "0.0175" },
        placeholderColor: COLORS,
        transitionDuration: { DEFAULT: "375ms" },
        minWidth: { xs: "20rem", screen: "100vh" },
        borderColor: { ...COLORS, DEFAULT: COLORS.card.border },
        borderRadius: createDesignTokens(theme.rounded, parsers.cssVariable),
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
  }
);
