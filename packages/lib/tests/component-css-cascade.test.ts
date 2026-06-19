/// <reference types="node" />

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSourceCss = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");

describe("component CSS cascade contract", () => {
    it("keeps component rules unlayered so app-level resets cannot override them", () => {
        const buttonCss = readSourceCss("src/components/core/button.css");

        expect(buttonCss).toContain(".__button--theme-main");
        expect(buttonCss).not.toContain("@layer var.components");
    });

    it("keeps foundation CSS unlayered for plain CSS consumers", () => {
        expect(readSourceCss("src/styles/tokens.css")).not.toContain("@layer var.tokens");
        expect(readSourceCss("src/styles/base.css")).not.toContain("@layer var.base");
    });

    it("sizes button icons from the button text icon token", () => {
        const buttonCss = readSourceCss("src/components/core/button.css");

        expect(buttonCss).toContain("inline-size: var(--button-text-icon, var(--var-button-icon-font-size));");
        expect(buttonCss).toContain(".__button__icon > svg");
    });

    it("sizes stats card icons from the card token configuration", () => {
        const cardCss = readSourceCss("src/components/display/card.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(cardCss).toContain("inline-size: var(--card-stats-icon-size);");
        expect(cardCss).toContain(".__display-card__slot-15 > svg");
        expect(componentTokens).toContain('"stats-icon-size": "3rem"');
    });

    it("wires spinner geometry to editable legacy tokens with runtime fallbacks", () => {
        const spinnerCss = readSourceCss("src/components/display/spinner.css");

        expect(spinnerCss).toContain("inline-size: var(--spinner-size, var(--var-spinner-size));");
        expect(spinnerCss).toContain("block-size: var(--spinner-size, var(--var-spinner-size));");
        expect(spinnerCss).toContain("border-width: var(--spinner-border, var(--var-spinner-border-width));");
        expect(spinnerCss).toContain("padding: var(--spinner-container-p, var(--var-spinner-container-p));");
    });

    it("wires stats geometry and typography to editable legacy tokens with runtime fallbacks", () => {
        const statsCss = readSourceCss("src/components/display/stats.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(statsCss).toContain("border-radius: var(--stats-radius, var(--var-stats-rounded));");
        expect(statsCss).toContain("inline-size: var(--stats-icon-size, var(--var-stats-icon-size));");
        expect(statsCss).toContain("font-size: var(--stats-title-text, var(--var-stats-title-font-size));");
        expect(statsCss).toContain("font-size: var(--stats-value-text, var(--var-stats-value-font-size));");
        expect(componentTokens).toContain('"title-text": "1rem"');
    });

    it("wires tag geometry and typography to editable legacy tokens with runtime fallbacks", () => {
        const tagCss = readSourceCss("src/components/core/tag.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(tagCss).toContain("gap: var(--tag-gap, var(--var-tag-gap));");
        expect(tagCss).toContain("border-radius: var(--tag-radius, var(--var-tag-rounded));");
        expect(tagCss).toContain("min-block-size: var(--tag-height, var(--var-tag-height));");
        expect(tagCss).toContain("inline-size: var(--tag-indicator-size, var(--var-tag-indicator-size));");
        expect(tagCss).toContain("font-size: var(--tag-text-small, var(--var-tag-small-font-size));");
        expect(componentTokens).toContain('"text-small": "0.875rem"');
    });

    it("wires file upload thumbnail shape and icon size to component tokens", () => {
        const fileUploadCss = readSourceCss("src/components/form/file-upload.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(fileUploadCss).toContain("border-radius: var(--file-upload-thumb-radius);");
        expect(fileUploadCss).toContain("inline-size: var(--file-upload-thumb-icon-size, 1.75rem);");
        expect(componentTokens).toContain('"thumb-radius": "50%"');
        expect(componentTokens).toContain('"thumb-icon-size": "1.75rem"');
    });

    it("wires tabs active divider height to its component token", () => {
        const tabsCss = readSourceCss("src/components/display/tabs.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(tabsCss).toContain("border-bottom-width: var(--tabs-divider-h);");
        expect(tabsCss).toContain("border-bottom-width: var(--tabs-divider-active-h);");
        expect(componentTokens).toContain('"divider-active-h": "2px"');
    });

    it("keeps dark secondary buttons readable", () => {
        const tokensCss = readSourceCss("src/styles/tokens.css");

        expect(tokensCss).toContain("--var-button-secondary-background: hsla(0, 0%, 100%);");
        expect(tokensCss).toContain("--var-button-secondary-foreground: hsla(240, 10%, 4%);");
    });
});
