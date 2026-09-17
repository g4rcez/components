// A component's variant axes, from its cva/tv definitions and from props
// typed as a union of string literals, which is the same shape written
// without a factory. Messages list these so reuse is the first option.

import * as fs from "node:fs";

import { walk } from "./ast";
import { mtimeOf } from "./fs";
import { parseSource } from "./parser";

export type VariantDefinition = {
    // buttonVariants, or the component whose props declare the axes.
    name: string | null;
    axes: Record<string, string[]>;
    // A factory stands in for any component in its file; props do not.
    source: "factory" | "props";
};

const cache = new Map<string, { mtimeMs: number; definitions: VariantDefinition[] }>();

const VARIANT_FACTORIES = new Set(["cva", "tv"]);

function keyName(node: any) {
    if (node.type === "Identifier") return node.name;
    if (node.type === "Literal" && typeof node.value === "string") return node.value;
    return null;
}

function axesOf(config: any) {
    const axes: Record<string, string[]> = {};
    if (config?.type !== "ObjectExpression") return axes;
    const variants = config.properties.find((p: any) => p.type === "Property" && keyName(p.key) === "variants");
    if (variants?.value?.type !== "ObjectExpression") return axes;
    for (const axis of variants.value.properties) {
        if (axis.type !== "Property") continue;
        const axisName = keyName(axis.key);
        if (!axisName || axis.value?.type !== "ObjectExpression") continue;
        axes[axisName] = axis.value.properties
            .filter((p: any) => p.type === "Property")
            .map((p: any) => keyName(p.key))
            .filter((k: any): k is string => typeof k === "string");
    }
    return axes;
}

const MAY_DEFINE_VARIANTS = /\b(?:cva|tv)\s*\(|\|\s*["']/;

// Null unless every member is a string literal (or undefined, for `?:`).
function literalValues(type: any) {
    if (!type) return null;
    const members = type.type === "TSUnionType" ? type.types : [type];
    const values: string[] = [];
    for (const member of members) {
        if (member.type === "TSUndefinedKeyword") continue;
        if (member.type === "TSLiteralType" && member.literal?.type === "Literal" && typeof member.literal.value === "string") {
            values.push(member.literal.value);
            continue;
        }
        return null;
    }
    return values.length ? values : null;
}

// Follows intersections and same-file aliases, so
// `React.ComponentProps<"div"> & Props` resolves.
function axesOfPropsType(type: any, declared: Map<string, any>, depth = 0) {
    const axes: Record<string, string[]> = {};
    if (!type || depth > 4) return axes;
    if (type.type === "TSIntersectionType") {
        for (const member of type.types) {
            Object.assign(axes, axesOfPropsType(member, declared, depth + 1));
        }
        return axes;
    }
    if (type.type === "TSTypeReference" && type.typeName?.type === "Identifier") {
        return axesOfPropsType(declared.get(type.typeName.name), declared, depth + 1);
    }
    const members = type.type === "TSTypeLiteral" ? type.members : type.type === "TSInterfaceBody" ? type.body : null;
    if (!members) return axes;
    for (const member of members) {
        if (member.type !== "TSPropertySignature") continue;
        const key = keyName(member.key);
        const values = literalValues(member.typeAnnotation?.typeAnnotation);
        if (key && values) axes[key] = values;
    }
    return axes;
}

function declaredTypes(ast: any) {
    const declared = new Map<string, any>();
    walk(ast, (node) => {
        if (node.type === "TSTypeAliasDeclaration" && node.id?.type === "Identifier") {
            declared.set(node.id.name, node.typeAnnotation);
        } else if (node.type === "TSInterfaceDeclaration" && node.id?.type === "Identifier") {
            declared.set(node.id.name, node.body);
        }
    });
    return declared;
}

// A component's first parameter and its name, for function declarations
// and `const X = (props) => ...`.
function componentSignature(node: any) {
    if (node.type === "FunctionDeclaration" && node.id?.type === "Identifier") {
        return { name: node.id.name as string, param: node.params?.[0] };
    }
    if (
        node.type === "VariableDeclarator" &&
        node.id?.type === "Identifier" &&
        (node.init?.type === "ArrowFunctionExpression" || node.init?.type === "FunctionExpression")
    ) {
        return { name: node.id.name as string, param: node.init.params?.[0] };
    }
    return null;
}

export function extractVariantDefinitions(source: string, file = "x.tsx") {
    const definitions: VariantDefinition[] = [];
    if (!MAY_DEFINE_VARIANTS.test(source)) return definitions;
    let ast: any;
    try {
        ast = parseSource(source, file);
    } catch {
        return definitions;
    }
    const declared = declaredTypes(ast);
    walk(ast, (node, parent) => {
        if (node.type === "CallExpression") {
            if (node.callee?.type !== "Identifier") return;
            if (!VARIANT_FACTORIES.has(node.callee.name)) return;
            // cva(base, config); tv(config) or tv(base, config).
            const [first, second] = node.arguments;
            const config = node.callee.name === "tv" && first?.type === "ObjectExpression" ? first : second;
            const axes = axesOf(config);
            if (!Object.keys(axes).length) return;
            const name = parent?.type === "VariableDeclarator" && parent.id?.type === "Identifier" ? parent.id.name : null;
            definitions.push({ name, axes, source: "factory" });
            return;
        }
        const signature = componentSignature(node);
        if (!signature) return;
        // `{ variant = "default" }: Props` or `props: Props`; the annotation
        // sits on the pattern either way.
        const type = signature.param?.typeAnnotation?.typeAnnotation;
        const axes = axesOfPropsType(type, declared);
        if (!Object.keys(axes).length) return;
        definitions.push({ name: signature.name, axes, source: "props" });
    });
    return definitions;
}

export function variantDefinitionsOf(file: string) {
    const mtimeMs = mtimeOf(file);
    if (mtimeMs === null) return [];
    const cached = cache.get(file);
    if (cached && cached.mtimeMs === mtimeMs) return cached.definitions;
    let definitions: VariantDefinition[] = [];
    try {
        definitions = extractVariantDefinitions(fs.readFileSync(file, "utf-8"), file);
    } catch {
        definitions = [];
    }
    cache.set(file, { mtimeMs, definitions });
    return definitions;
}

// The definition for a component: the cva named after it
// (buttonVariants for Button), else the component's own props (Text),
// else the file's first cva. Another component's props never apply.
function definitionFor(file: string, component: string) {
    const definitions = variantDefinitionsOf(file);
    if (!definitions.length) return null;
    const expected = component.charAt(0).toLowerCase() + component.slice(1) + "Variants";
    return (
        definitions.find((d) => d.name === expected) ??
        definitions.find((d) => d.name === component && d.source === "props") ??
        definitions.find((d) => d.source === "factory") ??
        null
    );
}

export function variantNamesFor(file: string, component: string) {
    const values = definitionFor(file, component)?.axes.variant;
    return values?.length ? values : null;
}

// The values of the component's size axis. Spacing findings offer them,
// because padding on a button usually means size.
export function sizeNamesFor(file: string, component: string) {
    const values = definitionFor(file, component)?.axes.size;
    return values?.length ? values : null;
}
