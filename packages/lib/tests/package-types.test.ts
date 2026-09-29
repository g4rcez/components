import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const consumerFile = resolve(root, "tests/package-consumer.tsx");
const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: false,
    noEmit: true,
    esModuleInterop: true,
    types: ["react", "node"],
};
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
    name: string;
    exports: Record<string, string | { types?: string }>;
};

function publicDeclarations() {
    const declarations = new Map<string, string>();
    for (const [specifier, target] of Object.entries(packageJson.exports)) {
        if (typeof target !== "string" && target.types && !specifier.includes("*")) {
            declarations.set(specifier, resolve(root, target.types));
        }
    }
    // Exercise both source-shaped wildcard paths and the historical flattened
    // aliases, including modules that have no top-level named package export.
    for (const file of globSync("src/components/**/*.{ts,tsx}", { cwd: root, absolute: true })) {
        const path = relative(resolve(root, "src"), file).replaceAll("\\", "/").replace(/\.tsx?$/u, "");
        const declaration = resolve(root, "dist", `${path}.d.ts`);
        declarations.set(`./${path}`, declaration);
        const name = basename(path);
        if (name.endsWith(".styles")) continue;
        if (path.startsWith("components/form/input/")) {
            declarations.set(`./components/form/${name}`, declaration);
        } else if (name === basename(dirname(path))) {
            declarations.set(`./${dirname(path)}`, declaration);
        }
    }
    return declarations;
}

function specifier(path: string) {
    return path === "." ? packageJson.name : `${packageJson.name}/${path.slice(2)}`;
}

describe("published declarations (build the library first)", () => {
    it("resolves every typed entry and original component wildcard alias", () => {
        for (const [path, declaration] of publicDeclarations()) {
            const resolved = ts.resolveModuleName(specifier(path), consumerFile, options, ts.sys).resolvedModule;
            expect(resolved?.resolvedFileName, specifier(path)).toBe(declaration);
        }
    });

    it("type-checks consumers and transitive declarations without skipLibCheck", () => {
        const imports = [...publicDeclarations().keys()].map((path, index) =>
            `import type * as Public${index} from ${JSON.stringify(specifier(path))};`
        );
        const source = `${imports.join("\n")}
import { Button } from "@g4rcez/components/button";
import { Button as WildcardButton } from "@g4rcez/components/components/core/button";
import { Button as NestedButton } from "@g4rcez/components/components/core/button/button";
import { createColumns, path, useForm } from "@g4rcez/components";
import { FileUpload } from "@g4rcez/components/file-upload";
import { z } from "zod";
declare const row: {
    profile?: { name: string } | null;
    items: readonly { title: string }[];
    pair: readonly [{ left: string }, { right: number }];
    choice: { first: boolean } | { second: bigint };
    created: Date;
    mixedKeys: { 0: string; title: string };
};
path(row, "profile.name");
path(row, "items[12].title");
path(row, "pair[0].left");
path(row, "pair[1].right");
// Tuple paths historically recurse through the union of element types.
path(row, "pair[0].right");
path(row, "choice.first");
path(row, "choice.second");
path(row, "created");
path(row, "mixedKeys");
// @ts-expect-error Symbol-keyed objects such as Date retain only the parent path.
path(row, "created.getTime");
// @ts-expect-error Mixed numeric/string-keyed objects retain only the parent path.
path(row, "mixedKeys.title");
// @ts-expect-error Unknown nested keys are rejected.
path(row, "profile.missing");
// @ts-expect-error Arrays use bracket indexes, not dotted numeric indexes.
path(row, "items.0.title");
// @ts-expect-error Fixed tuples reject indexes outside their length.
path(row, "pair[2].left");
createColumns<typeof row>((column) => {
    column.add("profile.name", "Name");
    column.add("items[0].title", "Title");
    // @ts-expect-error Column ids use the same checked nested paths.
    column.add("items[0].missing", "Missing");
});
const schema = z.object({ profile: z.object({ name: z.string() }), items: z.array(z.object({ title: z.string() })) });
const form = useForm(schema, "typed-consumer");
form.input("profile.name");
form.input("items[0].title");
// @ts-expect-error Form fields retain checked nested paths.
form.input("profile.missing");
const upload = <FileUpload accept={{ "image/png": [".png"] }} multiple onDeleteFile={(file) => file.name} />;
// @ts-expect-error Dropzone accept overrides the native input string attribute.
const invalidUpload = <FileUpload accept="image/png" />;
const button = <Button theme="primary" size="small">Save</Button>;
const anchor = <WildcardButton as="a" href="/guide">Guide</WildcardButton>;
const nested = <NestedButton disabled>Disabled</NestedButton>;
// @ts-expect-error Unknown variants must remain rejected by the published types.
const invalid = <Button theme="not-a-theme" />;
`;
        const host = ts.createCompilerHost(options);
        const readFile = host.readFile.bind(host);
        const fileExists = host.fileExists.bind(host);
        host.readFile = (file) => file === consumerFile ? source : readFile(file);
        host.fileExists = (file) => file === consumerFile || fileExists(file);
        const program = ts.createProgram([consumerFile], options, host);
        const diagnostics = ts.getPreEmitDiagnostics(program);
        expect(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCanonicalFileName: (file) => file,
            getCurrentDirectory: () => root,
            getNewLine: () => "\n",
        })).toBe("");
    }, 30_000);
});
