export type GeneralTokens = { [K in string]: string | GeneralTokens };

export type Token = { key: string; value: string };

export type DesignTokensParser =
    | ((value: string, key: string, combine: string) => string)
    | ((format: string) => (value: string, key: string, combine: string) => string);

export type DesignTokensBuilder = (value: string, key: string, combine: string) => Token;

type Fn = (...args: never[]) => unknown;

export type DeepParse<T extends GeneralTokens, F extends Fn> = {
    [K in keyof T]: T[K] extends GeneralTokens ? DeepParse<T[K], F> : ReturnType<Fn>;
};
