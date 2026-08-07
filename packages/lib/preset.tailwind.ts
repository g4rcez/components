import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import { createDesignTokens, parsers } from "./src/styles/design-tokens.ts";
import { defaultTokens } from "./src/styles/default-tokens.ts";
import { components } from "./src/styles/components.ts";
import { defaultLightTheme as theme } from "./src/styles/theme.ts";
import customPlugins from "./plugin.tailwind.ts";

const cssVar = (name: string) => `var(--var-${name})`;
const colorVar = (name: string) => cssVar(`color-${name}`);

type TailwindColorOptions = {
    opacityValue?: string;
    opacityVariable?: string;
};

const toOpacityPercent = (value: string) => {
    const amount = Number(value);
    if (Number.isFinite(amount)) return `${amount * 100}%`;
    return `calc(${value} * 100%)`;
};

const withOpacity = (value: string) => {
    return ({ opacityValue, opacityVariable }: TailwindColorOptions = {}) => {
        if (value === "transparent") return value;
        if (opacityValue !== undefined) return `color-mix(in srgb, ${value} ${toOpacityPercent(opacityValue)}, transparent)`;
        if (opacityVariable !== undefined) return `color-mix(in srgb, ${value} calc(var(${opacityVariable}) * 100%), transparent)`;
        return value;
    };
};

const mapTailwindColors = <T extends Record<string, unknown>>(tokens: T): T =>
    Object.fromEntries(
        Object.entries(tokens).map(([key, value]) => [
            key,
            typeof value === "string"
                ? withOpacity(value)
                : value && typeof value === "object" && !Array.isArray(value)
                  ? mapTailwindColors(value as Record<string, unknown>)
                  : value,
        ])
    ) as T;

