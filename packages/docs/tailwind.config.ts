import type { Config } from "tailwindcss";
import preset from "@g4rcez/components/preset/preset.tailwind";

const config: Config = {
  presets: [preset],
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
};

export default config;
