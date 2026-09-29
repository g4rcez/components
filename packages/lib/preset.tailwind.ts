import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import { createDesignTokens, parsers } from "./src/styles/design-tokens.ts";
import { themeTokenRegistry } from "./src/styles/theme-registry.generated.ts";
import customPlugins from "./plugin.tailwind.ts";
import { geometryToken } from "./src/styles/geometry-defaults.ts";

const cssVar = geometryToken;
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
    "field-height": cssVar("spacing-field-height"),
    "field-label": cssVar("input-field-label-font-size"),
    "input-height": cssVar("free-text-control-height"),
    "input-padding-x": cssVar("free-text-surface-padding-inline"),
    "input-padding-y": cssVar("free-text-surface-padding-block"),
    "input-inline": cssVar("input-field-slot-padding-inline-start"),
    "input-gap": cssVar("input-field-hint-margin-block-start"),
} as const;

const themedShadow = (name: "notification" | "table") =>
    `var(--var-shadow-${name}, var(--var-shadow-${name}-shape) var(--var-color-shadow-${name}))`;

const shadows = {
    card: cssVar("shadow-card"),
    floating: cssVar("shadow-floating"),
    notification: themedShadow("notification"),
    table: themedShadow("table"),
    "shadow-card": cssVar("shadow-card"),
    "shadow-floating": cssVar("shadow-floating"),
    "shadow-notification": themedShadow("notification"),
    "shadow-table": themedShadow("table"),
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

// Historical utility names remain public; only their CSS token targets are translated.
const componentTokenNames: Record<string, string> = {
    "card-rounded": "card-surface-radius",
    "card-padding-x": "card-content-padding-inline",
    "card-padding-y": "card-surface-padding-block",
    "card-gap": "card-content-gap",
    "card-title-pb": "card-title-padding-block-end",
    "card-title-mb": "card-title-margin-block-end",
    "card-stats-icon-col-w": "card-stats-icon-column-width",
    "card-stats-icon-col-p": "card-stats-icon-column-padding",
    "card-stats-content-py": "card-stats-content-padding-block",
    "card-title-text": "card-title-font-size",
    "button-padding-icon": "button-icon-p",
    "button-padding-x": "button-px",
    "button-padding-y": "button-py",
    "button-radius-rough": "button-rough-rounded",
    "button-radius-squared": "button-squared-rounded",
    "button-text": "button-font-size",
    "button-text-icon": "button-icon-font-size",
    "alert-rounded": "alert-surface-radius",
    "alert-p": "alert-surface-padding",
    "alert-gap": "alert-content-gap",
    "alert-close-top": "alert-close-inset-block-start",
    "alert-close-right": "alert-close-inset-inline-end",
    "stats-title-text": "stats-title-font-size",
    "stats-value-text": "stats-value-font-size",
    "notification-rounded": "notification-surface-radius",
    "notification-p": "notification-content-padding",
    "notification-gap": "notification-content-gap",
    "notification-inner-gap": "notification-text-gap",
    "notification-close-p": "notification-close-padding",
    "notification-list-gap": "notification-viewport-gap",
    "notification-badge-px": "notification-badge-padding-inline",
    "notification-badge-py": "notification-badge-padding-block",
    "notification-list-top": "notification-viewport-inset-block-start",
    "notification-list-max-w": "notification-viewport-max-inline-size",
    "notification-badge-text": "notification-badge-font-size",
    "calendar-cell-p": "calendar-day-cell-padding",
    "calendar-day-size": "calendar-day-button-size",
    "calendar-nav-p": "calendar-nav-button-padding",
    "calendar-weekday-py": "calendar-weekday-padding-block",
    "calendar-table-mt": "calendar-table-margin-block-start",
    "calendar-datetime-my": "calendar-datetime-margin-block",
    "calendar-footer-mt": "calendar-footer-margin-block-start",
    "calendar-nav-gap": "calendar-month-controls-gap",
    "calendar-nav-py": "calendar-month-controls-padding-block",
    "calendar-year-w": "calendar-year-input-width",
    "calendar-icon-size": "calendar-nav-icon-size",
    "calendar-weekday-text": "calendar-weekday-font-size",
    "calendar-cell-text": "calendar-day-button-font-size",
    "skeleton-rounded": "skeleton-radius",
    "skeleton-height": "skeleton-block-size",
    "skeleton-width": "skeleton-block-inline-size",
    "skeleton-cell-h": "skeleton-cell-block-size",
    "typography-base": "typography-paragraph-font-size",
    "typography-2xl": "typography-page-title-font-size",
    "switch-track-h": "switch-track-block-size",
    "switch-track-w": "switch-track-inline-size",
    "switch-gap": "switch-label-gap",
    "switch-label-text": "switch-label-font-size",
    "switch-hint-text": "switch-error-font-size",
    "switch-hint-mt": "switch-error-margin-block-start",
    "slider-control-h": "slider-control-block-size",
    "slider-track-h": "slider-track-block-size",
    "progress-track-h": "progress-track-block-size",
    "progress-rounded": "progress-track-radius",
    "empty-gap": "empty-surface-gap",
    "empty-px": "empty-surface-padding-inline",
    "empty-py": "empty-surface-padding-block",
    "list-rounded": "list-detail-card-radius",
    "list-card-p": "list-detail-card-padding",
    "list-card-py": "list-detail-card-padding-block",
    "list-card-pb": "list-detail-card-padding-block-end",
    "list-card-gap": "list-detail-card-gap",
    "list-close-p": "list-close-button-padding",
    "list-item-py": "list-item-padding-block",
    "list-item-gap": "list-item-content-gap",
    "list-avatar-px": "list-avatar-frame-padding-inline",
    "list-body-py": "list-item-body-padding-block",
    "list-title-text": "list-title-font-size",
    "step-size": "step-marker-size",
    "step-label-px": "step-label-padding-inline",
    "step-connector-h": "step-connector-block-size",
    "shortcut-gap": "shortcut-content-gap",
    "shortcut-text": "shortcut-content-font-size",
    "info-gap": "typography-info-gap",
    "info-label-text": "typography-info-label-font-size",
    "info-value-text": "typography-info-value-font-size",
    "info-secondary-text": "typography-info-secondary-font-size",
};

for (const size of ["big", "min", "small", "tiny"]) {
    componentTokenNames[`button-height-${size}`] = `button-${size}-height`;
    componentTokenNames[`button-padding-x-${size}`] = `button-${size}-px`;
    componentTokenNames[`button-padding-y-${size}`] = `button-${size}-py`;
    componentTokenNames[`button-text-${size}`] = `button-${size}-font-size`;
}

const componentToken = (key: string) =>
    cssVar(componentTokenNames[key] ?? (key.startsWith("input-free-text-") ? key.slice("input-".length) : key));

const registerComponentUtility = (key: string, attr: string, value: string) => {
    const isRadius = attr === "radius" || attr === "rounded" || attr.endsWith("-radius") || attr.endsWith("-rounded");
    const isBorderWidth = attr === "border" || attr.endsWith("-border") || attr.endsWith("-border-width");
    const isFontSize = attr === "text" || attr.endsWith("-text") || attr.startsWith("text-") || attr.endsWith("-font-size") || attr === "font-size";

    if (isRadius) componentBorderRadius[key] = value;
    if (isBorderWidth) componentBorderWidth[key] = value;
    if (isFontSize) componentFontSize[key] = value;
    componentSpacing[key] = value;
};
// Historical info-* utilities resolve to tokens owned by typography.
const componentUtilityOwners = [...new Set([...Object.keys(themeTokenRegistry.components), "input", "info"])].toSorted((left, right) => right.length - left.length);
for (const [component, attrs] of Object.entries(themeTokenRegistry.components)) {
    if (component === "typography") {
        for (const attr of attrs) {
            const value = componentToken(`typography-${attr}`);
            componentFontSize[attr] = value;
            componentFontSize[`typography-${attr}`] = value;
        }
        continue;
    }

    for (const attr of attrs) registerComponentUtility(`${component}-${attr}`, attr, componentToken(`${component}-${attr}`));
}

for (const [key, token] of Object.entries(componentTokenNames)) {
    const component = componentUtilityOwners.find((name) => key.startsWith(`${name}-`));
    if (!component) throw new Error(`No Tailwind component owner for semantic utility ${key}.`);
    const attr = key.slice(component.length + 1);
    const value = cssVar(token);
    if (component === "typography") {
        componentFontSize[attr] = value;
        componentFontSize[key] = value;
        continue;
    }
    registerComponentUtility(key, attr, value);
}

for (const attr of themeTokenRegistry.components["free-text"] ?? []) {
    const key = `input-free-text-${attr}`;
    registerComponentUtility(key, `free-text-${attr}`, componentToken(key));
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

export { createDesignTokens, parsers, config, customPlugins };

export default config;
