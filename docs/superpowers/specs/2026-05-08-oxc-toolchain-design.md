# OXC Toolchain Migration

Replace ESLint + Prettier with OXC linter (`oxlint`) and OXC formatter (`oxfmt`) across the pnpm workspace. `oxfmt` handles Tailwind CSS class sorting natively — no separate tool needed.

## Scope

Both packages: `packages/lib` and `packages/docs`.

## Files Created

- `/oxlint.json` — workspace-wide lint config
- `/.oxfmtrc.json` — oxfmt formatting config
- `/lefthook.yml` — pre-commit hook config

## Files Deleted

- `packages/lib/eslint.config.js`
- `packages/lib/.prettierrc.json`

## Package Changes

Root `package.json`:
- Remove: `prettier`, `prettier-plugin-tailwindcss`
- Add (devDeps, workspace root `-w`): `oxlint`, `oxfmt`, `lefthook`
- Add scripts: `lint` (`pnpm run -r lint`), `format` (`pnpm run -r format`), `prepare` (`lefthook install`)

`packages/lib/package.json`:
- Remove devDeps: `@eslint/js`, `eslint`, `eslint-config-react-app`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `typescript-eslint`, `prettier`
- Update `format` script: `oxfmt --write .`
- Add `lint` script: `oxlint .`

`packages/docs/package.json`:
- Add `lint` script: `oxlint .`
- Add `format` script: `oxfmt --write .`

## oxlint.json

Single config at workspace root.

- Plugins enabled: `react`, `typescript`, `jsx-a11y`
- Ignores: `dist`, `.next`, `node_modules`
- Files: `**/*.{ts,tsx}`
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `react-refresh` plugin dropped — no oxlint equivalent; it is a Vite dev-only warning, not a correctness rule

## OXC Formatter

Package: `oxfmt` (alpha). Config file: `/.oxfmtrc.json` at workspace root.

Formatting options carried over from `.prettierrc.json`:
- `tabWidth`: 4
- `semi`: true
- `singleQuote`: false
- `trailingComma`: "es5"
- `printWidth`: 150

Tailwind CSS class sorting enabled via `sortTailwindcss: true` — covers all `cn()` call sites and JSX `className` attributes natively. No separate tool required.

## Pre-commit Hook

`lefthook.yml` at workspace root. Pre-commit stage, runs in this order on staged `*.ts`/`*.tsx` files:

1. `oxfmt --write` — format + Tailwind class sorting (stage_fixed: true to re-stage modified files)
2. `oxlint` — lint (fail-fast on errors)

`lefthook` is registered in root `package.json` under `prepare` script (`lefthook install`) so hooks are installed automatically on `pnpm install`.

## Known Limitations

- `oxfmt` is alpha. Output may diverge from prior Prettier output on first run; that diff is expected and acceptable.
- `react-refresh/only-export-components` rule is dropped with no replacement.
