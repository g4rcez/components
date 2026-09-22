import type { OxfmtConfig } from "oxfmt";

// Keep the configuration in CommonJS, matching the root package.
declare const module: { exports: OxfmtConfig };

module.exports = {
    printWidth: 150,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    sortTailwindcss: {
        config: "./packages/docs/tailwind.config.ts",
        functions: ["cn", "cva", "clsx", "css"],
    },
} satisfies OxfmtConfig;
