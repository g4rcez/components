import { cp, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(packageDir, "../lint/dist");
const targetDir = resolve(packageDir, "dist/lint");

await rm(targetDir, { force: true, recursive: true });
await cp(sourceDir, targetDir, { recursive: true });
