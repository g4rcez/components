import { DesignTokens } from "./theme.types";

export const defaultDarkTheme: DesignTokens = {
    name: "dark",
    rounded: {
        pill: "2rem",
        card: "0.75rem"
    },
    spacing: {
        base: "1rem",
        lg: "1.5rem",
        sm: "0.75rem",
    },
    colors: {
        foreground: "hsla(210, 40%, 98%)",
        background: "hsla(0, 0%, 9%)",
        accent: "hsla(199, 89%, 54%)",
        disabled: "hsla(240, 4%, 33%)",
        primary: {
            foreground: "hsla(210, 40%, 98%)",
            DEFAULT: "hsla(199, 89%, 54%)",
            subtle: "hsla(199, 95%, 87%)",
            hover: "hsla(199, 97%, 40%)",
        },
        secondary: {
            DEFAULT: "hsla(210, 14%, 35%)",
            subtle: "hsla(210, 27%, 88%)",
            hover: "hsla(210, 21%, 27%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        info: {
            DEFAULT: "hsla(219, 91%, 59%)",
            subtle: "hsla(219, 93%, 77%)",
            hover: "hsla(219, 83%, 41%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        warn: {
            DEFAULT: "hsla(25, 95%, 53%)",
            subtle: "hsla(45, 95%, 66%)",
            hover: "hsla(35, 92%, 41%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        danger: {
            DEFAULT: "hsla(358, 75%, 59%)",
            subtle: "hsla(0, 94%, 81%)",
            hover: "hsla(0, 82%, 47%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        success: {
            DEFAULT: "hsla(160, 73%, 36%)",
            subtle: "hsla(160, 75%, 75%)",
            hover: "hsla(160, 91%, 27%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        input: {
            border: "hsla(240, 4%, 25%)",
            placeholder: "hsla(210, 24%, 71%)",
            "mask-error": "hsla(0, 94%, 81%)",
            "switch-bg": "hsla(0, 0%, 9%)",
            switch: "hsla(0, 0%, 100%)",
        },
        card: {
            background: "hsla(0, 0%, 15%)",
            border: "hsla(240, 7%, 27%)",
        },
        floating: {
            background: "hsla(0, 0%, 14%)",
            border: "hsla(240, 7%, 27%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        tooltip: {
            background: "hsla(0, 0%, 8%)",
            border: "hsla(0, 0%, 15%)",
        },
        table: {
            background: "hsla(0, 0%, 15%)",
            border: "hsla(240, 4%, 33%)",
        },
    },
};

export const defaultLightTheme: DesignTokens = {
    name: "light",
    spacing: {
        base: "1rem",
        lg: "1.5rem",
        sm: "0.75rem",
    },
    rounded: {
        pill: "2rem",
        card: "0.75rem"
    },
    colors: {
        foreground: "hsla(210, 14%, 27%)",
        background: "hsla(210, 34%, 96%)",
        accent: "hsla(199, 89%, 54%)",
        disabled: "hsla(240, 4%, 33%)",
        primary: {
            foreground: "hsla(210, 40%, 98%)",
            DEFAULT: "hsla(199, 89%, 54%)",
            subtle: "hsla(199, 95%, 87%)",
            hover: "hsla(199, 97%, 40%)",
        },
        secondary: {
            DEFAULT: "hsla(210, 14%, 35%)",
            subtle: "hsla(210, 27%, 88%)",
            hover: "hsla(210, 21%, 27%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        info: {
            DEFAULT: "hsla(219, 91%, 59%)",
            subtle: "hsla(219, 93%, 77%)",
            hover: "hsla(219, 83%, 41%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        danger: {
            DEFAULT: "hsla(0, 82%, 63%)",
            subtle: "hsla(0, 94%, 81%)",
            hover: "hsla(0, 82%, 47%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        warn: {
            DEFAULT: "hsla(25, 95%, 53%)",
            subtle: "hsla(45, 95%, 66%)",
            hover: "hsla(35, 92%, 41%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        success: {
            DEFAULT: "hsla(160, 73%, 36%)",
            subtle: "hsla(160, 75%, 75%)",
            hover: "hsla(160, 91%, 27%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        input: {
            border: "hsla(218, 22%, 80%)",
            placeholder: "hsla(210, 24%, 71%)",
            "mask-error": "hsla(0, 94%, 81%)",
            "switch-bg": "hsla(0, 0%, 9%)",
            switch: "hsla(0, 0%, 100%)",
        },
        card: {
            background: "hsla(0, 0%, 100%)",
            border: "hsla(210, 25%, 88%)",
        },
        floating: {
            background: "hsla(0, 0%, 100%)",
            border: "hsla(210, 25%, 88%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        tooltip: {
            background: "hsla(0, 0%, 8%)",
            border: "hsla(0, 0%, 15%)",
        },
        table: {
            background: "hsla(0, 0%, 100%)",
            border: "hsla(210, 25%, 88%)",
        },
    },
};
