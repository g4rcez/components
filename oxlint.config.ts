import { defineConfig } from "oxlint";

export default defineConfig({
    plugins: ["react", "typescript", "jsx-a11y"],
    rules: {
        "react/rules-of-hooks": "error",
        "react/exhaustive-deps": "warn",
    },
    ignorePatterns: ["dist", ".next", "node_modules"],
});
