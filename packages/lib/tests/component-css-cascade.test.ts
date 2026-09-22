/// <reference types="node" />

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultGeometryTokens } from "../src/styles/geometry-defaults";

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

    it("sizes button icons from the legacy icon token with a density-derived default", () => {
        const buttonCss = readSourceCss("src/components/core/button/button.css");

        expect(buttonCss).toContain("inline-size: var(--var-button-icon-font-size, calc(var(--var-spacing-base) * 1));");
        expect(buttonCss).toContain(".__button__icon > svg");
    });

    it("sizes stats card icons from the card token configuration", () => {
        const cardCss = readSourceCss("src/components/display/card/card.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(cardCss).toContain("inline-size: var(--var-card-stats-icon-size, calc(var(--var-spacing-base) * 3));");
        expect(cardCss).toContain(".__card__stats-icon > svg");
        expect(componentTokens).toContain('"stats-icon-size": "calc(var(--var-spacing-base) * 3)"');
    });

    it("wires spinner geometry to semantic component tokens", () => {
        const spinnerCss = readSourceCss("src/components/display/spinner/spinner.css");

        expect(spinnerCss).toContain("inline-size: var(--var-spinner-indicator-size, calc(var(--var-spacing-base) * 3));");
        expect(spinnerCss).toContain("block-size: var(--var-spinner-indicator-size, calc(var(--var-spacing-base) * 3));");
        expect(spinnerCss).toContain("border-width: var(--var-spinner-indicator-border-width, calc(var(--var-spacing-base) * 0.25));");
        expect(spinnerCss).toContain("padding: var(--var-spinner-container-padding, calc(var(--var-spacing-base) * 3));");
    });

    it("keeps expand content floating above surrounding layout", () => {
        const expandCss = readSourceCss("src/components/floating/expand/expand.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(expandCss).toContain("position: absolute;");
        expect(expandCss).toContain("top: -75%;");
        expect(expandCss).toContain("left: -25%;");
        expect(expandCss).toContain("z-index: var(--var-layer-wizard);");
        expect(expandCss).toContain("inline-size: max-content;");
        expect(componentTokens).toContain("expand: {},");
    });

    it("wires dropdown surface and title styles to semantic component tokens", () => {
        const dropdownCss = readSourceCss("src/components/floating/dropdown/dropdown.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(dropdownCss).toContain(
            "border-radius: var(--var-dropdown-surface-radius, calc( var(--var-radius, 0px) + calc(var(--var-radius-base) / 2) ));"
        );
        expect(dropdownCss).toContain("padding: var(--var-dropdown-surface-padding, calc(var(--var-spacing-base) * 1));");
        expect(dropdownCss).toContain("margin-block-end: var(--var-dropdown-header-margin-block-end, calc(var(--var-spacing-base) / 2));");
        expect(dropdownCss).toContain("font-size: var(--var-dropdown-title-font-size);");
        expect(componentTokens).toContain('"list-max-block-size": "calc(var(--var-spacing-base) * 24)"');
    });

    it("wires checkbox control and label styles to semantic component tokens", () => {
        const checkboxCss = readSourceCss("src/components/form/checkbox/checkbox.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(checkboxCss).toContain("gap: var(--var-checkbox-label-gap, calc(var(--var-spacing-base) * 0.5));");
        expect(checkboxCss).toContain("inline-size: var(--var-checkbox-control-size, calc(var(--var-spacing-base) * 1));");
        expect(checkboxCss).toContain("border-radius: var(--var-checkbox-control-radius, calc(var(--var-radius, var(--var-radius-base)) * 0.25));");
        expect(checkboxCss).toContain("color: var(--var-checkbox-control-foreground);");
        expect(checkboxCss).toContain(
            "outline: var(--var-checkbox-focus-ring-width, calc(var(--var-spacing-base) * 0.125)) solid var(--var-checkbox-focus-ring);"
        );
        expect(componentTokens).toContain('"control-size": "calc(var(--var-spacing-base) * 1)"');
    });

    it("wires radiobox control and label styles to semantic component tokens", () => {
        const radioboxCss = readSourceCss("src/components/form/radiobox/radiobox.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(radioboxCss).toContain("gap: var(--var-radiobox-label-gap, calc(var(--var-spacing-base) * 0.5));");
        expect(radioboxCss).toContain("inline-size: var(--var-radiobox-control-size, calc(var(--var-spacing-base) * 1));");
        expect(radioboxCss).toContain("color: var(--var-radiobox-control-foreground);");
        expect(radioboxCss).toContain(
            "outline: var(--var-radiobox-focus-ring-width, calc(var(--var-spacing-base) * 0.125)) solid var(--var-radiobox-focus-ring);"
        );
        expect(componentTokens).toContain("radiobox: {");
        expect(componentTokens).toContain('"mark-size": "calc(var(--var-spacing-base) * 0.375)"');
    });

    it("wires date picker icon styles to semantic component tokens", () => {
        const datePickerCss = readSourceCss("src/components/form/date-picker/date-picker.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(datePickerCss).toContain("inline-size: var(--var-date-picker-calendar-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(datePickerCss).toContain("block-size: var(--var-date-picker-calendar-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(componentTokens).toContain('"date-picker": {');
        expect(componentTokens).toContain('"calendar-icon-size": "calc(var(--var-spacing-base) * 1)"');
    });

    it("wires select trigger and control styles to shared input tokens", () => {
        const selectCss = readSourceCss("src/components/form/select/select.css");
        const selectSource = readSourceCss("src/components/form/select/select.tsx");

        expect(selectCss).toContain("margin-block-start: var(--var-free-text-surface-padding-block, calc(var(--var-spacing-base) * 0.25));");
        expect(selectCss).toContain("inline-size: var(--var-input-field-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(selectSource).toContain("freeTextStyles.slots.input");
        expect(selectSource).toContain("freeTextStyles.slots.surface");
    });

    it("wires autocomplete input, panel, and option styles to semantic component tokens", () => {
        const autocompleteCss = readSourceCss("src/components/form/autocomplete/autocomplete.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(autocompleteCss).toContain("inline-size: var(--var-input-field-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(autocompleteCss).toContain("min-block-size: var(--var-autocomplete-option-min-block-size, calc(var(--var-spacing-base) * 2.5));");
        expect(autocompleteCss).toContain("padding: var(--var-autocomplete-option-padding, calc(var(--var-spacing-base) * 0.625));");
        expect(autocompleteCss).toContain("background-color: var(--var-autocomplete-panel-background);");
        expect(componentTokens).toContain('"option-padding": "calc(var(--var-spacing-base) * 0.625)"');
    });

    it("wires multi-select panel and option styles to semantic component tokens", () => {
        const multiSelectCss = readSourceCss("src/components/form/multi-select/multi-select.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(multiSelectCss).toContain("inline-size: var(--var-input-field-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(multiSelectCss).toContain("padding: var(--var-multi-select-option-padding, calc(var(--var-spacing-base) * 0.625));");
        expect(multiSelectCss).toContain("max-block-size: var(--var-multi-select-results-max-block-size, calc(var(--var-spacing-base) * 18));");
        expect(multiSelectCss).toContain("background-color: var(--var-multi-select-option-selected-background);");
        expect(componentTokens).toContain('"multi-select": {');
        expect(componentTokens).toContain('"option-padding": "calc(var(--var-spacing-base) * 0.625)"');
    });

    it("wires menu surface and item styles to semantic component tokens", () => {
        const menuCss = readSourceCss("src/components/floating/menu/menu.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(menuCss).toContain(
            "border-radius: var(--var-menu-surface-radius, calc( var(--var-radius, 0px) + calc(var(--var-radius-base) / 2) ));"
        );
        expect(menuCss).toContain("max-block-size: var(--var-menu-surface-max-block-size, calc(var(--var-spacing-base) * 20));");
        expect(menuCss).toContain("padding: var(--var-menu-item-padding, calc(var(--var-spacing-base) * 0.625));");
        expect(menuCss).toContain("inline-size: var(--var-menu-item-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(componentTokens).toContain('"item-min-inline-size": "calc(var(--var-spacing-base) * 9)"');
    });

    it("wires command palette layout and item styles to semantic component tokens", () => {
        const commandCss = readSourceCss("src/components/floating/command-palette/command-palette.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(commandCss).toContain("max-inline-size: var(--var-command-dialog-max-inline-size-md, calc(var(--var-spacing-base) * 40));");
        expect(commandCss).toContain("block-size: var(--var-command-row-block-size, calc(var(--var-spacing-base) * 2.5));");
        expect(commandCss).toContain("padding: var(--var-command-item-padding, calc(var(--var-spacing-base) * 0.5));");
        expect(commandCss).toContain("inline-size: var(--var-command-search-icon-size, calc(var(--var-spacing-base) * 1));");
        expect(componentTokens).toContain('"search-icon-size": "calc(var(--var-spacing-base) * 1)"');
    });

    it("wires wizard surface and overlay styles to semantic component tokens", () => {
        const wizardCss = readSourceCss("src/components/floating/wizard/wizard.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(wizardCss).toContain("inline-size: var(--var-wizard-surface-inline-size, calc(var(--var-spacing-base) * 20));");
        expect(wizardCss).toContain("background-color: var(--var-wizard-surface-background);");
        expect(wizardCss).toContain("color: var(--var-wizard-overlay-background);");
        expect(wizardCss).toContain("font-size: var(--var-wizard-label-font-size);");
        expect(componentTokens).toContain('"surface-inline-size": "calc(var(--var-spacing-base) * 20)"');
    });

    it("wires stats geometry and typography to editable legacy tokens with runtime fallbacks", () => {
        const statsCss = readSourceCss("src/components/display/stats/stats.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(statsCss).toContain("border-radius: var(--var-stats-rounded, var(--stats-radius, calc(var(--var-radius-base) * 1)));");
        expect(statsCss).toContain("inline-size: var(--var-stats-icon-size, var(--stats-icon-size, calc(var(--var-spacing-base) * 2.5)));");
        expect(statsCss).toContain("font-size: var(--var-stats-title-text, var(--stats-title-text, var(--var-stats-title-font-size)));");
        expect(statsCss).toContain("font-size: var(--var-stats-value-text, var(--stats-value-text, var(--var-stats-value-font-size)));");
        expect(componentTokens).toContain('"title-text": "1rem"');
    });

    it("wires tag geometry and typography to semantic component tokens", () => {
        const tagCss = readSourceCss("src/components/core/tag/tag.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(tagCss).toContain("gap: var(--var-tag-surface-gap, calc(var(--var-spacing-base) * 0.375));");
        expect(tagCss).toContain("border-radius: var(--var-tag-surface-radius, calc(var(--var-radius, var(--var-radius-base)) * 2.666667));");
        expect(tagCss).toContain("min-block-size: var(--var-tag-default-min-block-size, calc(var(--var-spacing-base) * 2));");
        expect(tagCss).toContain("inline-size: var(--var-tag-indicator-size, calc(var(--var-spacing-base) * 0.5));");
        expect(tagCss).toContain("font-size: var(--var-tag-small-font-size);");
        expect(componentTokens).toContain('"small-font-size": "calc(var(--var-fontsize) * 0.875)"');
    });

    it("wires input field and free text styles to semantic component tokens", () => {
        const inputCss = readSourceCss("src/components/form/input/input.css");
        const tokensCss = readSourceCss("src/styles/tokens.css");

        expect(inputCss).toContain("gap: var(--var-input-field-label-gap, calc(var(--var-spacing-base) * 0.25));");
        expect(inputCss).toContain("border-radius: var(--var-input-field-control-radius, calc(var(--var-radius, var(--var-radius-base)) * 0.375));");
        expect(inputCss).toContain("block-size: var(--var-free-text-control-height, calc(var(--var-spacing-base) * 2.5));");
        expect(inputCss).toContain("padding-inline: var(--var-free-text-surface-padding-inline, calc(var(--var-spacing-base) * 0.5));");
        expect(defaultGeometryTokens["--var-input-field-control-radius"]).toBe("calc(var(--var-radius, var(--var-radius-base)) * 0.375)");
        expect(tokensCss).toContain("--var-free-text-placeholder-foreground: hsla(240, 4%, 46%);");
    });

    it("wires file upload surface, thumbnail, and list styles to semantic component tokens", () => {
        const fileUploadCss = readSourceCss("src/components/form/file-upload/file-upload.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(fileUploadCss).toContain("padding: var(--var-file-upload-surface-padding, calc(var(--var-spacing-base) * 1.5));");
        expect(fileUploadCss).toContain("border-radius: var(--var-file-upload-surface-radius, calc(var(--var-radius-base) * 0.5));");
        expect(fileUploadCss).toContain("inline-size: var(--var-file-upload-thumb-icon-size, calc(var(--var-spacing-base) * 1.75));");
        expect(fileUploadCss).toContain("margin-block-start: var(--var-file-upload-list-gap, calc(var(--var-spacing-base) * 2));");
        expect(componentTokens).toContain('"surface-padding": "calc(var(--var-spacing-base) * 1.5)"');
        expect(componentTokens).toContain('"thumb-icon-size": "calc(var(--var-spacing-base) * 1.75)"');
    });

    it("wires tabs active divider height to semantic component tokens", () => {
        const tabsCss = readSourceCss("src/components/display/tabs/tabs.css");
        const componentTokens = readSourceCss("src/styles/components.ts");

        expect(tabsCss).toContain("border-bottom-width: var(--var-tabs-divider-block-size);");
        expect(tabsCss).toContain("border-bottom-width: var(--var-tabs-active-divider-block-size);");
        expect(componentTokens).toContain('"active-divider-block-size": "calc(var(--var-border-hairline) * 2)"');
    });

    it("wires button size variants to semantic component tokens", () => {
        const buttonCss = readSourceCss("src/components/core/button/button.css");
        const tokensCss = readSourceCss("src/styles/tokens.css");

        expect(buttonCss).toContain("min-block-size: var(--var-button-big-height, calc(var(--var-spacing-base) * 3));");
        expect(buttonCss).toContain("padding-inline: var(--var-button-tiny-px, calc(var(--var-spacing-base) / 2));");
        expect(defaultGeometryTokens["--var-button-height"]).toBe("calc(var(--var-spacing-base) * 2.5)");
        expect(defaultGeometryTokens["--var-button-big-height"]).toBe("calc(var(--var-spacing-base) * 3)");
        expect(tokensCss).toContain("--var-button-small-font-size: calc(var(--var-fontsize) * 0.875);");
    });

    it("keeps the timeline connector offset synchronized across CSS and runtime themes", () => {
        const expectedValue = "calc(var(--var-spacing-base) * 1)";
        const tokensCss = readSourceCss("src/styles/tokens.css");
        const componentTokens = readSourceCss("src/styles/components.ts");
        const runtimeTheme = readSourceCss("src/styles/theme-runtime.ts");

        expect(defaultGeometryTokens["--var-timeline-connector-inset-inline-start"]).toBe(expectedValue);
        expect(tokensCss).not.toContain("--var-timeline-connector-inset-inline-start:");
        expect(componentTokens).toContain(`"connector-inset-inline-start": "${expectedValue}"`);
        expect(runtimeTheme).toContain(`"connector-inset-inline-start": "${expectedValue}"`);
    });

    it("keeps transient layers above the navigation layer", () => {
        const tokensCss = readSourceCss("src/styles/tokens.css");
        const layerValue = (name: string) => {
            const value = tokensCss.match(new RegExp(`--var-layer-${name}:\\s*(\\d+);`))?.[1];
            expect(value).toBeDefined();
            return Number(value);
        };

        expect(layerValue("navbar")).toBeLessThan(layerValue("overlay"));
        expect(layerValue("navbar")).toBeLessThan(layerValue("floating"));
    });

    it("keeps dark secondary buttons readable", () => {
        const tokensCss = readSourceCss("src/styles/tokens.css");

        expect(tokensCss).toContain("--var-button-secondary-background: hsla(0, 0%, 100%);");
        expect(tokensCss).toContain("--var-button-secondary-foreground: hsla(240, 10%, 4%);");
    });
});
