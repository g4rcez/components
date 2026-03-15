import { rounded, spacing, zIndex } from "./common";
import { DesignTokens } from "./theme.types";

export const LIGHT_THEME: DesignTokens = {
    rounded,
    spacing,
    name: "light",
    shadow: {
        "shadow-notification": "1px 2px 2px 2px hsla(210, 25%, 40%, 0.15)",
        "shadow-floating": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "shadow-card": "0px 1px 2px 1px hsla(210, 25%, 20%, 0.1)",
        "shadow-table": "0px 1px 1px 1px hsla(210, 0%, 0%,  0.1)",
    },
    zIndex,
    colors: {
        foreground: "hsla(221, 15%, 23%)",
        background: "hsla(0, 0%, 100%)",
        border: "hsla(240, 6%, 90%)",
        muted: {
            DEFAULT: "hsla(240, 5%, 96%)",
            foreground: "hsla(240, 4%, 46%)",
            subtle: "hsla(240, 4%, 46%)",
            hover: "hsla(240, 5%, 96%)",
        },
        disabled: "hsla(240, 5%, 96%)",
        emphasis: {
            foreground: "hsla(199, 89%, 48%)",
            DEFAULT: "hsla(199, 89%, 96%)",
            subtle: "hsla(199, 89%, 92%)",
            hover: "hsla(199, 89%, 40%)",
        },
        primary: {
            foreground: "hsla(240, 6%, 10%)",
            DEFAULT: "hsla(201,49%,54%)",
            subtle: "hsla(201,49%,36%)",
            hover: "hsla(201,49%,22%)",
        },
        secondary: {
            background: "hsla(240, 5%, 96%)",
            DEFAULT: "hsla(240, 6%, 10%)",
            subtle: "hsla(240, 5%, 96%)",
            hover: "hsla(240, 6%, 15%)",
            foreground: "hsla(0, 0%, 100%)",
        },
        info: {
            DEFAULT: "hsla(199, 89%, 48%)",
            subtle: "hsla(199, 89%, 96%)",
            hover: "hsla(199, 89%, 40%)",
            foreground: "hsla(0, 0%, 100%)",
            notification: "hsla(199, 89%, 48%)",
        },
        danger: {
            DEFAULT: "hsla(0, 84%, 60%)",
            subtle: "hsla(0, 84%, 96%)",
            hover: "hsla(0, 84%, 50%)",
            foreground: "hsla(0, 0%, 100%)",
            notification: "hsla(0, 84%, 60%)",
        },
        warn: {
            DEFAULT: "hsla(38, 92%, 50%)",
            subtle: "hsla(38, 92%, 96%)",
            hover: "hsla(38, 92%, 45%)",
            foreground: "hsla(0, 0%, 100%)",
            notification: "hsla(38, 92%, 50%)",
        },
        success: {
            DEFAULT: "hsla(142, 71%, 45%)",
            subtle: "hsla(142, 71%, 96%)",
            hover: "hsla(142, 71%, 40%)",
            foreground: "hsla(0, 0%, 100%)",
            notification: "hsla(142, 71%, 45%)",
        },
        input: {
            border: "hsla(240, 6%, 90%)",
            placeholder: "hsla(240, 4%, 46%)",
            "mask-error": "hsla(0, 84%, 96%)",
            "switch-bg": "hsla(240, 6%, 90%)",
            switch: "hsla(0, 0%, 100%)",
            slider: "hsla(199, 89%, 48%)",
        },
        card: {
            muted: "hsla(240, 5%, 96%)",
            border: "hsla(240, 6%, 90%)",
            background: "hsla(0, 0%, 100%)",
        },
        floating: {
            foreground: "hsla(240, 10%, 4%)",
            background: "hsla(0, 0%, 100%)",
            hover: "hsla(240, 5%, 96%)",
            border: "hsla(240, 6%, 90%)",
            overlay: "hsla(240, 10%, 4%)",
        },
        tooltip: {
            foreground: "hsla(0, 0%, 100%)",
            background: "hsla(240, 10%, 4%)",
            hover: "hsla(240, 10%, 4%)",
            border: "hsla(240, 10%, 4%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        table: {
            header: "hsla(240, 5%, 96%)",
            background: "hsla(0, 0%, 100%)",
            border: "hsla(240, 6%, 90%)",
        },
        button: {
            muted: {
                bg: "hsla(240, 5%, 96%)",
                text: "hsla(240, 6%, 10%)",
            },
            primary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(201,49%,54%)",
            },
            warn: {
                bg: "hsla(38, 92%, 50%)",
                text: "hsla(0, 0%, 100%)",
            },
            info: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(199, 89%, 48%)",
            },
            success: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(142, 71%, 45%)",
            },
            danger: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(0, 84%, 60%)",
            },
            neutral: {
                text: "hsla(240, 6%, 10%)",
                bg: "hsla(240, 5%, 96%)",
            },
            secondary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(240, 6%, 10%)",
            },
        },
        tag: {
            muted: {
                bg: "hsla(240, 5%, 96%)",
                text: "hsla(240, 4%, 46%)",
            },
            primary: {
                text: "hsla(199, 89%, 48%)",
                bg: "hsla(199, 89%, 96%)",
            },
            warn: {
                bg: "hsla(38, 92%, 96%)",
                text: "hsla(38, 92%, 40%)",
            },
            info: {
                text: "hsla(199, 89%, 40%)",
                bg: "hsla(199, 89%, 96%)",
            },
            success: {
                text: "hsla(142, 71%, 35%)",
                bg: "hsla(142, 71%, 96%)",
            },
            danger: {
                text: "hsla(0, 84%, 45%)",
                bg: "hsla(0, 84%, 96%)",
            },
            neutral: {
                text: "hsla(240, 6%, 10%)",
                bg: "hsla(240, 5%, 96%)",
            },
            secondary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(240, 6%, 10%)",
            },
        },
        alert: {
            muted: {
                bg: "hsla(240, 5%, 96%)",
                text: "hsla(240, 6%, 10%)",
                border: "hsla(240, 6%, 90%)",
            },
            primary: {
                text: "hsla(199, 89%, 40%)",
                border: "hsla(199, 89%, 90%)",
                bg: "hsla(199, 89%, 98%)",
            },
            warn: {
                bg: "hsla(38, 92%, 98%)",
                text: "hsla(38, 92%, 35%)",
                border: "hsla(38, 92%, 90%)",
            },
            info: {
                text: "hsla(199, 89%, 35%)",
                bg: "hsla(199, 89%, 98%)",
                border: "hsla(199, 89%, 90%)",
            },
            success: {
                text: "hsla(142, 71%, 30%)",
                bg: "hsla(142, 71%, 98%)",
                border: "hsla(142, 71%, 90%)",
            },
            danger: {
                text: "hsla(0, 84%, 40%)",
                bg: "hsla(0, 84%, 98%)",
                border: "hsla(0, 84%, 90%)",
            },
            neutral: {
                text: "hsla(240, 6%, 10%)",
                bg: "hsla(240, 5%, 96%)",
                border: "hsla(240, 6%, 90%)",
            },
            secondary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(240, 6%, 10%)",
                border: "hsla(240, 6%, 10%)",
            },
        },
    },
};
