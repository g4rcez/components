type DesignTokens = {
  [K in string]: string | DesignTokens;
};

type Token = { key: string, value: string }

type DesignTokensParser = (
  value: string,
  key: string,
  combine: string,
) => string;

type DesignTokensBuilder = (
  value: string,
  key: string,
  combine: string,
) => Token;


export const parsers = {
  cssVariable: (_, __, k) => `var(--${k})`,
  rgba: (value) => `rgba(${value})`,
  rgb: (value) => `rgb(${value})`,
  hsl: (value) => `hsl(${value})`,
  hsla: (value) => `hsla(${value})`,
  hex: (value) => value,
  raw: (value) => value,
} satisfies Record<string, DesignTokensParser>;

export const reduceTokens = <T extends DesignTokens>(
  colors: T,
  parse: DesignTokensBuilder,
  prefix: string = "",
  append: string = "",
): Token[] =>
  Object.entries(colors).reduce<Token[]>((acc, [key, value]) => {
    const combine = append === "" ? `${prefix}${key}` : `${append}-${key}`;
    if (typeof value === "string") {
      const k = append === "" ? `${prefix}${key}` : key;
      return acc.concat(parse(value, k, combine));
    }
    return acc.concat(reduceTokens(value, parse, prefix, combine));
  }, []);


export const createDesignTokens = <T extends DesignTokens>(
  colors: T,
  parse: DesignTokensParser,
  prefix: string = "",
  append: string = "",
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

const createStyleContent = (tokens: Token[], modifier: (str: string) => string) => {
  const content = tokens.map((token) => `${token.key}: ${token.value}`).join(";");
  return modifier(content);
};

export const createStyles = {
  default: (tokens: Token[]) => createStyleContent(tokens, modifiers.default),
  dark: (tokens: Token[]) => createStyleContent(tokens, modifiers.dark),
};