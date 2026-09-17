import { defineConfig } from "tsdown";

export default defineConfig({
    entry: {
        index: "src/index.ts",
        // The Tailwind oracle's worker thread; loaded by URL from index.
        "tailwind-worker": "src/tailwind/worker.ts",
    },
    // ESM only: Node 20.19+ and 22.12+ require() ESM without a flag, and
    // Oxlint loads the plugin as an ES module.
    format: ["esm"],
    dts: true,
    hash: false,
    // The host components package is not type=module; keep copied files explicit ESM.
    fixedExtension: true,
    target: "es2022",
    minify: false,
    clean: true,
});
