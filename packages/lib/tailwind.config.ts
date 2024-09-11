import type { Config } from "tailwindcss";
import preset from "./preset.tailwind";

const withDoc = ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"];
const lib = ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"];

const config: Config = {
    presets: [preset],
    content: process.env.BUILD_LIB === "true" ? lib : withDoc,
};

export default config;
