import type { DesignTokensBuilder, DesignTokensParser, GeneralTokens, Token } from "./theme.types.ts";

export const parsers = {
    hex: (value: string) => value,
    raw: (value: string) => value,
    hsl: (value: string) => `hsl(${value})` as const,
    rgb: (value: string) => `rgb(${value})` as const,
    z: (_value, _key, token) => `var(--z-${token})` as const,
    hsla: (value: string) => `hsla(${value})` as const,
    rgba: (value: string) => `rgba(${value})` as const,
    cssVariable: (_value, _key, token) => `var(--${token})` as const,
    formatWithVar: (format: string) => (_value: string, _key: string, token: string) => `${format}(var(--${token}), <alpha-value>)` as const,
} satisfies Record<string, DesignTokensParser>;

export const reduceTokens = <T extends GeneralTokens>(
    tokens: T,
    parse: DesignTokensBuilder,
    prefix: string = "",
    append: string = ""
): Token[] =>
    Object.entries(tokens).reduce<Token[]>((acc, [key, value]) => {
        const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
        if (typeof value === "string") {
            const name = append === "" ? `${prefix}${key}` : key;
            return acc.concat(parse(value, name, combine));
        }
        return acc.concat(reduceTokens(value, parse, prefix, combine));
    }, []);

export const createDesignTokens = <T extends GeneralTokens, Fn extends DesignTokensParser>(
    tokens: T,
    parse: Fn,
    prefix: string = "",
    append: string = ""
): T =>
    Object.entries(tokens).reduce<T>((acc, [key, value]) => {
        const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
        if (typeof value === "string") {
            const name = append === "" ? `${prefix}${key}` : key;
            return { ...acc, [name]: parse(value, key, combine) };
        }
        return {
            ...acc,
            [key]: createDesignTokens(value, parse, prefix, combine),
        };
    }, {} as T);
