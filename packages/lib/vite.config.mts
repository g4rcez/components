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
            entry: {
                index: "./src/index.ts",
                "components/core/button": "./src/components/core/button.tsx",
                "components/core/tag": "./src/components/core/tag.tsx",
                "components/form/form": "./src/components/form/form.tsx",
                "components/form/transfer-list": "./src/components/form/transfer-list.tsx",
                "components/form/radiobox": "./src/components/form/radiobox.tsx",
                "components/form/date-picker": "./src/components/form/date-picker.tsx",
                "components/form/task-list": "./src/components/form/task-list.tsx",
                "components/form/checkbox": "./src/components/form/checkbox.tsx",
                "components/form/input": "./src/components/form/input.tsx",
                "components/form/autocomplete": "./src/components/form/autocomplete.tsx",
                "components/form/switch": "./src/components/form/switch.tsx",
                "components/form/file-upload": "./src/components/form/file-upload.tsx",
                "components/form/select": "./src/components/form/select.tsx",
                "components/floating/expand": "./src/components/floating/expand.tsx",
                "components/floating/dropdown": "./src/components/floating/dropdown.tsx",
                "components/floating/modal": "./src/components/floating/modal.tsx",
                "components/floating/tooltip": "./src/components/floating/tooltip.tsx",
                "components/floating/menu": "./src/components/floating/menu.tsx",
                "components/display/notifications": "./src/components/display/notifications.tsx",
                "components/display/timeline": "./src/components/display/timeline.tsx",
                "components/display/list": "./src/components/display/list.tsx",
                "components/display/calendar": "./src/components/display/calendar.tsx",
                "components/display/card": "./src/components/display/card.tsx",
                "components/display/tabs": "./src/components/display/tabs.tsx",
                "components/display/stats": "./src/components/display/stats.tsx",
                "components/display/alert": "./src/components/display/alert.tsx",
                "components/table/table": "./src/components/table/index.tsx",
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
