// One tree walk for every analysis that reads an AST without a linter
// traversal. Skips parent back-references that are not part of Oxc's AST.

export function walk(node: any, visit: (node: any, parent: any) => void, parent: any = null) {
    if (!node || typeof node.type !== "string") return;
    visit(node, parent);
    for (const key of Object.keys(node)) {
        if (key === "parent") continue;
        const value = node[key];
        if (Array.isArray(value)) {
            for (const child of value) walk(child, visit, node);
        } else if (value && typeof value.type === "string") {
            walk(value, visit, node);
        }
    }
}
