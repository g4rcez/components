import type { ThemeConfiguration } from "@g4rcez/components";

export const docsThemes = [
    {
        name: "default",
        tokens: { "motion-duration-normal": "180ms" },
        components: {
            button: { "secondary-background": "hsla(188, 86%, 94%, 1)" },
        },
    },
    {
        name: "dark",
        components: {
            button: { rounded: "0px" },
        },
    },
] satisfies readonly ThemeConfiguration[];
