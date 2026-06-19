#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_NAME = "@g4rcez/components";
const START_MARKER = "/* @g4rcez/components auto-imports start */";
const END_MARKER = "/* @g4rcez/components auto-imports end */";
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mdx"]);
const DEFAULT_CONTENT_DIRS = ["src", "app", "pages", "components"];
const DEFAULT_CSS_FILES = [
    "src/index.css",
    "src/styles/index.css",
    "src/styles/globals.css",
    "src/app/globals.css",
    "app/globals.css",
    "styles/globals.css",
    "src/app.css",
    "src/App.css",
    "index.css",
];
const IGNORED_DIRS = new Set([".git", ".next", "coverage", "dist", "build", "node_modules", "out"]);

const cliRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const help = `Usage:
  csscomponents [options]

Detects @g4rcez/components usage and adds foundation.css plus the CSS chunks for
the components that are actually used.

Options:
  --root <dir>          Project root to scan. Defaults to the current directory.
  --content <path>      Source file or directory to scan. Can be repeated. Defaults to common source dirs.
  --css <file>          Stylesheet to update. Auto-detected when omitted.
  --manifest <file>     Component style manifest. Defaults to the packaged manifest.
  --library-root <dir>  Use local source CSS imports from this library root instead of package imports.
  --package <name>      Package import name. Defaults to ${PACKAGE_NAME}.
  --check               Do not write. Exit 1 when the stylesheet is not up to date.
  --dry-run             Do not write. Print the planned imports.
  --json                Print a JSON summary.
  --help                Show this help.

Examples:
  csscomponents
  csscomponents --root packages/docs --library-root packages/lib
`;

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const toPosixPath = (value) => value.split(sep).join("/");

const toCssImportPath = (fromFile, toFile) => {
    const path = toPosixPath(relative(dirname(fromFile), toFile));
    return path.startsWith(".") ? path : `./${path}`;
};

const pascalCase = (value) =>
    value
        .split(/[-_]/u)
        .filter(Boolean)
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join("");

const parseArgs = (argv) => {
    const args = [...argv];
    const command = args[0] === "styles" ? args.shift() : "styles";
    const options = {
        command,
        content: [],
        packageName: PACKAGE_NAME,
        root: process.cwd(),
        write: true,
        json: false,
        help: false,
        check: false,
    };

    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        const readValue = () => {
            const value = args[i + 1];
            if (!value || value.startsWith("-")) throw new Error(`Missing value for ${arg}`);
            i += 1;
            return value;
        };

        if (arg === "--") continue;
        else if (arg === "--root") options.root = readValue();
        else if (arg === "--content") options.content.push(readValue());
        else if (arg === "--css") options.css = readValue();
        else if (arg === "--manifest") options.manifest = readValue();
        else if (arg === "--library-root") options.libraryRoot = readValue();
        else if (arg === "--package") options.packageName = readValue();
        else if (arg === "--check") {
            options.check = true;
            options.write = false;
        } else if (arg === "--dry-run") options.write = false;
        else if (arg === "--json") options.json = true;
        else if (arg === "--help" || arg === "-h") options.help = true;
        else throw new Error(`Unknown option: ${arg}`);
    }

    return options;
};

const resolveFrom = (base, path) => (isAbsolute(path) ? path : resolve(base, path));

const findDefaultManifest = () => {
    const candidates = [resolve(cliRoot, "ai/component-style-manifest.json"), resolve(cliRoot, "dist/style-manifest.json")];
    const manifest = candidates.find((path) => existsSync(path));
    if (!manifest) throw new Error(`Could not find component style manifest. Tried: ${candidates.join(", ")}`);
    return manifest;
};

function listCssFiles(entry, output = []) {
    if (!existsSync(entry)) return output;
    const stats = statSync(entry);
    if (stats.isFile()) {
        if (extname(entry) === ".css") output.push(entry);
        return output;
    }
    if (!stats.isDirectory()) return output;

    for (const item of readdirSync(entry, { withFileTypes: true })) {
        if (item.isDirectory() && IGNORED_DIRS.has(item.name)) continue;
        listCssFiles(resolve(entry, item.name), output);
    }
    return output;
}

const findDefaultCssFile = (root) => {
    const explicit = DEFAULT_CSS_FILES.map((path) => resolveFrom(root, path)).find((path) => existsSync(path));
    if (explicit) return explicit;

    const cssFiles = listCssFiles(root);
    const componentCss = cssFiles.find((path) => readFileSync(path, "utf8").includes(PACKAGE_NAME));
    if (componentCss) return componentCss;
    if (cssFiles.length === 1) return cssFiles[0];

    throw new Error("Could not auto-detect a stylesheet. Pass --css <file>.");
};

