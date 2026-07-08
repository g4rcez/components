import { copyFileSync, existsSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const componentsRoot = resolve(root, "dist/components");

function toPosixPath(path) {
    return path.replaceAll("\\", "/");
}

function targetFor(file) {
    const relativePath = toPosixPath(relative(componentsRoot, file));
    const parts = relativePath.replace(/\.d\.ts$/u, "").split("/");
    const fileName = parts.at(-1);
    const folderName = parts.at(-2);

    if (parts[0] === "form" && parts[1] === "input" && fileName) return join(componentsRoot, "form", `${fileName}.d.ts`);
    if (fileName && fileName === folderName) return join(dirname(dirname(file)), `${fileName}.d.ts`);
    return undefined;
}

for (const file of globSync(join(componentsRoot, "**/*.d.ts"))) {
    if (basename(file).endsWith(".styles.d.ts")) continue;

    const target = targetFor(file);
    if (!target || target === file) continue;

    copyFileSync(file, target);

    const map = `${file}.map`;
    if (existsSync(map)) copyFileSync(map, `${target}.map`);
}
