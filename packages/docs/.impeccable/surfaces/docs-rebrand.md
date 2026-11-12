---
version: 1
slug: "docs-rebrand"
primary_target: "src/app/page.tsx"
related_targets: ["src/components/docs-layout.tsx","src/components/component-demo.tsx","src/components/header.tsx","src/app/styles/brand.css"]
---

# Landing and documentation rebrand

Scope: packages/docs. Landing mode: Persuade. Documentation mode: Read.

## Direction contract

THESIS: Let the library be the colour. A neutral, border-led frame (Radix-documentation inspired) around live components, with a generated API reference on every page.

OWN-WORLD: Neutral steps at hue 240, one Ultramarine accent (hue 232), Geist Sans and Mono, hairline borders, a dotted preview panel, light and dark that follow the system until chosen.

STORY: A developer lands, sees real components working in a grid, opens the docs, finds the example, the props and the keyboard behaviour on one page, and finds anything with Cmd+K.

FIRST VIEWPORT: Landing: short hero, install command with package-manager tabs, then the showcase grid. Docs: 56px header, 248px grouped sidebar, a 760px article, and a 200px outline.

FORM: One scrolling page per component; the API reference is generated from packages/lib/ai/docs. Signature interaction: Cmd+K search that matches titles, descriptions, prop names and examples.

FINISH: Verified in a real browser at 1440/768/390 in light and dark; contract hooks preserved; brand assets generated from source (scripts/capture-brand.mjs).
