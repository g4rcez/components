#!/usr/bin/env node
// Prints the version to publish for @g4rcez/components.
// - package.json version newer than npm "latest": publish it as is (manual minor/major bump).
// - otherwise: patch bump of npm "latest".
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../packages/lib/package.json", import.meta.url), "utf8"));
const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

const parse = (version) => {
    const match = SEMVER.exec(version);
    if (!match) throw new Error(`Expected x.y.z version, received "${version}"`);
    return match.slice(1).map(Number);
};

const isNewer = (a, b) => {
    const [x, y] = [parse(a), parse(b)];
    const index = x.findIndex((part, i) => part !== y[i]);
    return index !== -1 && x[index] > y[index];
};

const latest = (() => {
    try {
        return execFileSync("npm", ["view", manifest.name, "dist-tags.latest"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    } catch (error) {
        if (String(error.stderr).includes("E404")) return null;
        throw error;
    }
})();

if (latest === null || isNewer(manifest.version, latest)) {
    console.log(manifest.version);
} else {
    const [major, minor, patch] = parse(latest);
    console.log(`${major}.${minor}.${patch + 1}`);
}
