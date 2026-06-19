import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function toPosixPath(path) {
    return path.replaceAll("\\", "/");
}

function toSourcePath(path, from = root) {
    return toPosixPath(relative(from, path));
}

async function getComponentEntries(directory) {
    const components = (await glob(join(directory, "**", "*.css"))).sort();
    return components.reduce((acc, el) => {
        const key = `${basename(toPosixPath(el), ".css")}.css`;
        return { ...acc, [key]: [toSourcePath(el)] };
    }, {});
}

const componentEntries = await getComponentEntries(resolve(root, "src/components"));
const componentSources = Object.values(componentEntries).flat();

const entries = {
    ...componentEntries,
    "tokens.css": ["src/styles/tokens.css"],
    "base.css": ["src/styles/base.css"],
    "foundation.css": ["src/styles/foundation.css", "src/styles/tokens.css", "src/styles/base.css"],
    "index.css": ["src/styles/index.css", "src/styles/foundation.css", "src/styles/tokens.css", "src/styles/base.css", ...componentSources],
};

for (const [file, sources] of Object.entries(entries)) {
    const cssPath = resolve(root, "dist/css", file);
    if (!existsSync(cssPath)) continue;

    const mapFile = `${file}.map`;
    const mapPath = resolve(root, "dist/css", mapFile);
    const mapDirectory = dirname(mapPath);
    const css = readFileSync(cssPath, "utf8").replace(/\/\*# sourceMappingURL=.*?\*\/\s*$/u, "");
    const sourceMap = {
        version: 3,
        file,
        sources: sources.map((source) => toSourcePath(resolve(root, source), mapDirectory)),
        sourcesContent: sources.map((source) => readFileSync(resolve(root, source), "utf8")),
        names: [],
        mappings: "",
    };

    writeFileSync(mapPath, `${JSON.stringify(sourceMap)}\n`);
    writeFileSync(cssPath, `${css}\n/*# sourceMappingURL=${mapFile} */\n`);
}
