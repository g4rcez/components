import { rounded, spacing, zIndex } from "./common";
import { DesignTokens } from "./theme.types";

export const DARK_THEME: DesignTokens = {
    name: "dark",
    zIndex,
    rounded,
    spacing,
    shadow: {
        "shadow-notification": "1px 2px 2px 2px hsla(210, 15%, 20%,  0.15)",
        "shadow-floating": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "shadow-card": "0px 1px 1px 1px hsla(210, 25%, 20%,  0.1)",
        "shadow-table": "0px 1px 1px 1px hsla(210, 25%, 20%,  0.1)",
    },
    colors: {
        foreground: "hsla(240, 5%, 96%)",
        background: "hsla(240, 10%, 8%)",
        border: "hsla(240, 4%, 16%)",
        disabled: "hsla(240, 4%, 16%)",
        muted: {
            DEFAULT: "hsla(240, 4%, 16%)",
            foreground: "hsla(240, 5%, 65%)",
            subtle: "hsla(240, 5%, 65%)",
            hover: "hsla(240, 4%, 20%)",
        },
        emphasis: {
            foreground: "hsla(199, 89%, 48%)",
            DEFAULT: "hsla(199, 89%, 10%)",
            subtle: "hsla(199, 89%, 15%)",
            hover: "hsla(199, 89%, 40%)",
        },
        primary: {
            foreground: "hsla(240, 6%, 10%)",
            DEFAULT: "hsla(201,49%,54%)",
            subtle: "hsla(201,49%,36%)",
            hover: "hsla(201,49%,22%)",
        },
        secondary: {
            DEFAULT: "hsla(240, 5%, 96%)",
            background: "hsla(240, 4%, 16%)",
            subtle: "hsla(240, 4%, 20%)",
            hover: "hsla(240, 4%, 25%)",
            foreground: "hsla(240, 5%, 96%)",
        },
        info: {
            DEFAULT: "hsla(199, 89%, 48%)",
            subtle: "hsla(199, 89%, 15%)",
            hover: "hsla(199, 89%, 40%)",
            foreground: "hsla(0, 0%, 100%)",
            notification: "hsla(199, 89%, 48%)",
        },
        danger: {
            DEFAULT: "hsla(0, 84%, 60%)",
            subtle: "hsla(0, 84%, 15%)",
            hover: "hsla(0, 84%, 50%)",
            foreground: "hsla(0, 0%, 100%)",
            notification: "hsla(0, 84%, 60%)",
        },
        warn: {
            DEFAULT: "hsla(38, 92%, 50%)",
            subtle: "hsla(38, 92%, 15%)",
            hover: "hsla(38, 92%, 45%)",
            foreground: "hsla(240, 10%, 4%)",
            notification: "hsla(38, 92%, 50%)",
        },
        success: {
            DEFAULT: "hsla(142, 71%, 45%)",
            subtle: "hsla(142, 71%, 15%)",
            hover: "hsla(142, 71%, 40%)",
            foreground: "hsla(240, 10%, 4%)",
            notification: "hsla(142, 71%, 45%)",
        },
        input: {
            border: "hsla(240, 4%, 16%)",
            placeholder: "hsla(240, 5%, 65%)",
            "mask-error": "hsla(0, 84%, 20%)",
            "switch-bg": "hsla(240, 4%, 16%)",
            switch: "hsla(0, 0%, 100%)",
            slider: "hsla(0, 0%, 100%)",
        },
        card: {
            muted: "hsla(240, 4%, 10%)",
            border: "hsla(240, 4%, 11%)",
            background: "hsla(221, 16%, 9%)",
        },
        floating: {
            foreground: "hsla(240, 5%, 96%)",
            background: "hsla(240, 10%, 8%)",
            hover: "hsla(240, 4%, 16%)",
            border: "hsla(240, 4%, 16%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        tooltip: {
            foreground: "hsla(240, 10%, 4%)",
            background: "hsla(0, 0%, 100%)",
            hover: "hsla(0, 0%, 100%)",
            border: "hsla(0, 0%, 100%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        table: {
            header: "hsla(240, 4%, 10%)",
            border: "hsla(240, 4%, 16%)",
            background: "hsla(240, 10%, 4%)",
        },
        button: {
            primary: {
                text: "hsla(221, 52%, 100%)",
                bg: "hsla(201,49%,42%)",
            },
            warn: {
                text: "hsla(240, 10%, 4%)",
                bg: "hsla(38, 92%, 50%)",
            },
            info: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(199, 89%, 48%)",
            },
            success: {
                text: "hsla(240, 10%, 4%)",
                bg: "hsla(142, 71%, 45%)",
            },
            danger: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(0, 84%, 60%)",
            },
            muted: {
                text: "hsla(240, 5%, 96%)",
                bg: "hsla(240, 4%, 16%)",
            },
            neutral: {
                text: "hsla(240, 5%, 96%)",
                bg: "hsla(240, 4%, 16%)",
            },
            secondary: {
                text: "hsla(240, 10%, 4%)",
                bg: "hsla(0, 0%, 100%)",
            },
        },
        tag: {
            primary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(240, 4%, 20%)",
            },
            warn: {
                text: "hsla(38, 92%, 70%)",
                bg: "hsla(38, 92%, 15%)",
            },
            info: {
                text: "hsla(199, 89%, 70%)",
                bg: "hsla(199, 89%, 15%)",
            },
            success: {
                text: "hsla(142, 71%, 70%)",
                bg: "hsla(142, 71%, 15%)",
            },
            danger: {
                text: "hsla(0, 84%, 70%)",
                bg: "hsla(0, 84%, 15%)",
            },
            neutral: {
                text: "hsla(240, 5%, 96%)",
                bg: "hsla(240, 4%, 16%)",
            },
            secondary: {
                text: "hsla(240, 10%, 4%)",
                bg: "hsla(0, 0%, 100%)",
            },
            muted: {
                text: "hsla(240, 5%, 96%)",
                bg: "hsla(240, 4%, 16%)",
            },
        },
        alert: {
            primary: {
                text: "hsla(199, 89%, 80%)",
                border: "hsla(199, 89%, 25%)",
                bg: "hsla(199, 89%, 12%)",
            },
            warn: {
                bg: "hsla(38, 92%, 12%)",
                border: "hsla(38, 92%, 25%)",
                text: "hsla(38, 92%, 80%)",
            },
            info: {
                text: "hsla(199, 89%, 80%)",
                bg: "hsla(199, 89%, 12%)",
                border: "hsla(199, 89%, 25%)",
            },
            success: {
                text: "hsla(142, 71%, 80%)",
                bg: "hsla(142, 71%, 12%)",
                border: "hsla(142, 71%, 25%)",
            },
            danger: {
                text: "hsla(0, 84%, 80%)",
                bg: "hsla(0, 84%, 12%)",
                border: "hsla(0, 84%, 25%)",
            },
            neutral: {
                text: "hsla(240, 5%, 96%)",
                bg: "hsla(240, 4%, 16%)",
                border: "hsla(240, 4%, 20%)",
            },
            secondary: {
                text: "hsla(240, 10%, 4%)",
                bg: "hsla(0, 0%, 100%)",
                border: "hsla(0, 0%, 100%)",
            },
            muted: {
                bg: "hsla(240, 4%, 16%)",
                border: "hsla(240, 4%, 20%)",
                text: "hsla(240, 5%, 96%)",
            },
        },
    },
};
