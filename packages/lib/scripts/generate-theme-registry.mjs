import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { themeTokenMetadata } from "./theme-token-metadata.mjs";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(packageRoot, "src");
const cssRoot = join(sourceRoot, "styles", "tokens.css");
const outputPath = join(sourceRoot, "styles", "theme-registry.generated.ts");
const {
    sharedTokenPrefixes,
    sharedTokenNames,
    colorPrefixes,
    componentOwners,
    privateProperties,
    colorProperties,
    explicitColorProperties,
} = themeTokenMetadata;
const privatePropertySet = new Set(privateProperties);
const colorPropertySet = new Set(colorProperties);
const explicitColorPropertySet = new Set(explicitColorProperties);

const walkCssFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map((entry) => {
            const path = join(directory, entry.name);
            return entry.isDirectory() ? walkCssFiles(path) : entry.name.endsWith(".css") ? [path] : [];
        })
    );
    return files.flat();
};

const readRootProperties = (root) => {
    const properties = new Map();
    root.walkRules((rule) => {
        if (rule.selector.trim() !== ":root") return;
        rule.walkDecls(/^--var-/, (declaration) => properties.set(declaration.prop, declaration.value.trim()));
    });
    return properties;
};

const css = await readFile(cssRoot, "utf8");
const ast = postcss.parse(css, { from: relative(packageRoot, cssRoot) });
const rootProperties = readRootProperties(ast);
const darkOverrides = new Map();
ast.walkRules((rule) => {
    if (!rule.selector.split(",").some((selector) => selector.trim() === "html.dark")) return;
    rule.walkDecls(/^--var-/, (declaration) => darkOverrides.set(declaration.prop, declaration.value.trim()));
});

const allProperties = new Set();
const propertyConsumers = new Map();
const addProperty = (property, consumer) => {
    if (privatePropertySet.has(property)) return;
    allProperties.add(property);
    const consumers = propertyConsumers.get(property) ?? new Set();
    consumers.add(consumer);
    propertyConsumers.set(property, consumers);
};
for (const property of rootProperties.keys()) addProperty(property, "styles/tokens.css (:root)");
for (const property of darkOverrides.keys()) addProperty(property, "styles/tokens.css (html.dark)");

const colorUses = new Set();
for (const file of await walkCssFiles(join(sourceRoot, "components"))) {
    const consumerFile = relative(packageRoot, file);
    const componentAst = postcss.parse(await readFile(file, "utf8"), { from: consumerFile });
    componentAst.walkDecls((declaration) => {
        for (const match of declaration.value.matchAll(/var\(\s*(--var-[\w-]+)/gu)) {
            const property = match[1];
            addProperty(property, `${consumerFile} (${declaration.parent?.selector ?? declaration.prop})`);
            if (colorPropertySet.has(declaration.prop.toLowerCase())) colorUses.add(property);
        }
    });
}

for (const match of (await readFile(join(sourceRoot, "styles", "geometry-defaults.ts"), "utf8")).matchAll(/"(--var-[\w-]+)"\s*:/gu)) {
    addProperty(match[1], "styles/geometry-defaults.ts");
}


const primitiveProperties = new Set(["--var-spacing-base", "--var-radius-base"]);
const owners = new Map();
const globalTokenProperties = new Set();
const globalColorProperties = new Set();
const componentProperties = new Map(componentOwners.map((name) => [name, new Set()]));
const unclassified = [];
for (const property of [...allProperties].sort()) {
    if (primitiveProperties.has(property)) continue;
    const token = property.slice("--var-".length);
    if (colorPrefixes.some((prefix) => token.startsWith(prefix))) {
        globalColorProperties.add(property);
        continue;
    }
    if (sharedTokenNames.includes(token) || sharedTokenPrefixes.some((prefix) => token.startsWith(prefix))) {
        globalTokenProperties.add(property);
        continue;
    }
    const owner = componentOwners.filter((name) => token.startsWith(`${name}-`)).toSorted((left, right) => right.length - left.length)[0];
    if (!owner) {
        unclassified.push(property);
        continue;
    }
    owners.set(property, owner);
    componentProperties.get(owner).add(property);
}

if (unclassified.length > 0) {
    const details = unclassified.map((property) => `${property} (used by ${[...(propertyConsumers.get(property) ?? [])].join(", ") || "no known consumer"})`);
    throw new Error(`Unclassified public token properties: ${details.join("; ")}`);
}

const isColorProperty = (property) =>
    !privatePropertySet.has(property) &&
    (globalColorProperties.has(property) || colorUses.has(property) || explicitColorPropertySet.has(property));
const effectiveLightColors = new Map([...rootProperties].filter(([property]) => isColorProperty(property)));
const darkNonColors = [...darkOverrides.keys()].filter((property) => !isColorProperty(property) && !privatePropertySet.has(property));
if (darkNonColors.length > 0) throw new Error(`Dark theme may only override colors; found ${darkNonColors.join(", ")}.`);
const darkOnlyColors = [...darkOverrides.keys()].filter((property) => isColorProperty(property) && !rootProperties.has(property));
if (darkOnlyColors.length > 0) throw new Error(`Dark color defaults need a shared light fallback: ${darkOnlyColors.join(", ")}.`);
const effectiveDarkColors = new Map(effectiveLightColors);
for (const [property, value] of darkOverrides) {
    if (isColorProperty(property)) effectiveDarkColors.set(property, value);
}

const componentObject = (properties, predicate = () => true) => {
    const grouped = {};
    for (const [property, value] of properties) {
        const owner = owners.get(property);
        if (!owner || !predicate(property)) continue;
        const token = property.slice(`--var-${owner}-`.length);
        grouped[owner] ??= {};
        grouped[owner][token] = value;
    }
    return grouped;
};

const globalTokenObject = Object.fromEntries(
    [...globalTokenProperties]
        .filter((property) => rootProperties.has(property))
        .sort()
        .map((property) => [property.slice("--var-".length), rootProperties.get(property)])
);
const lightColorObject = Object.fromEntries(
    [...effectiveLightColors]
        .filter(([property]) => property.startsWith("--var-color-"))
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([property, value]) => [property.slice("--var-color-".length), value])
);
const darkColorObject = Object.fromEntries(
    [...effectiveDarkColors]
        .filter(([property]) => property.startsWith("--var-color-"))
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([property, value]) => [property.slice("--var-color-".length), value])
);
const tokenKeys = [...globalTokenProperties].map((property) => property.slice("--var-".length)).sort();
const colorKeys = [...globalColorProperties]
    .filter((property) => property.startsWith("--var-color-"))
    .map((property) => property.slice("--var-color-".length))
    .sort();
