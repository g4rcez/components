import { glob } from "glob";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, join, relative, resolve } from "node:path";
import { defineConfig, preprocessCSS, type Plugin, type ResolvedConfig } from "vite";

const root = import.meta.dirname;
const entryId = "\0components-css";
// Reuse Vite's installed CSS compiler rather than adding a second compiler dependency.
const require = createRequire(import.meta.url);
const { transform, browserslistToTargets } = createRequire(require.resolve("vite"))("lightningcss") as {
    transform(options: {
        filename: string;
        projectRoot: string;
        code: Uint8Array;
        inputSourceMap?: string;
        minify: boolean;
        sourceMap: boolean;
        targets: Record<string, number>;
    }): { code: Uint8Array; map?: Uint8Array; warnings: { message: string }[] };
    browserslistToTargets(browsers: string[]): Record<string, number>;
};

function cssAssets(entries: Record<string, string>): Plugin {
    let targets: Record<string, number>;
    let config: ResolvedConfig;
    return {
        name: "components-css-assets",
        configResolved(resolved) {
            config = resolved;
            const target = config.build.cssTarget;
            const browsers = (Array.isArray(target) ? target : [target]).filter(
                (browser): browser is string => typeof browser === "string" && browser !== "esnext"
            );
            targets = browserslistToTargets(browsers.map((browser) => browser.replace(/^(\D+)(\d)/u, "$1 $2")));
        },
        resolveId(id) {
            if (id === entryId) return entryId;
        },
        load(id) {
            if (id === entryId) return "export {};";
        },
        async buildStart() {
            // Vite's CSS asset finalizer drops transform maps. Compile and emit each
            // entry here so imports, minification and mappings have one owner.
            const outputDirectory = resolve(root, "dist/css");
            for (const [name, filename] of Object.entries(entries)) {
                // Preserve Vite's PostCSS import maps. Lightning CSS's native
                // multi-file bundler can mismatch source indexes across runs.
                const preprocessed = await preprocessCSS(await readFile(filename, "utf8"), filename, config);
                const inputMap = preprocessed.map;
                if (inputMap && typeof inputMap === "object" && "sources" in inputMap) {
                    inputMap.sources = inputMap.sources.map((source) => relative(root, source).replaceAll("\\", "/"));
                }
                const result = transform({
                    filename,
                    projectRoot: root,
                    code: Buffer.from(preprocessed.code),
                    inputSourceMap: inputMap && typeof inputMap === "object" && "mappings" in inputMap && inputMap.mappings
                        ? JSON.stringify(inputMap)
                        : undefined,
                    minify: true,
                    sourceMap: true,
                    targets,
                });
                for (const warning of result.warnings) this.warn(warning.message);
                if (!result.map) this.error(`CSS compiler did not return a map for ${filename}`);
                const map = JSON.parse(Buffer.from(result.map).toString()) as {
                    file: string;
                    sourceRoot?: string;
                    sources: string[];
                };
                map.file = `${name}.css`;
                map.sources = map.sources.map((source) => {
                    const path = resolve(root, map.sourceRoot ?? "", source);
                    this.addWatchFile(path);
                    return relative(outputDirectory, path).replaceAll("\\", "/");
                });
                delete map.sourceRoot;
                this.emitFile({ type: "asset", fileName: `css/${name}.css.map`, source: JSON.stringify(map) });
                this.emitFile({
                    type: "asset",
                    fileName: `css/${name}.css`,
                    source: `${Buffer.from(result.code).toString()}\n/*# sourceMappingURL=${name}.css.map */\n`,
                });
            }
        },
        generateBundle(_options, output) {
            for (const [name, asset] of Object.entries(output)) {
                if (asset.type === "chunk" && asset.facadeModuleId === entryId) delete output[name];
            }
        },
    };
}

export default defineConfig(async () => {
    const components = await glob(join(root, "src/components/**/*.css"));
    const entries = Object.fromEntries(components.map((file) => [basename(file, ".css"), file]));
    Object.assign(entries, {
        tokens: resolve(root, "src/styles/tokens.css"),
        base: resolve(root, "src/styles/base.css"),
        foundation: resolve(root, "src/styles/foundation.css"),
        index: resolve(root, "src/styles/index.css"),
    });
    return {
        plugins: [cssAssets(entries)],
        css: { devSourcemap: true },
        build: {
            outDir: "./dist",
            emptyOutDir: false,
            rollupOptions: { input: entryId },
        },
    };
});
