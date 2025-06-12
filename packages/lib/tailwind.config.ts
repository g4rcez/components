import type { Config } from "tailwindcss";
import preset from "./preset.tailwind";

const config: Config = {
    presets: [preset],
    content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
};

export default config;
