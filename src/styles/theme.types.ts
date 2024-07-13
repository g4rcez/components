export type GeneralTokens = { [K in string]: string | GeneralTokens };

export type DesignTokens = {
    name: string;
    rounded: {
        pill: string;
    };
    spacing: {
        base: string;
        lg: string;
        sm: string;
    };
    colors: {
        foreground: string;
        background: string;
        accent: string;
        disabled: string;
        primary: {
            foreground: string;
            DEFAULT: string;
            subtle: string;
            hover: string;
        };
        warn: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
        };
        secondary: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
        };
        info: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
        };
        danger: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
        };
        success: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
        };
        input: {
            border: string;
            placeholder: string;
            "mask-error": string;
            "switch-bg": string;
            switch: string;
        };
        card: {
            background: string;
            border: string;
        };
        floating: {
            background: string;
            border: string;
            overlay: string;
        };
        tooltip: {
            background: string;
            border: string;
        };
        table: {
            background: string;
            border: string;
            row: string;
        };
    };
};

export type Token = { key: string; value: string };

export type DesignTokensParser =
    | ((value: string, key: string, combine: string) => string)
    | ((format: string) => (value: string, key: string, combine: string) => string);

export type DesignTokensBuilder = (value: string, key: string, combine: string) => Token;

type Fn = (...a: any[]) => any;

export type DeepParse<T extends GeneralTokens, F extends Fn> = {
    [K in keyof T]: T[K] extends GeneralTokens ? DeepParse<T[K], F> : ReturnType<Fn>;
};
