import { CSSProperties } from "react";
import { DesignTokens, DesignTokensBuilder, DesignTokensParser, GeneralTokens, Token } from "./theme.types";

export const parsers = {
    cssVariable: (_, __, k) => `var(--${k})` as const,
    rgba: (v: string) => `rgba(${v})` as const,
    rgb: (v: string) => `rgb(${v})` as const,
    hsl: (v: string) => `hsl(${v})` as const,
    hsla: (v: string) => `hsla(${v})` as const,
    hex: (v: string) => v,
    raw: (v: string) => v,
    formatWithVar: (format: string) => (_: string, __: string, v: string) => `${format}(var(--${v}), <alpha-value>)` as const,
} satisfies Record<string, DesignTokensParser>;

export const reduceTokens = <T extends GeneralTokens>(colors: T, parse: DesignTokensBuilder, prefix: string = "", append: string = ""): Token[] =>
    Object.entries(colors).reduce<Token[]>((acc, [key, value]) => {
        const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
        if (typeof value === "string") {
            const k = append === "" ? `${prefix}${key}` : key;
            return acc.concat(parse(value, k, combine));
        }
        return acc.concat(reduceTokens(value, parse, prefix, combine));
    }, []);

export const createDesignTokens = <T extends GeneralTokens, Fn extends DesignTokensParser>(
    colors: T,
    parse: Fn,
    prefix: string = "",
    append: string = ""
): T =>
    Object.entries(colors).reduce<T>((acc, [key, value]) => {
        const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
        if (typeof value === "string") {
            const k = append === "" ? `${prefix}${key}` : key;
            return { ...acc, [k]: parse(value, key, combine) };
        }
        return {
            ...acc,
            [key]: createDesignTokens(value, parse, prefix, combine),
        };
    }, {} as T);

const modifiers = {
    default: (variables: string) => `:root { ${variables} }`,
    dark: (variables: string) => `html.dark {${variables}}`,
};

const createStyleContent = (
    tokens: Token[],
    modifiers: {
        result: (str: string) => string;
        value?: (k: string, v: string) => string;
    }
) => {
    const v = modifiers.value || ((_: string, s: string) => s);
    const content = tokens.map((token) => `${token.key}: ${v(token.key, token.value)}`).join(";");
    return modifiers.result(content);
};

export const createStyles = {
    default: (tokens: Token[]) => createStyleContent(tokens, { result: modifiers.default }),
    dark: (tokens: Token[]) => createStyleContent(tokens, { result: modifiers.dark }),
};

type TokenParsersType = "colors" | "spacing" | "rounded" | "customTokens";

type TokenCustomParser = (token: Token) => Token;

export type TokenRemap = Partial<Record<TokenParsersType, TokenCustomParser> & { name: string }>;

const createTokens = (theme: DesignTokens, map?: TokenRemap) => {
    const fn =
        (p?: TokenCustomParser): DesignTokensBuilder =>
        (value, _, key) => {
            const r = { key: `--${key}`, value: `${value}` };
            return p ? p(r) : r;
        };
    const colors = reduceTokens(theme.colors, fn(map?.colors));
    const spacing = reduceTokens(theme.spacing, fn(map?.spacing));
    const rounded = reduceTokens(theme.rounded, fn(map?.rounded));
    const customTokens = theme.custom ? reduceTokens(theme.custom, fn(map?.customTokens)) : [];
    return colors.concat(spacing, rounded, customTokens);
};

export const createTheme = (theme: DesignTokens, name?: string) =>
    createStyleContent(createTokens(theme), {
        result: (variables: string) => `html${name ? `.${name}` : ""} {${variables}}`,
        value: (_, v) => v.replace("hsla(", "").replace(")", ""),
    });

export const createCssProperties = (theme: DesignTokens, map?: TokenRemap): CSSProperties => {
    const tokens = createTokens(theme, map);
    return tokens.reduce<CSSProperties>((acc, el) => ({ ...acc, [el.key]: el.value }), {});
};

export const createTokenStyles = (theme: DesignTokens, map?: TokenRemap) =>
    createStyleContent(createTokens(theme, map), {
        result: (variables: string) => `html${map?.name ? `.${map.name}` : ""} {${variables}}`,
        value: (_, v) => v,
    });
