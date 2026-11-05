#!/usr/bin/env node
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageAi = join(repoRoot, "packages", "lib", "ai");
const skillName = "g4rcez-components";
const installDestination = join(repoRoot, ".claude", "skills", skillName);
const canonicalSkill = join(repoRoot, "skills", skillName, "SKILL.md");
const canonicalDocs = join(packageAi, "docs");
const usage = "Usage: npx components:skills <install|sync|check>\n";

const skillDestinations = [
    join(repoRoot, "packages", "lib", "SKILL.md"),
    join(packageAi, "SKILL.md"),
    join(installDestination, "SKILL.md"),
    join(repoRoot, ".agents", "skills", skillName, "SKILL.md"),
];

// skills/<name>/docs makes the skill self-contained when installed from GitHub with `npx skills add`.
const docsDestinations = [
    join(repoRoot, "skills", skillName, "docs"),
    join(installDestination, "docs"),
    join(repoRoot, ".agents", "skills", skillName, "docs"),
];

const toRelativePath = (path) => relative(repoRoot, path).split(sep).join("/");

function compareStrings(left, right) {
    if (left === right) return 0;
    if (left < right) return -1;
    return 1;
}

function getStat(path) {
    try {
        return lstatSync(path);
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return undefined;
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`cannot inspect ${toRelativePath(path)}: ${message}`);
    }
}

function validatePath(path, label, expectedType) {
    const pathParts = relative(repoRoot, path).split(sep).filter(Boolean);
    let current = repoRoot;

    for (const [index, part] of pathParts.entries()) {
        current = join(current, part);
        const stat = getStat(current);
        if (!stat) return undefined;
        if (stat.isSymbolicLink()) {
            throw new Error(`${label} contains symlink at ${toRelativePath(current)}`);
        }
        if (index < pathParts.length - 1 && !stat.isDirectory()) {
            throw new Error(`${label} parent is not a directory at ${toRelativePath(current)}`);
        }
    }

    const stat = getStat(path);
    if (!stat) return undefined;
    if (expectedType === "file" && !stat.isFile()) {
        throw new Error(`${label} is not a regular file at ${toRelativePath(path)}`);
    }
    if (expectedType === "directory" && !stat.isDirectory()) {
        throw new Error(`${label} is not a directory at ${toRelativePath(path)}`);
    }
    return stat;
}

