type N = `${number}`;

export type GeneralTokens = { [K in string]: string | GeneralTokens };

export type ThemeState = "primary" | "warn" | "secondary" | "info" | "danger" | "success" | "neutral" | "muted";

type BasicTokens = {
  hover: string;
  subtle: string;
  DEFAULT: string;
  foreground: string;
};

type ComponentToken = {
  hover: string;
  border: string;
  overlay: string;
  background: string;
  foreground: string;
};

export type ZIndex = {
  wizard: N;
  navbar: N;
  normal: N;
  overlay: N;
  tooltip: N;
  calendar: N;
  floating: N;
};

type Shadows = "floating" | "card" | "notification" | "table";

export type DesignTokens = {
  name: string;
  zIndex: ZIndex;
  shadow: Record<`shadow-${Shadows}`, string>;
  spacing: Record<"base" | "lg" | "sm" | "hairline", string> & {
    dialog: string;
    "input-x": string;
    "input-y": string;
    "input-gap": string;
    "field-label": string;
    "field-height": string;
    "input-height": string;
    "input-inline": string;
  };
  rounded: Record<"button" | "full" | "pill" | "card", string>;
  custom?: Record<string, string>;
  colors: {
    border: string;
    disabled: string;
    background: string;
    foreground: string;
    muted: BasicTokens;
    primary: BasicTokens;
    emphasis: BasicTokens;
    tooltip: ComponentToken;
    floating: ComponentToken;
    info: BasicTokens & { notification: string };
    warn: BasicTokens & { notification: string };
    danger: BasicTokens & { notification: string };
    secondary: BasicTokens & { background: string };
    success: BasicTokens & { notification: string };
    tag: Record<ThemeState, { text: string; bg: string }>;
    button: Record<ThemeState, { text: string; bg: string }>;
    card: { background: string; border: string; muted: string };
    table: { border: string; header: string; background: string };
    alert: Record<ThemeState, { text: string; bg: string; border: string }>;
    input: {
      border: string;
      placeholder: string;
      "mask-error": string;
      "switch-bg": string;
      switch: string;
      slider: string;
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
