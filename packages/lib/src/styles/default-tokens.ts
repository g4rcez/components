export const defaultSpacingTokens = {
    base: "1rem",
    hairline: "calc(var(--var-spacing-base) * 0.0625)",
    lg: "calc(var(--var-spacing-base) * 1.125)",
    sm: "calc(var(--var-spacing-base) * 0.75)",
    dialog: "calc(var(--var-spacing-base) * 20)",
    "field-height": "calc(var(--var-spacing-base) * 1.5)",
    "field-label": "calc(var(--var-fontsize) * 0.875)",
    "input-height": "calc(var(--var-spacing-base) * 2.5)",
    "input-x": "calc(var(--var-spacing-base) * 0.5)",
    "input-y": "calc(var(--var-spacing-base) * 0.25)",
    "input-inline": "calc(var(--var-spacing-base) * 0.25)",
    "input-gap": "calc(var(--var-spacing-base) * 0.3)",
} as const;

export const defaultRoundedTokens = {
    button: "calc(var(--var-radius-base) * 0.55)",
    pill: "calc(var(--var-radius-base) * 2)",
    card: "calc(var(--var-radius-base) * 0.75)",
    full: "9999px",
} as const;

export const defaultZIndexTokens = {
    wizard: "100",
    normal: "1",
    navbar: "19",
    calendar: "2",
    overlay: "21",
    tooltip: "20",
    floating: "22",
} as const;

export const defaultShadowTokens = {
    "shadow-notification": "1px 2px 2px 2px hsla(210, 25%, 40%, 0.15)",
    "shadow-floating": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "shadow-card": "0px 1px 2px 1px hsla(210, 25%, 20%, 0.1)",
    "shadow-table": "0px 1px 1px 1px hsla(210, 0%, 0%,  0.1)",
} as const;

export const defaultTokens = {
    spacing: defaultSpacingTokens,
    rounded: defaultRoundedTokens,
    zIndex: defaultZIndexTokens,
    shadow: defaultShadowTokens,
} as const;

export type DefaultTokens = typeof defaultTokens;
