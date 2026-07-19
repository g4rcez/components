export const defaultSpacingTokens = {
    base: "1rem",
    hairline: "0.0625rem",
    lg: "1.125rem",
    sm: "0.75rem",
    dialog: "20rem",
    "field-height": "1.5rem",
    "field-label": "0.875rem",
    "input-height": "2.5rem",
    "input-x": "0.5rem",
    "input-y": "0.25rem",
    "input-inline": "0.25rem",
    "input-gap": "0.3rem",
} as const;

export const defaultRoundedTokens = {
    button: "0.55rem",
    pill: "2rem",
    card: "0.75rem",
    full: "9999px",
} as const;

export const defaultZIndexTokens = {
    wizard: "100",
    normal: "1",
    navbar: "22",
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
