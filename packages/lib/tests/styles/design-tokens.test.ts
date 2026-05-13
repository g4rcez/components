import { describe, expect, it } from "vitest";
import { createTokenStyles } from "../../src/styles/design-tokens";
import { defaultLightTheme } from "../../src/styles/theme";

describe("createTokenStyles component tokens", () => {
    it("emits default component CSS variables", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--card-radius: 1rem");
        expect(css).toContain("--button-padding-x: 1rem");
    });

    it("honors component token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                card: { ...defaultLightTheme.components.card, radius: "4px" },
            },
        });
        expect(css).toContain("--card-radius: 4px");
    });

    it("emits per-component spacing defaults beyond card and button", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--alert-p: 1rem");
        expect(css).toContain("--modal-padding-x: 2rem");
    });

    it("emits typography defaults that fill Tailwind gaps", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--typography-xs: 0.75rem");
        expect(css).toContain("--typography-2xl: 1.5rem");
    });

    it("honors typography token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                typography: {
                    ...defaultLightTheme.components.typography,
                    xl: "2rem",
                },
            },
        });
        expect(css).toContain("--typography-xl: 2rem");
    });

    it("emits form component defaults", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--input-radius: 0.375rem");
        expect(css).toContain("--input-padding-x: 0.5rem");
        expect(css).toContain("--checkbox-size: 1rem");
        expect(css).toContain("--switch-track-w: 2.75rem");
        expect(css).toContain("--slider-track-h: 0.5rem");
        expect(css).toContain("--file-upload-p: 1.5rem");
    });

    it("honors input token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                input: { ...defaultLightTheme.components.input, radius: "12px" },
            },
        });
        expect(css).toContain("--input-radius: 12px");
    });

    it("emits typography scale fillers", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--typography-sm: 0.875rem");
        expect(css).toContain("--typography-base: 1rem");
        expect(css).toContain("--typography-lg: 1.125rem");
        expect(css).toContain("--typography-5xl: 3rem");
    });

    it("emits new component token groups", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--progress-track-h: 1.5rem");
        expect(css).toContain("--spinner-size: 3rem");
        expect(css).toContain("--spinner-border: 0.25rem");
        expect(css).toContain("--empty-px: 2rem");
        expect(css).toContain("--list-card-p: 1.5rem");
        expect(css).toContain("--timeline-icon-size: 3rem");
        expect(css).toContain("--step-size: 2.5rem");
        expect(css).toContain("--tabs-item-px: 2.5rem");
        expect(css).toContain("--shortcut-gap: 0.25rem");
        expect(css).toContain("--toolbar-radius: 0.5rem");
        expect(css).toContain("--wizard-w: 20rem");
        expect(css).toContain("--info-gap: 0.25rem");
        expect(css).toContain("--page-calendar-badge-size: 3rem");
        expect(css).toContain("--page-calendar-cell-min-h: 8rem");
    });

    it("honors progress token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                progress: {
                    ...defaultLightTheme.components.progress,
                    "track-h": "2rem",
                },
            },
        });
        expect(css).toContain("--progress-track-h: 2rem");
    });

    it("honors page-calendar token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                "page-calendar": {
                    ...defaultLightTheme.components["page-calendar"],
                    "badge-size": "4rem",
                },
            },
        });
        expect(css).toContain("--page-calendar-badge-size: 4rem");
    });

    it("honors typography.base token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                typography: {
                    ...defaultLightTheme.components.typography,
                    base: "1.125rem",
                },
            },
        });
        expect(css).toContain("--typography-base: 1.125rem");
    });
});
