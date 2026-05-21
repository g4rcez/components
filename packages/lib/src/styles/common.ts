import { DesignTokens, ZIndex } from "./theme.types";

export const rounded = {
    pill: "2rem",
    full: "9999px",
} as const;

export const spacing: DesignTokens["spacing"] = {
    base: "1rem",
    hairline: "0.0625rem",
    lg: "1.125rem",
    sm: "0.75rem",
    dialog: "20rem",
} as const;

export const zIndex: ZIndex = {
    wizard: "50",
    normal: "1",
    navbar: "22",
    calendar: "2",
    overlay: "21",
    tooltip: "20",
    floating: "22",
} as const;
