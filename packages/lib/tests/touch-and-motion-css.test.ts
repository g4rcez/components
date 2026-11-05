import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss, { type AtRule, type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const hoverQuery = "(hover: hover) and (pointer: fine)";
const reducedMotion = "(prefers-reduced-motion: reduce)";

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();

type Found = { media: string | null; offset: number; declarations: Record<string, string[]> };

const rulesFor = (path: string, selector: string): Found[] => {
    const found: Found[] = [];
    postcss.parse(readFileSync(resolve(__dirname, "..", path), "utf8")).walkRules((rule: Rule) => {
        if (!rule.selectors.map(normalize).includes(selector)) return;
        const parent = rule.parent as AtRule | undefined;
        const declarations: Record<string, string[]> = {};
        rule.walkDecls((declaration) => {
            (declarations[declaration.prop] ??= []).push(normalize(declaration.value));
        });
        found.push({
            declarations,
            offset: rule.source?.start?.offset ?? 0,
            media: parent?.type === "atrule" && parent.name === "media" ? normalize(parent.params) : null,
        });
    });
    return found;
};

const css = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");

describe("viewport units and safe areas", () => {
    it("sizes the drawer to the visible viewport, with a vh fallback for older browsers", () => {
        const [drawer] = rulesFor("src/components/floating/modal/modal.css", ".__modal--type-drawer");
        expect(drawer.declarations.height).toEqual(["100vh", "100dvh"]);
        expect(drawer.declarations["max-height"]).toEqual(["100vh", "100dvh"]);
    });

    it("sizes the list overlay to the visible viewport, with a vh fallback", () => {
        const [overlay] = rulesFor("src/components/display/list/list.css", ".__list__overlay");
        expect(overlay.declarations.height).toEqual(["100vh", "100dvh"]);
    });

    it("sizes the modal overlay token to the visible viewport", () => {
        const [root] = rulesFor("src/styles/tokens.css", ":root");
        expect(root.declarations["--var-modal-overlay-block-size"]).toEqual(["100dvh"]);
    });

    it("keeps the sheet content above the home indicator when the app opts into viewport-fit=cover", () => {
        const [sheet] = rulesFor("src/components/floating/modal/modal.css", ".__modal--type-sheet");
        expect(sheet.declarations["padding-bottom"]).toEqual([
            "calc(var(--var-modal-sheet-padding-block-end, calc(var(--var-spacing-base) * 1.5)) + env(safe-area-inset-bottom, 0px))",
        ]);
    });
});

describe("press feedback and reduced motion", () => {
    // The reduced-motion rule only wins if its selector is as specific as the press rule and comes after it.
    const cases = [
        {
            name: "Button",
            path: "src/components/core/button/button.css",
            selector: '.__button:not(:disabled):not([aria-disabled="true"]):active',
            scale: "scale(0.97)",
        },
        {
            name: "Checkbox",
            path: "src/components/form/checkbox/checkbox.css",
            selector: ".__checkbox__control-state:not(:disabled):active",
            scale: "scale(0.95)",
        },
    ];

    it.each(cases)(
        "$name scales when pressed and drops the scale under reduced motion with the same selector, later in the file",
        ({ path, selector, scale }) => {
            const rules = rulesFor(path, selector);
            const press = rules.find((rule) => rule.media === null);
            const reduced = rules.find((rule) => rule.media === reducedMotion);
            expect(press?.declarations.transform).toEqual([scale]);
            expect(reduced?.declarations.transform).toEqual(["none"]);
            expect(reduced!.offset).toBeGreaterThan(press!.offset);
        }
    );
});

describe("enter animations", () => {
    const cases = [
        {
            name: "Dropdown panel",
            path: "src/components/floating/dropdown/dropdown.css",
            selector: ".__dropdown",
            full: "__dropdown-in",
            fade: "__dropdown-fade",
        },
        { name: "Menu panel", path: "src/components/floating/menu/menu.css", selector: ".__menu__floating", full: "__menu-in", fade: "__menu-fade" },
        {
            name: "FileUpload drag icon",
            path: "src/components/form/file-upload/file-upload.css",
            selector: '.__file-upload__idle-icon[data-dragging="true"]',
            full: "__file-upload-icon-in",
            fade: "__file-upload-icon-fade",
        },
    ];

    it.each(cases)("$name scales in normally and only fades under reduced motion, using keyframes that exist", ({ path, selector, full, fade }) => {
        const rules = rulesFor(path, selector);
        const normal = rules.find((rule) => rule.media === null);
        const reduced = rules.find((rule) => rule.media === reducedMotion);
        expect(normal?.declarations.animation?.[0]).toMatch(new RegExp(`^${full} `));
        expect(reduced?.declarations["animation-name"]).toEqual([fade]);

        const source = css(path);
        expect(source).toContain(`@keyframes ${full}`);
        expect(source).toContain(`@keyframes ${fade}`);
    });
});

describe("controls that only reveal on hover", () => {
    it.each([".__table-head__filter-trigger", ".__table-head__resizer"])("%s is hidden only where fine hover exists", (selector) => {
        const hiding = rulesFor("src/components/table/table.css", selector).filter((rule) => rule.declarations.opacity?.includes("0"));
        expect(hiding.map((rule) => rule.media)).toEqual([hoverQuery]);
    });
});

describe("focus after a tap", () => {
    it.each([
        ["src/components/display/list/list.css", ".__list__close-button"],
        ["src/components/floating/modal/modal.css", ".__modal__close-button"],
    ])("%s %s reacts to keyboard focus, not to the focus a tap leaves behind", (path, selector) => {
        expect(rulesFor(path, `${selector}:focus`)).toEqual([]);
        expect(rulesFor(path, `${selector}:focus-visible`)[0].declarations.opacity).toEqual(["1"]);
    });
});