const rawColors = {
    background: colorVar("background"),
    foreground: colorVar("foreground"),
    border: colorVar("border"),
    ring: colorVar("ring"),
    disabled: colorVar("disabled"),
    muted: {
        DEFAULT: colorVar("muted"),
        foreground: colorVar("muted-foreground"),
    },
    primary: {
        DEFAULT: colorVar("primary"),
        foreground: colorVar("primary-foreground"),
        subtle: colorVar("primary-subtle"),
        hover: colorVar("primary-hover"),
    },
    secondary: {
        DEFAULT: colorVar("secondary"),
        foreground: colorVar("secondary-foreground"),
        subtle: colorVar("secondary-subtle"),
        hover: colorVar("secondary-hover"),
    },
    info: {
        DEFAULT: colorVar("info"),
        foreground: colorVar("info-foreground"),
        subtle: colorVar("info-subtle"),
        hover: colorVar("info-hover"),
    },
    warn: {
        DEFAULT: colorVar("warn"),
        foreground: colorVar("warn-foreground"),
        subtle: colorVar("warn-subtle"),
        hover: colorVar("warn-hover"),
    },
    danger: {
        DEFAULT: colorVar("danger"),
        foreground: colorVar("danger-foreground"),
        subtle: colorVar("danger-subtle"),
        hover: colorVar("danger-hover"),
    },
    success: {
        DEFAULT: colorVar("success"),
        foreground: colorVar("success-foreground"),
        subtle: colorVar("success-subtle"),
        hover: colorVar("success-hover"),
    },
    card: {
        DEFAULT: cssVar("card-background"),
        background: cssVar("card-background"),
        border: cssVar("card-border"),
        muted: cssVar("card-muted"),
    },
    floating: {
        DEFAULT: cssVar("dropdown-surface-border"),
        background: cssVar("dropdown-surface-background"),
        border: cssVar("dropdown-surface-border"),
        foreground: cssVar("dropdown-surface-foreground"),
        hover: colorVar("muted"),
        overlay: cssVar("modal-overlay-background"),
    },
    tooltip: {
        DEFAULT: cssVar("tooltip-surface-border"),
        background: cssVar("tooltip-surface-background"),
        border: cssVar("tooltip-surface-border"),
        foreground: cssVar("tooltip-surface-foreground"),
        hover: cssVar("tooltip-surface-background"),
        overlay: cssVar("modal-overlay-background"),
    },
    table: {
        DEFAULT: cssVar("table-background"),
        header: cssVar("table-header-background"),
        background: cssVar("table-background"),
        border: cssVar("table-border"),
    },
    input: {
        border: colorVar("border"),
        placeholder: cssVar("free-text-placeholder-foreground"),
        "mask-error": cssVar("free-text-error-placeholder-foreground"),
        "switch-bg": colorVar("border"),
        switch: cssVar("switch-thumb-checked-background"),
        slider: colorVar("primary"),
    },
    button: {
        primary: {
            bg: colorVar("primary"),
            text: colorVar("primary-foreground"),
        },
        warn: {
            bg: colorVar("warn"),
            text: colorVar("warn-foreground"),
        },
        secondary: {
            bg: cssVar("button-secondary-background"),
            text: cssVar("button-secondary-foreground"),
        },
        info: {
            bg: colorVar("info"),
            text: colorVar("info-foreground"),
        },
        danger: {
            bg: colorVar("danger"),
            text: colorVar("danger-foreground"),
        },
        success: {
            bg: colorVar("success"),
            text: colorVar("success-foreground"),
        },
        neutral: {
            bg: "transparent",
            text: colorVar("foreground"),
        },
        muted: {
            bg: colorVar("muted"),
            text: colorVar("muted-foreground"),
        },
    },
    tag: {
        primary: {
            bg: cssVar("tag-primary-background"),
            text: cssVar("tag-primary-foreground"),
        },
        warn: {
            bg: cssVar("tag-warn-background"),
            text: cssVar("tag-warn-foreground"),
        },
        secondary: {
            bg: cssVar("tag-secondary-background"),
            text: cssVar("tag-secondary-foreground"),
        },
        info: {
            bg: cssVar("tag-info-background"),
            text: cssVar("tag-info-foreground"),
        },
        danger: {
            bg: cssVar("tag-danger-background"),
            text: cssVar("tag-danger-foreground"),
        },
        success: {
            bg: cssVar("tag-success-background"),
            text: cssVar("tag-success-foreground"),
        },
        neutral: {
            bg: cssVar("tag-neutral-background"),
            text: cssVar("tag-neutral-foreground"),
        },
        muted: {
            bg: cssVar("tag-muted-background"),
            text: cssVar("tag-muted-foreground"),
        },
    },
    alert: {
        primary: {
            bg: cssVar("alert-primary-background"),
            text: cssVar("alert-primary-foreground"),
            border: cssVar("alert-primary-border"),
        },
        warn: {
            bg: cssVar("alert-warn-background"),
            text: cssVar("alert-warn-foreground"),
            border: cssVar("alert-warn-border"),
        },
        secondary: {
            bg: colorVar("secondary"),
            text: colorVar("secondary-foreground"),
            border: colorVar("secondary"),
        },
        info: {
            bg: cssVar("alert-info-background"),
            text: cssVar("alert-info-foreground"),
            border: cssVar("alert-info-border"),
        },
        danger: {
            bg: cssVar("alert-danger-background"),
            text: cssVar("alert-danger-foreground"),
            border: cssVar("alert-danger-border"),
        },
        success: {
            bg: cssVar("alert-success-background"),
            text: cssVar("alert-success-foreground"),
            border: cssVar("alert-success-border"),
        },
        neutral: {
            bg: colorVar("background"),
            text: colorVar("foreground"),
            border: colorVar("border"),
        },
        muted: {
            bg: colorVar("muted"),
            text: colorVar("muted-foreground"),
            border: colorVar("border"),
        },
    },
} as const;

const COLORS = mapTailwindColors(rawColors);

const spacing = {
    base: cssVar("spacing-base"),
    hairline: cssVar("spacing-hairline"),
    lg: cssVar("spacing-lg"),
    sm: cssVar("spacing-sm"),
    dialog: cssVar("spacing-dialog"),
    "field-height": defaultTokens.spacing["field-height"],
    "field-label": cssVar("input-field-label-font-size"),
    "input-height": cssVar("free-text-control-height"),
    "input-padding-x": cssVar("free-text-surface-padding-inline"),
    "input-padding-y": cssVar("free-text-surface-padding-block"),
    "input-inline": cssVar("input-field-slot-padding-inline-start"),
    "input-gap": defaultTokens.spacing["input-gap"],
} as const;

