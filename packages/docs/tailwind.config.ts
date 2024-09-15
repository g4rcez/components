import preset from "@g4rcez/components/preset/preset.tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [preset],
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../lib/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
};

export default config;
