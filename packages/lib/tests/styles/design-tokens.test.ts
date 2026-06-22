import { describe, expect, it } from "vitest";
import { createTokenStyles } from "../../src/styles/design-tokens";
import { defaultLightTheme } from "../../src/styles/theme";

describe("createTokenStyles component tokens", () => {
    it("emits default component CSS variables", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--card-rounded: 1rem");
        expect(css).toContain("--button-padding-x: 1rem");
    });

    it("honors component token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                card: { ...defaultLightTheme.components.card, rounded: "4px" },
            },
        });
        expect(css).toContain("--card-rounded: 4px");
    });

    it("emits per-component spacing defaults beyond card and button", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--alert-p: 1rem");
        expect(css).toContain("--modal-content-padding-inline: 2rem");
    });

    it("emits typography defaults", () => {
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
        expect(css).toContain("--input-rounded: 0.375rem");
        expect(css).toContain("--input-padding-x: 0.5rem");
        expect(css).toContain("--checkbox-size: 1rem");
        expect(css).toContain("--switch-track-w: 2.75rem");
        expect(css).toContain("--slider-track-h: 0.5rem");
        expect(css).toContain("--file-upload-p: 1.5rem");
        expect(css).toContain("--file-upload-thumb-rounded: 50%");
        expect(css).toContain("--file-upload-thumb-icon-size: 1.75rem");
    });

    it("honors input token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                input: { ...defaultLightTheme.components.input, rounded: "12px" },
            },
        });
        expect(css).toContain("--input-rounded: 12px");
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
        expect(css).toContain("--spinner-indicator-size: 3rem");
        expect(css).toContain("--spinner-indicator-border-width: 0.25rem");
        expect(css).toContain("--empty-px: 2rem");
        expect(css).toContain("--list-card-p: 1.5rem");
        expect(css).toContain("--timeline-icon-size: 3rem");
        expect(css).toContain("--timeline-item-padding-block-end: 3rem");
        expect(css).toContain("--step-size: 2.5rem");
        expect(css).toContain("--tabs-tab-padding-inline: 2.5rem");
        expect(css).toContain("--shortcut-gap: 0.25rem");
        expect(css).toContain("--toolbar-rounded: 0.5rem");
        expect(css).toContain("--wizard-surface-inline-size: 20rem");
        expect(css).toContain("--wizard-surface-padding: 1rem");
        expect(css).toContain("--info-gap: 0.25rem");
        expect(css).toContain("--page-calendar-badge-size: 3rem");
        expect(css).toContain("--page-calendar-cell-min-block-size: 8rem");
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

    it("emits per-component text-size tokens (Bucket B additions)", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--card-title-text: 2.25rem");
        expect(css).toContain("--stats-title-text: 1rem");
        expect(css).toContain("--stats-value-text: 2.25rem");
        expect(css).toContain("--list-title-text: 1.5rem");
        expect(css).toContain("--modal-title-font-size: 1.875rem");
    });

    it("emits per-component dimension tokens (Bucket B additions)", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--tabs-divider-block-size: 1px");
        expect(css).toContain("--tabs-active-divider-block-size: 2px");
        expect(css).toContain("--step-connector-h: 2px");
        expect(css).toContain("--calendar-weekday-text: 0.75rem");
        expect(css).toContain("--calendar-cell-text: 0.75rem");
    });

    it("emits notification positioning and badge tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--notification-list-top: 1.5rem");
        expect(css).toContain("--notification-list-max-w: 380px");
        expect(css).toContain("--notification-badge-text: 0.625rem");
    });

    it("emits modal responsive constraint tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--modal-dialog-max-inline-size-mobile: 90%");
        expect(css).toContain("--modal-sheet-max-block-size: calc(100vh - 15%)");
        expect(css).toContain("--modal-overlay-block-size: 100dvh");
    });

    it("emits table structural tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--table-cell-border: 1px");
        expect(css).toContain("--table-divider-width: 1px");
        expect(css).toContain("--table-groups-margin-block-start: 1rem");
        expect(css).toContain("--table-groups-margin-block: 1rem");
        expect(css).toContain("--table-metadata-min-inline-size: 1ch");
        expect(css).toContain("--table-inline-gap-tight: 0.25rem");
        expect(css).toContain("--table-cell-padding: 0.75rem");
    });

    it("emits page-calendar layout tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--page-calendar-cell-gap-tight: 0.125rem");
        expect(css).toContain("--page-calendar-filter-label-margin-inline-end: 0.25rem");
    });

    it("emits command palette semantic tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--command-surface-background: hsla(0, 0%, 100%)");
        expect(css).toContain("--command-list-padding-inline: 0.5rem");
        expect(css).toContain("--command-row-block-size: 2.5rem");
        expect(css).toContain("--command-search-icon-size: 1rem");
    });

    it("button radius-squared emits canonical 0px (not 0rem)", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--button-radius-squared: 0px");
        expect(css).not.toContain("--button-radius-squared: 0rem");
    });

    it("honors table cell-padding overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                table: { ...defaultLightTheme.components.table, "cell-padding": "0.5rem" },
            },
        });
        expect(css).toContain("--table-cell-padding: 0.5rem");
    });

    it("honors card title-text overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                card: { ...defaultLightTheme.components.card, "title-text": "3rem" },
            },
        });
        expect(css).toContain("--card-title-text: 3rem");
    });

    it("emits dropdown tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--dropdown-surface-radius: 0.5rem");
        expect(css).toContain("--dropdown-surface-padding: 1rem");
        expect(css).toContain("--dropdown-header-margin-block-end: 0.5rem");
        expect(css).toContain("--dropdown-title-font-size: 1.5rem");
        expect(css).toContain("--dropdown-title-letter-spacing: 0.025em");
        expect(css).toContain("--dropdown-list-max-block-size: 24rem");
        expect(css).toContain("--dropdown-surface-background: hsla(0, 0%, 100%)");
        expect(css).toContain("--dropdown-surface-border: hsla(240, 6%, 90%)");
        expect(css).toContain("--dropdown-surface-foreground: hsla(240, 10%, 4%)");
    });

    it("honors dropdown token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                dropdown: { ...defaultLightTheme.components.dropdown, "list-max-block-size": "32rem" },
            },
        });
        expect(css).toContain("--dropdown-list-max-block-size: 32rem");
    });

    it("emits tooltip tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--tooltip-surface-radius: 0.5rem");
        expect(css).toContain("--tooltip-surface-padding: 0.75rem");
        expect(css).toContain("--tooltip-surface-background: hsla(240, 10%, 4%)");
        expect(css).toContain("--tooltip-surface-foreground: hsla(0, 0%, 100%)");
        expect(css).toContain("--tooltip-surface-border: hsla(240, 10%, 4%)");
    });

    it("emits menu tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--menu-surface-radius: 0.5rem");
        expect(css).toContain("--menu-surface-max-block-size: 20rem");
        expect(css).toContain("--menu-surface-background: hsla(0, 0%, 100%)");
        expect(css).toContain("--menu-surface-border: hsla(240, 6%, 90%)");
        expect(css).toContain("--menu-surface-foreground: hsla(240, 10%, 4%)");
        expect(css).toContain("--menu-item-padding: 0.625rem");
        expect(css).toContain("--menu-item-min-inline-size: 9rem");
        expect(css).toContain("--menu-nested-icon-size: 0.875rem");
        expect(css).toContain("--menu-item-icon-size: 1rem");
    });

    it("emits tag tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--tag-surface-radius: 2rem");
        expect(css).toContain("--tag-default-min-block-size: 2rem");
        expect(css).toContain("--tag-default-padding-inline: 1rem");
        expect(css).toContain("--tag-default-padding-block: 0.5rem");
        expect(css).toContain("--tag-small-min-block-size: 1.5rem");
        expect(css).toContain("--tag-tiny-min-block-size: 1.25rem");
        expect(css).toContain("--tag-small-font-size: 0.875rem");
        expect(css).toContain("--tag-tiny-font-size: 0.75rem");
        expect(css).toContain("--tag-indicator-size: 0.5rem");
    });

    it("honors tag token overrides", () => {
        const css = createTokenStyles({
            ...defaultLightTheme,
            components: {
                ...defaultLightTheme.components,
                tag: { ...defaultLightTheme.components.tag, "surface-radius": "0.25rem" },
            },
        });
        expect(css).toContain("--tag-surface-radius: 0.25rem");
    });

    it("emits radiobox tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--radiobox-size: 1rem");
        expect(css).toContain("--radiobox-gap: 0.5rem");
    });

    it("emits skeleton tokens", () => {
        const css = createTokenStyles(defaultLightTheme);
        expect(css).toContain("--skeleton-rounded: 0.25rem");
        expect(css).toContain("--skeleton-height: 2rem");
        expect(css).toContain("--skeleton-width: 8rem");
        expect(css).toContain("--skeleton-cell-h: 1.5rem");
        expect(css).toContain("--skeleton-list-gap: 1.5rem");
    });
});