const componentKeys = Object.fromEntries(
    [...componentProperties]
        .map(([component, properties]) => [component, [...properties].map((property) => property.slice(`--var-${component}-`.length)).sort()])
        .filter(([, tokens]) => tokens.length > 0)
        .sort(([left], [right]) => left.localeCompare(right))
);
const sharedTokenObject = {
    spacing: rootProperties.get("--var-spacing-base"),
    rounding: rootProperties.get("--var-radius-base"),
    ...globalTokenObject,
};

const lightComponentTokens = componentObject(rootProperties);
const darkComponentTokens = componentObject(effectiveDarkColors, isColorProperty);
const sharedTokenJSON = JSON.stringify(sharedTokenObject, null, 4)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `    ${line}`))
    .join("\n");

const serialized = `/* Generated by scripts/generate-theme-registry.mjs from tokens.css, component CSS, geometry defaults, and explicit ownership metadata. */
export const themeTokenRegistry = ${JSON.stringify({ tokens: tokenKeys, colors: colorKeys, components: componentKeys }, null, 4)} as const;

export const defaultLightThemeColors = ${JSON.stringify(lightColorObject, null, 4)} as const;
export const defaultDarkThemeColors = ${JSON.stringify(darkColorObject, null, 4)} as const;
export const defaultLightComponentTokens = ${JSON.stringify(lightComponentTokens, null, 4)} as const;
export const defaultDarkComponentTokens = ${JSON.stringify(darkComponentTokens, null, 4)} as const;

export const defaultLightThemeTokens = {
    "tokens": ${sharedTokenJSON},
    "colors": defaultLightThemeColors,
    "components": defaultLightComponentTokens,
} as const;
export const defaultDarkThemeTokens = {
    "colors": defaultDarkThemeColors,
    "components": defaultDarkComponentTokens,
} as const;
`;


const check = process.argv.includes("--check");
let current;
try {
    current = await readFile(outputPath, "utf8");
} catch (error) {
    if (error.code !== "ENOENT") throw error;
}
if (check) {
    if (current !== serialized) throw new Error("Generated theme registry is stale; run `pnpm --filter @g4rcez/components tokens:generate`.");
} else if (current !== serialized) {
    await writeFile(outputPath, serialized);
}
