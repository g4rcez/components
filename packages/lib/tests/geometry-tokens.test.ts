import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultGeometryBases, defaultGeometryTokens, geometryToken } from "../src/styles/geometry-defaults";
import { createThemeProperties, defaultLightThemeTokens } from "../src/styles/theme-runtime";
import { createCssProperties, createTokenStyles } from "../src/styles/design-tokens";
import { defaultLightTheme } from "../src/styles/theme";

const root = join(__dirname, "..", "src");
const cssFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? cssFiles(path) : path.endsWith(".css") ? [path] : [];
    });

// Resolve only the balanced var() expressions used by this library. This is a
// contract test, not a browser layout/computed-style substitute.
function resolveVariables(value: string, variables: Record<string, string>): string {
    const start = value.indexOf("var(");
    if (start < 0) return value;
    let end = start + 4;
    let depth = 1;
    let comma = -1;
    for (; depth > 0; end++) {
        if (value[end] === "(") depth++;
        if (value[end] === ")") depth--;
        if (value[end] === "," && depth === 1 && comma < 0) comma = end;
    }
    const name = value.slice(start + 4, comma < 0 ? end - 1 : comma).trim();
    const replacement = variables[name] ?? (comma < 0 ? undefined : value.slice(comma + 1, end - 1).trim());
    if (replacement === undefined) throw new Error(`Missing ${name}`);
    return resolveVariables(value.slice(0, start) + replacement + value.slice(end), variables);
}

describe("scoped geometry defaults", () => {
    it("keeps one inherited spacing and one independent radius primitive", () => {
        const css = readFileSync(join(root, "styles/tokens.css"), "utf8");
        expect(css).toContain(`--var-spacing-base: ${defaultGeometryBases.spacing};`);
        expect(css).toContain(`--var-radius-base: ${defaultGeometryBases.radius};`);
        expect(css).not.toMatch(/--var-radius\s*:/);
        for (const key of Object.keys(defaultGeometryTokens)) expect(css).not.toContain(`${key}:`);
    });

    it("supplies use-site defaults throughout every component CSS chunk", () => {
        const files = cssFiles(join(root, "components"));
        expect(files.length).toBeGreaterThan(40);
        const bareReferences: string[] = [];
        for (const file of files) {
            const css = readFileSync(file, "utf8");
            for (const [key, value] of Object.entries(defaultGeometryTokens)) {
                if (css.includes(`var(${key})`)) bareReferences.push(`${file}: ${key}`);
                if (css.includes(`var(${key},`)) expect(css.replace(/\s/g, ""), `${file}: ${key}`).toContain(value.replace(/\s/g, ""));
            }
        }
        expect(bareReferences).toEqual([]);
    });

    it.each(["1rem", "0.5rem", "2rem"])("resolves the nearest spacing scope %s without pinning inherited defaults", (spacing) => {
        const inherited = { "--var-spacing-base": "1rem", "--var-radius-base": "1rem" };
        const scope = { ...inherited, "--var-spacing-base": spacing };
        expect(resolveVariables(geometryToken("button-height"), scope)).toBe(`calc(${spacing} * 2.5)`);
        expect(resolveVariables(geometryToken("stats-rounded"), scope)).toBe("calc(1rem * 1)");
        expect(resolveVariables(geometryToken("button-height"), { ...scope, "--var-button-height": "40px" })).toBe("40px");
    });

    it("uses only the radius base for ordinary corners, leaving full circles structural", () => {
        const radii = Object.entries(defaultGeometryTokens).filter(([key]) => /radius|rounded/.test(key));
        expect(radii.length).toBeGreaterThan(20);
        for (const [, value] of radii) {
            expect(value).toContain("--var-radius-base");
            expect(value).not.toContain("--var-spacing");
            const square = resolveVariables(value, { "--var-radius-base": "0px" });
            expect(square).not.toMatch(/[1-9][\d.]*(?:rem|px)/);
        }
        const css = readFileSync(join(root, "styles/tokens.css"), "utf8");
        expect(css).toContain("--var-rounded-full: 9999px;");
        expect(resolveVariables(geometryToken("button-rounded"), { "--var-radius-base": "1rem", "--var-radius": "0px" })).toBe(
            "calc(0px * 0.733333)"
        );
    });

    it("keeps inspectable runtime defaults aligned with CSS fallbacks", () => {
        const defaults = createThemeProperties(defaultLightThemeTokens);
        for (const [key, value] of Object.entries(defaultGeometryTokens)) {
            const runtime = defaults[key as keyof typeof defaults];
            if (runtime !== undefined) expect.soft(runtime.replace(/\s/g, ""), key).toBe(value.replace(/\s/g, ""));
        }
    });

    it("omits only implicit geometry from runtime theme emission", () => {
        const implicit = createThemeProperties();
        expect(implicit).not.toHaveProperty("--var-spacing-base");
        for (const key of Object.keys(defaultGeometryTokens)) expect(implicit).not.toHaveProperty(key);
        const explicit = createThemeProperties({
            spacing: { base: "0.5rem" },
            components: { radius: "0", button: { height: defaultLightThemeTokens.components.button.height, rounded: "0px" } },
        });
        expect(explicit["--var-spacing-base"]).toBe("0.5rem");
        expect(explicit["--var-button-height"]).toBe(defaultLightThemeTokens.components.button.height);
        expect(explicit["--var-button-rounded"]).toBe("0px");
        expect(explicit["--var-radius"]).toBe("0");
        expect(createThemeProperties({}, { base: { components: { button: { height: "40px" } } } })).toEqual({ "--var-button-height": "40px" });
        expect(createThemeProperties({}, { base: {} })).toEqual({});
    });

    it("preserves literal consumer values in legacy theme generators and remaps", () => {
        const theme = {
            ...defaultLightTheme,
            components: { ...defaultLightTheme.components, button: { ...defaultLightTheme.components.button, height: "40px", rounded: "0" } },
        };
        expect(createTokenStyles(theme)).toContain("--button-height: 40px");
        expect(createCssProperties(theme)).toMatchObject({ "--button-height": "40px", "--button-rounded": "0" });
        expect(createTokenStyles(theme, { components: (token) => ({ ...token, key: token.key.replace("--", "--var-") }) })).toContain(
            "--var-button-height: 40px"
        );
    });
});
