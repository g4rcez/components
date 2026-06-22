import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, createThemeCss, createThemeProperties, defaultDarkThemeTokens, registerTheme } from "../src/styles/theme-runtime";

describe("theme runtime helpers", () => {
    afterEach(() => {
        while (document.head.firstChild) document.head.firstChild.remove();
        document.documentElement.removeAttribute("style");
    });

    it("creates semantic --var CSS properties from partial overrides", () => {
        const properties = createThemeProperties({
            colors: { primary: { DEFAULT: "rebeccapurple" } },
            components: {
                button: { rounded: "0.75rem" },
                tag: { "surface-radius": "1rem" },
                spinner: { "indicator-size": "2rem" },
                progress: { rounded: "2px" },
                stats: { rounded: "4px" },
            },
            layer: { overlay: "100" },
        });

        expect(properties["--var-color-primary"]).toBe("rebeccapurple");
        expect(properties["--var-button-rounded"]).toBe("0.75rem");
        expect(properties["--var-tag-surface-radius"]).toBe("1rem");
        expect(properties["--var-spinner-indicator-size"]).toBe("2rem");
        expect(properties["--var-progress-rounded"]).toBe("2px");
        expect(properties["--var-stats-rounded"]).toBe("4px");
        expect(properties["--var-layer-overlay"]).toBe("100");
        expect(properties["--var-color-background"]).toBe("hsla(0, 0%, 100%)");
    });

    it("creates unlayered scoped CSS for named themes by default", () => {
        const css = createThemeCss({ colors: { primary: { DEFAULT: "red" } } }, { name: "brand" });

        expect(css).not.toContain("@layer var.tokens");
        expect(css).toContain('[data-theme="brand"]');
        expect(css).toContain("--var-color-primary: red;");
    });

    it("can create layered theme CSS when explicitly requested", () => {
        const css = createThemeCss({ colors: { primary: { DEFAULT: "red" } } }, { layer: true, name: "brand" });

        expect(css).toContain("@layer var.tokens");
        expect(css).toContain('[data-theme="brand"]');
        expect(css).toContain("--var-color-primary: red;");
    });

    it("applies inline variables to an element", () => {
        applyTheme(document.documentElement, { colors: { primary: { DEFAULT: "blue" } } });

        expect(document.documentElement.style.getPropertyValue("--var-color-primary")).toBe("blue");
    });

    it("registers a managed style element and returns the CSS", () => {
        const css = registerTheme("brand", { colors: { primary: { DEFAULT: "green" } } });
        const style = document.getElementById("g4rcez-theme-brand");

        expect(css).toContain('[data-theme="brand"]');
        expect(style).toBeInstanceOf(HTMLStyleElement);
        expect(style?.textContent).toContain("--var-color-primary: green;");
    });
});

describe("default dark theme tokens", () => {
    it("keeps secondary buttons readable", () => {
        const properties = createThemeProperties(defaultDarkThemeTokens);

        expect(properties["--var-button-secondary-background"]).toBe("hsla(0, 0%, 100%)");
        expect(properties["--var-button-secondary-foreground"]).toBe("hsla(240, 10%, 4%)");
    });
});
