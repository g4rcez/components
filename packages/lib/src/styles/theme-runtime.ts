export type TokenTree = {
    readonly [key: string]: string | TokenTree;
};

export type ThemeTokens = Partial<{
    colors: TokenTree;
    components: TokenTree;
    spacing: TokenTree;
    rounded: TokenTree;
    shadow: TokenTree;
    layer: TokenTree;
}>;

export type ThemeCssOptions = Partial<{
    name: string;
    selector: string;
    layer: boolean;
    base: ThemeTokens;
}>;

export type ThemeStyleElementOptions = ThemeCssOptions &
    Partial<{
        document: Document;
        id: string;
    }>;

export type ThemeCssProperties = Record<`--var-${string}`, string>;

const THEME_ATTRIBUTE = "data-theme";

export const defaultLightThemeTokens = {
    colors: {
        background: "hsla(0, 0%, 100%)",
        foreground: "hsla(221, 15%, 23%)",
        border: "hsla(240, 6%, 90%)",
        ring: "hsla(201, 49%, 36%)",
        disabled: "hsla(240, 5%, 96%)",
        muted: {
            DEFAULT: "hsla(240, 5%, 96%)",
            foreground: "hsla(240, 4%, 46%)",
        },
        primary: {
            DEFAULT: "hsla(201, 49%, 36%)",
            foreground: "hsla(240, 6%, 10%)",
            subtle: "hsla(201, 49%, 28%)",
            hover: "hsla(201, 49%, 22%)",
        },
        secondary: {
            DEFAULT: "hsla(240, 6%, 10%)",
            foreground: "hsla(0, 0%, 100%)",
            subtle: "hsla(240, 5%, 96%)",
            hover: "hsla(240, 6%, 15%)",
        },
        info: {
            DEFAULT: "hsla(199, 89%, 48%)",
            foreground: "hsla(0, 0%, 100%)",
            subtle: "hsla(199, 89%, 96%)",
            hover: "hsla(199, 89%, 40%)",
        },
        warn: {
            DEFAULT: "hsla(38, 92%, 50%)",
            foreground: "hsla(0, 0%, 100%)",
            subtle: "hsla(38, 92%, 96%)",
            hover: "hsla(38, 92%, 45%)",
        },
        danger: {
            DEFAULT: "hsla(0, 84%, 60%)",
            foreground: "hsla(0, 0%, 100%)",
            subtle: "hsla(0, 84%, 96%)",
            hover: "hsla(0, 84%, 50%)",
        },
        success: {
            DEFAULT: "hsla(142, 71%, 45%)",
            foreground: "hsla(0, 0%, 100%)",
            subtle: "hsla(142, 71%, 96%)",
            hover: "hsla(142, 71%, 40%)",
        },
    },
    components: {
        button: {
            height: "2.5rem",
            px: "1rem",
            py: "0.5rem",
            gap: "0.375rem",
            "font-size": "1rem",
            rounded: "0.55rem",
            primary: {
                background: "var(--var-color-primary)",
                foreground: "var(--var-color-primary-foreground)",
            },
        },
        tag: {
            "surface-gap": "0.375rem",
            "surface-radius": "2rem",
            "default-min-block-size": "2rem",
            "default-padding-inline": "1rem",
            "default-padding-block": "0.5rem",
            "big-min-block-size": "3rem",
            "big-padding-inline": "1.5rem",
            "big-padding-block": "1rem",
            "small-min-block-size": "1.5rem",
            "small-padding-inline": "0.75rem",
            "small-padding-block": "0.5rem",
            "small-font-size": "0.875rem",
            "tiny-min-block-size": "1.25rem",
            "tiny-padding-inline": "0.5rem",
            "tiny-padding-block": "0.25rem",
            "tiny-font-size": "0.75rem",
            "icon-padding": "0.25rem",
            "indicator-size": "0.5rem",
            "loading-opacity": "0.7",
            "loading-pulse-duration": "2s",
            "loading-pulse-timing": "cubic-bezier(0.4, 0, 0.6, 1)",
            "loading-pulse-opacity": "0.45",
            primary: {
                background: "hsla(201, 49%, 36%)",
                foreground: "hsla(221, 6%, 90%)",
            },
            info: {
                background: "hsla(199, 89%, 48%)",
                foreground: "hsla(0, 0%, 100%)",
            },
            warn: {
                background: "hsla(38, 92%, 50%)",
                foreground: "hsla(0, 0%, 100%)",
            },
            muted: {
                background: "hsla(240, 5%, 96%)",
                foreground: "hsla(240, 4%, 46%)",
            },
            danger: {
                background: "hsla(0, 84%, 60%)",
                foreground: "hsla(0, 0%, 100%)",
            },
            success: {
                background: "hsla(142, 71%, 45%)",
                foreground: "hsla(0, 0%, 100%)",
            },
            secondary: {
                background: "hsla(240, 6%, 10%)",
                foreground: "hsla(0, 0%, 100%)",
            },
            disabled: {
                background: "hsla(240, 5%, 96%)",
                foreground: "hsla(240, 4%, 46%)",
            },
            neutral: {
                background: "transparent",
                foreground: "hsla(221, 15%, 23%)",
                border: "hsla(240, 6%, 90%)",
            },
        },
        spinner: {
            "indicator-size": "3rem",
            "indicator-border-width": "0.25rem",
            "container-padding": "3rem",
            "spin-duration": "1s",
        },
        empty: {
            gap: "1rem",
            px: "2rem",
            py: "3rem",
            foreground: "var(--var-color-disabled)",
        },
        progress: {
            "track-h": "1.5rem",
            rounded: "0.3rem",
            "track-background": "var(--var-color-background)",
            "indicator-background": "var(--var-color-primary)",
            "label-foreground": "var(--var-color-primary-foreground)",
        },
        stats: {
            rounded: "1rem",
            p: "1.5rem",
            gap: "1rem",
            "icon-size": "2.5rem",
            "icon-p": "2rem",
            "inner-gap": "0.25rem",
            "footer-px": "1.5rem",
            "footer-py": "0.5rem",
            "title-font-size": "1rem",
            "value-font-size": "2.25rem",
            background: "var(--var-color-background)",
            "border-color": "var(--var-color-border)",
            "icon-background": "var(--var-color-primary)",
            "icon-foreground": "var(--var-color-primary-foreground)",
        },
    },
    spacing: {
        base: "1rem",
        hairline: "0.0625rem",
        lg: "1.125rem",
        sm: "0.75rem",
        dialog: "20rem",
    },
    rounded: {
        pill: "2rem",
        full: "9999px",
    },
    shadow: {
        card: "0px 1px 2px 1px transparent",
        floating: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        notification: "1px 2px 2px 2px hsla(210, 25%, 40%, 0.15)",
        table: "0px 1px 1px 1px hsla(210, 0%, 0%, 0.1)",
    },
    layer: {
        normal: "1",
        calendar: "2",
        tooltip: "20",
        overlay: "21",
        floating: "22",
        navbar: "22",
        wizard: "50",
    },
} satisfies ThemeTokens;

