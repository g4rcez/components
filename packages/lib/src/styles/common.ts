import type { DesignTokens, ZIndex } from "./theme.types";

export const rounded = {
    pill: "calc(var(--var-radius-base) * 2)",
    full: "9999px",
} as const;

export const spacing: DesignTokens["spacing"] = {
    base: "1rem",
    hairline: "calc(var(--var-spacing-base) * 0.0625)",
    lg: "calc(var(--var-spacing-base) * 1.125)",
    sm: "calc(var(--var-spacing-base) * 0.75)",
    dialog: "calc(var(--var-spacing-base) * 20)",
} as const;

export const zIndex: ZIndex = {
    wizard: "100",
    normal: "1",
    navbar: "19",
    calendar: "2",
    overlay: "21",
    tooltip: "20",
    floating: "22",
} as const;
