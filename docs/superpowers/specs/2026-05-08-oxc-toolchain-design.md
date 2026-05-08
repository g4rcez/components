# OXC Toolchain Migration

Replace ESLint + Prettier with OXC linter and formatter across the pnpm workspace. Add rustywind via lefthook for Tailwind class sorting on pre-commit.

## Scope

Both packages: `packages/lib` and `packages/docs`.

## Files Created

- `/oxlint.json` — workspace-wide lint config
- `/lefthook.yml` — pre-commit hook config

## Files Deleted

- `packages/lib/eslint.config.js`
- `packages/lib/.prettierrc.json`

## Package Changes

Root `package.json`:
- Remove: `prettier`, `prettier-plugin-tailwindcss`
- Add (devDeps, workspace root `-w`): `oxlint`, `@oxc-project/oxc_formatter`, `lefthook`, `rustywind`
- Add scripts: `lint` and `format` targeting workspace packages

`packages/lib/package.json`:
- Remove devDeps: `@eslint/js`, `eslint`, `eslint-config-react-app`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `typescript-eslint`, `prettier`
- Update `format` script: replace `npx prettier --write .` with `oxc_formatter format --write .`
- Add `lint` script: `oxlint .`

`packages/docs/package.json`:
- Add `lint` script: `oxlint .`
- Add `format` script: `oxc_formatter format --write .`

## oxlint.json

Single config at workspace root.

- Plugins enabled: `react`, `typescript`, `jsx-a11y`
- Ignores: `dist`, `.next`, `node_modules`
- Files: `**/*.{ts,tsx}`
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `react-refresh` plugin dropped — no oxlint equivalent; it is a Vite dev-only warning, not a correctness rule

## OXC Formatter

Package: `@oxc-project/oxc_formatter` (alpha).

Formatting options carried over from `.prettierrc.json`:
- indent width: 4
- semicolons: true
- single quotes: false
- trailing commas: es5
- print width: 150

Config is passed via CLI flags in the `format` script — no dedicated config file in the alpha API.

## Pre-commit Hook

`lefthook.yml` at workspace root. Pre-commit stage, runs in this order on staged `*.ts`/`*.tsx` files:

1. `rustywind --write` — Tailwind class sorting
2. `oxlint` — lint (fail-fast on errors)
3. `oxc_formatter format --write` — formatting

`lefthook` is registered in root `package.json` under `prepare` script (`lefthook install`) so hooks are installed automatically on `pnpm install`.

## Known Limitations

- OXC formatter is alpha. Output may diverge from prior Prettier output on first run; that diff is expected and acceptable.
- No Tailwind class sorting at format time (formatter pass only). Sorting happens at pre-commit via rustywind.
- `react-refresh/only-export-components` rule is dropped with no replacement.
