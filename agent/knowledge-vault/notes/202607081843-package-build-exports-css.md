---
title: "Package build exports must match built files"
type: approach
scope: project
created: 2026-07-08
source: "fix @g4rcez/components JS/CSS build output"
---

# Package build exports must match built files

## Trigger

When a workspace package builds but consumers fail to resolve CSS or subpath JS/types from `exports`.

## Approach

1. Compare `package.json` `exports` against files emitted under `dist`.
2. Make the JS bundler emit files at exported paths instead of patching consumers.
3. Keep the clean step as the first build command only; set later build tools to preserve `dist`.
4. Run the full workspace build, not just the package build, to catch package-consumer mismatches.

## Why it worked

The package was publishing CSS under `dist/css`, but some consumers imported non-exported paths and some JS/type subpaths did not line up with `exports`. Aligning emitted files and imports made the package contract real.

## Reuse checklist

- [ ] Check explicit `exports` targets exist after build.
- [ ] Check CSS files exist under exported CSS paths.
- [ ] Run at least one real workspace consumer build.

## Links

- Related: `packages/lib/package.json`
- Related: `packages/lib/vite.config.mts`
