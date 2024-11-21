import { Config } from "tailwindcss";
import { createDesignTokens, parsers } from "./src/styles/design-tokens";
import { defaultLightTheme as theme } from "./src/styles/theme";
declare const config: Partial<Config>;
export { createDesignTokens, parsers, theme };
export default config;
//# sourceMappingURL=preset.tailwind.d.ts.map