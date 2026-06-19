/// <reference types="vitest" />
import { readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const componentsRoot = "src/components";
const componentEntryExtensions = new Set([".ts", ".tsx"]);
const ignoredComponentEntries = [/\.types\.ts$/, /\.utils\.ts$/, /\.styles\.ts$/, /\.context\.tsx$/];
const externalPackages = new Set(["react", "react-dom", "use-sync-external-store"]);

function isExternalDependency(id: string) {
    return externalPackages.has(id) || [...externalPackages].some((pkg) => id.startsWith(`${pkg}/`));
}

function toPosixPath(path: string) {
    return path.replaceAll("\\", "/");
}

function componentEntryName(path: string) {
    return toPosixPath(relative("src", path)).replace(/\.(?:m|c)?tsx?$/, "");
}

function getComponentEntries(directory = componentsRoot): Record<string, string> {
    const entries: Record<string, string> = {};
    for (const file of readdirSync(directory, { withFileTypes: true })) {
        const path = toPosixPath(join(directory, file.name));
        if (file.isDirectory()) {
            Object.assign(entries, getComponentEntries(path));
            continue;
        }
        if (path === `${componentsRoot}/index.ts`) continue;
        if (!componentEntryExtensions.has(extname(path))) continue;
        if (ignoredComponentEntries.some((pattern) => pattern.test(path))) continue;
        const key = componentEntryName(path);
        console.log({ key, directory, path });
        entries[key] = `./${path}`;
    }
    return entries;
}

export default defineConfig({
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
                ...getComponentEntries(),
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
});
