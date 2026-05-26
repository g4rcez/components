/// <reference types="vitest" />
import { readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfig from "vite-tsconfig-paths";

const componentsRoot = "src/components";
const componentEntryExtensions = new Set([".ts", ".tsx"]);
const ignoredComponentEntries = [/\.types\.ts$/, /\.utils\.ts$/, /\.context\.tsx$/];

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

        entries[componentEntryName(path)] = `./${path}`;
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
                ...getComponentEntries(),
            },
            formats: ["es"],
        },
        rollupOptions: {
            treeshake: true,
            external: ["react", "react/jsx-runtime", "react-dom", "tailwindcss"],
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name]-[hash].js",
            },
        },
    },
});
