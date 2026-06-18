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

const rows = Object.entries(componentStyleManifest)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, entry]) => {
        const dependencies = entry.dependencies.length ? entry.dependencies.map((dependency) => `\`${dependency}.css\``).join(", ") : "none";
        const variants = Object.entries(entry.classes.variants)
            .map(
                ([variant, values]) =>
                    `\`${variant}\`: ${Object.keys(values)
                        .map((value) => `\`${value}\``)
                        .join(", ")}`
            )
            .join("; ");
        const slots = Object.keys(entry.classes.slots).length
            ? Object.values(entry.classes.slots)
                  .map((slot) => `\`${slot}\``)
                  .join(", ")
            : "none";
        return `| \`${name}\` | \`${entry.css}\` | ${dependencies} | \`${entry.classes.base}\` | ${variants || "none"} | ${slots} |`;
    })
    .join("\n");

const markdown = `# @g4rcez/components style dependencies\n\nGenerated from the component style manifest. Do not edit by hand.\n\nImport \`@g4rcez/components/foundation.css\` before component CSS files. Component dependencies are already resolved in the manifest and should be imported before the component that depends on them.\n\n| Component | CSS import | Dependencies | Base class | Variants | Slots |\n|---|---|---|---|---|---|\n${rows}\n`;
writeFileSync(resolve(root, "ai/docs/style-dependencies.md"), markdown);
