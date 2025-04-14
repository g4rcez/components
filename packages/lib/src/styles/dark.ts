import { rounded, spacing, zIndex } from "./common";
import { DesignTokens } from "./theme.types";

export const DARK_THEME: DesignTokens = {
    name: "dark",
    zIndex,
    rounded,
    spacing,
    shadow: {
        floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 5px 12px",
    },
    colors: {
        foreground: "hsla(210, 50%, 98%)",
        background: "hsla(0, 0%, 9%)",
        muted: "hsla(0, 0%, 12%)",
        disabled: "hsla(240, 4%, 33%)",
        emphasis: {
            foreground: "hsla(251, 91%, 95%)",
            DEFAULT: "hsla(255, 92%, 76%)",
            subtle: "hsla(252, 95%, 85%)",
            hover: "hsla(262, 83%, 58%)",
        },
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
            notification: "hsla(219, 91%, 59%)",
        },
        warn: {
            DEFAULT: "hsla(27, 96%, 61%)",
            subtle: "hsla(45, 95%, 66%)",
            hover: "hsla(21, 90%, 48%)",
            foreground: "hsla(210, 40%, 98%)",
            notification: "hsla(32, 65%, 75%)",
        },
        danger: {
            DEFAULT: "hsla(358, 65%, 57%)",
            subtle: "hsla(0, 94%, 81%)",
            hover: "hsla(0, 82%, 47%)",
            foreground: "hsla(210, 40%, 98%)",
            notification: "hsla(358, 40%, 23%)",
        },
        success: {
            DEFAULT: "hsla(160, 73%, 36%)",
            subtle: "hsla(160, 75%, 75%)",
            hover: "hsla(160, 91%, 27%)",
            foreground: "hsla(160, 91%, 50%)",
            notification: "hsla(161,62%,17%)",
        },
        input: {
            border: "hsla(240, 4%, 25%)",
            placeholder: "hsla(210, 24%, 71%)",
            "mask-error": "hsla(0, 94%, 81%)",
            "switch-bg": "hsla(0, 0%, 9%)",
            switch: "hsla(0, 0%, 100%)",
        },
        card: {
            muted: "hsla(0, 0%, 22%)",
            border: "hsla(240, 7%, 27%)",
            background: "hsla(0, 0%, 15%)",
        },
        floating: {
            foreground: "hsla(210, 40%, 98%)",
            background: "hsla(0, 0%, 14%)",
            hover: "hsla(221, 10%, 22%)",
            border: "hsla(240, 7%, 27%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        tooltip: {
            foreground: "hsla(210, 40%, 98%)",
            background: "hsla(0, 0%, 8%)",
            hover: "hsla(221, 10%, 35%)",
            border: "hsla(0, 0%, 19%)",
            overlay: "hsla(0, 0%, 0%)",
        },
        table: {
            header: "hsla(0, 0%, 12%)",
            border: "hsla(240, 4%, 33%)",
            background: "hsla(0, 0%, 15%)",
        },
        button: {
            primary: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
            },
            warn: {
                text: "hsla(26,100%,67%)",
                bg: "hsla(37,100%,15%)",
            },
            info: {
                text: "hsla(200,80%,70%)",
                bg: "hsla(206,66%,24%)",
            },
            success: {
                text: "hsla(151,65%,54%)",
                bg: "hsla(154,52%,19%)",
            },
            danger: {
                text: "hsla(2,100%,90%)",
                bg: "hsla(5,62%,23%)",
            },
            muted: {
                text: "hsla(0, 100%, 100%)",
                bg: "hsla(0, 0%, 12%)",
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
            primary: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
            },
            warn: {
                text: "hsla(26,100%,67%)",
                bg: "hsla(37,100%,15%)",
            },
            info: {
                text: "hsla(200,80%,70%)",
                bg: "hsla(206,66%,24%)",
            },
            success: {
                text: "hsla(151,65%,54%)",
                bg: "hsla(154,52%,19%)",
            },
            danger: {
                text: "hsla(2,100%,79%)",
                bg: "hsla(5,62%,23%)",
            },
            neutral: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
            },
            secondary: {
                text: "hsla(216,10%,90%)",
                bg: "hsla(214,7%,19%)",
            },
            muted: {
                text: "hsla(0, 100%, 100%)",
                bg: "hsla(0, 0%, 12%)",
            },
        },
        alert: {
            primary: {
                text: "hsla(210,100%,72%)",
                border: "hsla(212,69%,16%)",
                bg: "hsla(215,42%,9%)",
            },
            warn: {
                bg: "hsla(28,33%,9%)",
                border: "hsla(29,65%,12%)",
                text: "hsla(27,100%,78%)"
            },
            info: {
                text: "hsla(253,100%,83%)",
                bg: "hsla(263,28%,11%)",
                border: "hsla(252,34%,51%)",
            },
            success: {
                text: "hsla(144,79%,79%)",
                bg: "hsla(153,20%,9%)",
                border: "hsla(144,70%,14%)",
            },
            danger: {
                text: "hsla(350,100%,91%)",
                bg: "hsla(355,25%,15%)",
                border: "hsla(355,25%,10%)",
            },
            neutral: {
                text: "hsla(200,98%,60%)",
                bg: "hsla(200,28%,19%)",
                border: "hsla(200,90%,89%)",
            },
            secondary: {
                text: "hsla(220,9%,94%)",
                bg: "hsla(220,6%,10%)",
                border: "hsla(214,7%,19%)",
            },
            muted: {
                bg: "hsla(0, 0%, 12%)",
                border: "hsla(0, 0%, 40%)",
                text: "hsla(0, 100%, 100%)",
            },
        },
    },
};
