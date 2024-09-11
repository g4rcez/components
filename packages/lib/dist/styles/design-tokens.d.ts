import { DesignTokens, DesignTokensBuilder, DesignTokensParser, GeneralTokens, Token } from "./theme.types";
export declare const parsers: {
    cssVariable: (_: string, __: string, k: string) => `var(--${string})`;
    rgba: (v: string) => `rgba(${string})`;
    rgb: (v: string) => `rgb(${string})`;
    hsl: (v: string) => `hsl(${string})`;
    hsla: (v: string) => `hsla(${string})`;
    hex: (v: string) => string;
    raw: (v: string) => string;
    formatWithVar: (format: string) => (_: string, __: string, v: string) => `${string}(var(--${string}), <alpha-value>)`;
};
export declare const reduceTokens: <T extends GeneralTokens>(colors: T, parse: DesignTokensBuilder, prefix?: string, append?: string) => Token[];
export declare const createDesignTokens: <T extends GeneralTokens, Fn extends DesignTokensParser>(colors: T, parse: Fn, prefix?: string, append?: string) => T;
export declare const createStyles: {
    default: (tokens: Token[]) => string;
    dark: (tokens: Token[]) => string;
};
export declare const createTheme: (theme: DesignTokens, name?: string) => string;
//# sourceMappingURL=design-tokens.d.ts.map