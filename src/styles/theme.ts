export const defaultDarkTheme = {
    name: "dark",
    spacing: {
        base: "1rem",
        lg: "1.5rem",
        sm: "0.75rem",
    },
    colors: {
        foreground: "#f8fafc",
        background: "#191817",
        accent: "#0ea5e9",
        disabled: "#52525b",
        primary: {
            foreground: "#f8fafc",
            DEFAULT: "#0ea5e9",
            subtle: "#bae6fd",
            hover: "#0284c7",
        },
        secondary: {
            DEFAULT: "#475569",
            subtle: "#cbd5e1",
            hover: "#334155",
        },
        info: {
            DEFAULT: "#3b82f6",
            subtle: "#93c5fd",
            hover: "#1d4ed8",
        },
        danger: {
            DEFAULT: "#ef4444",
            subtle: "#fca5a5",
            hover: "#dc2626",
        },
        success: {
            DEFAULT: "#10b981",
            subtle: "#6ee7b7",
            hover: "#047857",
        },
        input: {
            border: "#52525b",
            placeholder: "#94a3b8",
            "mask-error": "#fca5a5",
            "switch-bg": "#171717",
            switch: "#fff",
        },
        card: {
            background: "#27272a",
            border: "#3f3f46",
            overlay: "#00000080",
        },
        floating: {
            background: "#252525",
            border: "#3f3f46",
            overlay: "#00000080",
        },
        tooltip: {
            background: "#141414",
            border: "#27272a",
        },
        table: {
            background: "#27272a",
            border: "#52525b",
            row: "#3f3f46",
        },
    },
};

export type Theme = typeof defaultDarkTheme;

export const defaultLightTheme: Theme = {
    name: "light",
    spacing: {
        base: "1rem",
        lg: "1.5rem",
        sm: "0.75rem",
    },
    colors: {
        foreground: "#334155",
        background: "#f1f5f9",
        accent: "#0ea5e9",
        disabled: "#52525b",
        primary: {
            foreground: "#f8fafc",
            DEFAULT: "#0ea5e9",
            subtle: "#bae6fd",
            hover: "#0284c7",
        },
        secondary: {
            DEFAULT: "#475569",
            subtle: "#cbd5e1",
            hover: "#334155",
        },
        info: {
            DEFAULT: "#3b82f6",
            subtle: "#93c5fd",
            hover: "#1d4ed8",
        },
        danger: {
            DEFAULT: "#ef4444",
            subtle: "#fca5a5",
            hover: "#dc2626",
        },
        success: {
            DEFAULT: "#10b981",
            subtle: "#6ee7b7",
            hover: "#047857",
        },
        input: {
            border: "#52525b",
            placeholder: "#94a3b8",
            "mask-error": "#fca5a5",
            "switch-bg": "#171717",
            switch: "#fff",
        },
        card: {
            background: "#ffffff",
            border: "#e2e8f0",
            overlay: "#00000080",
        },
        floating: {
            background: "#ffffff",
            border: "#e2e8f0",
            overlay: "#00000080",
        },
        tooltip: {
            background: "#141414",
            border: "#27272a",
        },
        table: {
            background: "#ffffff",
            border: "#e2e8f0",
            row: "#94a3b8",
        },
    },
};
