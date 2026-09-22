---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/docs/page.tsx","src/components/docs-layout.tsx"]
---

# Landing and documentation rebuild

Scope: packages/docs only. Landing mode: Persuade. Documentation mode: Read.

## Direction contract

THESIS: Show the React library in use, then make its reference easy to navigate. Replace the oversized gradient hero and boxed documentation introductions with a connected, border-led site.

OWN-WORLD: Neutral ink and white surfaces, clear cyan actions, fine structural borders, restrained corners, readable sans-serif text and monospace only for code. The user explicitly chose Tailwind CSS and Next.js as references; that pinned direction overrides seed d72ac9bd (assigned index 7).

STORY: Developers see working components, open setup, and find an example without navigating through marketing or generic guidance.

FIRST VIEWPORT: A compact shared header above a left-aligned landing headline, installation action, and a live preview paired with source. Docs use a 248px navigation rail, readable article, and a quiet on-page outline. Mobile stacks previews and moves navigation to a drawer.

FORM: User-approved reference-led developer documentation, code-led. Signature interaction is opening documentation search from anywhere with the header or keyboard. Hover and focus transitions are restrained; no entrance motion hides content.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Preserve URLs, component APIs, demo behavior, light/dark switching, copy actions, and keyboard navigation. No dependencies, library edits, or shipping raster assets. Verify desktop and mobile on the existing localhost:10000 server. Build is not approved.
