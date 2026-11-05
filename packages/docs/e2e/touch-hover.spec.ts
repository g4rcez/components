import { devices, expect, test, type Page } from "@playwright/test";

const { defaultBrowserType: _browser, ...pixel } = devices["Pixel 7"];

const button = (page: Page) => page.getByLabel("Button Themes", { exact: true }).getByRole("button", { name: "Normal", exact: true });
const fontSizeOf = (page: Page, size: string) =>
    page
        .locator(`.__free-text--size-${size}.__free-text__surface`)
        .first()
        .evaluate((element) => getComputedStyle(element).fontSize);

test.describe("touch device (no hover, coarse pointer)", () => {
    // Pixel 7 emulation reports (hover: none) and (pointer: coarse). The wide viewport keeps the table in its desktop layout.
    test.use({ ...pixel, viewport: { width: 1024, height: 768 } });

    test("is emulated as a device without hover", async ({ page }) => {
        await page.goto("/docs/buttons");
        const media = await page.evaluate(() => ({
            hover: matchMedia("(hover: hover)").matches,
            fine: matchMedia("(pointer: fine)").matches,
            coarse: matchMedia("(pointer: coarse)").matches,
        }));
        expect(media).toEqual({ hover: false, fine: false, coarse: true });
    });

    test("a tapped button does not stay dimmed by a sticky hover or focus state", async ({ page }) => {
        await page.goto("/docs/buttons");
        const normal = button(page);
        await expect(normal).toBeVisible();
        await normal.tap();
        await expect.poll(() => normal.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("buttons skip the double-tap delay, the tap flash and long-press text selection", async ({ page }) => {
        await page.goto("/docs/buttons");
        const style = await button(page).evaluate((element) => {
            const computed = getComputedStyle(element);
            return {
                touchAction: computed.touchAction,
                tapHighlight: computed.getPropertyValue("-webkit-tap-highlight-color"),
                userSelect: computed.userSelect,
            };
        });
        expect(style).toEqual({ touchAction: "manipulation", tapHighlight: "rgba(0, 0, 0, 0)", userSelect: "none" });
    });

    test("table column resizers are visible without hovering", async ({ page }) => {
        await page.goto("/docs/table");
        const resizer = page.locator(".__table-head__resizer").first();
        await expect(resizer).toBeAttached();
        await expect.poll(() => resizer.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("small inputs are at least 16px so iOS does not zoom on focus", async ({ page }) => {
        await page.goto("/docs/input");
        expect(await fontSizeOf(page, "min")).toBe("16px");
        expect(await fontSizeOf(page, "small")).toBe("16px");
        expect(await fontSizeOf(page, "tiny")).toBe("16px");
    });
});

test.describe("mouse device (hover, fine pointer)", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("hovering a primary button darkens its fill without fading it", async ({ page }) => {
        await page.goto("/docs/buttons");
        const normal = button(page);
        await normal.hover();
        await expect.poll(() => normal.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(20, 109, 123)");
        expect(await normal.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("keyboard focus darkens a primary button without fading it", async ({ page }) => {
        await page.goto("/docs/buttons");
        const normal = button(page);
        await normal.focus();
        await expect.poll(() => normal.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(20, 109, 123)");
        expect(await normal.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("a mouse click does not leave a button dimmed by focus", async ({ page }) => {
        await page.goto("/docs/buttons");
        const normal = button(page);
        await normal.click();
        await page.mouse.move(0, 0);
        await expect.poll(() => normal.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("table column resizers are hidden until the header is hovered", async ({ page }) => {
        await page.goto("/docs/table");
        const resizer = page.locator(".__table-head__resizer").first();
        await expect(resizer).toBeAttached();
        await expect.poll(() => resizer.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");

        await page.locator(".__table-head__cell").first().hover();
        await expect.poll(() => resizer.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("small inputs keep their compact size", async ({ page }) => {
        await page.goto("/docs/input");
        expect(await fontSizeOf(page, "min")).toBe("14px");
        expect(await fontSizeOf(page, "small")).toBe("14px");
        expect(await fontSizeOf(page, "tiny")).toBe("14px");
    });
});
