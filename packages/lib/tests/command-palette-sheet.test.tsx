import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CommandPalette } from "../src/components/floating/command-palette/command-palette";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const stubViewport = (desktop: boolean) =>
    vi.stubGlobal(
        "matchMedia",
        vi.fn().mockImplementation((query: string) => ({
            media: query,
            matches: desktop,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
    );

const renderPalette = () =>
    render(
        <ComponentsProvider>
            <CommandPalette open commands={[]} onChangeVisibility={() => undefined} />
        </ComponentsProvider>
    );

describe("CommandPalette on small viewports", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("renders as a bottom sheet below 64rem", () => {
        stubViewport(false);
        renderPalette();
        const dialog = screen.getByRole("dialog");
        expect(dialog.className).toContain("__modal--type-sheet");
        expect(dialog.className).not.toContain("__modal--type-dialog");
    });

    it("renders as a dialog on desktop", () => {
        stubViewport(true);
        renderPalette();
        expect(screen.getByRole("dialog").className).toContain("__modal--type-dialog");
    });

    it("keeps the palette styles off the Modal surface", () => {
        stubViewport(false);
        renderPalette();
        const dialog = screen.getByRole("dialog");
        expect(dialog.className).not.toContain("__command-palette");
        const root = dialog.querySelector("[data-component='command-palette']");
        expect(root).not.toBeNull();
        expect(root!.className).toContain("__command-palette");
    });

    it("only tunes the Modal geometry through overlay tokens", () => {
        const css = readFileSync(resolve(__dirname, "../src/components/floating/command-palette/command-palette.css"), "utf8");
        const base = css.match(/^\.__command-palette\s*\{[^}]*\}/m)?.[0] ?? "";
        expect(base).not.toBe("");
        expect(base).not.toMatch(/position|padding|overflow|inset|max-inline-size/);
        // any selector reaching the Modal surface must be scoped under the palette overlay
        const surfaceSelectors = css.match(/[^{}]*__modal--type-[a-z]+[^{]*\{/g) ?? [];
        expect(surfaceSelectors.length).toBeGreaterThan(0);
        for (const selector of surfaceSelectors) {
            expect(selector).toContain(".__command-palette__overlay");
            expect(selector).not.toContain("__modal--type-sheet");
        }
    });

    it("keeps the sheet and focus ring motion wired to the native tokens", () => {
        const read = (path: string) => readFileSync(resolve(__dirname, path), "utf8");
        const modal = read("../src/components/floating/modal/modal.css");
        const sheet = modal.match(/^\.__modal--type-sheet\s*\{[^}]*\}/m)?.[0] ?? "";
        expect(sheet).toContain("var(--var-keyboard-inset");
        expect(sheet).toMatch(/translate:\s*0 calc\(var\(--var-keyboard-inset/);
        expect(sheet).toContain("--var-motion-timing-sheet");
        const input = read("../src/components/form/input/input.css");
        expect(input.match(/^\.__input-field__control \{[^}]*\}/gm)?.some((rule) => /transition-property:[^;]*box-shadow/.test(rule))).toBe(true);
        expect(read("../src/components/form/multi-select/multi-select.css")).toMatch(/__multi-select__transition \{[^}]*box-shadow/);
        expect(input).toMatch(/pointer: coarse\)[\s\S]*max\(16px, var\(--var-free-text-min-font-size\)\)/);
        expect(input).toMatch(/max\(16px, var\(--var-free-text-small-font-size\)\)/);
        expect(input).toMatch(/max\(16px, var\(--var-free-text-tiny-font-size\)\)/);
        expect(read("../src/styles/base.css")).toMatch(/input,\s*select,\s*textarea\s*\{[^}]*font-size:\s*16px/);
    });
});
