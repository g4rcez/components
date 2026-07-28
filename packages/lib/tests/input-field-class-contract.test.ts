import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const testsDir = dirname(fileURLToPath(import.meta.url));
const formDir = resolve(testsDir, "../src/components/form");

const readFormFile = (name: string) => readFileSync(resolve(formDir, name), "utf8");

const listSourceFiles = (directory: string): string[] =>
    readdirSync(directory).flatMap((name) => {
        const filePath = resolve(directory, name);
        if (statSync(filePath).isDirectory()) return listSourceFiles(filePath);
        return /\.(css|tsx?)$/.test(name) ? [filePath] : [];
    });

describe("component stable class contracts", () => {
    it("does not expose generated tw selector contracts", () => {
        for (const filePath of listSourceFiles(resolve(testsDir, "../src/components"))) {
            const content = readFileSync(filePath, "utf8");

            expect(content, filePath).not.toMatch(/__[A-Za-z0-9_-]+__tw-(?:extra-|state-)?\d+/);
            expect(content, filePath).not.toContain("@generated component utility migration");
        }
    });
});

describe("InputField stable class contract", () => {
    const source = readFormFile("input/input-field.tsx");
    const css = readFormFile("input/input.css");
    const dependentCssFiles = [
        "checkbox/checkbox.css",
        "radiobox/radiobox.css",
        "input/input.css",
        "autocomplete/autocomplete.css",
        "multi-select/multi-select.css",
    ] as const;

    it("removes generated input-field tw class names from the migrated slice", () => {
        expect(source).not.toMatch(/__form-input-field__tw-/);
        expect(css).not.toMatch(/__form-input-field__tw-/);
        expect(css).not.toContain("@generated component utility migration");

        for (const file of dependentCssFiles) {
            expect(readFormFile(file)).not.toMatch(/__form-input-field__tw-/);
        }
    });

    it("uses stable semantic input-field selectors", () => {
        expect(source).toContain("inputFieldStyles.className");
        expect(source).toContain("inputFieldStyles.slots.control");
        expect(source).toContain('inputFieldStyles.slots["status-indicator"]');
        expect(css).toContain(".__input-field");
        expect(css).toContain(".__input-field__control");
        expect(css).toContain(".__input-field__status-indicator");
    });

    it("shows explicit error messages independently of native input validity", () => {
        expect(css).toContain('.__input-field[data-error="true"] .__input-field__error-state');
        expect(css).toContain('.__input-field[data-error="true"] .__input-field__feedback-state');
    });
});

describe("migrated form component class contracts", () => {
    const migratedFiles = [
        "autocomplete/autocomplete.tsx",
        "autocomplete/autocomplete.css",
        "checkbox/checkbox.tsx",
        "checkbox/checkbox.css",
        "radiobox/radiobox.tsx",
        "radiobox/radiobox.css",
        "input/free-text.tsx",
        "input/input.css",
        "multi-select/multi-select.tsx",
        "multi-select/multi-select.css",
        "slider/slider.tsx",
        "slider/slider.css",
        "switch/switch.tsx",
        "switch/switch.css",
        "task-list/task-list.tsx",
        "task-list/task-list.css",
        "date-picker/date-picker.tsx",
        "date-picker/date-picker.css",
        "file-upload/file-upload.tsx",
        "file-upload/file-upload.css",
    ] as const;

    it("removes generated tw class names from the migrated form batch", () => {
        for (const file of migratedFiles) {
            const content = readFormFile(file);
            expect(content).not.toMatch(
                /__form-(autocomplete|checkbox|radiobox|free-text|multi-select|slider|switch|task-list|date-picker|file-upload)__tw-/
            );
            expect(content).not.toContain("@generated component utility migration");
        }
    });

    it("uses stable semantic selectors in the migrated form batch", () => {
        expect(readFormFile("autocomplete/autocomplete.tsx")).toContain("autocompleteStyles.slots.panel");
        expect(readFormFile("checkbox/checkbox.tsx")).toContain("checkboxStyles.slots.label");
        expect(readFormFile("radiobox/radiobox.tsx")).toContain("radioboxStyles.slots.label");
        expect(readFormFile("radiobox/radiobox.tsx")).toContain("radioboxStyles.className({ size })");
        expect(readFormFile("input/free-text.tsx")).toContain("freeTextStyles.slots.input");
        expect(readFormFile("multi-select/multi-select.tsx")).toContain("multiSelectStyles.slots.panel");
        expect(readFormFile("slider/slider.tsx")).toContain("sliderStyles.slots.control");
        expect(readFormFile("switch/switch.tsx")).toContain("switchStyles.slots.track");
        expect(readFormFile("task-list/task-list.tsx")).toContain("taskListStyles.className()");
        expect(readFormFile("date-picker/date-picker.tsx")).toContain('datePickerStyles.slots["sr-label"]');
        expect(readFormFile("file-upload/file-upload.tsx")).toContain("fileUploadStyles.slots.dropzone");
    });

    it("centers the checkbox mark inside its control", () => {
        const checkboxCss = readFormFile("checkbox/checkbox.css");

        expect(checkboxCss).toMatch(/\.__checkbox__control-state\s*\{[^}]*position: relative;/s);
        expect(checkboxCss).toMatch(/\.__checkbox__control-state::before\s*\{[^}]*position: absolute;[^}]*inset: 0;[^}]*margin: auto;/s);
    });

    it("keeps radiobox control sizing and colors token-driven", () => {
        const radioboxCss = readFormFile("radiobox/radiobox.css");

        expect(radioboxCss).toContain("block-size: var(--var-radiobox-control-size)");
        expect(radioboxCss).toContain("inline-size: var(--var-radiobox-control-size)");
        expect(radioboxCss).toContain("gap: var(--var-radiobox-label-gap)");
        expect(radioboxCss).toContain("color: var(--var-radiobox-control-foreground)");
        expect(radioboxCss).toContain("transition-duration: var(--var-radiobox-transition-duration)");
        expect(radioboxCss).toContain("transform: scale(0.55)");
        expect(radioboxCss).not.toContain("transform: scale(0)");
        expect(radioboxCss).not.toContain("color: #2563eb");
        expect(radioboxCss).not.toContain("background-color: #fff");
        expect(radioboxCss).not.toContain("border-color: #6b7280");
    });
});
