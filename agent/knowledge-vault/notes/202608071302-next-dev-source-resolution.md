---
title: "Resolve workspace package source in Next development"
type: approach
scope: project
created: 2026-08-07
source: "Local @g4rcez/components source resolution"
---

## Resolve workspace package source in Next development

### Trigger

Use this approach when a local Next app links `@g4rcez/components`, the package
has no `dist`, and Turbopack reports `Module not found` even when the package
exports a `source` condition.

### Approach

1. Read `packages/lib/package.json` exports and build exact development aliases
   from each export's `source` target.
2. Make Turbopack alias targets relative to the consuming app directory, not the
   workspace root. Keep absolute exact-match aliases for webpack.
3. Enable aliases only when `NODE_ENV` is `development`. Keep production builds
   on package output.
4. Treat Tailwind loaders separately. Tailwind config and PostCSS resolution can
   bypass Next aliases, so import the preset and CSS source directly.
5. For TypeScript source loaded by Tailwind config, use explicit `.ts` imports.
   Enable `allowImportingTsExtensions` and `rewriteRelativeImportExtensions` in
   emitting TypeScript configs.
6. Start each development server and request a page. Check the server log for
   JavaScript and CSS resolution errors.

### Why it worked

Next aliases, Node export conditions, and Tailwind/PostCSS use different
resolvers. A workspace-relative Turbopack target was interpreted relative to the
consuming app and pointed to a nonexistent nested path. One resolver setting
could not cover the Tailwind loaders.

### Reuse checklist

- [ ] Confirm the workspace symlink exists.
- [ ] Confirm `node --conditions=source` resolves the package export.
- [ ] Generate aliases from package exports instead of copying an export list.
- [ ] Resolve Turbopack targets from the consuming app directory.
- [ ] Test CSS and Tailwind config resolution separately.
- [ ] Request a real development page and require HTTP 200 with no module errors.

### Links

- Related: `scripts/components-source-aliases.mjs`
