/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { glob } from "glob";
import { basename, join } from "node:path";
import { defineConfig, ViteUserConfig } from "vitest/config";

const externalPackages = new Set(["react", "react-dom", "use-sync-external-store"]);

function isExternalDependency(id: string) {
    return externalPackages.has(id) || [...externalPackages].some((pkg) => id.startsWith(`${pkg}/`));
}

function toPosixPath(path: string) {
    return path.replaceAll("\\", "/");
}

async function getComponentEntries(directory: string): Promise<Record<string, string>> {
    const components = await glob(join(directory, "**", "*.tsx"));
    return components.reduce<Record<string, string>>((acc, el) => {
        const key = basename(toPosixPath(el), ".tsx");
        return { ...acc, [key]: el };
    }, {});
}

export default defineConfig(
    async (): Promise<ViteUserConfig> => ({
        plugins: [react()],
        resolve: { tsconfigPaths: true },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: ["./tests/setup.ts"],
        },
        build: {
            sourcemap: true,
            outDir: "./dist",
            emptyOutDir: false,
            lib: {
                entry: {
                    index: "./src/index.ts",
                    "styles/theme": "./src/styles/theme.ts",
                    "styles/design-tokens": "./src/styles/design-tokens.ts",
                    "styles/theme-runtime": "./src/styles/theme-runtime.ts",
                    "styles/tokens": "./src/styles/tokens.ts",
                    "styles/style-manifest": "./src/styles/style-manifest.ts",
                    ...(await getComponentEntries("src/components")),
                },
                formats: ["es"],
            },
            rollupOptions: {
                treeshake: true,
                external: isExternalDependency,
                output: {
                    entryFileNames: "[name].mjs",
                    chunkFileNames: "[name]-[hash].mjs",
                },
            },
        },
    })
);
