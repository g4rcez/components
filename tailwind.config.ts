import type { Config } from "tailwindcss";
import preset from "./preset.tailwind";

const content =
    process.env.NODE_ENV === "production" ? ["./src/**/*.{js,ts,jsx,tsx,mdx}"] : ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"];

const config: Config = {
    presets: [preset],
    content,
};

export default config;
