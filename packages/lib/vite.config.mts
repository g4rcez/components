import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfig from "vite-tsconfig-paths";

/// <reference types="vitest" />
export default defineConfig({
    plugins: [react(), tsconfig({ configNames: ["tsconfig.lib.json"] })],
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
            name: "components",
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["es", "umd", "cjs"],
        },
        rollupOptions: {
            treeshake: true,
            external: ["react", "react/jsx-runtime", "react-dom", "tailwindcss"],
            output: {
                globals: {
                    react: "React",
                    "react/jsx-runtime": "react/jsx-runtime",
                    "react-dom": "ReactDOM",
                    tailwindcss: "tailwindcss",
                },
            },
        },
    },
});
