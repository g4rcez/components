/// <reference types="node" />

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSourceCss = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");

describe("component CSS cascade contract", () => {
    it("keeps component rules unlayered so app-level resets cannot override them", () => {
        const buttonCss = readSourceCss("src/components/core/button/button.css");

        expect(buttonCss).toContain(".__button--theme-main");
        expect(buttonCss).not.toContain("@layer var.components");
    });

    it("keeps foundation CSS unlayered for plain CSS consumers", () => {
        expect(readSourceCss("src/styles/tokens.css")).not.toContain("@layer var.tokens");
        expect(readSourceCss("src/styles/base.css")).not.toContain("@layer var.base");
    });

    it("sizes button icons from the button text icon token", () => {
        const buttonCss = readSourceCss("src/components/core/button/button.css");

        expect(buttonCss).toContain(
            "inline-size: var(--var-button-icon-font-size, var(--button-text-icon, var(--var-button-font-size, var(--button-font-size))));"
        );
        expect(buttonCss).toContain(".__button__icon > svg");
    });

    it("sizes stats card icons from the card token configuration", () => {
        const cardCss = readSourceCss("src/components/display/card/card.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(cardCss).toContain("inline-size: var(--var-card-stats-icon-size);");
        expect(cardCss).toContain(".__card__stats-icon > svg");
        expect(componentTokens).toContain('"stats-icon-size": "3rem"');
    });

    it("wires spinner geometry to semantic component tokens", () => {
        const spinnerCss = readSourceCss("src/components/display/spinner/spinner.css");

        expect(spinnerCss).toContain("inline-size: var(--var-spinner-indicator-size);");
        expect(spinnerCss).toContain("block-size: var(--var-spinner-indicator-size);");
        expect(spinnerCss).toContain("border-width: var(--var-spinner-indicator-border-width);");
        expect(spinnerCss).toContain("padding: var(--var-spinner-container-padding);");
    });

    it("keeps expand content floating above surrounding layout", () => {
        const expandCss = readSourceCss("src/components/floating/expand/expand.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(expandCss).toContain("position: absolute;");
        expect(expandCss).toContain("inset-block-end: calc(100% + (var(--var-spacing-base) * 0.5));");
        expect(expandCss).toContain("z-index: var(--var-layer-wizard);");
        expect(expandCss).toContain("inline-size: max-content;");
        expect(componentTokens).toContain('expand: {} as ComponentTokens["expand"],');
    });

    it("wires dropdown surface and title styles to semantic component tokens", () => {
        const dropdownCss = readSourceCss("src/components/floating/dropdown/dropdown.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(dropdownCss).toContain("border-radius: var(--var-dropdown-surface-radius);");
        expect(dropdownCss).toContain("padding: var(--var-dropdown-surface-padding);");
        expect(dropdownCss).toContain("margin-block-end: var(--var-dropdown-header-margin-block-end);");
        expect(dropdownCss).toContain("font-size: var(--var-dropdown-title-font-size);");
        expect(componentTokens).toContain('"list-max-block-size": "24rem"');
    });

    it("wires menu surface and item styles to semantic component tokens", () => {
        const menuCss = readSourceCss("src/components/floating/menu/menu.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(menuCss).toContain("border-radius: var(--var-menu-surface-radius);");
        expect(menuCss).toContain("max-block-size: var(--var-menu-surface-max-block-size);");
        expect(menuCss).toContain("padding: var(--var-menu-item-padding);");
        expect(menuCss).toContain("inline-size: var(--var-menu-item-icon-size);");
        expect(componentTokens).toContain('"item-min-inline-size": "9rem"');
    });

    it("wires stats geometry and typography to editable legacy tokens with runtime fallbacks", () => {
        const statsCss = readSourceCss("src/components/display/stats/stats.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(statsCss).toContain("border-radius: var(--var-stats-rounded, var(--stats-radius));");
        expect(statsCss).toContain("inline-size: var(--var-stats-icon-size, var(--stats-icon-size));");
        expect(statsCss).toContain("font-size: var(--var-stats-title-text, var(--stats-title-text, var(--var-stats-title-font-size)));");
        expect(statsCss).toContain("font-size: var(--var-stats-value-text, var(--stats-value-text, var(--var-stats-value-font-size)));");
        expect(componentTokens).toContain('"title-text": "1rem"');
    });

    it("wires tag geometry and typography to semantic component tokens", () => {
        const tagCss = readSourceCss("src/components/core/tag/tag.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(tagCss).toContain("gap: var(--var-tag-surface-gap);");
        expect(tagCss).toContain("border-radius: var(--var-tag-surface-radius);");
        expect(tagCss).toContain("min-block-size: var(--var-tag-default-min-block-size);");
        expect(tagCss).toContain("inline-size: var(--var-tag-indicator-size);");
        expect(tagCss).toContain("font-size: var(--var-tag-small-font-size);");
        expect(componentTokens).toContain('"small-font-size": "0.875rem"');
    });

    it("wires file upload thumbnail shape and icon size to component tokens", () => {
        const fileUploadCss = readSourceCss("src/components/form/file-upload/file-upload.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(fileUploadCss).toContain("border-radius: var(--var-file-upload-thumb-radius, var(--file-upload-thumb-radius));");
        expect(fileUploadCss).toContain("inline-size: var(--var-file-upload-thumb-icon-size, var(--file-upload-thumb-icon-size, 1.75rem));");
        expect(componentTokens).toContain('"thumb-radius": "50%"');
        expect(componentTokens).toContain('"thumb-icon-size": "1.75rem"');
    });

    it("wires tabs active divider height to semantic component tokens", () => {
        const tabsCss = readSourceCss("src/components/display/tabs/tabs.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(tabsCss).toContain("border-bottom-width: var(--var-tabs-divider-block-size);");
        expect(tabsCss).toContain("border-bottom-width: var(--var-tabs-active-divider-block-size);");
        expect(componentTokens).toContain('"active-divider-block-size": "2px"');
    });

    it("derives button size variants from the small customization set", () => {
        const buttonCss = readSourceCss("src/components/core/button/button.css");
        const tokensCss = readSourceCss("src/styles/tokens.css");

        expect(buttonCss).toContain("min-block-size: var(--var-button-big-height, calc(var(--var-button-height, var(--button-height)) + 0.5rem));");
        expect(buttonCss).toContain("padding-inline: var(--var-button-tiny-px, calc(var(--var-button-px, var(--button-px)) - 0.5rem));");
        expect(tokensCss).toContain("--var-button-height: 2.5rem;");
        expect(tokensCss).not.toContain("--var-button-big-height:");
        expect(tokensCss).not.toContain("--var-button-small-font-size:");
    });

    it("keeps dark secondary buttons readable", () => {
        const tokensCss = readSourceCss("src/styles/tokens.css");

        expect(tokensCss).toContain("--var-button-secondary-background: hsla(0, 0%, 100%);");
        expect(tokensCss).toContain("--var-button-secondary-foreground: hsla(240, 10%, 4%);");
    });
});
