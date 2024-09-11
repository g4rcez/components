import { DesignTokens } from "./theme.types";

export const defaultDarkTheme: DesignTokens = {
    name: "dark",
    spacing: { base: "1rem", lg: "1.5rem", sm: "0.75rem" },
    shadow: {
        floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 5px 12px",
    },
    rounded: {
        pill: "2rem",
        card: "0.75rem",
        full: "9999px",
    },
    colors: {
        foreground: "hsla(210, 50%, 98%)",
        background: "hsla(0, 0%, 9%)",
        disabled: "hsla(240, 4%, 33%)",
        primary: {
            foreground: "hsla(210, 40%, 98%)",
            DEFAULT: "hsla(200,98%,39%)",
            subtle: "hsla(199, 95%, 87%)",
            hover: "hsla(199, 97%, 40%)",
        },
        secondary: {
            DEFAULT: "hsla(210, 32%, 70%)",
            background: "hsla(210, 30%, 81%)",
            subtle: "hsla(210, 27%, 88%)",
            hover: "hsla(210, 10%, 58%)",
            foreground: "hsla(210, 20%, 30%)",
        },
        info: {
            DEFAULT: "hsla(219, 91%, 59%)",
            subtle: "hsla(219, 93%, 77%)",
            hover: "hsla(219, 83%, 41%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        warn: {
            DEFAULT: "hsla(27, 96%, 61%)",
            subtle: "hsla(45, 95%, 66%)",
            hover: "hsla(21, 90%, 48%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        danger: {
            DEFAULT: "hsla(358, 65%, 57%)",
            subtle: "hsla(0, 94%, 81%)",
            hover: "hsla(0, 82%, 47%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        success: {
            DEFAULT: "hsla(160, 73%, 36%)",
            subtle: "hsla(160, 75%, 75%)",
            hover: "hsla(160, 91%, 27%)",
            foreground: "hsla(160, 91%, 50%)",
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
            foreground: "hsla(210, 40%, 98%)",
            background: "hsla(0, 0%, 8%)",
            border: "hsla(0, 0%, 19%)",
        },
        table: {
            background: "hsla(0, 0%, 15%)",
            border: "hsla(240, 4%, 33%)",
        },
    },
};

export const defaultLightTheme: DesignTokens = {
    name: "light",
    shadow: {
        floating: "rgba(50, 50, 50, 0.1) 0px 0px 0px 1px, rgba(50, 50, 50, 0.1) 0px 3px 6px, rgba(50, 50, 50, 0.1) 0px 2px 3px",
    },
    spacing: {
        base: "1rem",
        lg: "1.5rem",
        sm: "0.75rem",
    },
    rounded: {
        pill: "2rem",
        card: "0.75rem",
        full: "9999px",
    },
    colors: {
        foreground: "hsla(217, 15%, 20%)",
        background: "hsla(210, 34%, 96%)",
        disabled: "hsla(240, 10%, 75%)",
        primary: {
            foreground: "hsla(210, 40%, 98%)",
            DEFAULT: "hsla(199, 89%, 54%)",
            subtle: "hsla(199, 95%, 87%)",
            hover: "hsla(199, 97%, 40%)",
        },
        secondary: {
            background: "hsla(210, 25%, 35%)",
            DEFAULT: "hsla(210, 25%, 35%)",
            subtle: "hsla(207, 29%, 39%)",
            hover: "hsla(210, 21%, 67%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        info: {
            DEFAULT: "hsla(219, 91%, 59%)",
            subtle: "hsla(219, 70%, 90%)",
            hover: "hsla(219, 83%, 41%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        danger: {
            DEFAULT: "hsla(0, 82%, 63%)",
            subtle: "hsla(0, 96%, 95%)",
            hover: "hsla(0, 82%, 47%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        warn: {
            DEFAULT: "hsla(27, 100%, 70%)",
            subtle: "hsla(45, 95%, 80%)",
            hover: "hsla(29, 85%, 50%)",
            foreground: "hsla(210, 34%, 96%)",
        },
        success: {
            DEFAULT: "hsla(160, 73%, 36%)",
            subtle: "hsla(160, 75%, 90%)",
            hover: "hsla(160, 91%, 27%)",
            foreground: "hsla(160, 91%, 17%)",
        },
        input: {
            border: "hsla(218, 22%, 80%)",
            placeholder: "hsla(210, 24%, 71%)",
            "mask-error": "hsla(0, 94%, 81%)",
            "switch-bg": "hsla(0, 0%, 45%)",
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
            foreground: "hsla(210, 40%, 98%)",
            background: "hsla(0, 0%, 8%)",
            border: "hsla(0, 0%, 85%)",
        },
        table: {
            background: "hsla(0, 0%, 100%)",
            border: "hsla(210, 25%, 88%)",
        },
    },
};