const listFiles = (entry, output = []) => {
    if (!existsSync(entry)) return output;
    const stats = statSync(entry);
    if (stats.isFile()) {
        if (SOURCE_EXTENSIONS.has(extname(entry))) output.push(entry);
        return output;
    }
    if (!stats.isDirectory()) return output;

    for (const item of readdirSync(entry, { withFileTypes: true })) {
        if (item.isDirectory() && IGNORED_DIRS.has(item.name)) continue;
        listFiles(resolve(entry, item.name), output);
    }
    return output;
};

const sourceRoots = (root, content) => {
    const entries = content.length > 0 ? content : DEFAULT_CONTENT_DIRS;
    return entries.map((entry) => resolveFrom(root, entry));
};

const componentAliases = (name) => {
    const pascal = pascalCase(name);
    return new Set([pascal]);
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

const hasJsxUsage = (content, alias) => new RegExp(`<${escapeRegExp(alias)}(?:[\\s>/]|\\.)`, "u").test(content);

const hasImportUsage = (content, name, entry, packageName) => {
    const packageImport = entry.import.replace(PACKAGE_NAME, packageName);
    if (content.includes(`"${packageImport}"`) || content.includes(`'${packageImport}'`)) return true;
    if (content.includes(`"${packageName}/${name}"`) || content.includes(`'${packageName}/${name}'`)) return true;
    return new RegExp(`from\\s+["'][^"']*/${escapeRegExp(name)}["']`, "u").test(content);
};

const detectUsedComponents = (files, manifest, packageName) => {
    const used = new Set();

    for (const file of files) {
        const content = readFileSync(file, "utf8");
        for (const [name, entry] of Object.entries(manifest)) {
            if (used.has(name)) continue;
            const aliases = componentAliases(name);
            const classNames = [entry.classes?.base, ...Object.values(entry.classes?.slots ?? {})].filter(Boolean);
            const classUsage = classNames.some((className) => content.includes(className));
            const jsxUsage = [...aliases].some((alias) => hasJsxUsage(content, alias));
            if (jsxUsage || classUsage || hasImportUsage(content, name, entry, packageName)) used.add(name);
        }
    }

    return [...used];
};

const addWithDependencies = (name, manifest, output, seen = new Set()) => {
    if (seen.has(name)) return;
    seen.add(name);
    const entry = manifest[name];
    if (!entry) return;
    for (const dependency of entry.dependencies ?? []) addWithDependencies(dependency, manifest, output, seen);
    if (!output.includes(name)) output.push(name);
};

const resolveComponentOrder = (used, manifest) => {
    const output = [];
    for (const name of Object.keys(manifest)) {
        if (used.includes(name)) addWithDependencies(name, manifest, output);
    }
    return output;
};

const findSourceCss = (libraryRoot, name) => {
    const filename = `${name}.css`;
    const exactMatches = [];
    const styleSidecarMatches = [];
    const styleNamePattern = new RegExp(`name:\\s*["']${escapeRegExp(name)}["']`);

    const visit = (directory) => {
        if (!existsSync(directory)) return;
        for (const item of readdirSync(directory, { withFileTypes: true })) {
            const path = resolve(directory, item.name);
            if (item.isDirectory()) {
                visit(path);
                continue;
            }

            if (item.name === filename) exactMatches.push(path);
            if (!item.name.endsWith(".styles.ts")) continue;
            if (!styleNamePattern.test(readFileSync(path, "utf8"))) continue;

            const cssPath = path.replace(/\.styles\.ts$/u, ".css");
            if (existsSync(cssPath)) styleSidecarMatches.push(cssPath);
        }
    };

    visit(resolve(libraryRoot, "src/components"));
    return styleSidecarMatches[0] ?? exactMatches[0];
};

const createImportPlan = ({ cssFile, libraryRoot, manifest, packageName, used }) => {
    const ordered = resolveComponentOrder(used, manifest);
    const imports = [];
    const bundleImports = [`@import "${packageName}/index.css";`, `@import "${packageName}/dist/index.css";`];
    const removableImports = new Set(bundleImports);

    if (libraryRoot) {
        const foundation = resolve(libraryRoot, "src/styles/foundation.css");
        const index = resolve(libraryRoot, "src/styles/index.css");
        const legacyIndex = resolve(libraryRoot, "src/index.css");
        const foundationImport = `@import "${toCssImportPath(cssFile, foundation)}";`;
        const indexImport = `@import "${toCssImportPath(cssFile, index)}";`;
        const legacyIndexImport = `@import "${toCssImportPath(cssFile, legacyIndex)}";`;
        imports.push(foundationImport);
        removableImports.add(foundationImport);
        removableImports.add(indexImport);
        removableImports.add(legacyIndexImport);

        for (const name of Object.keys(manifest)) {
            const sourceCss = findSourceCss(libraryRoot, name);
            const entry = manifest[name];
            const importLine = sourceCss
                ? `@import "${toCssImportPath(cssFile, sourceCss)}";`
                : `@import "${entry.css.replace(PACKAGE_NAME, packageName)}";`;
            removableImports.add(importLine);
            if (ordered.includes(name)) imports.push(importLine);
        }
    } else {
        const foundationImport = `@import "${packageName}/foundation.css";`;
        imports.push(foundationImport);
        removableImports.add(foundationImport);
        for (const entry of Object.values(manifest)) removableImports.add(`@import "${entry.css.replace(PACKAGE_NAME, packageName)}";`);
        for (const name of ordered) imports.push(`@import "${manifest[name].css.replace(PACKAGE_NAME, packageName)}";`);
    }

    return {
        components: ordered,
        imports: [...new Set(imports)],
        removableImports: [...removableImports],
    };
};

const removeManagedBlock = (content) => {
    const pattern = new RegExp(`${escapeRegExp(START_MARKER)}[\\s\\S]*?${escapeRegExp(END_MARKER)}\\n?`, "u");
    return content.replace(pattern, "");
};

const removeImportLines = (content, imports) => {
    const importSet = new Set(imports);
    return content
        .split("\n")
        .filter((line) => !importSet.has(line.trim()))
        .join("\n");
};

const insertImportBlock = (content, imports) => {
    const lines = content.replace(/^\n+/u, "").split("\n");
    let insertAt = 0;
    while (insertAt < lines.length && /^@(charset|config|import)\b/u.test(lines[insertAt].trim())) insertAt += 1;

    lines.splice(insertAt, 0, ...imports);
    return `${lines
        .join("\n")
        .replace(/\n{3,}/gu, "\n\n")
        .trimEnd()}\n`;
};

const updateStylesheet = (content, plan) => {
    const managed = removeImportLines(removeManagedBlock(content), plan.removableImports);
    return insertImportBlock(managed, plan.imports);
};

const runStyles = (options) => {
    const root = resolve(options.root);
    const cssFile = options.css ? resolveFrom(root, options.css) : findDefaultCssFile(root);

    const manifestPath = options.manifest ? resolveFrom(process.cwd(), options.manifest) : findDefaultManifest();
    const manifest = readJson(manifestPath);
    const files = sourceRoots(root, options.content).flatMap((entry) => listFiles(entry));
    const used = detectUsedComponents(files, manifest, options.packageName);
    const libraryRoot = options.libraryRoot ? resolveFrom(process.cwd(), options.libraryRoot) : undefined;
    const plan = createImportPlan({ cssFile, libraryRoot, manifest, packageName: options.packageName, used });
    const current = existsSync(cssFile) ? readFileSync(cssFile, "utf8") : "";
    const next = updateStylesheet(current, plan);
    const changed = current !== next;

    if (options.write && changed) {
        mkdirSync(dirname(cssFile), { recursive: true });
        writeFileSync(cssFile, next);
    }

    return {
        changed,
        checkedFiles: files.length,
        components: plan.components,
        cssFile,
        imports: plan.imports,
        manifest: manifestPath,
        mode: libraryRoot ? "source" : "package",
    };
};

const main = () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            console.log(help.trim());
            return;
        }
        if (options.command !== "styles") throw new Error(`Unknown command: ${options.command}`);

        const result = runStyles(options);
        if (options.json) console.log(JSON.stringify(result, null, 2));
        else {
            const action = options.write
                ? result.changed
                    ? "updated"
                    : "already up to date"
                : result.changed
                  ? "would update"
                  : "already up to date";
            console.log(`csscomponents: ${action} ${toPosixPath(result.cssFile)}`);
            console.log(`components: ${result.components.length ? result.components.join(", ") : "none"}`);
            for (const line of result.imports) console.log(line);
        }

        if (options.check && result.changed) process.exitCode = 1;
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
    }
};

export { createImportPlan, detectUsedComponents, parseArgs, runStyles, updateStylesheet };

const isEntrypoint = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isEntrypoint) main();
