import type { ComponentIndex } from "./components";
import type { ExportBinding } from "./modules";

export type ComponentImport = {
    source: string;
    original: string;
    namespace: boolean;
};

// `<Dialog.Content>` from a named import is `DialogContent`; from a
// namespace import it is the property alone.
export function importNameOf(imported: ComponentImport, root: string, property: string | null) {
    const suffix = property !== null && !imported.namespace ? property : "";
    return {
        source: imported.source,
        exportName: imported.namespace ? (property ?? "") : imported.original,
        name: imported.namespace ? (property ?? "") : `${imported.original === "default" ? root : imported.original}${suffix}`,
        suffix,
    };
}

// One the ui index owns, or any export of a componentImports source.
export function componentFromImport(
    index: ComponentIndex,
    binding: ExportBinding | null,
    importedName: ReturnType<typeof importNameOf>,
    patterns: RegExp[]
) {
    if (binding && index.owns(binding.file)) {
        const component = `${binding.name}${importedName.suffix}`;
        return { component, file: index.files.get(component) ?? binding.file };
    }
    if (patterns.some((pattern) => pattern.test(importedName.source))) {
        return { component: importedName.name, file: binding?.file ?? null };
    }
    return null;
}
