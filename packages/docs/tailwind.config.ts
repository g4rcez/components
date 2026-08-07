import type { Config } from "tailwindcss";
import preset from "../lib/preset.tailwind.ts";

const config: Config = {
    presets: [preset],
    darkMode: "class",
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "../lib/src/**/*.{js,ts,jsx,tsx,mdx,css}"],
    plugins: [],
};

export default config;
