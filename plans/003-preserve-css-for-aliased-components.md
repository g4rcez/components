# Plan 003: Preserve CSS imports for aliased component imports

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 294542b..HEAD -- packages/lib/bin/csscomponents.mjs packages/lib/tests/style-import-cli.test.ts`
> If either in-scope source file changed since this plan was written, compare
> the "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `294542b`, 2026-09-22

## Why this matters

The `csscomponents` CLI scans source text to decide which component CSS chunks
to import. It recognizes canonical JSX names such as `<Button>` and direct
subpath imports, but it does not connect a renamed root-package import to the
component it represents. For example, `import { Button as SaveButton } from
"@g4rcez/components"` followed by `<SaveButton />` can be missed; a stylesheet
rewrite can then omit `button.css` even though the component is used. Teach the
existing detector to understand named import aliases without adding a parser or
changing the existing plain-source scanning contract.

## Current state

- `packages/lib/bin/csscomponents.mjs` — ESM CLI that scans source files,
  resolves manifest dependencies, and rewrites managed CSS imports.
- `packages/lib/tests/style-import-cli.test.ts` — Vitest CLI tests using a
  temporary project fixture and the checked-in component style manifest.
- `packages/lib/ai/component-style-manifest.json` — canonical manifest keyed by
  kebab-case component names such as `button`, with `@g4rcez/components/button`
  import metadata and CSS dependency metadata.

The detector currently derives only the canonical PascalCase name:

```js
// packages/lib/bin/csscomponents.mjs:165-194
const componentAliases = (name) => {
    const pascal = pascalCase(name);
    return new Set([pascal]);
};

const hasJsxUsage = (content, alias) => new RegExp(`<${escapeRegExp(alias)}(?:[\\s>/]|\\.)`, "u").test(content);

const hasImportUsage = (content, name, entry, packageName) => {
    const packageImport = entry.import.replace(PACKAGE_NAME, packageName);
    if (content.includes(`"${packageImport}"`) || content.includes(`'${packageImport}'`)) return true;
    if (content.includes(`"${packageName}/${name}"`) || content.includes(`'${packageName}/${name}'`)) return true;
    return new RegExp(`from\\s+["'][^"']*/${escapeRegExp(name)}["']`, "u").test(content);
};
```

`detectUsedComponents` then checks class strings, canonical JSX aliases, and
import strings for every manifest entry:

```js
// packages/lib/bin/csscomponents.mjs:176-194
const detectUsedComponents = (files, manifest, packageName) => {
    const used = new Set();

    for (const file of files) {
        const content = readFileSync(file, "utf8");
        for (const [name, entry] of Object.entries(manifest)) {
            if (used.has(name)) continue;
            const aliases = componentAliases(name);
            const classNames = [entry.classes?.base, ...Object.values(entry.classes?.slots ?? {})].filter(Boolean);
            const classUsage = classNames.some((className) => content.includes(className));
            const jsxUsage = [...aliases].some((alias) => hasJsxUsage(content, alias));
            if (jsxUsage || classUsage || hasImportUsage(content, name, entry, packageName)) used.add(name);
        }
    }

    return [...used];
};
```

The import plan correctly emits the foundation import and CSS chunks for the
set of detected component names (`packages/lib/bin/csscomponents.mjs:288-313`),
so the defect is in detection rather than ordering or dependency resolution.

Existing tests create a project with a canonical import and `<Button>` and
assert `foundation.css` plus `button.css` (`packages/lib/tests/style-import-cli.test.ts:13-47`).
There is no test for a renamed named import. Keep the current no-new-dependency,
plain-text scanner approach and preserve support for the `--package` option and
`--library-root` mode.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Syntax check | `pnpm exec node --check packages/lib/bin/csscomponents.mjs` | Exit 0 and no output |
| Focused CLI tests | `pnpm --filter @g4rcez/components test tests/style-import-cli.test.ts` | All tests pass, including alias coverage |
| Library lint | `pnpm --filter @g4rcez/components lint` | Exit 0 |
| Formatting | `pnpm exec oxfmt --check packages/lib/bin/csscomponents.mjs packages/lib/tests/style-import-cli.test.ts` | All matched files use the correct format |

## Scope

**In scope** (the only implementation files to modify):

- `packages/lib/bin/csscomponents.mjs`
- `packages/lib/tests/style-import-cli.test.ts`
- `plans/README.md` — update only this plan's status row after completion.

**Out of scope**:

- Adding an AST/parser dependency or changing package dependencies/lockfiles.
- Changing the component style manifest, CSS dependency order, import output,
  or `--package`/`--library-root` command-line semantics.
- Replacing the source scanner with a full JavaScript parser.
- Changing how CSS class-string usage or direct subpath imports are detected.

## Git workflow

- Work in the currently checked-out branch. Do not create or switch branches or
  worktrees.
- Before implementation, run `git diff --cached --quiet --`. If it reports
  staged changes, stop, list the staged paths, and ask the user to commit them.
- Preserve all pre-existing unstaged and untracked work. Never revert, delete,
  stage, or overwrite user-owned changes.
- Do not stage, commit, push, or open a pull request.

## Steps

### Step 1: Define the alias-detection contract

Keep the existing canonical aliases and add local names from named imports from
the configured root package. The detector must recognize both forms below,
including whitespace/newlines inside the braces:

```tsx
import { Button } from "@g4rcez/components";
import { Button as SaveButton } from "@g4rcez/components";