function collectMarkdownFiles(directory, relativeDirectory = "") {
    const files = [];
    const entries = readdirSync(directory, { withFileTypes: true }).toSorted((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
        const path = join(directory, entry.name);
        const stat = getStat(path);
        if (!stat) {
            throw new Error(`managed path disappeared while reading: ${toRelativePath(path)}`);
        }
        if (stat.isSymbolicLink()) {
            throw new Error(`managed path contains symlink at ${toRelativePath(path)}`);
        }

        const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
        if (stat.isDirectory()) {
            files.push(...collectMarkdownFiles(path, relativePath));
        } else if (entry.name.endsWith(".md")) {
            if (!stat.isFile()) {
                throw new Error(`managed Markdown path is not a regular file at ${toRelativePath(path)}`);
            }
            files.push({ path, relativePath, content: readFileSync(path) });
        }
    }

    return files;
}

function loadCanonicalSources() {
    const skillStat = validatePath(canonicalSkill, "canonical skill", "file");
    if (!skillStat) throw new Error(`canonical skill not found at ${toRelativePath(canonicalSkill)}`);
    const skill = readFileSync(canonicalSkill);
    const frontmatter = /^---\r?\n(?<body>[\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(skill.toString());
    if (!frontmatter?.groups) throw new Error("canonical skill frontmatter is missing or invalid");
    if (!frontmatter.groups.body.split(/\r?\n/u).includes(`name: ${skillName}`)) {
        throw new Error(`canonical skill frontmatter must declare name: ${skillName}`);
    }

    const docsStat = validatePath(canonicalDocs, "canonical docs", "directory");
    if (!docsStat) throw new Error(`canonical docs not found at ${toRelativePath(canonicalDocs)}`);
    const references = collectMarkdownFiles(canonicalDocs);
    if (references.length === 0) {
        throw new Error(`canonical docs contains no Markdown references at ${toRelativePath(canonicalDocs)}`);
    }
    references.sort((left, right) => compareStrings(left.relativePath, right.relativePath));

    return { skill, references };
}

function validateDestinationFile(path, label) {
    return validatePath(path, label, "file");
}

function validateDestinationDocs(directory) {
    const stat = validatePath(directory, "destination docs", "directory");
    return stat ? collectMarkdownFiles(directory) : [];
}

function makeDestinationPath(directory, referencePath) {
    return join(directory, ...referencePath.split("/"));
}

function prepareTargets(sources) {
    const operations = [];
    for (const destination of skillDestinations) {
        validateDestinationFile(destination, "destination skill");
        operations.push({ path: destination, relativePath: toRelativePath(destination), content: sources.skill });
    }

    const expectedReferences = new Set(sources.references.map((reference) => reference.relativePath));
    const extraFiles = [];
    for (const docsDirectory of docsDestinations) {
        const actualFiles = validateDestinationDocs(docsDirectory);
        for (const actual of actualFiles) {
            if (!expectedReferences.has(actual.relativePath)) {
                extraFiles.push({
                    relativePath: toRelativePath(makeDestinationPath(docsDirectory, actual.relativePath)),
                    reason: "extra",
                });
            }
        }

        for (const reference of sources.references) {
            const path = makeDestinationPath(docsDirectory, reference.relativePath);
            validateDestinationFile(path, "destination reference");
            operations.push({
                path,
                relativePath: toRelativePath(path),
                content: reference.content,
            });
        }
    }

    return { extraFiles, operations };
}

function compareTargets(targets) {
    const drift = [...targets.extraFiles];
    for (const target of targets.operations) {
        const stat = getStat(target.path);
        if (!stat) {
            drift.push({ relativePath: target.relativePath, reason: "missing" });
            continue;
        }
        if (stat.isSymbolicLink()) {
            throw new Error(`managed path contains symlink at ${target.relativePath}`);
        }
        const actual = readFileSync(target.path);
        if (!actual.equals(target.content)) {
            drift.push({ relativePath: target.relativePath, reason: "different" });
        }
    }
    return drift.sort((left, right) => {
        return compareStrings(left.relativePath, right.relativePath) || compareStrings(left.reason, right.reason);
    });
}

function reportDrift(operation, drift) {
    process.stderr.write(`${operation} failed; managed files are not synchronized:\n`);
    for (const item of drift) process.stderr.write(`${item.relativePath}: ${item.reason}\n`);
    process.exitCode = 1;
}

function runConsistency(operation) {
    const sources = loadCanonicalSources();
    const targets = prepareTargets(sources);
    const drift = compareTargets(targets);

    if (operation === "check") {
        if (drift.length > 0) reportDrift("check", drift);
        else process.stdout.write("check passed: managed files are synchronized\n");
        return;
    }

    if (drift.some((item) => item.reason === "extra")) {
        reportDrift("sync", drift);
        return;
    }

    const writes = targets.operations.filter((target) => drift.some((item) => item.relativePath === target.relativePath && item.reason !== "extra"));
    for (const target of writes) {
        mkdirSync(dirname(target.path), { recursive: true });
        writeFileSync(target.path, target.content);
    }
    process.stdout.write(`sync complete: ${writes.length} file(s) written\n`);
}

function runInstall() {
    const sourceSkill = join(packageAi, "SKILL.md");
    const sourceDocs = join(packageAi, "docs");

    if (!existsSync(packageAi)) {
        process.stderr.write(`error: skill source directory not found at ${packageAi}\n`);
        process.exit(1);
    }
    validatePath(packageAi, "skill source directory", "directory");

    if (!existsSync(sourceSkill)) {
        process.stderr.write(`error: skill source not found at ${sourceSkill}\n`);
        process.exit(1);
    }
    validatePath(sourceSkill, "skill source", "file");

    if (!existsSync(sourceDocs)) {
        process.stderr.write(`error: docs source not found at ${sourceDocs}\n`);
        process.exit(1);
    }
    validatePath(sourceDocs, "docs source", "directory");
    validatePath(installDestination, "install destination", "directory");

    rmSync(installDestination, { recursive: true, force: true });
    mkdirSync(join(installDestination, "docs"), { recursive: true });

    cpSync(sourceSkill, join(installDestination, "SKILL.md"));
    process.stdout.write(`copied SKILL.md → .claude/skills/${skillName}/SKILL.md\n`);

    cpSync(sourceDocs, join(installDestination, "docs"), { recursive: true });
    process.stdout.write(`copied docs/    → .claude/skills/${skillName}/docs/\n`);
    process.stdout.write("install complete\n");
}

const [, , subcommand] = process.argv;

try {
    if (subcommand === "install") runInstall();
    else if (subcommand === "sync" || subcommand === "check") runConsistency(subcommand);
    else {
        process.stderr.write(usage);
        process.exitCode = 1;
    }
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`error: ${message}\n`);
    process.exitCode = 1;
}
