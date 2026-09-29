import postcss from "postcss";
import tailwindcss from "tailwindcss";
import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import { describe, expect, it } from "vitest";

import preset from "../preset.tailwind";
import { themeTokenRegistry } from "../src/styles/theme-registry.generated";

const compileUtilities = async (classes: string) => {
    const config = {
        ...preset,
        content: [{ raw: `<div class="${classes}"></div>`, extension: "html" }],
    } as Config;

    return postcss([tailwindcss(config)]).process("@tailwind utilities;", { from: undefined });
};

describe("Tailwind preset", () => {
    it.each([
        ["card", "bg-card bg-card-background", "--var-card-background"],
        ["table", "bg-table bg-table-background", "--var-table-background"],
    ])("maps %s background utilities to their component token", async (_, classes, token) => {
        const result = await compileUtilities(classes);
        const [defaultClass, backgroundClass] = classes.split(" ");

        expect(result.css).toContain(`.${defaultClass} {`);
        expect(result.css).toContain(`.${backgroundClass} {`);
        expect(result.css.match(new RegExp(`var\\(${token}\\)`, "g"))).toHaveLength(2);
        expect(result.css).not.toContain("var(--var-color-background)");
    });

    it("keeps card and table utility aliases independently themeable", async () => {
        const result = await compileUtilities("border-card-border bg-card-muted border-table-border");

        expect(result.css).toContain("var(--var-card-border)");
        expect(result.css).toContain("var(--var-card-muted)");
        expect(result.css).toContain("var(--var-table-border)");
        expect(result.css).not.toContain("var(--var-color-border)");
        expect(result.css).not.toContain("var(--var-color-muted)");
    });

    it.each([
        ["h-button-height", "height", "var(--var-button-height, calc(var(--var-spacing-base) * 2.5))"],
        ["h-button-height-big", "height", "var(--var-button-big-height, calc(var(--var-spacing-base) * 3))"],
        ["px-button-padding-x-small", "padding-left", "var(--var-button-small-px, calc(var(--var-spacing-base) * 1))"],
        ["text-button-text-tiny", "font-size", "var(--var-button-tiny-font-size)"],
        ["px-card-padding-x", "padding-left", "var(--var-card-content-padding-inline, calc(var(--var-spacing-base) * 1.5))"],
        ["p-alert-p", "padding", "var(--var-alert-surface-padding, calc(var(--var-spacing-base) * 1))"],
        ["h-input-free-text-control-height", "height", "var(--var-free-text-control-height, calc(var(--var-spacing-base) * 2.5))"],
        ["text-calendar-cell-text", "font-size", "var(--var-calendar-day-button-font-size)"],
        ["text-stats-title-text", "font-size", "var(--var-stats-title-font-size)"],
        ["text-typography-base", "font-size", "var(--var-typography-paragraph-font-size)"],
        ["gap-info-gap", "gap", "var(--var-typography-info-gap, calc(var(--var-spacing-base) * 1))"],
        ["text-typography-2xl", "font-size", "var(--var-typography-page-title-font-size)"],
        ["text-switch-hint-text", "font-size", "var(--var-switch-error-font-size)"],
    ])("keeps %s responsive to its semantic override", async (className, property, value) => {
        const result = await compileUtilities(className);
        const values: string[] = [];
        result.root.walkDecls(property, (declaration) => {
            values.push(declaration.value);
        });
        expect(values).toStrictEqual([value]);
    });

    it("registers only canonical tokens for component dimensions", () => {
        const resolved = resolveConfig({ ...preset, content: [] } as Config);
        const canonical = new Set<string>([
            "spacing-base",
            "radius-base",
            ...themeTokenRegistry.tokens,
            ...Object.entries(themeTokenRegistry.components).flatMap(([component, attributes]) =>
                attributes.map((attribute) => `${component}-${attribute}`)
            ),
        ]);
        for (const group of ["spacing", "borderRadius", "borderWidth", "fontSize"] as const) {
            for (const [name, value] of Object.entries(resolved.theme[group])) {
                if (typeof value !== "string" || !value.startsWith("var(--var-")) continue;
                const token = /^var\(--var-([^,)]+)/.exec(value)?.[1];
                expect(canonical.has(token ?? ""), `${group}.${name}: ${value}`).toBe(true);
            }
        }
    });

    it("keeps legacy radius utility names mapped to canonical CSS properties", async () => {
        const result = await compileUtilities("rounded-card-rounded");
        const declarations: string[] = [];
        result.root.walkDecls("border-radius", (declaration) => declarations.push(declaration.value));

        expect(declarations).toStrictEqual(["var(--var-card-surface-radius, calc(var(--var-radius-base) / 4))"]);
    });

    it.each(["table", "notification"])("keeps full %s shadow overrides ahead of theme-aware defaults", (name) => {
        const resolved = resolveConfig({ ...preset, content: [] } as Config);
        const value = `var(--var-shadow-${name}, var(--var-shadow-${name}-shape) var(--var-color-shadow-${name}))`;
        expect(resolved.theme.boxShadow[name]).toBe(value);
        expect(resolved.theme.boxShadow[`shadow-${name}`]).toBe(value);
        expect(resolved.theme.dropShadow[name]).toBe(value);
        expect(resolved.theme.dropShadow[`shadow-${name}`]).toBe(value);
    });

    it.each([
        ["bg-button-secondary-bg/50", "var(--var-button-secondary-background)", "50%"],
        ["text-tag-primary-text/25", "var(--var-tag-primary-foreground)", "25%"],
        ["bg-primary/0", "var(--var-color-primary)", "0%"],
        ["bg-primary/100", "var(--var-color-primary)", "100%"],
    ])("preserves opacity modifiers on %s", async (className, token, opacity) => {
        const result = await compileUtilities(className);
        expect(result.css).toContain(`color-mix(in srgb, ${token} ${opacity}, transparent)`);
    });

    it("preserves transparent neutral button utilities", async () => {
        const result = await compileUtilities("bg-button-neutral-bg/50");
        expect(result.css).toContain("background-color: transparent");
        expect(result.css).not.toContain("color-mix");
    });
});