const shadows = {
    card: cssVar("shadow-card"),
    floating: cssVar("shadow-floating"),
    notification: cssVar("shadow-notification"),
    table: cssVar("shadow-table"),
    "shadow-card": cssVar("shadow-card"),
    "shadow-floating": cssVar("shadow-floating"),
    "shadow-notification": cssVar("shadow-notification"),
    "shadow-table": cssVar("shadow-table"),
} as const;

const componentBorderRadius: Record<string, string> = {
    button: cssVar("button-rounded"),
    card: cssVar("card-surface-radius"),
    full: cssVar("rounded-full"),
    input: cssVar("input-field-control-radius"),
    pill: cssVar("rounded-pill"),
};
const componentBorderWidth: Record<string, string> = {};
const componentSpacing: Record<string, string> = {
    "input-height": cssVar("free-text-control-height"),
    "input-padding-x": cssVar("free-text-surface-padding-inline"),
    "input-padding-y": cssVar("free-text-surface-padding-block"),
};
const componentFontSize: Record<string, string> = {
    "input-label-text": cssVar("input-field-label-font-size"),
};

for (const [component, attrs] of Object.entries(components)) {
    if (!attrs || typeof attrs !== "object") continue;
    if (component === "typography") {
        for (const [attr, value] of Object.entries(attrs)) {
            componentFontSize[attr] = value;
            componentFontSize[`typography-${attr}`] = value;
        }
        continue;
    }

    for (const [attr, value] of Object.entries(attrs)) {
        const key = `${component}-${attr}`;
        const isRadius = attr === "radius" || attr === "rounded" || attr.endsWith("-radius") || attr.endsWith("-rounded");
        const isBorderWidth = attr === "border" || attr.endsWith("-border") || attr.endsWith("-border-width");
        const isFontSize =
            attr === "text" || attr.endsWith("-text") || attr.startsWith("text-") || attr.endsWith("-font-size") || attr === "font-size";

        if (isRadius) componentBorderRadius[key] = value;
        if (isBorderWidth) componentBorderWidth[key] = value;
        if (isFontSize) componentFontSize[key] = value;
        componentSpacing[key] = value;
    }
}

componentBorderRadius["card-radius"] = cssVar("card-surface-radius");
componentBorderRadius["input-radius"] = cssVar("input-field-control-radius");
componentBorderRadius["button-rounded"] = cssVar("button-rounded");

const config: Partial<Config> = {
    theme: {
        extend: {
            transitionTimingFunction: {
                DEFAULT: "cubic-bezier(0,0,.58,1)",
                normal: "cubic-bezier(.25,.1,.25,1)",
            },
            fill: COLORS,
            colors: COLORS,
            boxShadow: shadows,
            dropShadow: shadows,
            placeholderColor: COLORS,
            lineHeight: { typography: cssVar("typography-paragraph-line-height") },
            letterSpacing: { typography: "0.0175" },
            transitionDuration: { DEFAULT: cssVar("motion-duration-normal") },
            minWidth: { xs: cssVar("spacing-dialog"), screen: "100vh" },
            width: { ...spacing, ...componentSpacing },
            spacing: { ...spacing, ...componentSpacing },
            fontSize: { ...spacing, ...componentFontSize },
            maxHeight: { ...spacing, ...componentSpacing },
            borderColor: { ...COLORS, DEFAULT: COLORS.card.border },
            borderRadius: {
                ...createDesignTokens(theme.rounded, parsers.cssVariable, "var-rounded-"),
                ...componentBorderRadius,
            },
            borderWidth: { ...componentBorderWidth },
            zIndex: {
                wizard: cssVar("layer-wizard"),
                navbar: cssVar("layer-navbar"),
                normal: cssVar("layer-normal"),
                overlay: cssVar("layer-overlay"),
                tooltip: cssVar("layer-tooltip"),
                calendar: cssVar("layer-calendar"),
                floating: cssVar("layer-floating"),
            },
        },
    },
    plugins: [forms({ strategy: "class" }), customPlugins],
};

export { createDesignTokens, parsers, theme, config, customPlugins };

export default config;