export const defaultDarkThemeTokens = {
    colors: {
        background: "hsla(240, 10%, 8%)",
        foreground: "hsla(240, 5%, 96%)",
        border: "hsla(240, 4%, 16%)",
        ring: "hsla(201, 49%, 65%)",
        disabled: "hsla(240, 4%, 16%)",
        muted: {
            DEFAULT: "hsla(240, 4%, 16%)",
            foreground: "hsla(240, 5%, 65%)",
        },
        primary: {
            DEFAULT: "hsla(201, 49%, 54%)",
            foreground: "hsla(240, 6%, 10%)",
            subtle: "hsla(201, 49%, 36%)",
            hover: "hsla(201, 49%, 22%)",
        },
    },
    components: {
        button: {
            secondary: {
                background: "hsla(0, 0%, 100%)",
                foreground: "hsla(240, 10%, 4%)",
            },
        },
        tag: {
            primary: {
                background: "hsla(201, 49%, 54%)",
                foreground: "hsla(240, 6%, 10%)",
            },
            warn: {
                background: "hsla(38, 92%, 50%)",
                foreground: "hsla(240, 10%, 4%)",
            },
            muted: {
                background: "hsla(240, 4%, 16%)",
                foreground: "hsla(240, 5%, 65%)",
            },
            success: {
                background: "hsla(142, 71%, 45%)",
                foreground: "hsla(240, 10%, 4%)",
            },
            secondary: {
                background: "hsla(0, 0%, 100%)",
                foreground: "hsla(240, 10%, 4%)",
            },
            disabled: {
                background: "hsla(240, 4%, 16%)",
                foreground: "hsla(240, 5%, 65%)",
            },
            neutral: {
                background: "transparent",
                foreground: "hsla(240, 5%, 96%)",
                border: "hsla(240, 4%, 16%)",
            },
        },
    },
} satisfies ThemeTokens;

