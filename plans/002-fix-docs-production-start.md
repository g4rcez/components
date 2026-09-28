# Plan 002: Make the docs production start script launchable

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 294542b..HEAD -- packages/docs/package.json packages/docs/playwright.config.ts`
> If either in-scope configuration file changed since this plan was written,
> compare the "Current state" excerpts against the live files before
> proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `294542b`, 2026-09-22

## Why this matters

The docs package advertises a production `start` script, but it currently adds
`--turbo` to `next start`. The installed Next.js 16.1.1 production CLI exposes
`next start` options for port, hostname, keep-alive timeout, and config type
stripping; it does not expose a `--turbo` option. A production build can pass
while the deployment start command still fails before serving a page. Remove
the unsupported flag and prove the actual package script starts a built docs
server and serves a real route.

## Current state

- `packages/docs/package.json` — docs package scripts and dependencies.
- `packages/docs/playwright.config.ts` — existing browser configuration; its
  `webServer` deliberately starts the development server with `pnpm dev`, so it
  does not validate production startup.

Current package scripts include:

```json
// packages/docs/package.json:5-10
"dev": "NODE_OPTIONS=--conditions=source next dev --port 10000",
"build": "pnpm --filter @g4rcez/components build && next build",
"start": "next start --turbo",
"test:e2e": "pnpm --filter @g4rcez/components build && playwright test"
```

The installed CLI help was inspected during planning with:

```text
pnpm --filter docs exec next start --help
```

Its options include `--port`, `--hostname`, `--keepAliveTimeout`, and
`--experimental-next-config-strip-types`; there is no `--turbo`. The current
Playwright server command is:

```ts
// packages/docs/playwright.config.ts:11-15
webServer: {
    command: "rm -rf .next && NEXT_TELEMETRY_DISABLED=1 pnpm dev",
    url: "http://localhost:10000/docs/date-picker",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
}
```

This task is only about the production start command. Do not change the dev
server, the Next config, the route structure, or the browser test port.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Production build | `pnpm --filter docs build` | Library and docs build successfully; all static routes are generated |
| Production start help | `pnpm --filter docs exec next start --help` | Help exits 0 and lists no `--turbo` option |
| Production server smoke test | See Step 2 | Server stays alive and returns HTTP 200 for `/docs/toolbar` |
| Docs lint | `pnpm --filter docs lint` | Exit 0 |
| Formatting | `pnpm exec oxfmt --check packages/docs/package.json` | All matched files use the correct format |

## Scope

**In scope** (the only implementation files to modify):

- `packages/docs/package.json`
- `plans/README.md` — update only this plan's status row after completion.

**Out of scope**:

- `packages/docs/playwright.config.ts` — it intentionally runs the dev server
  for the existing browser suite.
- `packages/docs/next.config.mjs`, route files, deployment manifests, and
  library build scripts.
- Adding a new test framework, changing the production port default, or adding
  a second start script.

## Git workflow

- Work in the currently checked-out branch. Do not create or switch branches or
  worktrees.
- Before implementation, run `git diff --cached --quiet --`. If it reports
  staged changes, stop, list the staged paths, and ask the user to commit them.
- Preserve all pre-existing unstaged and untracked work. Never revert, delete,
  stage, or overwrite user-owned changes.
- Do not stage, commit, push, or open a pull request.

## Steps

### Step 1: Remove the unsupported production flag

Change only the `start` script in `packages/docs/package.json` from
`next start --turbo` to `next start`. Keep the script name and all other
scripts unchanged. Do not replace it with `next dev`, `next start --hostname`,
or a custom shell wrapper.

**Verify**: `pnpm exec oxfmt --check packages/docs/package.json` → all matched
files use the correct format.

### Step 2: Build and smoke-test the package script

Build the production app first:

```bash
pnpm --filter docs build
```

Then run the package's actual `start` script on an unused test port so it does
not interfere with the existing development server. From the repository root,
use a command equivalent to this and preserve the cleanup trap:

```bash
(
    set -eu
    log_file="$(mktemp -t g4rcez-docs-start.XXXXXX)"
    pnpm --filter docs start -- -p 10001 >"$log_file" 2>&1 &
    server_pid=$!
    cleanup() {
        kill "$server_pid" 2>/dev/null || true
        rm -f "$log_file"
    }
    trap cleanup EXIT INT TERM

    for attempt in $(seq 1 30); do
        if curl -fsS http://127.0.0.1:10001/docs/toolbar >/dev/null; then
            exit 0
        fi
        if ! kill -0 "$server_pid" 2>/dev/null; then
            cat "$log_file"
            exit 1
        fi
        sleep 1
    done

    cat "$log_file"
    exit 1
)
```

The expected result is exit 0, an HTTP 200 response for `/docs/toolbar`, and
no unsupported-option error in the server log. If port `10001` is occupied,
choose another unused port and use that same port consistently in the command.
Do not kill a process that was not started by this smoke test.

**Verify**: the smoke command exits 0 and the server is cleaned up by the trap.

### Step 3: Run focused quality checks

Run `pnpm --filter docs lint` and the formatting command from the table. Review
the package diff and confirm the only configuration change is removal of the
unsupported flag.

**Verify**: lint and formatting both exit 0; `git diff --check --
packages/docs/package.json` reports no whitespace errors.

## Test plan

- No new test framework or browser fixture is needed for this one-line package
  contract. The production smoke test in Step 2 is the regression check because
  it executes the exact `packages/docs` `start` script rather than a copied
  Next command.
- Keep the existing dev-browser suite unchanged; it verifies development
  behavior, not the production server.
- Verification: `pnpm --filter docs build`, the Step 2 smoke command, and
  `pnpm --filter docs lint` must all pass.

## Done criteria

- [ ] `packages/docs/package.json` contains exactly `"start": "next start"`.
- [ ] `pnpm --filter docs build` exits 0 and generates the docs routes.
- [ ] The actual package start script serves `/docs/toolbar` with HTTP 200 on a
  temporary port.
- [ ] The production server starts without an unsupported-option error.
- [ ] `pnpm --filter docs lint` exits 0.
- [ ] `pnpm exec oxfmt --check packages/docs/package.json` exits 0.
- [ ] No implementation files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

Stop and report instead of improvising if:

- `next start --help` now documents a supported `--turbo` option, because the
  finding is stale and the package may have changed independently.
- The production build fails for a reason unrelated to the `start` script; do
  not repair unrelated library or Next configuration in this plan.
- The smoke server fails because port `10001` is occupied and no safe unused
  port can be selected.
- The smoke command would need to kill an existing process or alter the shared
  development server.
- A verification command fails twice after one focused correction attempt.

## Maintenance notes

When upgrading Next.js, re-check `next start --help` and rerun the production
smoke test because CLI flags are version-specific. If deployment later adds a
platform-specific wrapper, keep the package `start` script as the minimal
portable production command and test the wrapper separately. This plan does
not add production E2E coverage for every route; it proves startup and one
representative docs route only.
