import { afterEach, describe, expect, it, vi } from "vitest";
import {
    configureTheme,
    createThemeCss,
    createThemeProperties,
    defaultDarkThemeTokens,
    defaultLightThemeTokens,
} from "../src/styles/theme-runtime";

const testDocument = document;

afterEach(() => {
    vi.unstubAllGlobals();
    while (testDocument.head.firstChild) testDocument.head.firstChild.remove();
    testDocument.documentElement.className = "";
});

describe("sparse theme overrides", () => {
    it("serializes only supplied canonical values and preserves explicit zero", () => {
        const properties = createThemeProperties({
            tokens: { spacing: 0, rounding: "0px", fontsize: "1.125rem", "layer-tooltip": "22" },
            colors: { primary: "hsla(201, 49%, 60%, 1)" },
            components: { button: { height: "40px", "secondary-background": "var(--brand-button-secondary)" } },
        });

        expect(properties).toStrictEqual({
            "--var-color-primary": "hsla(201, 49%, 60%, 1)",
            "--var-button-height": "40px",
            "--var-button-secondary-background": "var(--brand-button-secondary)",
            "--var-fontsize": "1.125rem",
            "--var-layer-tooltip": "22",
            "--var-radius-base": "0px",
            "--var-spacing-base": "0px",
        });
        expect(createThemeProperties()).toStrictEqual({});
    });

    it("projects shared defaults once and keeps dark defaults color-only", () => {
        expect(defaultLightThemeTokens.tokens.spacing).toBe("1rem");
        expect(defaultLightThemeTokens.tokens.rounding).toBe("1rem");
        expect(defaultLightThemeTokens.components.card.background).toBe("hsla(0, 0%, 100%)");
        expect(defaultLightThemeTokens.components.table.background).toBe("hsla(0, 0%, 100%)");
        expect(defaultDarkThemeTokens).not.toHaveProperty("tokens");
        expect(defaultDarkThemeTokens.components.button["secondary-background"]).toBe("hsla(0, 0%, 100%)");
        expect(defaultDarkThemeTokens.components.alert["danger-background"]).toBe("hsla(0, 84%, 12%)");
    });
});

describe("theme CSS serialization", () => {
    it("targets :root for default and html class scopes for named themes", () => {
        const defaultCss = createThemeCss({ name: "default", tokens: { spacing: 16, rounding: 0 } });
        const darkCss = createThemeCss({ name: "dark", colors: { primary: "rebeccapurple" } });

        expect(defaultCss).toContain("@layer var.tokens, var.theme, var.base, var.components, var.utilities;");
        expect(defaultCss).toContain(":root {");
        expect(defaultCss).toContain("--var-spacing-base: 16px;");
        expect(defaultCss).toContain("--var-radius-base: 0px;");
        expect(defaultCss).not.toContain("--var-color-primary:");
        expect(darkCss).toContain("html.dark {");
        expect(darkCss).toContain("--var-color-primary: rebeccapurple;");
    });

    it("accepts CSS functions with nested tokens and rejects declaration or rule boundaries", () => {
        expect(
            createThemeProperties({ colors: { primary: "var(--brand, hsla(201, 49%, 60%, 1))" } })["--var-color-primary"]
        ).toBe("var(--brand, hsla(201, 49%, 60%, 1))");
        expect(createThemeProperties({ colors: { primary: "var(--brand, !important)" } })["--var-color-primary"]).toBe(
            "var(--brand, !important)"
        );
        for (const value of ["red; color: blue", "red !important", "red } html { color: blue", "red</style><script>", "calc(1px", "red)"]) {
            expect(() => createThemeProperties({ colors: { primary: value } })).toThrow();
        }
        expect(() => createThemeProperties({ tokens: { spacing: Number.POSITIVE_INFINITY } })).toThrow();
        expect(() => createThemeProperties({ colors: { unknown: "red" } } as never)).toThrow();
        expect(() => createThemeProperties({ tokens: { "spacing-base": "2rem" } } as never)).toThrow();
    });

    it("rejects unsafe theme names and unknown configuration groups", () => {
        expect(() => createThemeCss({ name: "dark; body", colors: { primary: "red" } })).toThrow();
        expect(() => createThemeCss({ name: "dark", extra: {} } as never)).toThrow();
    });
});

describe("theme registration", () => {
    it("replaces one owned style in place and preserves its nonce unless replaced", () => {
        const firstCss = configureTheme(
            { name: "dark", colors: { primary: "green" }, components: { button: { height: "40px" } } },
            { document: testDocument, nonce: "nonce-1" }
        );
        const style = testDocument.getElementById("g4rcez-theme-dark") as HTMLStyleElement;
        const unrelatedCss = configureTheme({ name: "brand", colorScheme: "light", tokens: { spacing: 12 } }, { document: testDocument });

        expect(firstCss).toContain("--var-color-primary: green;");
        expect(style.getAttribute("data-g4rcez-theme-owner")).toBe("theme-runtime");
        expect(style.getAttribute("data-g4rcez-theme-name")).toBe("dark");
        expect(style.nonce).toBe("nonce-1");
        expect(unrelatedCss).toContain("html.brand {");

        const replacementCss = configureTheme({ name: "dark", tokens: { spacing: 0 } }, { document: testDocument });
        expect(testDocument.getElementById("g4rcez-theme-dark")).toBe(style);
        expect(style.textContent).toBe(replacementCss);
        expect(style.textContent).toContain("--var-spacing-base: 0px;");
        expect(style.textContent).not.toContain("--var-color-primary:");
        expect(style.textContent).not.toContain("--var-button-height:");
        expect(style.nonce).toBe("nonce-1");
        expect(testDocument.querySelectorAll("style[data-g4rcez-theme-owner]")).toHaveLength(2);

        configureTheme({ name: "dark" }, { document: testDocument, nonce: "nonce-2" });
        expect(style.nonce).toBe("nonce-2");
    });


    it("validates a replacement before mutating an existing registration", () => {
        configureTheme({ name: "dark", colors: { primary: "green" } }, { document: testDocument });
        const style = testDocument.getElementById("g4rcez-theme-dark") as HTMLStyleElement;
        const existingCss = style.textContent;

        expect(() => configureTheme({ name: "dark", colors: { primary: "red !important" } }, { document: testDocument })).toThrow();
        expect(style.textContent).toBe(existingCss);
    });
    it("does not activate theme classes and rejects a conflicting style id without overwriting it", () => {
        const collision = testDocument.createElement("div");
        collision.id = "g4rcez-theme-brand";
        collision.textContent = "keep";
        testDocument.head.appendChild(collision);

        expect(() => configureTheme({ name: "brand", colors: { primary: "red" } }, { document: testDocument })).toThrow(/not owned/u);
        expect(collision.textContent).toBe("keep");
        expect(testDocument.documentElement.classList.contains("brand")).toBe(false);
    });

    it("returns pure CSS without registering when no document exists", () => {
        vi.stubGlobal("document", undefined);
        const css = configureTheme({ name: "dark", tokens: { rounding: 0 } });

        expect(css).toContain("--var-radius-base: 0px;");
        expect(testDocument.querySelector("style[data-g4rcez-theme-owner]")).toBeNull();
    });
});
