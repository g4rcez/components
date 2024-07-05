import type { Config } from "tailwindcss";
import preset from "./styles.config";

const config: Config = {
    presets: [preset],
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
};
export default config;
