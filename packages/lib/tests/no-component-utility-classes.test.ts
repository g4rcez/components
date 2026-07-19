import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const componentsRoot = join(__dirname, "..", "src", "components");

const staticUtilities = new Set([
    "absolute",
    "appearance-none",
    "bg-transparent",
    "block",
    "border",
    "cursor-default",
    "cursor-not-allowed",
    "cursor-pointer",
    "fill-current",
    "fixed",
    "flex",
    "flex-1",
    "flex-auto",
    "flex-none",
    "flow-root",
    "font-bold",
    "font-medium",
    "font-normal",
    "font-semibold",
    "form-checkbox",
    "form-radio",
    "grid",
    "group",
    "grow",
    "grow-0",
    "hidden",
    "inline",
    "inline-block",
    "inline-flex",
    "invisible",
    "isolate",
    "italic",
    "list-none",
    "not-sr-only",
    "overflow-auto",
    "overflow-hidden",
    "overflow-x-auto",
    "overflow-y-auto",
    "pointer-events-auto",
    "pointer-events-none",
    "proportional-nums",
    "relative",
    "resize-none",
    "select-none",
    "shrink-0",
    "sr-only",
    "sticky",
    "tabular-nums",
    "truncate",
    "uppercase",
    "visible",
    "whitespace-nowrap",
    "whitespace-pre",
]);

const utilityPrefixes = [
    "align",
    "animate",
    "appearance",
    "aspect",
    "backdrop",
    "basis",
    "bg",
    "blur",
    "border",
    "bottom",
    "col",
    "content",
    "cursor",
    "decoration",
    "duration",
    "ease",
    "fill",
    "flex",
    "font",
    "gap",
    "grid",
    "grow",
    "h",
    "inset",
    "items",
    "justify",
    "leading",
    "left",
    "list",
    "m",
    "max-h",
    "max-w",
    "mb",
    "min-h",
    "min-w",
    "ml",
    "mr",
    "mt",
    "mx",
    "my",
    "object",
    "opacity",
    "order",
    "origin",
    "outline",
    "overflow",
    "overscroll",
    "p",
    "pb",
    "place",
    "placeholder",
    "pl",
    "pr",
    "pt",
    "px",
    "py",
    "ring",
    "right",
    "rotate",
    "rounded",
    "row",
    "scale",
    "select",
    "self",
    "shadow",
    "shrink",
    "size",
    "space",
    "stroke",
    "table",
    "text",
    "top",
    "tracking",
    "transition",
    "translate",
    "w",
    "z",
];

const variants = [
    "after",
    "aria-hidden",
    "before",
    "checked",
    "disabled",
    "empty",
    "enabled",
    "even",
    "first",
    "focus",
    "focus-visible",
    "focus-within",
    "hover",
    "invalid",
    "last",
    "odd",
    "open",
    "placeholder-shown",
    "required",
    "valid",
    "visited",
];

function componentFiles(dir = componentsRoot): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const file = join(dir, entry.name);
        if (entry.isDirectory()) return componentFiles(file);
        if (!/\.tsx?$/.test(file)) return [];
        if (/\.(styles|types|utils)\.ts$/.test(file) || /\.context\.tsx$/.test(file)) return [];
        return [file];
    });
}

function splitVariant(token: string): [variant: string, utility: string] | undefined {
    let bracketDepth = 0;

    for (let index = 0; index < token.length; index += 1) {
        const character = token[index];
        if (character === "[") bracketDepth += 1;
        if (character === "]") bracketDepth -= 1;
        if (character !== ":" || bracketDepth > 0) continue;

        return [token.slice(0, index), token.slice(index + 1)];
    }

    return undefined;
}

function isVariantPrefix(value: string): boolean {
    return (
        variants.includes(value) ||
        ["2xl", "lg", "md", "sm", "xl"].includes(value) ||
        (value.startsWith("[") && value.endsWith("]")) ||
        (value.startsWith("data-[") && value.endsWith("]")) ||
        (value.startsWith("aria-[") && value.endsWith("]")) ||
        (value.startsWith("group-has-[") && value.endsWith("]")) ||
        value.startsWith("group-") ||
        value.startsWith("peer-")
    );
}

function stripVariant(token: string): string {
    let next = token.replace(/^!/, "");

    while (true) {
        const parts = splitVariant(next);
        if (!parts || !isVariantPrefix(parts[0])) return next.replace(/^!/, "");
        next = parts[1];
    }
}

function isUtilityClass(token: string): boolean {
    if (!token || token.startsWith("__")) return false;
    if (["input", "select", "typography"].includes(token)) return false;
    if (token.startsWith("group-table-")) return false;

    const utility = stripVariant(token);
    if (staticUtilities.has(utility)) return true;

    return utilityPrefixes.some(
        (prefix) => utility.startsWith(`${prefix}-`) || utility.startsWith(`-${prefix}-`) || utility.startsWith(`${prefix}[`)
    );
}

function isClassContext(node: ts.Node): boolean {
    let current: ts.Node | undefined = node.parent;

    while (current) {
        if (
            ts.isJsxAttribute(current) &&
            ts.isIdentifier(current.name) &&
            ["bodyClassName", "className", "container", "titleClassName"].includes(current.name.text)
        ) {
            return true;
        }

        if (
            ts.isPropertyAssignment(current) &&
            ts.isIdentifier(current.name) &&
            ["bodyClassName", "className", "container", "titleClassName"].includes(current.name.text)
        ) {
            return true;
        }

        if (ts.isCallExpression(current)) {
            const expression = current.expression;
            if (ts.isIdentifier(expression) && ["css", "cva"].includes(expression.text)) return true;
            if (ts.isPropertyAccessExpression(expression) && ["css", "cva"].includes(expression.name.text)) return true;
        }

        current = current.parent;
    }

    return false;
}

function collectUtilityClasses(file: string): string[] {
    const source = readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const findings: string[] = [];

    function check(text: string, node: ts.Node) {
        const utilities = text.split(/\s+/).filter(isUtilityClass);
        if (utilities.length === 0) return;

        const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        findings.push(`${relative(process.cwd(), file)}:${position.line + 1} ${utilities.join(" ")}`);
    }

    function visit(node: ts.Node) {
        if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && isClassContext(node)) {
            check(node.text, node);
        }

        if (ts.isTemplateExpression(node) && isClassContext(node)) {
            check(node.head.text, node.head);
            for (const span of node.templateSpans) check(span.literal.text, span.literal);
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return findings;
}

describe("component class names", () => {
    it("do not use utility classes directly", () => {
        const findings = componentFiles().flatMap(collectUtilityClasses);

        expect(findings).toEqual([]);
    });
});
