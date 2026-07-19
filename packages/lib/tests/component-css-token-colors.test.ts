import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const componentsRoot = join(__dirname, "..", "src", "components");

const colorDeclarationProperties = new Set([
    "background",
    "background-color",
    "border",
    "border-block-end-color",
    "border-bottom",
    "border-bottom-color",
    "border-color",
    "border-left",
    "border-left-color",
    "border-right",
    "border-right-color",
    "border-top",
    "border-top-color",
    "caret-color",
    "color",
    "fill",
    "outline",
    "outline-color",
    "stroke",
]);

const fullColorTokenPrefixes = ["--shiki-", "--tw-", "--var-"];
const colorFunctionPrefixes = ["hsl(", "hsla(", "rgb(", "rgba(", "oklch("];

function componentCssFiles(dir = componentsRoot): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const file = join(dir, entry.name);
        if (entry.isDirectory()) return componentCssFiles(file);
        return file.endsWith(".css") ? [file] : [];
    });
}

function isFullColorToken(token: string): boolean {
    return fullColorTokenPrefixes.some((prefix) => token.startsWith(prefix));
}

function isWrappedInColorFunction(value: string, index: number): boolean {
    const beforeToken = value.slice(0, index).trimEnd().toLowerCase();
    return colorFunctionPrefixes.some((prefix) => beforeToken.endsWith(prefix));
}

function collectBareChannelColorVars(file: string): string[] {
    return readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) => {
            const declaration = line.trim().match(/^([a-zA-Z-]+)\s*:\s*([^;]+);?/);
            if (!declaration) return [];

            const [, property, value] = declaration;
            if (!colorDeclarationProperties.has(property)) return [];

            return [...value.matchAll(/var\((--[A-Za-z0-9_-]+)/g)].flatMap((match) => {
                const token = match[1];
                if (isFullColorToken(token) || isWrappedInColorFunction(value, match.index ?? 0)) return [];

                return [`${relative(process.cwd(), file)}:${index + 1} ${property}: ${value.trim()}`];
            });
        });
}

describe("component CSS color tokens", () => {
    it("wraps channel color vars in CSS color functions", () => {
        const findings = componentCssFiles().flatMap(collectBareChannelColorVars);

        expect(findings).toEqual([]);
    });

    it("uses valid alert theme color declarations", () => {
        const alertCss = readFileSync(join(componentsRoot, "display", "alert", "alert.css"), "utf8");

        expect(alertCss).toContain(".__alert--theme-muted");
        expect(alertCss).toContain("color: var(--var-alert-danger-foreground);");
        expect(alertCss).toContain("border-color: var(--var-alert-danger-border);");
        expect(alertCss).toContain("background-color: var(--var-alert-danger-background);");
        expect(alertCss).toContain("color: var(--var-color-foreground);");
        expect(alertCss).not.toContain("hsla(var(--alert-");
        expect(alertCss).not.toContain("color: var(--alert-");
        expect(alertCss).not.toContain("background: var(--alert-");
        expect(alertCss).not.toContain("border-color: var(--alert-");
    });

    it("wires checkbox control colors to semantic CSS variables", () => {
        const checkboxCss = readFileSync(join(componentsRoot, "form", "checkbox", "checkbox.css"), "utf8");

        expect(checkboxCss).toContain("color: var(--var-checkbox-control-foreground);");
        expect(checkboxCss).toContain("background-color: var(--var-checkbox-control-background);");
        expect(checkboxCss).toContain("border-color: var(--var-checkbox-control-border);");
        expect(checkboxCss).toContain("border-color: var(--var-checkbox-mark-foreground);");
        expect(checkboxCss).not.toContain("#2563eb");
        expect(checkboxCss).not.toContain('background-image: url("data:image/svg+xml');
    });

    it("uses component surface tokens for card and table backgrounds", () => {
        const cardCss = readFileSync(join(componentsRoot, "display", "card", "card.css"), "utf8");
        const tableCss = readFileSync(join(componentsRoot, "table", "table.css"), "utf8");

        expect(cardCss).toContain("background-color: var(--var-card-background);");
        expect(cardCss).toContain("border-color: var(--var-card-border);");
        expect(tableCss.match(/background-color: var\(--var-table-background\);/g)).toHaveLength(3);
        expect(tableCss.match(/border(?:-block-start)?-color: var\(--var-table-border\);/g)).toHaveLength(4);
    });
});
