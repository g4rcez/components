import { readFileSync } from "node:fs";
import path from "node:path";

const workspaceRoot = path.resolve(import.meta.dirname, "..");
const componentsRoot = path.join(workspaceRoot, "packages/lib");

function readComponentsPackage() {
    try {
        return JSON.parse(readFileSync(path.join(componentsRoot, "package.json"), "utf8"));
    } catch (error) {
        throw new Error("Cannot read the @g4rcez/components package configuration.", { cause: error });
    }
}

const componentsPackage = readComponentsPackage();
const absoluteAliases = Object.fromEntries(
    Object.entries(componentsPackage.exports).flatMap(([subpath, target]) => {
        if (target === null || typeof target !== "object" || typeof target.source !== "string") return [];

        const name = subpath === "." ? componentsPackage.name : `${componentsPackage.name}/${subpath.slice(2)}`;
        return [[name, path.resolve(componentsRoot, target.source)]];
    })
);

export function getComponentsSourceAliases(projectRoot) {
    const turbopack = Object.fromEntries(
        Object.entries(absoluteAliases).map(([name, source]) => {
            const relativeSource = path.relative(projectRoot, source).split(path.sep).join("/");
            return [name, relativeSource.startsWith(".") ? relativeSource : `./${relativeSource}`];
        })
    );
    const webpack = Object.fromEntries(Object.entries(absoluteAliases).map(([name, source]) => [`${name}$`, source]));

    return { turbopack, webpack, workspaceRoot };
}
