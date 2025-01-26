export type GeneralTokens = { [K in string]: string | GeneralTokens };

type ThemeState = "primary" | "warn" | "secondary" | "info" | "danger" | "success" | "neutral";

export type DesignTokens = {
    name: string;
    shadow: Record<"floating", string>;
    rounded: Record<"button" | "full" | "pill" | "card", string>;
    spacing: Record<"base" | "lg" | "sm", string>;
    custom?: Record<string, string>;
    colors: {
        tag: Record<ThemeState, { text: string; bg: string }>;
        button: Record<ThemeState, { text: string; bg: string }>;
        alert: Record<ThemeState, { text: string; bg: string; border: string }>;
        foreground: string;
        background: string;
        disabled: string;
        emphasis: {
            foreground: string;
            DEFAULT: string;
            subtle: string;
            hover: string;
        };
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
            notification: string;
        };
        secondary: {
            DEFAULT: string;
            background: string;
            subtle: string;
            hover: string;
            foreground: string;
        };
        info: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
            notification: string;
        };
        danger: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
            notification: string;
        };
        success: {
            DEFAULT: string;
            subtle: string;
            hover: string;
            foreground: string;
            notification: string;
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
            foreground: string;
            background: string;
            border: string;
        };
        table: {
            border: string;
            header: string;
            background: string;
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
