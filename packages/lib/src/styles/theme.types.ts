export type GeneralTokens = { [K in string]: string | GeneralTokens };

export type ThemeState = "primary" | "warn" | "secondary" | "info" | "danger" | "success" | "neutral";

type BasicTokens = {
    hover: string;
    subtle: string;
    DEFAULT: string;
    foreground: string;
};

type ComponentToken = {
    border: string;
    overlay: string;
    background: string;
    foreground: string;
};

export type DesignTokens = {
    name: string;
    shadow: Record<"floating", string>;
    rounded: Record<"button" | "full" | "pill" | "card", string>;
    spacing: Record<"base" | "lg" | "sm", string>;
    custom?: Record<string, string>;
    colors: {
        disabled: string;
        background: string;
        foreground: string;
        primary: BasicTokens;
        emphasis: BasicTokens;
        tooltip: ComponentToken;
        floating: ComponentToken;
        info: BasicTokens & { notification: string };
        warn: BasicTokens & { notification: string };
        card: { background: string; border: string };
        danger: BasicTokens & { notification: string };
        secondary: BasicTokens & { background: string };
        success: BasicTokens & { notification: string };
        tag: Record<ThemeState, { text: string; bg: string }>;
        button: Record<ThemeState, { text: string; bg: string }>;
        table: { border: string; header: string; background: string };
        alert: Record<ThemeState, { text: string; bg: string; border: string }>;
        input: {
            border: string;
            placeholder: string;
            "mask-error": string;
            "switch-bg": string;
            switch: string;
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