const groupPrefixes = {
    colors: ["color"],
    components: [],
    spacing: ["spacing"],
    rounded: ["rounded"],
    shadow: ["shadow"],
    layer: ["layer"],
} satisfies Record<keyof Required<ThemeTokens>, readonly string[]>;

const isTokenTree = (value: string | TokenTree): value is TokenTree => typeof value !== "string";

const mergeTokenTree = (base: TokenTree | undefined, override: TokenTree | undefined): TokenTree | undefined => {
    if (!base) return override;
    if (!override) return base;

    const merged: Record<string, string | TokenTree> = { ...base };
    for (const [key, value] of Object.entries(override)) {
        const existing = merged[key];
        merged[key] = typeof existing === "string" || typeof value === "string" ? value : (mergeTokenTree(existing, value) ?? value);
    }
    return merged;
};

export const mergeThemeTokens = (base: ThemeTokens = defaultLightThemeTokens, override: ThemeTokens = {}): ThemeTokens => ({
    colors: mergeTokenTree(base.colors, override.colors),
    components: mergeTokenTree(base.components, override.components),
    spacing: mergeTokenTree(base.spacing, override.spacing),
    rounded: mergeTokenTree(base.rounded, override.rounded),
    shadow: mergeTokenTree(base.shadow, override.shadow),
    layer: mergeTokenTree(base.layer, override.layer),
});

const tokenName = (parts: readonly string[]) => `--var-${parts.filter((part) => part !== "DEFAULT").join("-")}` as `--var-${string}`;

const collectProperties = (tokens: TokenTree, parts: readonly string[], properties: ThemeCssProperties) => {
    for (const [key, value] of Object.entries(tokens)) {
        const nextParts = [...parts, key];
        if (isTokenTree(value)) collectProperties(value, nextParts, properties);
        else properties[tokenName(nextParts)] = value;
    }
};

export const createThemeProperties = (theme: ThemeTokens = {}, options: ThemeCssOptions = {}): ThemeCssProperties => {
    const merged = mergeThemeTokens(options.base ?? defaultLightThemeTokens, theme);
    const properties: ThemeCssProperties = {};

    for (const [group, prefix] of Object.entries(groupPrefixes)) {
        const tokens = merged[group as keyof ThemeTokens];
        if (tokens) collectProperties(tokens, prefix, properties);
    }

    return properties;
};

const cssEscape = (value: string) => value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');

const createSelector = (options: ThemeCssOptions) => {
    if (options.selector) return options.selector;
    if (options.name) return `[${THEME_ATTRIBUTE}="${cssEscape(options.name)}"]`;
    return ":root";
};

export const createThemeCss = (theme: ThemeTokens = {}, options: ThemeCssOptions = {}) => {
    const selector = createSelector(options);
    const properties = createThemeProperties(theme, options);
    const declarations = Object.entries(properties)
        .map(([key, value]) => `    ${key}: ${value};`)
        .join("\n");
    const content = `${selector} {\n${declarations}\n}`;

    if (options.layer !== true) return content;
    return `@layer var.tokens, var.base, var.components, var.utilities;\n\n@layer var.tokens {\n${content}\n}`;
};

export const applyTheme = (target: HTMLElement | null | undefined, theme: ThemeTokens = {}, options: ThemeCssOptions = {}) => {
    if (!target) return;
    const properties = createThemeProperties(theme, options);
    for (const [key, value] of Object.entries(properties)) target.style.setProperty(key, value);
};

export const registerTheme = (name: string, theme: ThemeTokens = {}, options: ThemeStyleElementOptions = {}) => {
    const css = createThemeCss(theme, { ...options, name });
    const ownerDocument = options.document ?? globalThis.document;
    if (!ownerDocument) return css;

    const id = options.id ?? `g4rcez-theme-${name}`;
    let style = ownerDocument.getElementById(id) as HTMLStyleElement | null;
    if (!style) {
        style = ownerDocument.createElement("style");
        style.id = id;
        style.dataset.g4Theme = name;
        ownerDocument.head.append(style);
    }
    style.textContent = css;
    return css;
};
