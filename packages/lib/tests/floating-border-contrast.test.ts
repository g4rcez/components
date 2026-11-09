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
        [":root" as const, "--var-dropdown-surface-border"],
        [":root" as const, "--var-menu-surface-border"],
        ["html.dark" as const, "--var-dropdown-surface-border"],
        ["html.dark" as const, "--var-menu-surface-border"],
    ])("%s %s uses the input colour, the only 3:1 border token", (selector, token) => {
        expect(themeTokens(selector)[token]).toBe("var(--var-color-input)");
    });

    it.each([
        [":root" as const, "--var-dropdown-surface-background", 3],
        [":root" as const, "--var-menu-surface-background", 3],
        ["html.dark" as const, "--var-dropdown-surface-background", 3],
        ["html.dark" as const, "--var-menu-surface-background", 3],
    ])("%s the input colour is at least 3:1 against %s (WCAG 1.4.11)", (selector, surface, minimum) => {
        const tokens = themeTokens(selector);
        expect(contrast(tokens["--var-color-input"], tokens[surface])).toBeGreaterThanOrEqual(minimum);
    });

    it("keeps the decorative border token unchanged", () => {
        expect(themeTokens(":root")["--var-color-border"]).toBe("hsla(240, 6%, 90%)");
        expect(themeTokens("html.dark")["--var-color-border"]).toBe("hsla(240, 4%, 12%)");
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
