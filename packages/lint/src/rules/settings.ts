// settings.shadcn: the recognition options written once instead of once
// per rule, with a rule's own option winning. `ui` is an import prefix,
// what components.json's aliases.ui is for projects without that file.

import { warnOnce } from "../project/warn";

const SHARED = ["componentImports", "ignoreImports", "mergeFunctions", "variantFunctions"] as const;

function strings(value: unknown, key: string) {
    const list = Array.isArray(value) ? value : value == null ? [] : [value];
    if (!list.every((v) => typeof v === "string")) {
        warnOnce(`settings:${key}`, `settings.shadcn.${key} must be a string or an array of strings; it is ignored.`);
        return null;
    }
    return list as string[];
}

function escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function withSettings<T extends Record<string, unknown>>(context: any, options: T) {
    const settings = context.settings?.shadcn;
    if (!settings || typeof settings !== "object") return options;
    const merged: Record<string, unknown> = { ...options };
    for (const key of SHARED) {
        if (merged[key] !== undefined || settings[key] === undefined) continue;
        const list = strings(settings[key], key);
        if (list) merged[key] = list;
    }
    if (settings.ui !== undefined) {
        const prefixes = strings(settings.ui, "ui") ?? [];
        if (prefixes.length) {
            merged.componentImports = [
                ...((merged.componentImports as string[] | undefined) ?? []),
                ...prefixes.map((prefix) => `^${escapeRegExp(prefix)}(/|$)`),
            ];
        }
    }
    return merged as T;
}
