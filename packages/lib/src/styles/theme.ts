import { DesignTokens } from "./theme.types";

const rounded = {
    button: "0.4rem",
    pill: "2rem",
    card: "0.75rem",
    full: "9999px",
};

const spacing = {
    base: "1rem",
    lg: "1.5rem",
    sm: "0.75rem",
    "input-height": "2.5rem",
    "input-x": "0.5rem",
    "input-y": "0.25rem",
    "input-inline": "0.25rem",
    "input-gap": "0.375rem",
};

export const defaultDarkTheme: DesignTokens = {
    name: "dark",
    rounded,
    spacing,
    shadow: {
        floating: "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 5px 12px",
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
        },
    },
};

export const defaultLightTheme: DesignTokens = {
    name: "light",
    rounded,
    spacing,
    shadow: {
        floating: "rgba(50, 50, 50, 0.1) 0px 0px 0px 1px, rgba(50, 50, 50, 0.1) 0px 3px 6px, rgba(50, 50, 50, 0.1) 0px 2px 3px",
    },
    colors: {
        foreground: "hsla(217, 15%, 30%)",
        background: "hsla(210, 34%, 96%)",
        disabled: "hsla(240, 10%, 78%)",
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
            foreground: "hsla(217, 15%, 20%)",
            background: "hsla(210, 25%, 98%)",
            border: "hsla(200, 1%, 80%)",
        },
        table: {
            background: "hsla(0, 0%, 100%)",
            border: "hsla(210, 25%, 88%)",
        },
        button: {
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
    },
};