export const Example = () => <SaveButton>Save</SaveButton>;
```

For a manifest entry named `button`, map the imported symbol `Button` to the
local symbol `SaveButton`. Use the runtime `packageName` argument rather than
hardcoding `@g4rcez/components` when matching the root-package import. Keep
subpath import detection unchanged; it already recognizes imports such as
`@g4rcez/components/button`.

Implement a small helper in `csscomponents.mjs` that receives source content,
the manifest component name, and `packageName`, then returns a set containing
the canonical PascalCase name plus matching local aliases. Integrate it into
`detectUsedComponents` without scanning the same file more times than the
current loop requires. A bounded regular-expression import scan is acceptable
for this existing text scanner; it must not require a new dependency.

Only aliases whose imported symbol matches the current manifest component may
be added. Do not treat an unrelated import renamed to `SaveButton` as a
`Button` use. Preserve the existing JSX boundary check so `<ButtonGroup>` is
not treated as `<Button>`.

**Verify**: `pnpm exec node --check packages/lib/bin/csscomponents.mjs` → exit 0.

### Step 2: Add regression tests for aliased root imports

Extend the existing `createProject` fixture in
`packages/lib/tests/style-import-cli.test.ts` so a test can provide source
content. Add tests that run the real CLI in a temporary project and inspect the
rewritten stylesheet:

1. A multiline root-package named alias, such as `Button as SaveButton`, used
   as `<SaveButton>`, emits `foundation.css` and `button.css`.
2. The canonical `<Button>` test continues to pass.
3. An unrelated named import aliased to the same local JSX name does not cause
   `button.css` to be emitted, unless another real usage causes it.

Use the existing `execFileSync`, manifest path, temporary root, and stylesheet
assertion patterns. Do not assert internal helper calls; assert the CSS imports
that a consumer observes. If the implementation supports more named-import
forms, add only cases needed to prove those forms and avoid turning the test
into a JavaScript parser suite.

**Verify**: `pnpm --filter @g4rcez/components test tests/style-import-cli.test.ts` → all tests pass with the new alias cases.

### Step 3: Preserve output behavior and run quality checks

Review `createImportPlan` and `updateStylesheet` after the detector change.
Confirm that only the detected component set changes for aliased imports; CSS
import order, dependency expansion, removal of managed imports, and unrelated
stylesheet content remain unchanged. Run the focused test, lint, syntax, and
format commands from the table.

**Verify**: all commands in the table exit 0; `git diff --check --
packages/lib/bin/csscomponents.mjs packages/lib/tests/style-import-cli.test.ts`
reports no whitespace errors.

## Test plan

- Extend `packages/lib/tests/style-import-cli.test.ts`, following its existing
  disposable-project pattern.
- Cover multiline named root imports, aliased JSX usage, canonical usage, and
  an unrelated symbol/alias false-positive guard.
- Keep tests package-mode based; the detection helper is shared by package and
  local-source output modes, so no duplicate mode test is needed unless the
  implementation changes mode-specific code.
- Verification: `pnpm --filter @g4rcez/components test tests/style-import-cli.test.ts`
  must pass.

## Done criteria

- [ ] A named root import alias used in JSX causes the matching CSS chunk to be
  emitted.
- [ ] Canonical JSX, class-string, and direct subpath detection still work.
- [ ] An unrelated import does not create a false component match.
- [ ] No new dependency or parser is added.
- [ ] `pnpm --filter @g4rcez/components test tests/style-import-cli.test.ts` exits 0.
- [ ] `pnpm --filter @g4rcez/components lint` exits 0.
- [ ] `pnpm exec oxfmt --check packages/lib/bin/csscomponents.mjs packages/lib/tests/style-import-cli.test.ts` exits 0.
- [ ] No implementation files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

Stop and report instead of improvising if:

- The manifest no longer uses kebab-case keys or no longer exposes the
  `entry.import`/`entry.css` shape described above.
- Supporting aliases safely requires an AST parser or a dependency change;
  report that design choice instead of adding a parser in this plan.
- The configured package name can contain syntax that makes a bounded import
  matcher unsafe; report the needed input contract rather than interpolating
  it unsafely.
- Existing tests show that changing aliases alters CSS output for canonical
  imports, class strings, or direct subpath imports.
- A verification command fails twice after one focused correction attempt.

## Maintenance notes

The scanner is intentionally lightweight and will not understand every valid
JavaScript import form. If future requirements include namespace imports,
re-exports, TypeScript path aliases, or comment/string exclusion, create a
separate parser-evaluation plan rather than expanding regexes indefinitely.
Reviewers should check that alias matching remains scoped to the configured
package and that the existing JSX word boundary prevents prefix collisions.
