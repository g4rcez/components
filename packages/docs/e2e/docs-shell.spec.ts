import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 390, 320]) {
    test(`landing and documentation fit a ${width}px viewport`, async ({ page }) => {
        await page.setViewportSize({ width, height: 960 });
        for (const path of ["/", "/docs", "/docs/buttons"]) {
            await page.goto(path);
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        }
    });
}

test("landing search opens a focused navigation drawer and follows a result", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    const search = dialog.getByRole("searchbox", { name: "Search documentation" });
    await expect(search).toBeFocused();
    await search.fill("buttons");
    await dialog.getByRole("link", { name: "Buttons", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/buttons$/);
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Buttons" })).toBeVisible();
});

test("desktop search filters routes, shows an empty state, and clears", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/docs");
    await page.keyboard.press("/");
    const search = page.getByRole("searchbox", { name: "Search documentation" });
    await expect(search).toBeFocused();
    await search.fill("no-such-component");
    await expect(page.getByRole("status").filter({ hasText: "No documentation matches" })).toBeVisible();
    await page.getByRole("button", { name: "Clear documentation search" }).click();
    await expect(search).toBeFocused();
    await expect(search).toHaveValue("");
    await expect(
        page.getByRole("navigation", { name: "Documentation navigation", exact: true }).getByRole("link", { name: "Introduction", exact: true })
    ).toHaveAttribute("aria-current", "page");
});

test("mobile navigation focuses search, clears it, and restores the trigger on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs");
    const trigger = page.getByRole("button", { name: "Open documentation navigation" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    const search = dialog.getByRole("searchbox", { name: "Search documentation" });
    await expect(search).toBeFocused();
    await search.fill("calendar");
    await dialog.getByRole("button", { name: "Clear documentation search" }).click();
    await expect(search).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
});

test("theme switch and code copy work on the landing page", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("button", { name: "Copy code example" }).first().click();
    await expect(page.getByRole("button", { name: "Copied code example" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm add @g4rcez/components");
});

test("mobile page outline expands with the keyboard and preserves section anchors", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs");
    const outline = page.locator("details");
    const summary = outline.locator("summary");
    await expect(summary).toBeVisible();
    await expect(outline).not.toHaveAttribute("open");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(outline).toHaveAttribute("open");
    await outline.getByRole("link", { name: "Installation", exact: true }).click();
    await expect(page).toHaveURL(/#installation-title$/);
});

test("skip link reaches the main content and the page outline navigates to a section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/docs");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await page.getByRole("navigation", { name: "Page sections" }).getByRole("link", { name: "Installation", exact: true }).click();
    await expect(page).toHaveURL(/#installation-title$/);
});
