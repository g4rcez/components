import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const testsDir = dirname(fileURLToPath(import.meta.url));
const formDir = resolve(testsDir, "../src/components/form");

const readFormFile = (name: string) => readFileSync(resolve(formDir, name), "utf8");

describe("InputField stable class contract", () => {
    const source = readFormFile("input-field.tsx");
    const css = readFormFile("input-field.css");
    const dependentCssFiles = ["checkbox.css", "radiobox.css", "free-text.css", "autocomplete.css", "multi-select.css"] as const;

    it("removes generated input-field tw class names from the migrated slice", () => {
        expect(source).not.toMatch(/__form-input-field__tw-/);
        expect(css).not.toMatch(/__form-input-field__tw-/);
        expect(css).not.toContain("@generated component utility migration");

        for (const file of dependentCssFiles) {
            expect(readFormFile(file)).not.toMatch(/__form-input-field__tw-/);
        }
    });

    it("uses stable semantic input-field selectors", () => {
        expect(source).toContain("__input-field");
        expect(source).toContain("__input-field__control");
        expect(source).toContain("__input-field__status-indicator");
        expect(css).toContain(".__input-field");
        expect(css).toContain(".__input-field__control");
        expect(css).toContain(".__input-field__status-indicator");
    });
});

describe("migrated form component class contracts", () => {
    const migratedFiles = [
        "autocomplete.tsx",
        "autocomplete.css",
        "checkbox.tsx",
        "checkbox.css",
        "radiobox.tsx",
        "radiobox.css",
        "free-text.tsx",
        "free-text.css",
        "multi-select.tsx",
        "multi-select.css",
        "slider.tsx",
        "slider.css",
        "switch.tsx",
        "switch.css",
        "date-picker.tsx",
        "date-picker.css",
        "file-upload.tsx",
        "file-upload.css",
    ] as const;

    it("removes generated tw class names from the migrated form batch", () => {
        for (const file of migratedFiles) {
            const content = readFormFile(file);
            expect(content).not.toMatch(/__form-(autocomplete|checkbox|radiobox|free-text|multi-select|slider|switch|date-picker|file-upload)__tw-/);
            expect(content).not.toContain("@generated component utility migration");
        }
    });

    it("uses stable semantic selectors in the migrated form batch", () => {
        expect(readFormFile("autocomplete.tsx")).toContain("__autocomplete__panel");
        expect(readFormFile("checkbox.tsx")).toContain("__checkbox__label");
        expect(readFormFile("radiobox.tsx")).toContain("__radiobox__label");
        expect(readFormFile("free-text.tsx")).toContain("__free-text__input");
        expect(readFormFile("multi-select.tsx")).toContain("__multi-select__panel");
        expect(readFormFile("slider.tsx")).toContain("__slider__control");
        expect(readFormFile("switch.tsx")).toContain("__switch__track");
        expect(readFormFile("date-picker.tsx")).toContain("__date-picker__sr-label");
        expect(readFormFile("file-upload.tsx")).toContain("__file-upload__dropzone");
    });

    it("keeps radiobox control sizing and colors token-driven", () => {
        const radioboxCss = readFormFile("radiobox.css");

        expect(radioboxCss).toContain("height: var(--radiobox-size)");
        expect(radioboxCss).toContain("width: var(--radiobox-size)");
        expect(radioboxCss).toContain("gap: var(--radiobox-gap)");
        expect(radioboxCss).toContain("hsla(var(--radiobox-control-color), 1)");
        expect(radioboxCss).not.toContain("color: #2563eb");
        expect(radioboxCss).not.toContain("background-color: #fff");
        expect(radioboxCss).not.toContain("border-color: #6b7280");
    });
});
