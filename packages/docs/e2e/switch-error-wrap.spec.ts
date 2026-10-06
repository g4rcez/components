import { expect, test } from "@playwright/test";

const errorMessage = "This setting cannot be changed until the account security review is complete and an administrator approves the update.";

test("Switch error messages wrap at narrow widths without page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 960 });
    await page.goto("/docs/switch");
    await expect(page.getByRole("heading", { level: 1, name: "Switch" })).toBeVisible();

    const control = page.getByRole("switch", { name: "Experimental feature" });
    await expect(control).toHaveAttribute("aria-invalid", "true");
    const errorId = await control.getAttribute("aria-describedby");
    expect(errorId).toBeTruthy();

    const error = page.locator(`[id="${errorId}"]`);
    await expect(error).toHaveText(errorMessage);
    await expect(error).toBeVisible();

    const layout = await error.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const bounds = element.getBoundingClientRect();
        return {
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            right: bounds.right,
            lineCount: range.getClientRects().length,
        };
    });

    expect(layout.clientWidth).toBeGreaterThan(0);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    expect(layout.right).toBeLessThanOrEqual(320);
    expect(layout.lineCount).toBeGreaterThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

    await page.setViewportSize({ width: 1440, height: 960 });
    await expect(error).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
});
