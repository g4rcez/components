import { rounded, spacing, zIndex } from "./common";
import { DesignTokens } from "./theme.types";

export const LIGHT_THEME: DesignTokens = {
    rounded,
    spacing,
    name: "light",
    shadow: {
        "shadow-notification": "1px 2px 2px 2px hsla(210, 25%, 40%,  0.15)",
        "shadow-floating": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "shadow-card": "0px 1px 1px 1px hsla(210, 25%, 20%,  0.1)",
    },
    zIndex,
    colors: {
        foreground: "hsla(217, 15%, 30%)",
        background: "hsla(210, 40%, 98%)",
        border: "hsla(210, 25%, 88%)",
        muted: "hsla(210, 30%, 86%)",
        disabled: "hsla(240, 10%, 78%)",
        emphasis: {
            foreground: "hsla(251,91%,95%)",
            DEFAULT: "hsla(255,92%,76%)",
            subtle: "hsla(252,95%,85%)",
            hover: "hsla(262,83%,58%)",
        },
        primary: {
            foreground: "hsla(210, 40%, 98%)",
            DEFAULT: "hsla(199, 89%, 54%)",
            subtle: "hsla(199, 95%, 87%)",
            hover: "hsla(199, 97%, 40%)",
        },
        secondary: {
            background: "hsla(210, 25%, 35%)",
            DEFAULT: "hsla(210, 25%, 45%)",
            subtle: "hsla(207, 29%, 39%)",
            hover: "hsla(210, 21%, 67%)",
            foreground: "hsla(210, 40%, 98%)",
        },
        info: {
            DEFAULT: "hsla(219, 91%, 59%)",
            subtle: "hsla(219, 70%, 90%)",
            hover: "hsla(219, 83%, 41%)",
            foreground: "hsla(210, 34%, 96%)",
            notification: "hsla(219, 91%, 59%)",
        },
        danger: {
            DEFAULT: "hsla(0, 82%, 63%)",
            subtle: "hsla(0, 96%, 95%)",
            hover: "hsla(0, 82%, 47%)",
            foreground: "hsla(210, 34%, 96%)",
            notification: "hsla(0, 100%, 87%)",
        },
        warn: {
            DEFAULT: "hsla(27, 100%, 70%)",
            subtle: "hsla(45, 95%, 80%)",
            hover: "hsla(29, 85%, 50%)",
            foreground: "hsla(210, 34%, 96%)",
            notification: "hsla(27, 85%, 92%)",
        },
        success: {
            DEFAULT: "hsla(160, 73%, 36%)",
            subtle: "hsla(160, 75%, 90%)",
            hover: "hsla(160, 91%, 27%)",
            foreground: "hsla(160, 91%, 17%)",
            notification: "hsla(160, 75%, 80%)",
        },
        input: {
            border: "hsla(218, 22%, 85%)",
            placeholder: "hsla(210, 24%, 71%)",
            "mask-error": "hsla(0, 94%, 81%)",
            "switch-bg": "hsla(0, 0%, 45%)",
            switch: "hsla(0, 0%, 100%)",
            slider: "hsla(0, 0%, 100%)",
        },
        card: {
            muted: "hsla(210, 25%, 94%)",
            border: "hsla(210, 25%, 95%)",
            background: "hsla(0, 0%, 100%)",
        },
        floating: {
            foreground: "hsla(217, 15%, 20%)",
            background: "hsla(0, 0%, 100%)",
            hover: "hsla(0, 0%, 92%)",
            border: "hsla(210, 25%, 88%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        tooltip: {
            foreground: "hsla(217, 15%, 20%)",
            background: "hsla(210, 25%, 98%)",
            hover: "hsla(210, 25%, 92%)",
            border: "hsla(200, 1%, 80%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        table: {
            header: "hsla(221, 20%, 97%)",
            background: "hsla(0, 0%, 100%)",
            border: "hsla(210, 20%, 92%)",
        },
        button: {
            muted: {
                bg: "hsla(210, 30%, 86%)",
                text: "hsla(210, 10%, 15%)",
            },
            primary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(207,96%,48%)",
            },
            warn: {
                bg: "hsla(26,90%,60%)",
                text: "hsla(0, 0%, 100%)",
            },
            info: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(210,60%,60%)",
            },
            success: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(152,56%,39%)",
            },
            danger: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(10,78%,54%)",
            },
            neutral: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
            },
            secondary: {
                text: "hsla(216,10%,90%)",
                bg: "hsla(214,7%,19%)",
            },
        },
        tag: {
            muted: {
                bg: "hsla(210, 30%, 92%)",
                text: "hsla(210, 10%, 25%)",
            },
            primary: {
                text: "hsla(0, 0%, 100%)",
                bg: "hsla(207,70%,55%)",
            },
            warn: {
                bg: "hsla(30,100%,82%)",
                text: "hsla(23,100%,40%)",
            },
            info: {
                text: "hsla(196,100%,20%)",
                bg: "hsla(197,65%,80%)",
            },
            success: {
                text: "hsla(154,52%,19%)",
                bg: "hsla(152,56%,80%)",
            },
            danger: {
                text: "hsla(10,82%,45%)",
                bg: "hsla(359,94%,92%)",
            },
            neutral: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
            },
            secondary: {
                text: "hsla(216,10%,90%)",
                bg: "hsla(214,7%,19%)",
            },
        },
        alert: {
            muted: {
                bg: "hsla(210, 30%, 86%)",
                text: "hsla(210, 30%, 86%)",
                border: "hsla(210, 10%, 70%)",
            },
            primary: {
                text: "hsla(206,70%,50%)",
                border: "hsla(206,90%,89%)",
                bg: "hsla(205,92%,95%)",
            },
            warn: {
                bg: "hsla(23,100%,96%)",
                text: "hsla(23,93%,53%)",
                border: "hsla(33,100%,85%)",
            },
            info: {
                text: "hsla(252,56%,57%)",
                bg: "hsla(256,100%,95%)",
                border: "hsla(252,76%,84%)",
            },
            success: {
                text: "hsla(152,56%,39%)",
                bg: "hsla(139,47%,93%)",
                border: "hsla(152,58%,78%)",
            },
            danger: {
                text: "hsla(358,69%,55%)",
                bg: "hsla(357,90%,96%)",
                border: "hsla(359,100%,90%)",
            },
            neutral: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
                border: "hsla(200,90%,89%)",
            },
            secondary: {
                text: "hsla(216,10%,10%)",
                bg: "hsla(214,7%,92%)",
                border: "hsla(216,22%,78%)",
            },
        },
    },
};
