import { expect, test } from "@playwright/test";

test("a component page opens on Examples and switches tabs with the mouse", async ({ page }) => {
    await page.goto("/docs/buttons");
    await expect(page.getByRole("tab", { name: "Examples" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "Button Themes" })).toBeVisible();

    await page.getByRole("tab", { name: "Usage" }).click();
    await expect(page.getByRole("heading", { name: "When to use Buttons" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Button Themes" })).toHaveCount(0);
    await expect(page).toHaveURL(/\/docs\/buttons\?tab=usage$/);

    await page.getByRole("tab", { name: "Examples" }).click();
    await expect(page).toHaveURL(/\/docs\/buttons$/);
});

test("arrow keys move between tabs", async ({ page }) => {
    await page.goto("/docs/buttons");
    await page.getByRole("tab", { name: "Examples" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Usage" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Accessibility" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "Accessibility", level: 2 })).toHaveCount(1);
});

test("?tab= and anchors that live in another tab open that tab", async ({ page }) => {
    await page.goto("/docs/buttons?tab=accessibility");
    await expect(page.getByRole("tab", { name: "Accessibility" })).toHaveAttribute("aria-selected", "true");

    await page.goto("/docs/buttons#usage-guidance");
    await expect(page.getByRole("tab", { name: "Usage" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "When to use Buttons" })).toBeInViewport();
});

test("guide pages keep a single reading flow without tabs", async ({ page }) => {
    await page.goto("/docs/get-started");
    await expect(page.getByRole("tab")).toHaveCount(0);
});

test("the page outline follows the active tab", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/docs/buttons");
    const outline = page.getByRole("complementary", { name: "On this page" });
    await expect(outline.getByRole("link", { name: "Button Themes" })).toBeVisible();
    await page.getByRole("tab", { name: "Usage" }).click();
    await expect(outline.getByRole("link", { name: "Use when" })).toBeVisible();
    await expect(outline.getByRole("link", { name: "Button Themes" })).toHaveCount(0);
});
