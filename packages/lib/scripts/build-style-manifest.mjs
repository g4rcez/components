import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestModuleUrl = pathToFileURL(resolve(root, "dist/styles/style-manifest.mjs")).href;
const { componentStyleManifest } = await import(manifestModuleUrl);

const json = `${JSON.stringify(componentStyleManifest, null, 2)}\n`;
const outputs = [resolve(root, "dist/style-manifest.json"), resolve(root, "ai/component-style-manifest.json")];
for (const output of outputs) {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, json);
}

// Compact on purpose: agents read this file in full. Selector names follow a fixed pattern, stated once in the header:
// base `__<name>`, variant `__<name>--<variant>-<value>`, slot `__<name>__<slot>`.
const rows = Object.entries(componentStyleManifest)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, entry]) => {
        const dependencies = entry.dependencies.length ? entry.dependencies.map((dependency) => `${dependency}.css`).join(", ") : "-";
        const variants = Object.entries(entry.classes.variants)
            .map(([variant, values]) => `${variant}=${Object.keys(values).join("/")}`)
            .join("; ");
        const slots = Object.keys(entry.classes.slots).join(", ");
        return `| ${name} | ${entry.css.replace("@g4rcez/components/", "")} | ${dependencies} | ${variants || "-"} | ${slots || "-"} |`;
    })
    .join("\n");

const markdown = `# @g4rcez/components style dependencies\n\nGenerated from the component style manifest. Do not edit by hand.\n\nImport order: \`@g4rcez/components/foundation.css\`, then each file in Needs, then the component CSS. Prefix every file with \`@g4rcez/components/\`.\n\nSelectors: base \`__<component>\`, variant \`__<component>--<variant>-<value>\`, slot \`__<component>__<slot>\`. A \`-\` cell means none.\n\n| Component | CSS | Needs | Variants (name=values) | Slots |\n|---|---|---|---|---|\n${rows}\n`;
writeFileSync(resolve(root, "ai/docs/style-dependencies.md"), markdown);
