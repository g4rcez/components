export const parsers = {
    cssVariable: (_, __, k) => `var(--${k})`,
    rgba: (v) => `rgba(${v})`,
    rgb: (v) => `rgb(${v})`,
    hsl: (v) => `hsl(${v})`,
    hsla: (v) => `hsla(${v})`,
    hex: (v) => v,
    raw: (v) => v,
    formatWithVar: (format) => (_, __, v) => `${format}(var(--${v}), <alpha-value>)`,
};
export const reduceTokens = (colors, parse, prefix = "", append = "") => Object.entries(colors).reduce((acc, [key, value]) => {
    const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
    if (typeof value === "string") {
        const k = append === "" ? `${prefix}${key}` : key;
        return acc.concat(parse(value, k, combine));
    }
    return acc.concat(reduceTokens(value, parse, prefix, combine));
}, []);
export const createDesignTokens = (colors, parse, prefix = "", append = "") => Object.entries(colors).reduce((acc, [key, value]) => {
    const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
    if (typeof value === "string") {
        const k = append === "" ? `${prefix}${key}` : key;
        return Object.assign(Object.assign({}, acc), { [k]: parse(value, key, combine) });
    }
    return Object.assign(Object.assign({}, acc), { [key]: createDesignTokens(value, parse, prefix, combine) });
}, {});
const modifiers = {
    default: (variables) => `:root { ${variables} }`,
    dark: (variables) => `html.dark {${variables}}`,
};
const createStyleContent = (tokens, modifiers) => {
    const v = modifiers.value || ((_, s) => s);
    const content = tokens.map((token) => `${token.key}: ${v(token.key, token.value)}`).join(";");
    return modifiers.result(content);
};
export const createStyles = {
    default: (tokens) => createStyleContent(tokens, { result: modifiers.default }),
    dark: (tokens) => createStyleContent(tokens, { result: modifiers.dark }),
};
export const createTheme = (theme, name) => {
    const fn = (value, _, key) => ({
        key: `--${key}`,
        value: `${value}`,
    });
    const colors = reduceTokens(theme.colors, fn);
    const spacing = reduceTokens(theme.spacing, fn);
    const rounded = reduceTokens(theme.rounded, fn);
    return createStyleContent(colors.concat(spacing, rounded), {
        result: (variables) => `html${name ? `.${name}` : ""} {${variables}}`,
        value: (_, v) => v.replace("hsla(", "").replace(")", ""),
    });
};
