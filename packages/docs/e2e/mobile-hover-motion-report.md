# E2E report: touch hover gating, mobile fixes, small animations

Date: 2026-11-04 · Browser: Chromium only (Playwright 1.61, the project's only configured browser) · Target: docs dev server (`pnpm dev`, library source via `--conditions=source`)

## Result

| Run | Result |
|---|---|
| New specs on current sources (`touch-hover`, `motion-feedback`, `dropdown-docs`) | **20 / 20 pass** |
| `touch-hover` + `motion-feedback` (18) on `HEAD` sources, before the changes | **12 fail, 6 pass** — the specs detect the problems |
| Whole e2e suite on current sources (45 tests) | 42 pass, **3 fail** — all 3 also fail on `HEAD` (pre-existing, unrelated) |
| Unit guard `packages/lib/tests/hover-gating.test.ts` | pass (failed first on 49 ungated `:hover` selectors) |
| `tsc` (docs, `e2e/`), `oxfmt`, `oxlint` on the new files | clean |

## What was added

- `e2e/touch-hover.spec.ts` (10 tests). A Pixel 7 context (`hover: none`, `pointer: coarse`, 1024×768) against a desktop context (`hover: hover`, `pointer: fine`).
- `e2e/motion-feedback.spec.ts` (8 tests). Press feedback, floating-panel enter animations, Alert and FileUpload motion, reduced motion.
- `e2e/dropdown-docs.spec.ts` (2 tests, added with the Dropdown fix). The docs page has no hydration error or nested buttons, and a `Button` trigger opens the panel and reports `aria-expanded`.
- `packages/lib/tests/hover-gating.test.ts` (unit, `postcss`). Fails if any `:hover` rule is outside `@media (hover: hover) and (pointer: fine)`, apart from three allowlisted selectors.

## Per-test outcome

"HEAD" means the library sources before this work.

| Spec · test | HEAD | Now |
|---|---|---|
| touch · is emulated as a device without hover (sanity) | pass | pass |
| touch · a tapped button is not left dimmed by sticky hover/focus | fail | pass |
| touch · button: `touch-action: manipulation`, no tap flash, `user-select: none` | fail | pass |
| touch · table column resizers visible without hovering | fail | pass |
| touch · small inputs are ≥ 16px (iOS zoom) | fail | pass |
| mouse · hovering a button dims it | pass | pass |
| mouse · keyboard focus dims a button | pass | pass |
| mouse · a click does not leave a button dimmed by focus | fail | pass |
| mouse · resizers hidden until the header is hovered | pass | pass |
| mouse · small inputs keep their compact 14px size | pass | pass |
| motion · pressed button scales to 0.97 and returns | fail | pass |
| motion · pressed checkbox scales to 0.95 and returns | fail | pass |
| motion · dropdown: enter animation, opens below trigger, origin at trigger edge, no `transform` positioning | fail | pass |
| motion · menu and submenu enter animation, submenu grows from its left edge | fail | pass |
| motion · alert opened after load fades in; alert open on load does not | fail | pass |
| motion · FileUpload icon pops in on drag | fail | pass |
| reduced motion · pressed button does not scale | pass (nothing to scale at HEAD) | pass |
| reduced motion · dropdown only fades | fail | pass |

## Findings

1. **Bug in my earlier CSS, caught by these tests and fixed.** The reduced-motion rule `.__button:active { transform: none }` had specificity (0,2,0). The press rule is (0,4,0). Users with reduced motion still got the scale. The reduced-motion selector now matches the press selector (`button.css`). Unit tests and typecheck did not catch this.
2. **Dropdown docs page hydration error: fixed.** `Dropdown` always wrapped its `trigger` in a `<button>`, and the docs demos passed a `<Button>`, so buttons were nested. In dev the Next error overlay covered the page and the demos disappeared. The documented contract already said not to pass a button as `trigger`. Fix: a new optional `asChild` prop on `Dropdown` (same pattern as `Menu`). With `asChild`, the `trigger` element receives the trigger props directly through `Slot`, with no wrapper. Existing callers are unchanged. The docs demos now use `asChild`, `ai/docs/Dropdown.md` documents it, and `tests/floating-contracts.test.tsx` has a contract test (red first: 2 buttons rendered). Before the fix the page probe showed the hydration error and overlay. After it, the `dropdown-docs` spec passes.
3. **Pre-existing e2e failures (same result on `HEAD`):** `date-picker.spec.ts` "range example stages a preset…" and both `drawing-editor.spec.ts` tests (the Undo button stays disabled; the stroke pixels are not drawn). Not touched.
4. **Pre-existing typecheck error:** `packages/docs/src/app/docs/video-player/page.tsx(40,34)` implicit `any`.

## Not covered (needs a real device or another browser)

- **iOS zoom on focus** and **sticky hover on real touch hardware.** The tests use Chromium's emulation. The computed styles are correct, but iOS Safari behavior is unverified. The project has no WebKit project configured, although a WebKit browser is installed locally.
- **`100dvh` drawer height** with a collapsing URL bar, and **`env(safe-area-inset-bottom)` on the sheet.** Playwright cannot set safe-area insets or dynamic toolbar height.
- **Table filter trigger.** No docs table renders a filter, so only the resizer reveal is tested.
- **Row aside reveal** (left ungated on purpose). Covered by the existing unit test `row-aside-keyboard.test.tsx`.
- Visual feel: curves and durations (150ms, `cubic-bezier(0.23, 1, 0.32, 1)`) were checked only as computed values.

## Method notes and caveats

- **Before/after comparison.** I backed up my 27 changed `packages/lib/src` files, put the `HEAD` versions back, ran the specs, and restored. After the first attempt the restore ran from the wrong directory and did nothing. I caught it and restored from the backup by absolute path. All 27 files had identical checksums before and after. A second comparison for the 3 pre-existing failures used a fixed script and also restored cleanly.
- **Concurrent changes in the working tree.** While this ran, other changes appeared that I did not make: a skills rename (`csscomponents` → `g4rcez-components`), edits to `AGENTS.md`, `scripts/skills.mjs`, `skills-sync.test.ts`, `packages/lib/package.json`, and deleted `.agents`/`.claude` skill files. I left them alone. My runs only touched `packages/lib/src`.
- `playwright.config.ts` starts `rm -rf .next && pnpm dev` itself. I ran against a server I started manually, then stopped it (no listener on port 10000 now).
- `test.use({ reducedMotion })` is not applied in this Playwright version. The specs use `page.emulateMedia`, as `reduced-motion.spec.ts` already does.

## Run it

```sh
cd packages/docs
pnpm exec playwright test e2e/touch-hover.spec.ts e2e/motion-feedback.spec.ts
pnpm --filter @g4rcez/components exec vitest run tests/hover-gating.test.ts
```
