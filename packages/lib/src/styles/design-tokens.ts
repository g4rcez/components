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

export const createTheme = (theme: DesignTokens, name?: string) => {
    const fn: DesignTokensBuilder = (value, _, key) => ({
        key: `--${key}`,
        value: `${value}`,
    });
    const colors = reduceTokens(theme.colors, fn);
    const spacing = reduceTokens(theme.spacing, fn);
    const rounded = reduceTokens(theme.rounded, fn);
    const customTokens = theme.custom ? reduceTokens(theme.custom, fn) : [];
    return createStyleContent(colors.concat(spacing, rounded, customTokens), {
        result: (variables: string) => `html${name ? `.${name}` : ""} {${variables}}`,
        value: (_, v) => v.replace("hsla(", "").replace(")", ""),
    });
};
