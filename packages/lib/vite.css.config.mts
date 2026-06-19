/// <reference types="vitest" />
import { glob } from "glob";
import { basename, join, resolve } from "node:path";
import { defineConfig, ViteUserConfig } from "vitest/config";

const root = import.meta.dirname;

function toPosixPath(path: string) {
    return path.replaceAll("\\", "/");
}

async function getComponentEntries(directory: string): Promise<Record<string, string>> {
    const components = await glob(join(directory, "**", "*.css"));
    return components.reduce<Record<string, string>>((acc, el) => {
        const key = basename(toPosixPath(el), ".css");
        return { ...acc, [key]: el };
    }, {});
}

export default defineConfig(
    async (): Promise<ViteUserConfig> => ({
        css: {
            devSourcemap: true,
        },
        build: {
            outDir: "./dist",
            emptyOutDir: false,
            sourcemap: true,
            cssCodeSplit: true,
            cssMinify: true,
            rollupOptions: {
                input: {
                    ...(await getComponentEntries("./src/components/")),
                    tokens: resolve(root, "src/styles/tokens.css"),
                    base: resolve(root, "src/styles/base.css"),
                    foundation: resolve(root, "src/styles/foundation.css"),
                    index: resolve(root, "src/styles/index.css"),
                },
                output: {
                    entryFileNames: "css-entry-[name].js",
                    chunkFileNames: "css-entry-[name]-[hash].js",
                    assetFileNames: (assetInfo) => {
                        const name = assetInfo.names?.[0] ?? assetInfo.name ?? "asset";
                        if (name.endsWith(".css")) return "css/[name][extname]";
                        if (name.endsWith(".css.map")) return "css/[name][extname]";
                        return "assets/[name]-[hash][extname]";
                    },
                },
            },
        },
    })
);
