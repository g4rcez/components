import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss, { type Rule } from "postcss";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");

const themeTokens = (selector: ":root" | "html.dark") => {
    const tokens: Record<string, string> = {};
    postcss.parse(read("src/styles/tokens.css")).walkRules((rule: Rule) => {
        if (rule.selector.trim() !== selector) return;
        rule.walkDecls(/^--var-/, (declaration) => {
            tokens[declaration.prop] = declaration.value.trim();
        });
    });
    return tokens;
};

const declarationsOf = (path: string, selector: string, media?: string) => {
    const declarations: Record<string, string> = {};
    postcss.parse(read(path)).walkRules((rule: Rule) => {
        if (rule.selector.trim() !== selector) return;
        const parent = rule.parent;
        const inMedia = parent?.type === "atrule" && "name" in parent && parent.name === "media" ? String(parent.params) : undefined;
        if (inMedia !== media) return;
        rule.walkDecls((declaration) => {
            declarations[declaration.prop] = declaration.value.replace(/\s+/g, " ").trim();
        });
    });
    return declarations;
};

// WCAG 2.x relative luminance of an opaque `hsla(h, s%, l%)` token.
const luminance = (hsla: string) => {
    const [h, s, l] = (hsla.match(/[\d.]+/g) ?? []).map(Number);
    const saturation = s / 100;
    const lightness = l / 100;
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const channel = (n: number) => {
        const k = (n + h / 30) % 12;
        const value = lightness - (chroma / 2) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);
};

const contrast = (a: string, b: string) => {
    const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (lighter + 0.05) / (darker + 0.05);
};

describe("Dropdown and Menu surface border", () => {
    it.each([
        ["dropdown", ":root" as const],
        ["dropdown", "html.dark" as const],
        ["menu", ":root" as const],
        ["menu", "html.dark" as const],
    ])("the %s border in %s is a soft hairline that the shadow backs up, not the 3:1 input colour", (component, selector) => {
        const tokens = themeTokens(selector);
        expect(tokens[`--var-${component}-surface-border`]).not.toBe("var(--var-color-input)");
        const ratio = contrast(tokens[`--var-${component}-surface-border`], tokens[`--var-${component}-surface-background`]);
        expect(ratio).toBeGreaterThan(1.05);
        expect(ratio).toBeLessThan(2);
    });

    it.each(["dropdown", "menu"])("builds the %s shadow from the theme's shadow colours, so dark mode follows", (component) => {
        expect(themeTokens(":root")[`--var-${component}-surface-shadow`]).toContain("var(--var-color-shadow-drop)");
    });

    // The input colour draws the outline of controls. It is deliberately soft: visible on every surface, but well under the
    // 3:1 of a high-contrast outline, so borders do not compete with the content.
    it.each([
        [":root" as const, "--var-dropdown-surface-background"],
        [":root" as const, "--var-menu-surface-background"],
        ["html.dark" as const, "--var-dropdown-surface-background"],
        ["html.dark" as const, "--var-menu-surface-background"],
    ])("%s the input colour is a soft outline against %s, between 1.4:1 and 3:1", (selector, surface) => {
        const tokens = themeTokens(selector);
        const ratio = contrast(tokens["--var-color-input"], tokens[surface]);
        expect(ratio).toBeGreaterThanOrEqual(1.4);
        expect(ratio).toBeLessThan(3);
    });

    it("keeps the decorative border token unchanged", () => {
        expect(themeTokens(":root")["--var-color-border"]).toBe("hsla(240, 6%, 92%)");
        expect(themeTokens("html.dark")["--var-color-border"]).toBe("hsla(202, 10%, 12%)");
    });
});

describe("Notification close button", () => {
    const notifications = "src/components/display/notifications/notifications.css";

    it("takes the colour of the toast theme in light and dark", () => {
        expect(themeTokens(":root")["--var-notification-close-foreground"]).toBe("currentColor");
        expect(themeTokens("html.dark")["--var-notification-close-foreground"]).toBe("currentColor");
    });

    it("does not replace the toast colour on hover, which made it unreadable on the secondary theme", () => {
        const hover = declarationsOf(notifications, ".__notifications__close:hover", "(hover: hover) and (pointer: fine)");
        expect(hover["background-color"]).toBe("var(--var-notification-close-background-hover)");
        expect(hover.color).toBeUndefined();
    });

    it("draws a keyboard focus ring in the toast colour", () => {
        const focus = declarationsOf(notifications, ".__notifications__close:focus-visible");
        expect(focus.outline).toBe("calc(var(--var-spacing-base) * 0.125) solid currentColor");
    });
});

describe("active MenuItem text", () => {
    it("keeps the surface text colour on a soft highlight, so only the background changes", () => {
        for (const selector of [":root", "html.dark"] as const) {
            const tokens = themeTokens(selector);
            expect(tokens["--var-menu-item-active-foreground"]).toBe(tokens["--var-menu-surface-foreground"]);
            expect(tokens["--var-menu-item-active-background"]).not.toBe(tokens["--var-menu-surface-background"]);
        }
    });

    it.each([":root" as const, "html.dark" as const])("%s the text is at least 7:1 against the active background", (selector) => {
        const tokens = themeTokens(selector);
        expect(contrast(tokens["--var-menu-item-active-foreground"], tokens["--var-menu-item-active-background"])).toBeGreaterThanOrEqual(7);
    });
});
