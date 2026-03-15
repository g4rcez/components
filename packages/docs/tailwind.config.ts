import type { Config } from "tailwindcss";
import preset from "@g4rcez/components/preset.tailwind";

const config: Config = {
  presets: [preset],
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../lib/src/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  plugins: [],
};

export default config;
