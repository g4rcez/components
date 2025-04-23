import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfig from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfig({ configNames: ["tsconfig.lib.json"] })],
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
